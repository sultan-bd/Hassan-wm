// Hassan Office Login System - Dual Authentication
// Admin Login (Local) + Firebase User Login

// DOM Elements
const loginForm = document.forms["loginForm"];
const loginButton = document.getElementById("loginButton");
const loginMessage = document.getElementById("loginMessage");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const usernameError = document.getElementById("usernameError");
const passwordError = document.getElementById("passwordError");
const passwordToggle = document.getElementById("passwordToggle");
const forgetPasswordLink = document.getElementById("forgetPasswordLink");

// Password visibility toggle
if (passwordToggle) {
  passwordToggle.addEventListener("click", () => {
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";

    const eyeIcon = passwordToggle.querySelector(".eye-icon");
    if (isHidden) {
      eyeIcon.innerHTML = `
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1
                 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1
                 -2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>`;
    } else {
      eyeIcon.innerHTML = `
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>`;
    }
  });
}

// Forget password link handler
if (forgetPasswordLink) {
  forgetPasswordLink.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "/forgot-password.html";
  });
}

// Login form submission
if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Clear previous messages
    loginMessage.style.display = "none";
    usernameError.textContent = "";
    passwordError.textContent = "";

    // Validate form and show loading
    if (!window.validateAndShowLoading(loginForm, loginButton)) {
      return;
    }

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    try {
      // Check for admin login using secure authentication system
      const secureAuth = window.systemCore?.database?.connection?.authenticate;
      console.log("SecureAuth available:", !!secureAuth);
      console.log("Trying admin login for:", username);

      if (secureAuth && secureAuth(username, password)) {
        console.log("Admin login successful");
        // Clear any existing error messages on successful login
        loginMessage.style.display = "none";
        // Admin login successful
        window.simpleLoader.hide(loginButton);
        setAuthCookie("admin");
        setTimeout(() => redirectToMainContent(), 500);
        return;
      }

      // Try Firebase login for regular users
      console.log("Firebase Auth available:", !!window.firebaseAuth);
      console.log(
        "signInWithEmailAndPassword available:",
        !!window.signInWithEmailAndPassword,
      );

      if (window.firebaseAuth && window.signInWithEmailAndPassword) {
        console.log("Trying Firebase login for:", username);
        await window.signInWithEmailAndPassword(
          window.firebaseAuth,
          username,
          password,
        );
        console.log("Firebase login successful");
        // Clear any existing error messages on successful login
        loginMessage.style.display = "none";
        // Firebase login successful
        window.simpleLoader.hide(loginButton);
        setAuthCookie("user");
        setTimeout(() => redirectToMainContent(), 500);
      } else {
        throw new Error("Firebase not initialized");
      }
    } catch (error) {
      console.warn("Login failed:", error.message);
      // Clear input fields on login failure
      usernameInput.value = "";
      passwordInput.value = "";
      // Show persistent error message
      showMessage("اسم المستخدم أو كلمة المرور غير صحيحة", "error");
    } finally {
      window.simpleLoader.hide(loginButton);
    }
  });
}

// Helper functions
function showMessage(message, type) {
  if (!loginMessage) return;

  loginMessage.textContent = message;
  loginMessage.className = type; // Use existing CSS classes (success/error)
  loginMessage.style.display = "block";

  // Auto-hide messages based on type
  if (type === "success") {
    setTimeout(() => {
      if (loginMessage.className === type) {
        loginMessage.style.display = "none";
      }
    }, 3000);
  } else if (type === "error") {
    // Error messages auto-hide after 1 minute (60 seconds)
    setTimeout(() => {
      if (loginMessage.className === type) {
        loginMessage.style.display = "none";
      }
    }, 60000); // 60 seconds = 1 minute
  }
}

function setAuthCookie(userType) {
  const cookieExpiry = new Date();
  cookieExpiry.setHours(cookieExpiry.getHours() + 24);
  document.cookie = `loggedIn=true;expires=${cookieExpiry.toUTCString()};path=/`;
  document.cookie = `userType=${userType};expires=${cookieExpiry.toUTCString()};path=/`;

  const now = Date.now();
  const buf = new Uint32Array(4);
  (window.crypto || window.msCrypto).getRandomValues(buf);
  const token = Array.from(buf).map((n) => n.toString(16)).join("");
  const session = {
    token,
    userType,
    createdAt: now,
    expiresAt: now + 30 * 60 * 1000,
  };
  try { localStorage.setItem("session", JSON.stringify(session)); } catch {}
}

function redirectToMainContent() {
  // Always redirect to main page after login
  window.location.href = "/";
}

// Check if already logged in and redirect
function checkExistingLogin() {
  if (document.cookie.includes("loggedIn=true")) {
    // Already logged in, redirect to main content
    redirectToMainContent();
  }
}

// Auto-redirect check when page loads
document.addEventListener("DOMContentLoaded", () => {
  // Only check for existing login if we're on login page
  if (window.location.pathname === "/login.html") {
    checkExistingLogin();
  }
});
