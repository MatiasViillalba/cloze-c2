/**
 * Cloud sync endpoint.
 *
 * Empty by default: with no values here the app behaves exactly as it always
 * has — everything local, nothing ever leaves the device, and the Ajustes
 * screen simply explains how to turn sync on.
 *
 * Both values below are *publishable* credentials. The anon key is designed to
 * ship inside client code: it grants nothing on its own. The database revokes
 * all table access from it and exposes only two functions, and both demand the
 * 16-character sync code, which lives on your devices and is never committed.
 *
 * Setup lives in docs/sync.md; the SQL is scripts/supabase-setup.sql.
 */
window.CPE = window.CPE || {};
window.CPE.SYNC_CONFIG = {
  url: '',       /* p.ej. 'https://abcdefghijklm.supabase.co' */
  anonKey: ''    /* la clave "anon public" del panel de Supabase */
};
