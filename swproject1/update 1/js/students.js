/* ============================================
   Student Hub — Student CRUD Module
   js/students.js
   ============================================ */

// ---- LocalStorage Persistence (Step 10) ----

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Reads the student list from localStorage into state. */
function loadState() {
  try {
    const stored = localStorage.getItem(STATE_KEY);
    if (stored) {
      state.students = JSON.parse(stored);
      logAction("Loaded student profiles from local cache memory.");
    } else {
      state.students = [];
      logAction("No local storage profile cache found. Database empty.");
    }
  } catch (err) {
    console.error("Local Storage failure:", err);
    state.students = [];
  }
}

/** Writes the current student list to localStorage and flashes the sync bar. */
function saveState() {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(state.students));
    triggerSyncSuccess();
  } catch (err) {
    console.error("Failed to write to local storage:", err);
  }
}

/** Briefly highlights the sync status bar when data is saved. */
function triggerSyncSuccess(msg = "✓ Browser LocalStorage Cache Layer Synchronized") {
  const syncStatus = document.getElementById('sync-status-text');
  const syncPulse  = document.getElementById('sync-pulse');

  syncStatus.textContent = msg;
  syncStatus.classList.remove('text-slate-400');
  syncStatus.classList.add('text-emerald-400', 'font-bold');
  syncPulse.classList.remove('bg-emerald-500');
  syncPulse.classList.add('bg-emerald-400', 'shadow-glow-emerald');

  setTimeout(() => {
    syncStatus.classList.remove('text-emerald-400', 'font-bold');
    syncStatus.classList.add('text-slate-400');
    syncPulse.classList.add('bg-emerald-500');
    syncPulse.classList.remove('bg-emerald-400', 'shadow-glow-emerald');
    if (msg !== "✓ Browser LocalStorage Cache Layer Synchronized") {
      syncStatus.textContent = "✓ Browser LocalStorage Cache Layer Synchronized";
    }
  }, 2500);

  logAction("Database synced with LocalStorage cache.");
}

// ---- Seed / Clear Database ----

/** Loads the fallback mock data set into state. */
function seedMockData() {
  state.students = [...DEFAULT_SEED_DATA];
  saveState();
  const currentView = document.querySelector('[id^="view-"]:not(.hidden)').id.replace('view-', '');
  switchView(currentView);
  logAction("Database cache loaded with mock seed profile array.");
}

/** Wipes the entire student database. */
function clearDatabase() {
  state.students = [];
  saveState();
  const currentView = document.querySelector('[id^="view-"]:not(.hidden)').id.replace('view-', '');
  switchView(currentView);
  logAction("LocalStorage cache database flushed.");
}

function createBlankStudentSheet() {
  if (!window.XLSX) {
    alert('Excel export is unavailable right now.');
    return;
  }

  const headers = [
    'Student ID',
    'Full Name',
    'Roll Number',
    'Email Address',
    'Course Title',
    'Age',
    'Status'
  ];
  const rows = [headers, ['', '', '', '', '', '', ''], ['', '', '', '', '', '', ''], ['', '', '', '', '', '', '']];
  const workbook = XLSX.utils.book_new();
  const sheet = XLSX.utils.aoa_to_sheet(rows);
  XLSX.utils.book_append_sheet(workbook, sheet, 'Students');
  const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `student_template_blank_${new Date().toISOString().slice(0, 10)}.xlsx`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
  logAction('Downloaded a blank student Excel sheet template.');
}

window.createBlankStudentSheet = createBlankStudentSheet;

// ---- Add Student Form (Steps 2 & 3) ----

/** Toggles the Add Student registration form panel visibility. */
function toggleAddStudentForm() {
  if (document.getElementById('view-roster').classList.contains('hidden')) {
    switchView('roster');
  }
  const formCard = document.getElementById('step-3-schema');
  if (formCard.classList.contains('hidden')) {
    formCard.classList.remove('hidden');
    document.getElementById('form-name').focus();
    highlightStepBadge(3);
  } else {
    formCard.classList.add('hidden');
  }
}

