/* ============================================
   Student Hub — Event Logger Utility
   js/logger.js
   ============================================ */

/**
 * Appends a timestamped log entry to the dashboard event console.
 * @param {string} msg - The message to log.
 */
function logAction(msg) {
  const consoleEl = document.getElementById('log-console');
  if (!consoleEl) return;
  const now = new Date();
  const timeStr = now.toTimeString().split(' ')[0];
  const logLine = document.createElement('div');
  logLine.textContent = `[${timeStr}] ${msg}`;
  consoleEl.appendChild(logLine);
  consoleEl.scrollTop = consoleEl.scrollHeight;
}
