/**
 * Parses every shipped JavaScript file.
 *
 * The app has no build step, so a syntax error would only surface on the
 * device. This walks the exact list the service worker precaches.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');

const files = [
  'sw.js',
  'assets/js/version.js',
  'assets/js/app.js',
  ...['util', 'sync-config', 'store', 'sync', 'srs', 'words', 'content'].map((n) => `assets/js/core/${n}.js`),
  ...['toast', 'home', 'cloze', 'drill', 'result', 'mistakes', 'weak', 'library', 'stats', 'settings'].map((n) => `assets/js/ui/${n}.js`),
  ...readdirSync(join(ROOT, 'assets/js/data')).filter((f) => f.endsWith('.js')).sort().map((f) => `assets/js/data/${f}`)
];

let failed = 0;
for (const rel of files) {
  const code = readFileSync(join(ROOT, rel), 'utf8');
  try {
    new Function(code);
  } catch (err) {
    console.error(`✖ ${rel}: ${err.message}`);
    failed += 1;
  }
}

console.log(failed ? `${failed} file(s) failed to parse` : `✔ ${files.length} files parsed cleanly`);
process.exit(failed ? 1 : 0);
