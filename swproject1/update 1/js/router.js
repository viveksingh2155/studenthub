/* ============================================
   Student Hub — SPA Router / View Switcher
   js/router.js
   ============================================ */

/**
 * Switches the main content view and updates the sidebar nav state.
 * @param {'dashboard'|'roster'|'batches'|'sql-studio'|'settings'} viewId
 */
function switchView(viewId) {
  // Hide all views
  ["dashboard", "roster", "batches", "sql-studio", "settings"].forEach((id) => {
    document.getElementById(`view-${id}`).classList.add("hidden");
  });

  // Show the selected view
  document.getElementById(`view-${viewId}`).classList.remove("hidden");

  // Update sidebar nav button styles
  const navIds = ["dashboard", "roster", "batches", "sql-studio", "settings"];
  navIds.forEach((id) => {
    const btn = document.getElementById(`nav-${id}`);
    if (id === viewId) {
      btn.className =
        "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-white bg-slate-800 border border-slate-700/50 shadow-sm transition";
      btn.querySelector("svg").className = "w-5 h-5 text-custom-primary";
    } else {
      btn.className =
        "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent hover:border-slate-800 transition";
      btn.querySelector("svg").className = "w-5 h-5 text-slate-400";
    }
  });

  // Trigger view-specific render functions
  if (viewId === "dashboard") {
    renderDashboardAnalytics();
  } else if (viewId === "batches") {
    renderBatchesView();
  } else if (viewId === "roster") {
    render();
  } else if (viewId === "sql-studio") {
    if (window.initializeSqlStudio) {
      window.initializeSqlStudio();
    }
  }

  logAction(`Switched active view content: ${viewId.toUpperCase()}`);
}
