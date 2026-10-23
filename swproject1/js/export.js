/* ============================================
   Student Hub — Excel / CSV Export Module
   js/export.js
   ============================================ */

/**
 * Exports the current student database to a dated CSV file download.
 * Complies with Excel-compatible CSV spec (quoted fields, escaped quotes).
 */
function exportToExcel() {
  if (state.students.length === 0) {
    alert("Export Error: The student database roster is currently empty.");
    return;
  }

  // CSV column headers matching Step 3 schema
  const headers = [
    "Student ID",
    "Full Name",
    "Roll Number",
    "Email Address",
    "Course Title",
    "Age",
    "Status",
  ];

  // Map student records to CSV rows with proper escaping
  const csvRows = state.students.map((s) => [
    s.id,
    `"${s.name.replace(/"/g, '""')}"`,
    s.rollNumber,
    s.email,
    `"${s.course.replace(/"/g, '""')}"`,
    s.age,
    s.status,
  ]);

  const csvContent = [
    headers.join(","),
    ...csvRows.map((row) => row.join(",")),
  ].join("\n");

  // Build and trigger blob download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.setAttribute("href", url);
  anchor.setAttribute(
    "download",
    `student_roster_${new Date().toISOString().slice(0, 10)}.csv`,
  );
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  logAction(
    "Exported entire student database roster as an Excel (CSV) spreadsheet.",
  );
}
