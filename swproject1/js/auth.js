/* ============================================
   Student Hub — Authentication Module
   js/auth.js
   ============================================ */

/**
 * Switches the visible auth sub-panel: 'login' | 'register' | 'reset'
 */
function showAuthView(viewName) {
  document.getElementById('auth-view-login').classList.add('hidden');
  document.getElementById('auth-view-register').classList.add('hidden');
  document.getElementById('auth-view-reset').classList.add('hidden');
  document.getElementById('auth-alert').classList.add('hidden');
  document.getElementById('auth-success').classList.add('hidden');

  document.getElementById(`auth-view-${viewName}`).classList.remove('hidden');
}

/** Displays a red error banner on the auth card. */
function showAuthAlert(msg) {
  document.getElementById('auth-alert-msg').textContent = msg;
  document.getElementById('auth-alert').classList.remove('hidden');
  document.getElementById('auth-success').classList.add('hidden');
}

/** Displays a green success banner on the auth card. */
function showAuthSuccess(msg) {
  document.getElementById('auth-success-msg').textContent = msg;
  document.getElementById('auth-success').classList.remove('hidden');
  document.getElementById('auth-alert').classList.add('hidden');
}

/** Pre-fills the login form with admin demo credentials. */
function autofillCredentials() {
  document.getElementById('login-identifier').value = 'admin@studenthub.io';
  document.getElementById('login-password').value = 'admin123';
  showAuthSuccess("Credentials autofilled: admin@studenthub.io / admin123");
}

/** Simulates dispatching an OTP to the user's contact method. */
function sendMockOTP() {
  const identifier = document.getElementById('reset-identifier').value.trim();
  if (!identifier) {
    showAuthAlert("Please provide an email or phone number first.");
    return;
  }
  const user = users.find(u => u.email === identifier || u.phone === identifier);
  if (!user) {
    showAuthAlert("No account found with this email or phone number.");
    return;
  }
  document.getElementById('reset-otp').value = "123456";
  showAuthSuccess("Mock OTP verification code sent: 123456");
}

/** Handles the Login form submission. */
function handleLoginSubmit(event) {
  event.preventDefault();
  const identifier = document.getElementById('login-identifier').value.trim();
  const password   = document.getElementById('login-password').value;

  const user = users.find(u =>
    (u.email === identifier || u.phone === identifier) && u.password === password
  );

  if (!user) {
    showAuthAlert("Invalid credentials. Try again or register a new admin account.");
    return;
  }

  session.isLoggedIn = true;
  session.activeUser = user;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));

  applySessionState();
  logAction(`Administrator '${user.name}' logged in successfully.`);
}

/** Handles the Register form submission. */
function handleRegisterSubmit(event) {
  event.preventDefault();
  const name     = document.getElementById('register-name').value.trim();
  const email    = document.getElementById('register-email').value.trim();
  const phone    = document.getElementById('register-phone').value.trim();
  const password = document.getElementById('register-password').value;
  const confirm  = document.getElementById('register-confirm').value;

  if (password !== confirm) {
    showAuthAlert("Registration error: Passwords do not match.");
    return;
  }

  const exists = users.some(u => u.email === email || u.phone === phone);
  if (exists) {
    showAuthAlert("Registration error: An account with this email/phone already exists.");
    return;
  }

  const newUser = { name, email, phone, password };
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  showAuthSuccess("Admin account created successfully! You can now log in.");
  showAuthView('login');

  // Pre-fill login for convenience
  document.getElementById('login-identifier').value = email;
  document.getElementById('login-password').value   = password;
}

/** Handles the Password Reset form submission. */
function handleResetSubmit(event) {
  event.preventDefault();
  const identifier  = document.getElementById('reset-identifier').value.trim();
  const otp         = document.getElementById('reset-otp').value.trim();
  const newPassword = document.getElementById('reset-password').value;

  if (otp !== "123456") {
    showAuthAlert("Password recovery error: Invalid OTP verification code.");
    return;
  }

  const userIndex = users.findIndex(u => u.email === identifier || u.phone === identifier);
  if (userIndex === -1) {
    showAuthAlert("Password recovery error: Account identifier not found.");
    return;
  }

  users[userIndex].password = newPassword;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  session.isLoggedIn = true;
  session.activeUser = users[userIndex];
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));

  applySessionState();
  logAction(`Password updated for user '${session.activeUser.name}'. Autologged in.`);
}

/** Signs out the current administrator session. */
function handleSignOut() {
  session.isLoggedIn = false;
  session.activeUser = null;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  applySessionState();
  logAction("Administrator logged out successfully.");
}

/**
 * Shows / hides the auth container vs. the main app layout
 * depending on the current session state.
 */
function applySessionState() {
  if (session.isLoggedIn && session.activeUser) {
    document.getElementById('auth-container').classList.add('hidden');
    document.getElementById('app-layout').classList.remove('hidden');
    document.getElementById('user-display-name').textContent  = session.activeUser.name;
    document.getElementById('user-display-email').textContent = session.activeUser.email;
  } else {
    document.getElementById('auth-container').classList.remove('hidden');
    document.getElementById('app-layout').classList.add('hidden');
    document.getElementById('login-identifier').value = '';
    document.getElementById('login-password').value   = '';
  }
}
