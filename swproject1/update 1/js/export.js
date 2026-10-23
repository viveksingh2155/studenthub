/* ============================================
   Student Hub — Excel / CSV Export Module
   js/export.js
   ============================================ */

function escapeCsvValue(value) {
  const stringValue = String(value ?? "");
  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n") ||
    stringValue.includes("\r")
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

function buildCsvContent(rows, headers) {
  const body = rows.map((row) =>
    headers.map((header) => escapeCsvValue(row[header] ?? "")).join(","),
  );
  return [headers.join(","), ...body].join("\n");
}

function exportCsvRows(rows, filename) {
  if (!rows || !rows.length) {
    alert("Export Error: There is no data available to export.");
    return;
  }

  const headers = Object.keys(rows[0]);
  const csvContent = buildCsvContent(rows, headers);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

function exportDashboardSummary() {
  const summaryRows = [
    {
      Date: new Date().toISOString().slice(0, 10),
      "Total Students": state.students.length,
      "Active Students": state.students.filter(
        (student) =>
          student.status === "Active" || student.status === "Active Status",
      ).length,
      "Inactive Students": state.students.filter(
        (student) =>
          student.status === "Inactive" || student.status === "Inactive Status",
      ).length,
      "Unique Courses": new Set(
        state.students
          .map((student) => String(student.course || "").trim())
          .filter(Boolean),
      ).size,
      "Imported Rows": state.importSummary?.rowsRead || 0,
      "Invalid Rows": state.importSummary?.invalidRows || 0,
    },
  ];
  exportCsvRows(
    summaryRows,
    `dashboard_summary_${new Date().toISOString().slice(0, 10)}.csv`,
  );
  logAction("Exported dashboard summary as CSV.");
}

function exportRosterFiltered() {
  const filtered = state.students.filter(
    (student) =>
      student.name.toLowerCase().includes(state.searchQuery) ||
      student.rollNumber.toLowerCase().includes(state.searchQuery) ||
      student.course.toLowerCase().includes(state.searchQuery),
  );

  const rows = filtered.map((student) => ({
    "Student ID": student.id,
    "Full Name": student.name,
    "Roll Number": student.rollNumber,
    "Email Address": student.email,
    "Course Title": student.course,
    Age: student.age,
    Status: student.status,
  }));

  exportCsvRows(
    rows,
    `student_roster_${new Date().toISOString().slice(0, 10)}.csv`,
  );
  logAction("Exported the currently filtered roster as CSV.");
}

function exportCourseBatches() {
  const rows = [];
  const courseConfigs = [
    { name: "Computer Science & AI", code: "BATCH-CS-2026" },
    { name: "Electrical Engineering", code: "BATCH-EE-2026" },
    { name: "Bioinformatics", code: "BATCH-BIO-2026" },
    { name: "Mechanical Systems", code: "BATCH-ME-2026" },
    { name: "Data Analytics", code: "BATCH-DA-2026" },
  ];

  const courseLookup = new Map(
    courseConfigs.map((config) => [config.name, config.code]),
  );
  state.students.forEach((student) => {
    const batchCode =
      courseLookup.get(student.course) ||
      `BATCH-CUSTOM-${String(rows.filter((row) => row.course === student.course).length + 1).padStart(3, "0")}`;
    rows.push({
      course: student.course,
      batchCode,
      studentId: student.id,
      fullName: student.name,
      rollNumber: student.rollNumber,
      email: student.email,
      status: student.status,
    });
  });

  exportCsvRows(
    rows,
    `course_batches_${new Date().toISOString().slice(0, 10)}.csv`,
  );
  logAction("Exported course batch membership as CSV.");
}

/**
 * Exports the current student database to a dated CSV file download.
 * Complies with Excel-compatible CSV spec (quoted fields, escaped quotes).
 */
function exportToExcel() {
  if (state.students.length === 0) {
    alert("Export Error: The student database roster is currently empty.");
    return;
  }

  const rows = state.students.map((student) => ({
    "Student ID": student.id,
    "Full Name": student.name,
    "Roll Number": student.rollNumber,
    "Email Address": student.email,
    "Course Title": student.course,
    Age: student.age,
    Status: student.status,
  }));

  exportCsvRows(
    rows,
    `student_roster_${new Date().toISOString().slice(0, 10)}.csv`,
  );
  logAction(
    "Exported entire student database roster as an Excel (CSV) spreadsheet.",
  );
}

window.exportDashboardSummary = exportDashboardSummary;
window.exportRosterFiltered = exportRosterFiltered;
window.exportCourseBatches = exportCourseBatches;
window.exportToExcel = exportToExcel;
window.exportCsvRows = exportCsvRows;
