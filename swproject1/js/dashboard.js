/* ============================================
   Student Hub — Dashboard Analytics Module
   js/dashboard.js
   ============================================ */

/**
 * Computes and updates the four stat widget cards (Step 11).
 */
function calculateAnalytics() {
  const totalCount = state.students.length;
  const activeCount = state.students.filter(
    (s) => s.status === "Active" || s.status === "Active Status",
  ).length;
  const inactiveCount = state.students.filter(
    (s) => s.status === "Inactive" || s.status === "Inactive Status",
  ).length;
  const batchesCount = new Set(state.students.map((s) => s.course)).size;

  document.getElementById("stat-total-students").textContent =
    totalCount.toLocaleString();
  document.getElementById("stat-active-students").textContent =
    activeCount.toLocaleString();
  document.getElementById("stat-inactive-students").textContent =
    inactiveCount.toLocaleString();
  document.getElementById("stat-course-batches").textContent =
    batchesCount > 0 ? `${batchesCount} Modules` : "0 Modules";
}

/**
 * Renders the dashboard analytics widgets and the course enrollment matrix bar chart.
 */
function renderDashboardAnalytics() {
  calculateAnalytics();

  const container = document.getElementById("course-matrix-container");
  if (!container) return;

  container.innerHTML = "";

  const courses = [
    "Computer Science & AI",
    "Electrical Engineering",
    "Bioinformatics",
    "Mechanical Systems",
    "Data Analytics",
  ];

  // Count enrollment per course
  const counts = {};
  courses.forEach((c) => (counts[c] = 0));
  state.students.forEach((s) => {
    if (counts[s.course] !== undefined) counts[s.course]++;
  });

  const maxEnrollment = Math.max(...Object.values(counts), 1);

  courses.forEach((course) => {
    const count = counts[course];
    const pct = (count / maxEnrollment) * 100;
    container.innerHTML += `
      <div>
        <div class="flex items-center justify-between text-xs mb-1">
          <span class="text-slate-300 font-semibold">${course}</span>
          <span class="font-mono text-slate-400 font-bold bg-slate-950 px-1.5 rounded">${count} Enrolled</span>
        </div>
        <div class="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800/60">
          <div class="bg-custom-primary h-full rounded-full transition-all duration-500" style="width: ${pct}%"></div>
        </div>
      </div>
    `;
  });
}
