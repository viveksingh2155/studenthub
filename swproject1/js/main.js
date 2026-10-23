/* ============================================
   Student Hub — App Entry Point
   js/main.js
   ============================================ */

/**
 * Bootstraps the application once the DOM is fully loaded.
 *
 * Load order contract (defined in index.html):
 *   state.js → logger.js → auth.js → router.js →
 *   students.js → dashboard.js → batches.js →
 *   settings.js → tracker.js → export.js → main.js
 */
window.addEventListener("DOMContentLoaded", () => {
  // 1. Check for an existing session and show/hide auth vs. app layout
  applySessionState();

  // 2. Hydrate the student state from localStorage cache
  loadState();

  // 3. Render the default dashboard view
  switchView("dashboard");
});
