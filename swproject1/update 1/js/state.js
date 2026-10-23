/* ============================================
   Student Hub — App State & Constants
   js/state.js
   ============================================ */

// ---- LocalStorage Keys ----
const USERS_KEY   = 'STUDENT_HUB_USERS_STATE';
const SESSION_KEY = 'STUDENT_HUB_SESSION_STATE';
const STATE_KEY   = 'STUDENT_HUB_DATABASE_STATE';

// ---- Auth Users Store ----
let users = JSON.parse(localStorage.getItem(USERS_KEY)) || [
  {
    name: "Devon Lane",
    email: "admin@studenthub.io",
    phone: "+1234567890",
    password: "admin123"
  }
];

// ---- Session Store ----
let session = JSON.parse(localStorage.getItem(SESSION_KEY)) || {
  isLoggedIn: false,
  activeUser: null
};

// ---- Student Database State ----
let state = {
  students: [],
  searchQuery: '',
  importPreviewRows: [],
  importSearchQuery: '',
  importSummary: null,
  sqlStudio: {
    query: "SELECT * FROM students",
    results: [],
    rowCount: 0,
    error: ''
  }
};

// ---- Default Fallback Seed Data (Step 4) ----
const DEFAULT_SEED_DATA = [
  {
    id: "STU-8829-19",
    name: "Amara Chen",
    rollNumber: "2026CS091",
    email: "amara.chen@studenthub.edu",
    course: "Computer Science & AI",
    age: 21,
    status: "Active"
  },
  {
    id: "STU-4402-92",
    name: "Marcus Vance",
    rollNumber: "2026EE104",
    email: "marcus.vance@studenthub.edu",
    course: "Electrical Engineering",
    age: 22,
    status: "Inactive"
  },
  {
    id: "STU-7115-38",
    name: "Elena Rostova",
    rollNumber: "2026BIO053",
    email: "elena.rostova@studenthub.edu",
    course: "Bioinformatics",
    age: 20,
    status: "Active"
  }
];

// ---- Architecture Step → DOM Element Map ----
const STEP_ELEMENT_MAP = {
  1: 'step-1-sidebar',
  2: 'step-2-trigger',
  3: 'step-3-schema',
  4: 'step-4-empty',
  5: null,
  6: 'step-6-grid',
  7: 'step-7-modal',
  8: null,
  9: 'step-9-search',
  10: 'step-10-sync',
  11: 'step-11-widgets',
  12: 'step-12-endpoint'
};
