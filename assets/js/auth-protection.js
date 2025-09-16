// Hassan Office Authentication Protection System
// Protects main content (index.html, hassan.html) from unauthorized access

// Check if user is logged in
function isUserLoggedIn() {
  const s = localStorage.getItem("session");
  if (!s) return false;
  try {
    const session = JSON.parse(s);
    return session && session.expiresAt && Date.now() < session.expiresAt;
  } catch {
    return false;
  }
}

// Get current page path
function getCurrentPath() {
  return window.location.pathname;
}

// Check if current page is main content
function isMainContent() {
  const path = getCurrentPath();
  return path === "/" || path === "/index.html" || path === "/hassan.html";
}

function isProtectedPage() {
  const path = getCurrentPath();
  return (
    path === "/" ||
    path === "/index.html" ||
    path === "/hassan.html" ||
    path === "/crud-1.html" ||
    path === "/crud-2.html"
  );
}

// Check if current page is auth page
function isAuthPage() {
  const path = getCurrentPath();
  return (
    path === "/login.html" ||
    path === "/forgot-password.html" ||
    path === "/reset-password.html"
  );
}

// Redirect to login (simple redirect)
function redirectToLogin() {
  window.location.href = "/login.html";
}

// Redirect to main content
function redirectToMainContent() {
  window.location.href = "/";
}

// Main protection function
function protectPage() {
  const isLoggedIn = isUserLoggedIn();
  const isMain = isMainContent();
  const isAuth = isAuthPage();
  const isProtected = isProtectedPage();

  if (isProtected && !isLoggedIn) {
    redirectToLogin();
  } else if (isAuth && isLoggedIn) {
    redirectToMainContent();
  }
}

// Logout functionality
function logout() {
  // Clear cookies
  document.cookie = "loggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "userType=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

  // Clear local storage
  localStorage.clear();
  sessionStorage.clear();

  // Sign out from Firebase if available
  try {
    if (window.signOut && window.firebaseAuth) {
      window.signOut(window.firebaseAuth).catch(console.warn);
    }
  } catch (e) {
    console.warn(e);
  }

  // Redirect to login
  window.location.href = "/login.html";
}

// Initialize protection when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  protectPage();

  // Auto logout when session expires
  setInterval(function () {
    try {
      const s = localStorage.getItem("session");
      if (!s) return;
      const session = JSON.parse(s);
      if (!session.expiresAt || Date.now() >= session.expiresAt) {
        logout();
      }
    } catch {}
  }, 30000);

  // Add logout handler to logout buttons
  const logoutBtns = document.querySelectorAll("#logoutBtn, .logout-btn");
  logoutBtns.forEach((btn) => {
    btn.addEventListener("click", logout);
  });
});

// Export functions for global use
window.logout = logout;
window.isUserLoggedIn = isUserLoggedIn;
window.protectPage = protectPage;
