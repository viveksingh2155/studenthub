/* ============================================
   Student Hub — Excel / CSV Import Module
   js/import.js
   ============================================ */

(function () {
  const REQUIRED_FIELDS = ['name', 'rollNumber', 'email', 'course', 'age', 'status'];
  let isInitialized = false;
  const HEADER_SYNONYMS = {
    id: ['student id', 'id', 'studentid', 'record id'],
    name: ['full name', 'name', 'fullname', 'student name'],
    rollNumber: ['roll number', 'roll', 'rollnumber', 'roll no', 'student roll number'],
    email: ['email address', 'email', 'emailaddress', 'student email'],
    course: ['course title', 'course', 'course title', 'course name', 'course module'],
    age: ['age', 'student age', 'years'],
    status: ['status', 'student status', 'current status']
  };

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function normalizeHeader(header) {
    return String(header ?? '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  function getCanonicalField(rawHeader) {
    const normalized = normalizeHeader(rawHeader);
    for (const [field, synonyms] of Object.entries(HEADER_SYNONYMS)) {
      if (synonyms.some(synonym => normalized === synonym || normalized.includes(synonym) || synonym.includes(normalized))) {
        return field;
      }
    }
    return null;
  }

  function normalizeStatus(value) {
    const trimmed = String(value ?? '').trim();
    if (!trimmed) {
      return { value: '', isValid: false };
    }
    const lowered = trimmed.toLowerCase();
    if (['active', 'active status', 'active student'].includes(lowered)) {
      return { value: 'Active', isValid: true };
    }
    if (['inactive', 'inactive status', 'inactive student'].includes(lowered)) {
      return { value: 'Inactive', isValid: true };
    }
    return { value: trimmed, isValid: false };
  }

  function normalizeAge(value) {
    const numberValue = Number(value);
    if (!Number.isFinite(numberValue)) {
      return { value: '', isValid: false };
    }
    return {
      value: Math.round(numberValue),
      isValid: numberValue >= 16 && numberValue <= 99
    };
  }

  function createStudentId(candidate, index) {
    const trimmed = String(candidate ?? '').trim();
    if (trimmed) {
      return trimmed;
    }
    return `STU-${String(Date.now()).slice(-4)}-${String(index + 1).padStart(2, '0')}`;
  }

  function buildPreviewRows(rawRows) {
    return rawRows.map((row, index) => {
      const entry = {};
      Object.entries(row).forEach(([key, value]) => {
        const canonicalField = getCanonicalField(key);
        if (canonicalField) {
          entry[canonicalField] = value;
        }
      });

      const statusResult = normalizeStatus(entry.status);
      const ageResult = normalizeAge(entry.age);
      const name = String(entry.name ?? '').trim();
      const rollNumber = String(entry.rollNumber ?? '').trim();
      const email = String(entry.email ?? '').trim();
      const course = String(entry.course ?? '').trim();

      return {
        id: createStudentId(entry.id, index),
        name,
        rollNumber,
        email,
        course,
        age: ageResult.value,
        status: statusResult.value,
        errors: [],
        isValid: false
      };
    });
  }

  function validatePreviewRows(rows) {
    const seenRolls = new Map();
    return rows.map((row) => {
      const errors = [];
      const rollKey = String(row.rollNumber ?? '').trim().toLowerCase();

      if (!String(row.name ?? '').trim()) errors.push('Name is required');
      if (!String(row.rollNumber ?? '').trim()) errors.push('Roll number is required');
      if (!String(row.email ?? '').trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(row.email ?? '').trim())) {
        errors.push('Email is invalid');
      }
      if (!String(row.course ?? '').trim()) errors.push('Course is required');
      const ageResult = normalizeAge(row.age);
      if (!ageResult.isValid) errors.push('Age must be a number between 16 and 99');
      const statusResult = normalizeStatus(row.status);
      if (!statusResult.isValid) errors.push('Status must be Active or Inactive');

      if (rollKey) {
        if (seenRolls.has(rollKey)) {
          errors.push('Duplicate roll number in import file');
        } else {
          seenRolls.set(rollKey, true);
        }
      }

      return {
        ...row,
        age: ageResult.value,
        status: statusResult.value,
        errors,
        isValid: errors.length === 0
      };
    });
  }

  function calculateImportSummary(rows) {
    const activeStudents = rows.filter(row => row.status === 'Active').length;
    const inactiveStudents = rows.filter(row => row.status === 'Inactive').length;
    const uniqueCourses = new Set(rows.map(row => String(row.course || '').trim()).filter(Boolean)).size;
    const invalidRows = rows.filter(row => !row.isValid).length;

    return {
      rowsRead: rows.length,
      totalRows: rows.length,
      activeStudents,
      inactiveStudents,
      uniqueCourses,
      invalidRows
    };
  }

  function renderImportSummary() {
    const summary = state.importSummary || calculateImportSummary(state.importPreviewRows || []);
    const totalRowsEl = document.getElementById('dashboard-import-total');
    const activeRowsEl = document.getElementById('dashboard-import-active');
    const inactiveRowsEl = document.getElementById('dashboard-import-inactive');
    const coursesEl = document.getElementById('dashboard-import-courses');
    const invalidRowsEl = document.getElementById('dashboard-import-invalid');

    if (totalRowsEl) totalRowsEl.textContent = summary.totalRows.toLocaleString();
    if (activeRowsEl) activeRowsEl.textContent = summary.activeStudents.toLocaleString();
    if (inactiveRowsEl) inactiveRowsEl.textContent = summary.inactiveStudents.toLocaleString();
    if (coursesEl) coursesEl.textContent = summary.uniqueCourses.toLocaleString();
    if (invalidRowsEl) invalidRowsEl.textContent = summary.invalidRows.toLocaleString();
  }

  function renderImportPanel() {
    renderImportSummary();

    const previewContainer = document.getElementById('import-preview-container');
    const previewEmptyState = document.getElementById('import-preview-empty');
    const importActions = document.getElementById('import-actions');
    const previewStatus = document.getElementById('import-preview-status');

    if (!previewContainer || !previewEmptyState || !importActions) return;

    if (!state.importPreviewRows.length) {
      previewContainer.innerHTML = '';
      previewEmptyState.classList.remove('hidden');
      importActions.classList.add('hidden');
      if (previewStatus) previewStatus.textContent = 'Upload a spreadsheet or CSV file to review rows before import.';
      return;
    }

    previewEmptyState.classList.add('hidden');
    importActions.classList.remove('hidden');

    const query = String(state.importSearchQuery || '').trim().toLowerCase();
    const visibleRows = state.importPreviewRows
      .map((row, index) => ({ row, index }))
      .filter(({ row }) => !query || [row.id, row.name, row.rollNumber, row.email, row.course, row.status]
        .some(value => String(value || '').toLowerCase().includes(query)));
    const rowsHtml = visibleRows.map(({ row, index }) => {
      const rowClass = row.isValid ? 'border-emerald-200 bg-emerald-50/50' : 'border-rose-200 bg-rose-50/50';
      const errorHint = row.errors.length > 0 ? `<div class="mt-2 text-[10px] text-rose-600">${row.errors.join(' • ')}</div>` : '<div class="mt-2 text-[10px] text-emerald-600">Ready to import</div>';
      const idValue = row.id || '';
      return `
        <tr class="${rowClass}">
          <td class="px-3 py-3 align-top text-[11px] text-slate-500">
            <div class="flex items-center justify-between gap-2">
              <span>${index + 1}</span>
              <button type="button" onclick="removeImportPreviewRow(${index})" class="text-rose-500 hover:text-rose-600">Remove</button>
            </div>
          </td>
          <td class="px-3 py-3 align-top">
            <input value="${escapeHtml(idValue)}" onchange="updateImportPreviewRow(${index}, 'id', this.value)" class="w-full rounded border border-green-200 bg-white px-2 py-1.5 text-[11px] text-slate-700" />
          </td>
          <td class="px-3 py-3 align-top">
            <input value="${escapeHtml(row.name)}" onchange="updateImportPreviewRow(${index}, 'name', this.value)" class="w-full rounded border border-green-200 bg-white px-2 py-1.5 text-[11px] text-slate-700" />
          </td>
          <td class="px-3 py-3 align-top">
            <input value="${escapeHtml(row.rollNumber)}" onchange="updateImportPreviewRow(${index}, 'rollNumber', this.value)" class="w-full rounded border border-green-200 bg-white px-2 py-1.5 text-[11px] text-slate-700" />
          </td>
          <td class="px-3 py-3 align-top">
            <input value="${escapeHtml(row.email)}" onchange="updateImportPreviewRow(${index}, 'email', this.value)" class="w-full rounded border border-green-200 bg-white px-2 py-1.5 text-[11px] text-slate-700" />
          </td>
          <td class="px-3 py-3 align-top">
            <input value="${escapeHtml(row.course)}" onchange="updateImportPreviewRow(${index}, 'course', this.value)" class="w-full rounded border border-green-200 bg-white px-2 py-1.5 text-[11px] text-slate-700" />
          </td>
          <td class="px-3 py-3 align-top">
            <input value="${escapeHtml(row.age)}" onchange="updateImportPreviewRow(${index}, 'age', this.value)" class="w-full rounded border border-green-200 bg-white px-2 py-1.5 text-[11px] text-slate-700" />
          </td>
          <td class="px-3 py-3 align-top">
            <input value="${escapeHtml(row.status)}" onchange="updateImportPreviewRow(${index}, 'status', this.value)" class="w-full rounded border border-green-200 bg-white px-2 py-1.5 text-[11px] text-slate-700" />
          </td>
          <td class="px-3 py-3 align-top">
            <div class="text-[11px] text-slate-700">
              ${errorHint}
            </div>
          </td>
        </tr>
      `;
    }).join('');

    previewContainer.innerHTML = `
      <div class="overflow-x-auto">
        <table class="min-w-full text-left text-xs">
          <thead>
            <tr class="bg-slate-900 text-slate-100">
              <th class="px-3 py-2 font-semibold">#</th>
              <th class="px-3 py-2 font-semibold">ID</th>
              <th class="px-3 py-2 font-semibold">Name</th>
              <th class="px-3 py-2 font-semibold">Roll</th>
              <th class="px-3 py-2 font-semibold">Email</th>
              <th class="px-3 py-2 font-semibold">Course</th>
              <th class="px-3 py-2 font-semibold">Age</th>
              <th class="px-3 py-2 font-semibold">Status</th>
              <th class="px-3 py-2 font-semibold">Validation</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </div>
    `;

    if (previewStatus) {
      const validCount = state.importPreviewRows.filter(row => row.isValid).length;
      previewStatus.textContent = `${validCount} valid rows ready • ${state.importPreviewRows.length - validCount} rows need attention`;
    }
    if (typeof renderDashboardAnalytics === 'function') renderDashboardAnalytics();
  }

  function updateImportPreviewRow(index, field, rawValue) {
    const updatedRows = [...state.importPreviewRows];
    const targetRow = { ...updatedRows[index], [field]: rawValue };
    updatedRows[index] = targetRow;
    state.importPreviewRows = validatePreviewRows(updatedRows);
    state.importSummary = calculateImportSummary(state.importPreviewRows);
    renderImportPanel();
  }

  function removeImportPreviewRow(index) {
    state.importPreviewRows.splice(index, 1);
    state.importSummary = calculateImportSummary(state.importPreviewRows);
    renderImportPanel();
  }

  function addImportPreviewRow() {
    state.importPreviewRows = validatePreviewRows([
      ...state.importPreviewRows,
      { id: createStudentId('', state.importPreviewRows.length), name: '', rollNumber: '', email: '', course: '', age: '', status: '' }
    ]);
    state.importSummary = calculateImportSummary(state.importPreviewRows);
    renderImportPanel();
  }

  function setImportPreviewSearch(value) {
    state.importSearchQuery = String(value || '');
    renderImportPanel();
  }

  function validateImportPreview() {
    state.importPreviewRows = validatePreviewRows(state.importPreviewRows);
    state.importSummary = calculateImportSummary(state.importPreviewRows);
    renderImportPanel();
    logAction('Validated the current spreadsheet workspace rows.');
  }

  function saveImportEdits() {
    validateImportPreview();
    logAction('Saved spreadsheet workspace edits in this browser session.');
  }

  function clearImportPreview() {
    state.importPreviewRows = [];
    state.importSearchQuery = '';
    state.importSummary = calculateImportSummary(state.importPreviewRows);
    renderImportPanel();
    const input = document.getElementById('import-file-input');
    if (input) input.value = '';
  }

  async function processUploadedFile(file) {
    if (!file) return;
    const allowedExtensions = ['xlsx', 'xls', 'csv'];
    const extension = String(file.name.split('.').pop() || '').toLowerCase();
    if (!allowedExtensions.includes(extension)) {
      alert('Unsupported file type. Please upload an .xlsx, .xls, or .csv file.');
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

      if (!rows.length || rows.every(row => row.every(cell => String(cell ?? '').trim() === ''))) {
        state.importPreviewRows = [];
        state.importSummary = calculateImportSummary(state.importPreviewRows);
        renderImportPanel();
        logAction('Attempted to import an empty spreadsheet file.');
        return;
      }

      const headerRow = rows[0].map(value => String(value ?? '').trim());
      const dataRows = rows.slice(1).filter(row => row.some(cell => String(cell ?? '').trim() !== ''));
      const mappedRows = dataRows.map((row) => {
        const entry = {};
        headerRow.forEach((header, index) => {
          const canonicalField = getCanonicalField(header);
          if (canonicalField) {
            entry[canonicalField] = row[index];
          }
        });
        return entry;
      });

      const previewRows = validatePreviewRows(buildPreviewRows(mappedRows));
      state.importPreviewRows = previewRows;
      state.importSummary = calculateImportSummary(state.importPreviewRows);
      renderImportPanel();
      logAction(`Prepared import preview for ${state.importPreviewRows.length} rows from ${file.name}.`);
    } catch (error) {
      console.error(error);
      alert('Unable to parse the selected file. Please ensure it is a valid Excel or CSV worksheet.');
    }
  }

  function exportPreviewData() {
    if (!state.importPreviewRows.length) {
      alert('Import preview is empty. Upload a file before exporting preview data.');
      return;
    }

    const csvRows = state.importPreviewRows.map(row => ({
      'Student ID': row.id || '',
      'Full Name': row.name || '',
      'Roll Number': row.rollNumber || '',
      'Email Address': row.email || '',
      'Course Title': row.course || '',
      'Age': row.age || '',
      'Status': row.status || '',
      'Validation': row.errors.join(' | ') || 'Ready'
    }));

    exportCsvRows(csvRows, `import_preview_${new Date().toISOString().slice(0, 10)}.csv`);
    logAction('Exported current import preview data as CSV.');
  }

  function exportEditedExcel() {
    if (!state.importPreviewRows.length) {
      alert('Upload or create spreadsheet rows before exporting.');
      return;
    }
    if (!window.XLSX) {
      alert('Excel export is unavailable. Please refresh and try again.');
      return;
    }
    const rows = state.importPreviewRows.map(row => ({
      'Student ID': row.id || '',
      'Full Name': row.name || '',
      'Roll Number': row.rollNumber || '',
      'Email Address': row.email || '',
      'Course Title': row.course || '',
      'Age': row.age || '',
      'Status': row.status || ''
    }));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(rows), 'Edited Students');
    XLSX.writeFile(workbook, `edited_student_sheet_${new Date().toISOString().slice(0, 10)}.xlsx`);
    logAction('Exported the edited spreadsheet workspace as an Excel file.');
  }

  function importValidRows() {
    if (!state.importPreviewRows.length) {
      return;
    }

    const rowsToImport = state.importPreviewRows.filter(row => row.isValid);
    if (!rowsToImport.length) {
      alert('No valid rows are available to import.');
      return;
    }

    const nextStudents = [...state.students];
    let added = 0;
    let updated = 0;
    let skipped = 0;

    rowsToImport.forEach((row) => {
      const existingIndex = nextStudents.findIndex(student => student.rollNumber.toLowerCase() === String(row.rollNumber).trim().toLowerCase());
      if (existingIndex >= 0) {
        nextStudents[existingIndex] = {
          ...nextStudents[existingIndex],
          id: nextStudents[existingIndex].id,
          name: row.name,
          rollNumber: row.rollNumber,
          email: row.email,
          course: row.course,
          age: Number(row.age),
          status: row.status
        };
        updated += 1;
      } else {
        nextStudents.unshift({
          id: row.id || `STU-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(10 + Math.random() * 89)}`,
          name: row.name,
          rollNumber: row.rollNumber,
          email: row.email,
          course: row.course,
          age: Number(row.age),
          status: row.status
        });
        added += 1;
      }
    });

    const invalidRows = state.importPreviewRows.filter(row => !row.isValid).length;
    state.students = nextStudents;
    state.importSummary = {
      ...calculateImportSummary(state.importPreviewRows),
      rowsRead: state.importPreviewRows.length,
      added,
      updated,
      skipped: skipped + invalidRows,
      invalidRows
    };
    saveState();
    renderDashboardAnalytics();
    render();
    renderBatchesView();
    renderImportPanel();
    logAction(`Imported ${rowsToImport.length} valid student rows: ${added} added, ${updated} updated, ${invalidRows} skipped.`);
  }

  function initializeImportPanel() {
    if (isInitialized) return;
    isInitialized = true;
    const dropZone = document.getElementById('import-drop-zone');
    const input = document.getElementById('import-file-input');
    const clearButton = document.getElementById('import-clear-btn');
    const addButton = document.getElementById('import-add-row-btn');
    const validateButton = document.getElementById('import-validate-btn');
    const saveButton = document.getElementById('import-save-btn');
    const excelButton = document.getElementById('import-export-excel-btn');
    const importButton = document.getElementById('import-valid-btn');
    const exportButton = document.getElementById('import-export-btn');
    const cancelButton = document.getElementById('import-cancel-btn');

    if (dropZone) {
      ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, (event) => {
          event.preventDefault();
          dropZone.classList.add('border-custom-primary-40', 'bg-green-50');
        });
      });

      ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (event) => {
          event.preventDefault();
          dropZone.classList.remove('border-custom-primary-40', 'bg-green-50');
        });
      });

      dropZone.addEventListener('drop', (event) => {
        const file = event.dataTransfer.files[0];
        if (file) {
          processUploadedFile(file);
        }
      });
    }

    if (input) {
      input.addEventListener('change', (event) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
          processUploadedFile(file);
        }
      });
    }

    if (clearButton) clearButton.addEventListener('click', clearImportPreview);
    if (addButton) addButton.addEventListener('click', addImportPreviewRow);
    if (validateButton) validateButton.addEventListener('click', validateImportPreview);
    if (saveButton) saveButton.addEventListener('click', saveImportEdits);
    if (excelButton) excelButton.addEventListener('click', exportEditedExcel);
    if (importButton) importButton.addEventListener('click', importValidRows);
    if (exportButton) exportButton.addEventListener('click', exportPreviewData);
    if (cancelButton) cancelButton.addEventListener('click', clearImportPreview);

    state.importSummary = calculateImportSummary(state.importPreviewRows || []);
    renderImportPanel();
  }

  window.initializeImportPanel = initializeImportPanel;
  window.processUploadedFile = processUploadedFile;
  window.updateImportPreviewRow = updateImportPreviewRow;
  window.removeImportPreviewRow = removeImportPreviewRow;
  window.addImportPreviewRow = addImportPreviewRow;
  window.setImportPreviewSearch = setImportPreviewSearch;
  window.validateImportPreview = validateImportPreview;
  window.saveImportEdits = saveImportEdits;
  window.importValidRows = importValidRows;
  window.exportPreviewData = exportPreviewData;
  window.exportEditedExcel = exportEditedExcel;
  window.clearImportPreview = clearImportPreview;
  window.downloadImportTemplate = function () {
    const headers = [
      'Student ID',
      'Full Name',
      'Roll Number',
      'Email Address',
      'Course Title',
      'Age',
      'Status'
    ];
    const rows = [headers, [], [], []];
    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(workbook, sheet, 'Students');
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `student_template_${new Date().toISOString().slice(0, 10)}.xlsx`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
    logAction('Downloaded the student import template workbook.');
  };

  document.addEventListener('DOMContentLoaded', initializeImportPanel);
})();
