/* ============================================
   Student Hub — Course Batches View Module
   js/batches.js
   ============================================ */

/**
 * Renders the Course Batches directory grid with enrolled student counts
 * and a collapsible roster for each module.
 */
function renderBatchesView() {
  const container = document.getElementById('batches-grid-container');
  if (!container) return;

  container.innerHTML = '';

  const courseConfigs = [
    { name: "Computer Science & AI",  code: "BATCH-CS-2026",  schedule: "Mon/Wed 10:00 AM - 12:30 PM", icon: "chip"  },
    { name: "Electrical Engineering", code: "BATCH-EE-2026",  schedule: "Tue/Thu 02:00 PM - 04:30 PM", icon: "bolt"  },
    { name: "Bioinformatics",         code: "BATCH-BIO-2026", schedule: "Fri 09:00 AM - 01:00 PM",     icon: "dna"   },
    { name: "Mechanical Systems",     code: "BATCH-ME-2026",  schedule: "Mon/Wed 01:30 PM - 04:00 PM", icon: "cog"   },
    { name: "Data Analytics",         code: "BATCH-DA-2026",  schedule: "Sat 09:00 AM - 02:00 PM",     icon: "chart" }
  ];

  const ICONS = {
    chip:  `<svg class="w-5 h-5 text-custom-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 5h10a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2z"></path></svg>`,
    bolt:  `<svg class="w-5 h-5 text-custom-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>`,
    dna:   `<svg class="w-5 h-5 text-custom-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l-3-3m3 3l-3 3M4.5 12l3-3m-3 3l3 3"></path></svg>`,
    cog:   `<svg class="w-5 h-5 text-custom-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path></svg>`,
    chart: `<svg class="w-5 h-5 text-custom-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>`
  };

  courseConfigs.forEach((c, idx) => {
    const enrolledStudents = state.students.filter(s => s.course === c.name);
    const count            = enrolledStudents.length;
    const iconSvg          = ICONS[c.icon] || ICONS.chart;

    const studentListHtml = count > 0
      ? `<div id="batch-roster-${idx}" class="hidden mt-4 pt-4 border-t border-slate-800/80 space-y-2">
           <span class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Registered Rosters:</span>
           <div class="space-y-1.5 max-h-36 overflow-y-auto pr-1">
             ${enrolledStudents.map(s => `
               <div class="flex items-center justify-between text-xs bg-slate-950 px-3 py-2 rounded-lg border border-slate-800/40">
                 <span class="text-slate-300 font-medium">${s.name}</span>
                 <span class="font-mono text-slate-500 text-[10px]">${s.rollNumber}</span>
               </div>
             `).join('')}
           </div>
         </div>`
      : `<div id="batch-roster-${idx}" class="hidden mt-4 pt-4 border-t border-slate-800/80 text-center text-xs text-slate-500 py-3 bg-slate-950 rounded-lg">
           ⚠ No student profiles enrolled in this module.
         </div>`;

    container.innerHTML += `
      <div class="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl hover:border-slate-700/60 shadow-sm relative group overflow-hidden transition-all duration-300">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
              ${iconSvg}
            </div>
            <div>
              <h4 class="text-sm font-bold text-slate-200 tracking-wide">${c.name}</h4>
              <span class="font-mono text-[10px] text-slate-500 tracking-wider">${c.code}</span>
            </div>
          </div>
          <span class="px-2.5 py-0.5 text-[10px] font-mono font-bold rounded bg-custom-primary/10 border border-custom-primary-20 text-custom-primary">
            ${count} Accounts
          </span>
        </div>

        <div class="mt-4 space-y-1.5 text-xs text-slate-400">
          <div class="flex items-center justify-between">
            <span>Timetable Schedule</span>
            <span class="text-slate-200 font-medium text-right">${c.schedule}</span>
          </div>
        </div>

        <div class="mt-5">
          <button onclick="toggleBatchList(${idx})" class="w-full btn-transition py-2 text-center text-xs font-semibold text-slate-400 hover:text-white bg-slate-950 hover:bg-slate-800/40 rounded-lg border border-slate-800 hover:border-slate-700/50">
            View Enrolled Student Directory
          </button>
        </div>

        ${studentListHtml}
      </div>
    `;
  });
}

/**
 * Toggles the collapsible enrolled student list within a batch card.
 * @param {number} idx - Batch card index.
 */
function toggleBatchList(idx) {
  const rosterDiv = document.getElementById(`batch-roster-${idx}`);
  rosterDiv.classList.toggle('hidden');
}
