/* ============================================
   Student Hub — Settings & Theme Module
   js/settings.js
   ============================================ */

/**
 * Switches the global accent color theme preset.
 * @param {'blue'|'emerald'|'amber'|'rose'|'purple'} color
 */
function changeThemePreset(color) {
  // Reset body to baseline classes
  document.body.className =
    "font-sans antialiased h-screen select-none relative";

  const themeMap = {
    emerald: { cls: "theme-emerald", name: "Forest Green" },
    amber: { cls: "theme-amber", name: "Sunset Orange" },
    rose: { cls: "theme-rose", name: "Crimson Rogue" },
    purple: { cls: "theme-purple", name: "Nebula Dusk" },
  };

  let themeName = "Indigo Cyber";
  if (themeMap[color]) {
    document.body.classList.add(themeMap[color].cls);
    themeName = themeMap[color].name;
  }

  // Re-render all views to pick up new CSS variables
  renderDashboardAnalytics();
  renderBatchesView();
  if (!document.getElementById("view-roster").classList.contains("hidden")) {
    render();
  }

  logAction(
    `Global accent theme preset changed to: ${themeName.toUpperCase()}`,
  );
}

/**
 * Simulates toggling the MongoDB Atlas connection online/offline (Step 12).
 * @param {boolean} isOffline
 */
function toggleDbStatus(isOffline) {
  const indicator =
    document.getElementById("step-12-endpoint").firstElementChild;

  if (isOffline) {
    indicator.className =
      "flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/25 px-2.5 py-1 rounded-md text-[10px] text-rose-400 font-medium transition-colors duration-300";
    indicator.innerHTML = `<span class="h-1.5 w-1.5 rounded-full bg-rose-500 inline-block pulse-dot"></span> Connection Pipeline Offline: Secure Connection Interrupted`;
    logAction(
      "MongoDB Cloud Atlas production endpoint connection pipeline went OFFLINE.",
    );
  } else {
    indicator.className =
      "flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-md text-[10px] text-emerald-400 font-medium transition-colors duration-300";
    indicator.innerHTML = `<span class="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block pulse-dot"></span> Pipeline Connected Securely to Cloud MongoDB Atlas via Next.js API Routes`;
    logAction(
      "MongoDB Cloud Atlas production endpoint connection pipeline restored to ONLINE.",
    );
  }
}
