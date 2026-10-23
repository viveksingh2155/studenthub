/* ============================================
   Student Hub — Dashboard Analytics Module
   js/dashboard.js
   ============================================ */

/**
 * Computes and updates the four stat widget cards (Step 11).
 */
function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function calculateAnalytics() {
  const totalCount    = state.students.length;
  const activeCount   = state.students.filter(s => s.status === 'Active' || s.status === 'Active Status').length;
  const inactiveCount = state.students.filter(s => s.status === 'Inactive' || s.status === 'Inactive Status').length;
  const batchesCount  = new Set(state.students.map(s => s.course)).size;

  document.getElementById('stat-total-students').textContent  = totalCount.toLocaleString();
  document.getElementById('stat-active-students').textContent = activeCount.toLocaleString();
  document.getElementById('stat-inactive-students').textContent = inactiveCount.toLocaleString();
  document.getElementById('stat-course-batches').textContent  = batchesCount > 0 ? `${batchesCount} Modules` : '0 Modules';
}

/**
 * Renders the dashboard analytics widgets and the course enrollment matrix bar chart.
 */
function renderDashboardAnalytics() {
  calculateAnalytics();

  const container = document.getElementById('course-matrix-container');
  if (!container) return;

  container.innerHTML = '';

  // While a spreadsheet is open, visualise that sheet; otherwise visualise saved roster data.
  const sourceRows = state.importPreviewRows && state.importPreviewRows.length
    ? state.importPreviewRows
    : state.students;
  const counts = sourceRows.reduce((result, student) => {
    const course = String(student.course || '').trim() || 'Unassigned course';
    result[course] = (result[course] || 0) + 1;
    return result;
  }, {});
  const courses = Object.keys(counts).sort((a, b) => counts[b] - counts[a] || a.localeCompare(b));

  if (!courses.length) {
    container.innerHTML = '<p class="text-xs text-slate-500 text-center">Upload a spreadsheet or add students to see course counts.</p>';
    return;
  }

  const maxEnrollment = Math.max(...Object.values(counts), 1);

  courses.forEach(course => {
    const count = counts[course];
    const pct   = (count / maxEnrollment) * 100;
    container.innerHTML += `
      <div>
        <div class="flex items-center justify-between text-xs mb-1">
          <span class="text-slate-300 font-semibold">${escapeHtml(course)}</span>
          <span class="font-mono text-slate-400 font-bold bg-slate-950 px-1.5 rounded">${count} Enrolled</span>
        </div>
        <div class="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800/60">
          <div class="bg-custom-primary h-full rounded-full transition-all duration-500" style="width: ${pct}%"></div>
        </div>
      </div>
    `;
  });
}