/** Handles the Add Student form submission — validates and persists to state. */
function handleFormSubmit(e) {
  e.preventDefault();
  const name   = document.getElementById('form-name').value.trim();
  const roll   = document.getElementById('form-roll').value.trim();
  const email  = document.getElementById('form-email').value.trim();
  const course = document.getElementById('form-course').value;
  const age    = parseInt(document.getElementById('form-age').value);
  const status = document.getElementById('form-status').value;

  const isDuplicate = state.students.some(s => s.rollNumber.toLowerCase() === roll.toLowerCase());
  if (isDuplicate) {
    alert(`Database Integrity Error: Roll number ${roll} already registered.`);
    return;
  }

  const randomID = 'STU-' + Math.floor(1000 + Math.random() * 9000) + '-' + Math.floor(10 + Math.random() * 89);
  const newStudent = { id: randomID, name, rollNumber: roll, email, course, age, status };

  state.students.unshift(newStudent);
  saveState();
  render();

  document.getElementById('add-student-form').reset();
  toggleAddStudentForm();
  logAction(`Registered new student profile: ${name} (${roll})`);
  document.getElementById('step-6-grid').scrollIntoView({ behavior: 'smooth' });
}

// ---- Edit Modal (Step 7) ----

/** Opens and pre-fills the edit modal for a given student ID. */
function openEditModal(studentId) {
  const student = state.students.find(s => s.id === studentId);
  if (!student) return;

  document.getElementById('edit-id').value     = student.id;
  document.getElementById('edit-name').value   = student.name;
  document.getElementById('edit-roll').value   = student.rollNumber;
  document.getElementById('edit-email').value  = student.email;
  document.getElementById('edit-course').value = student.course;
  document.getElementById('edit-age').value    = student.age;
  document.getElementById('edit-status').value =
    (student.status === 'Active' || student.status === 'Active Status') ? 'Active' : 'Inactive';

  const modal = document.getElementById('step-7-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  highlightStepBadge(7);
}

/** Closes the edit modal. */
function closeEditModal() {
  const modal = document.getElementById('step-7-modal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

/** Saves changes from the edit modal form. */
function handleEditFormSubmit(e) {
  e.preventDefault();
  const id     = document.getElementById('edit-id').value;
  const name   = document.getElementById('edit-name').value.trim();
  const roll   = document.getElementById('edit-roll').value.trim();
  const email  = document.getElementById('edit-email').value.trim();
  const course = document.getElementById('edit-course').value;
  const age    = parseInt(document.getElementById('edit-age').value);
  const status = document.getElementById('edit-status').value;

  const isDuplicate = state.students.some(s => s.id !== id && s.rollNumber.toLowerCase() === roll.toLowerCase());
  if (isDuplicate) {
    alert(`Integrity Error: Roll number ${roll} belongs to another record.`);
    return;
  }

  state.students = state.students.map(s =>
    s.id === id ? { ...s, name, rollNumber: roll, email, course, age, status } : s
  );

  saveState();
  render();
  closeEditModal();
  logAction(`Updated student profile ID: ${id}`);
}

// ---- Delete Confirmation Modal (Step 8) ----

let studentIdToDelete = null;

/** Opens the delete confirmation modal for the given student ID. */
function deleteStudent(studentId) {
  studentIdToDelete = studentId;
  const modal = document.getElementById('delete-confirm-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

/** Closes the delete confirmation modal without deleting. */
function closeDeleteModal() {
  studentIdToDelete = null;
  const modal = document.getElementById('delete-confirm-modal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

/** Permanently removes the student from state and re-renders. */
function executeDeleteStudent() {
  if (studentIdToDelete) {
    const id = studentIdToDelete;
    const cardElement = document.getElementById(`student-card-${id}`);
    if (cardElement) {
      cardElement.classList.add('opacity-0', 'scale-90', 'translate-y-4');
      setTimeout(() => {
        state.students = state.students.filter(s => s.id !== id);
        saveState();
        render();
      }, 300);
    } else {
      state.students = state.students.filter(s => s.id !== id);
      saveState();
      render();
    }
    logAction(`Deleted student profile ID: ${id}`);
  }
  closeDeleteModal();
}

// ---- Real-time Search Filter (Step 9) ----

/** Filters roster grid as user types. */
function handleSearch(val) {
  state.searchQuery = val.trim().toLowerCase();
  render(true);
}

// ---- Roster Grid Renderer (Step 5 / Step 6) ----

/**
 * Re-renders the student card grid based on current state and search query.
 * @param {boolean} isSearching
 */
function render(isSearching = false) {
  const container  = document.getElementById('student-roster-viewport');
  const emptyState = document.getElementById('step-4-empty');

  container.innerHTML = '';

  const filtered = state.students.filter(s =>
    s.name.toLowerCase().includes(state.searchQuery) ||
    s.rollNumber.toLowerCase().includes(state.searchQuery) ||
    s.course.toLowerCase().includes(state.searchQuery)
  );

  document.getElementById('filtered-count').textContent =
    `${filtered.length} of ${state.students.length} Items`;

  if (state.students.length === 0) {
    emptyState.classList.remove('hidden');
    emptyState.classList.add('flex');
    container.classList.add('hidden');
    return;
  }

  emptyState.classList.add('hidden');
  emptyState.classList.remove('flex');
  container.classList.remove('hidden');

  filtered.forEach(student => {
    const isActive = student.status === 'Active' || student.status === 'Active Status';
    container.innerHTML += `
      <div id="student-card-${student.id}" class="step-highlight bg-slate-900 border border-slate-800 hover:border-slate-700/60 p-5 rounded-2xl flex flex-col justify-between shadow-md relative group hover:-translate-y-1 transition-all duration-300 transform scale-100">
        
        <div class="absolute top-2 right-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition duration-300">
          <button onclick="openEditModal('${student.id}')" class="cursor-pointer bg-blue-500/10 hover:bg-blue-500/25 border border-blue-500/20 text-blue-400 text-[10px] px-2 py-0.5 rounded flex items-center gap-1 font-semibold">
            Edit ✏️
          </button>
        </div>

        <div>
          <div class="flex items-start justify-between mb-3">
            <div>
              <h4 class="text-sm font-bold text-slate-100 group-hover:text-custom-primary transition-colors tracking-tight">${escapeHtml(student.name)}</h4>
              <span class="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mt-0.5">${escapeHtml(student.id)}</span>
            </div>
            <span class="px-2.5 py-0.5 text-[9px] font-bold rounded-full border tracking-wide uppercase ${
              isActive
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
            }">
              ${isActive ? 'Active' : 'Inactive'}
            </span>
          </div>

          <div class="space-y-2 mt-4 text-xs">
            <div class="flex items-center justify-between py-1 border-b border-slate-800/40">
              <span class="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">Roll Number</span>
              <span class="font-mono text-slate-300 font-medium tracking-wide bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800/50">${escapeHtml(student.rollNumber)}</span>
            </div>
            <div class="flex items-center justify-between py-1 border-b border-slate-800/40">
              <span class="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">Core Course</span>
              <span class="text-slate-300 font-medium truncate max-w-[150px] text-right" title="${escapeHtml(student.course)}">${escapeHtml(student.course)}</span>
            </div>
            <div class="flex items-center justify-between py-1 border-b border-slate-800/40">
              <span class="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">Email Address</span>
              <span class="text-slate-300 font-medium truncate max-w-[150px] text-right font-mono" title="${escapeHtml(student.email)}">${escapeHtml(student.email)}</span>
            </div>
            <div class="flex items-center justify-between py-1">
              <span class="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">Calculated Age</span>
              <span class="text-slate-300 font-bold font-mono">${escapeHtml(student.age)} Years</span>
            </div>
          </div>
        </div>

        <div class="mt-5 pt-3 border-t border-slate-800/80">
          <button onclick="deleteStudent('${student.id}')" class="btn-transition text-[11px] text-rose-400 hover:text-rose-300 active:text-rose-500 font-semibold tracking-wide flex items-center gap-1.5">
            Delete Student 🗑️
          </button>
        </div>
      </div>
    `;
  });
}
