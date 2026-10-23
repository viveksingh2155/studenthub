/* ============================================
   Student Hub — Architecture Step Tracker
   js/tracker.js
   ============================================ */

/**
 * Returns the title and description for a given architecture step number.
 * @param {number} stepNum
 * @returns {{ title: string, desc: string }}
 */
function getStepDetailsText(stepNum) {
  const steps = {
    1:  { title: "Step 1: Home Page & Layout Framework",       desc: "Constructs the viewport structure featuring a responsive slate left-navigation sidebar panel alongside the primary viewport template." },
    2:  { title: "Step 2: Add Student Page Input Interface",   desc: "Top-right control action button that registers click events to toggle the sleek creation panel layout containing student parameters." },
    3:  { title: "Step 3: Create Student Type Data Schema",    desc: "Sets up frontend schema models checking entries for Roll Numbers, emails, ages, courses, and unique system IDs before persistence." },
    4:  { title: "Step 4: Create Fake Database Array State",   desc: "Renders a clean dashed placeholder layout when all records are erased, prompting administrators to seed the fallback array cache." },
    5:  { title: "Step 5: Student Card Component UI",          desc: "Custom reusable card layouts hosting student metadata, calculated ages, emails, courses, roll numbers, and active/inactive status pills." },
    6:  { title: "Step 6: Student List Page Roster",           desc: "Responsive 3-column roster layout loading modular student cards based on database queries or filtered search results." },
    7:  { title: "Step 7: Edit Student Modal View",            desc: "Pre-fills student object fields inside a glassmorphic modal overlay containing Save Changes and Cancel operations." },
    8:  { title: "Step 8: Destructive Action Footer",          desc: "Permanent student removal trigger embedded inside cards, flushing target IDs out of current workspace state caches." },
    9:  { title: "Step 9: Search Student Real-time Filter",    desc: "Full-width filter bar dynamically parsing search terms against student names, course categories, or unique roll numbers." },
    10: { title: "Step 10: Local Storage Cache Layer Sync",    desc: "Synchronizes the in-memory array database straight into LocalStorage, triggering flash notifications across the status bar on edits." },
    11: { title: "Step 11: System Dashboard Widgets",          desc: "Analyzes overall student states in real-time, flashing active/inactive totals, unique batch counts, and total registrations." },
    12: { title: "Step 12: Connect MongoDB Production Endpoint", desc: "Production endpoint status bar verifying Next.js secure connection handshake with MongoDB Atlas." }
  };
  return steps[stepNum] || { title: "Unknown Step", desc: "Trace details not found." };
}

/**
 * Applies or removes the glowing highlight outline on the architecture-mapped DOM element.
 * Also updates the Active Step details card in the tracker sidebar.
 * @param {number}  stepNum
 * @param {boolean} isHovered
 */
function setStepGlow(stepNum, isHovered) {
  const elementId  = STEP_ELEMENT_MAP[stepNum];
  const details    = getStepDetailsText(stepNum);
  const focusTitle = document.getElementById('focus-step-title');
  const focusDesc  = document.getElementById('focus-step-desc');
  const focusCard  = focusTitle.parentElement;

  if (isHovered) {
    focusTitle.textContent = details.title;
    focusDesc.textContent  = details.desc;
    focusCard.classList.remove('border-blue-500/25');
    focusCard.classList.add('border-custom-primary', 'shadow-glow-custom');
    if (elementId) {
      const el = document.getElementById(elementId);
      if (el) el.classList.add('step-highlight-active');
    }
  } else {
    focusTitle.textContent = 'No Step Highlighted';
    focusDesc.textContent  = 'Hover over tracker elements or click numeric badges to trace live architecture pipeline.';
    focusCard.classList.add('border-blue-500/25');
    focusCard.classList.remove('border-custom-primary', 'shadow-glow-custom');
    if (elementId) {
      const el = document.getElementById(elementId);
      if (el) el.classList.remove('step-highlight-active');
    }
  }
}

/**
 * Triggered when a user clicks an inline step badge.
 * Scrolls the tracker list to that step and pulses the highlight for 3 s.
 * @param {number} stepNum
 */
function triggerStepDetails(stepNum) {
  const trackerEl = document.getElementById(`tracker-step-${stepNum}`);
  if (!trackerEl) return;

  trackerEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  trackerEl.classList.remove('bg-slate-950/40', 'border-slate-800/80');
  trackerEl.classList.add('bg-blue-600/10', 'border-custom-primary', 'shadow-glow-custom');
  setStepGlow(stepNum, true);

  setTimeout(() => {
    trackerEl.classList.remove('bg-blue-600/10', 'border-custom-primary', 'shadow-glow-custom');
    trackerEl.classList.add('bg-slate-950/40', 'border-slate-800/80');
    setStepGlow(stepNum, false);
  }, 3000);
}

/**
 * Alias used by form/modal open triggers.
 * @param {number} stepNum
 */
function highlightStepBadge(stepNum) {
  triggerStepDetails(stepNum);
}
