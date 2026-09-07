/**
 * Build identity. `BUILD` is bumped on every release and is also used as the
 * service-worker cache namespace, so shipping a new value transparently
 * invalidates every stale asset on the device.
 */
window.CPE = window.CPE || {};
window.CPE.APP_NAME = 'Cloze C2';
window.CPE.VERSION = '1.0.0';
window.CPE.BUILD = '2026.09.06';
