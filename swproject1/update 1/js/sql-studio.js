/* ============================================
   Student Hub — SQL Dataset Studio Module
   js/sql-studio.js
   ============================================ */

(function () {
  const SAFE_QUERY_PATTERN = /^\s*(with\s+.+\s+select|select)\b/i;
  const BLOCKED_PATTERN =
    /\b(insert|update|delete|drop|alter|create|attach|replace|truncate|merge)\b/i;

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function buildSqlTableData() {
    return state.students.map((student) => ({
      id: student.id,
      name: student.name,
      rollNumber: student.rollNumber,
      email: student.email,
      course: student.course,
      age: student.age,
      status: student.status,
    }));
  }

  function renderSqlStudio() {
    const editor = document.getElementById("sql-editor");
    const resultTable = document.getElementById("sql-result-table");
    const rowCountEl = document.getElementById("sql-row-count");
    const errorEl = document.getElementById("sql-error");
    const exportButton = document.getElementById("sql-export-btn");

    if (editor) {
      editor.value = state.sqlStudio.query || "SELECT * FROM students";
    }

    if (resultTable) {
      if (!state.sqlStudio.results.length) {
        resultTable.innerHTML =
          '<tr><td colspan="7" class="px-4 py-6 text-center text-xs text-slate-500">Run a query to preview rows.</td></tr>';
      } else {
        const headers = Object.keys(state.sqlStudio.results[0]);
        const rows = state.sqlStudio.results
          .map((row) => headers.map((header) => row[header] ?? ""))
          .map((values) => values.map((value) => String(value)));
        const headerHtml = headers
          .map(
            (header) =>
              `<th class="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-300">${escapeHtml(header)}</th>`,
          )
          .join("");
        const bodyHtml = rows
          .map(
            (row) =>
              `<tr class="border-t border-slate-800/70">${row.map((cell) => `<td class="px-3 py-2 text-[11px] text-slate-200">${escapeHtml(cell)}</td>`).join("")}</tr>`,
          )
          .join("");
        resultTable.innerHTML = `<thead><tr class="bg-slate-900 text-slate-100">${headerHtml}</tr></thead><tbody>${bodyHtml}</tbody>`;
      }
    }

    if (rowCountEl) {
      rowCountEl.textContent = `${state.sqlStudio.rowCount} rows`;
    }

    if (errorEl) {
      errorEl.textContent = state.sqlStudio.error || "";
      errorEl.className = state.sqlStudio.error
        ? "text-[11px] text-rose-500"
        : "text-[11px] text-emerald-500";
    }

    if (exportButton) {
      exportButton.disabled = !state.sqlStudio.results.length;
      exportButton.className = state.sqlStudio.results.length
        ? "btn-transition bg-custom-primary bg-custom-primary-hover text-white px-4 py-2 text-xs font-bold rounded-lg border border-custom-primary-40 shadow-sm"
        : "btn-transition bg-slate-200 text-slate-500 px-4 py-2 text-xs font-bold rounded-lg border border-slate-300 shadow-sm cursor-not-allowed";
      exportButton.title = state.sqlStudio.results.length
        ? "Export current query results"
        : "Run a query first to enable export";
    }
  }

  function runSqlQuery() {
    const editorEl = document.getElementById("sql-editor");
    if (!editorEl) return;

    const query = editorEl.value.trim();
    if (!query) {
      state.sqlStudio.error = "Enter a SQL query to run.";
      state.sqlStudio.results = [];
      state.sqlStudio.rowCount = 0;
      renderSqlStudio();
      return;
    }

    const normalized = query.replace(/\s+/g, " ").trim();
    if (BLOCKED_PATTERN.test(normalized)) {
      state.sqlStudio.error =
        "Only read-only SELECT or WITH ... SELECT queries are allowed.";
      state.sqlStudio.results = [];
      state.sqlStudio.rowCount = 0;
      renderSqlStudio();
      logAction(
        "Blocked a non-read-only SQL query attempt in SQL Dataset Studio.",
      );
      return;
    }

    if (!SAFE_QUERY_PATTERN.test(normalized)) {
      state.sqlStudio.error =
        "Only SELECT or WITH ... SELECT statements are permitted.";
      state.sqlStudio.results = [];
      state.sqlStudio.rowCount = 0;
      renderSqlStudio();
      return;
    }

    const statements = normalized
      .split(";")
      .map((value) => value.trim())
      .filter(Boolean);
    if (statements.length > 1) {
      state.sqlStudio.error = "Multiple statements are not allowed.";
      state.sqlStudio.results = [];
      state.sqlStudio.rowCount = 0;
      renderSqlStudio();
      return;
    }

    try {
      const data = buildSqlTableData();
      const alasql = window.alasql;
      if (!alasql) {
        state.sqlStudio.error =
          "AlaSQL is not available. Please refresh the page and try again.";
        renderSqlStudio();
        return;
      }
      state.sqlStudio.query = query;
      alasql("DROP TABLE IF EXISTS students");
      alasql(
        "CREATE TABLE students (id STRING, name STRING, rollNumber STRING, email STRING, course STRING, age INT, status STRING)",
      );
      data.forEach((row) => {
        alasql("INSERT INTO students VALUES (?, ?, ?, ?, ?, ?, ?)", [
          row.id,
          row.name,
          row.rollNumber,
          row.email,
          row.course,
          row.age,
          row.status,
        ]);
      });
      const results = alasql(query);
      const normalizedResults = Array.isArray(results) ? results : [];
      state.sqlStudio.results = normalizedResults;
      state.sqlStudio.rowCount = normalizedResults.length;
      state.sqlStudio.error = "";
      renderSqlStudio();
      logAction("Executed a read-only SQL query in SQL Dataset Studio.");
    } catch (error) {
      state.sqlStudio.error = error.message || "Invalid SQL syntax.";
      state.sqlStudio.results = [];
      state.sqlStudio.rowCount = 0;
      renderSqlStudio();
      logAction("SQL Dataset Studio reported a query syntax error.");
    }
  }

  function resetSqlQuery() {
    state.sqlStudio.query = "SELECT * FROM students";
    state.sqlStudio.results = [];
    state.sqlStudio.rowCount = 0;
    state.sqlStudio.error = "";
    renderSqlStudio();
  }

  function fillSampleQuery(query) {
    const editor = document.getElementById("sql-editor");
    if (editor) {
      editor.value = query;
      state.sqlStudio.query = query;
    }
  }

  function exportSqlResults() {
    if (!state.sqlStudio.results.length) {
      alert("No SQL results are available to export. Run a query first.");
      return;
    }

    const csvRows = state.sqlStudio.results.map((row) => row);
    exportCsvRows(
      csvRows,
      `sql_results_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    logAction("Exported SQL Dataset Studio query results as CSV.");
  }

  function initializeSqlStudio() {
    const runButton = document.getElementById("sql-run-btn");
    const resetButton = document.getElementById("sql-reset-btn");
    const exportButton = document.getElementById("sql-export-btn");
    const sampleButtons = document.querySelectorAll("[data-sample-sql]");

    if (runButton) runButton.addEventListener("click", runSqlQuery);
    if (resetButton) resetButton.addEventListener("click", resetSqlQuery);
    if (exportButton) exportButton.addEventListener("click", exportSqlResults);

    sampleButtons.forEach((button) => {
      button.addEventListener("click", () => {
        fillSampleQuery(button.getAttribute("data-sample-sql"));
      });
    });

    renderSqlStudio();
  }

  window.initializeSqlStudio = initializeSqlStudio;
  window.runSqlQuery = runSqlQuery;
  window.resetSqlQuery = resetSqlQuery;
  window.fillSampleQuery = fillSampleQuery;
  window.exportSqlResults = exportSqlResults;
})();
