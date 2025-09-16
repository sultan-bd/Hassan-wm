// Hassan Office Forgot Password System - Simple & Effective Implementation
// Firebase Password Reset with User Existence Check

// DOM Elements
const forgotPasswordForm = document.forms["forgotPasswordForm"];
const forgotPasswordButton = document.getElementById("forgotPasswordButton");
const emailInput = document.getElementById("email");
const emailError = document.getElementById("emailError");

// Wait for Firebase to be fully loaded
document.addEventListener("DOMContentLoaded", async () => {
  // Check if already logged in, redirect to main content
  if (document.cookie.includes("loggedIn=true")) {
    window.location.href = "/";
    return;
  }

  // Wait for Firebase to initialize
  let attempts = 0;
  const maxAttempts = 50; // 5 seconds max wait

  while (!window.firebaseAuth && attempts < maxAttempts) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    attempts++;
  }

  if (!window.firebaseAuth) {
    console.error("Firebase failed to initialize");
    showFeedback("خطأ في تحميل النظام. يرجى إعادة تحميل الصفحة", "error");
  } else {
    console.log("Firebase initialized successfully for forgot password");
  }
});

// Custom form handler for forgot password
async function handleForgotPassword(event) {
  event.preventDefault();

  // Clear previous messages
  clearMessages();

  // Validate form and show loading
  if (
    !window.validateAndShowLoading(forgotPasswordForm, forgotPasswordButton)
  ) {
    return false;
  }

  const email = emailInput.value.trim();

  // Check if Firebase is available
  if (
    !window.firebaseAuth ||
    !window.sendPasswordResetEmail ||
    !window.createUserWithEmailAndPassword
  ) {
    showFeedback("خطأ في النظام. يرجى إعادة تحميل الصفحة", "error");
    window.simpleLoader.hide(forgotPasswordButton);
    return false;
  }

  try {
    console.log("Checking if user exists in Firebase:", email);

    // Strategy: Try to create user with temp password to check if email already exists
    // If email exists, we'll get 'auth/email-already-in-use' error
    // If email doesn't exist, user will be created (we'll delete immediately)
    let userExists = false;

    try {
      const tempResult = await window.createUserWithEmailAndPassword(
        window.firebaseAuth,
        email,
        "temporary_password_12345_check",
      );

      console.log("Temp user created, email doesn't exist in Firebase");

      // Delete the temporary user immediately
      if (tempResult.user) {
        await tempResult.user.delete();
        console.log("Temporary user deleted");
      }

      // Email doesn't exist in Firebase
      showFeedback(
        "عنوان البريد الإلكتروني غير موجود في النظام. يُرجى إدخال بريد إلكتروني صالح.",
        "error",
      );
      window.simpleLoader.hide(forgotPasswordButton);
      return false;
    } catch (createError) {
      console.log("Create user error:", createError.code);

      if (createError.code === "auth/email-already-in-use") {
        console.log("Email already in use - user exists!");
        userExists = true;
      } else if (createError.code === "auth/weak-password") {
        console.log("Weak password error means user doesn't exist");
        showFeedback(
          "عنوان البريد الإلكتروني غير موجود في النظام. يُرجى إدخال بريد إلكتروني صالح.",
          "error",
        );
        window.simpleLoader.hide(forgotPasswordButton);
        return false;
      } else if (createError.code === "auth/invalid-email") {
        showFeedback(
          "البريد الإلكتروني غير صحيح. يرجى إدخال بريد إلكتروني صالح",
          "error",
        );
        window.simpleLoader.hide(forgotPasswordButton);
        return false;
      } else if (createError.code === "auth/too-many-requests") {
        showFeedback(
          "تم إرسال الكثير من الطلبات. يرجى المحاولة بعد قليل",
          "error",
        );
        window.simpleLoader.hide(forgotPasswordButton);
        return false;
      } else {
        console.log(
          "Other create error, assuming user exists:",
          createError.code,
        );
        userExists = true;
      }
    }

    if (userExists) {
      console.log("User exists, proceeding with password reset");

      // User exists, now send password reset email
      await window.sendPasswordResetEmail(window.firebaseAuth, email);

      console.log("Password reset email sent successfully");
      window.simpleLoader.hide(forgotPasswordButton);
      showFeedback(
        "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. يرجى التحقق من صندوق الوارد",
        "success",
      );

      // Clear form after success
      setTimeout(() => {
        if (forgotPasswordForm) {
          forgotPasswordForm.reset();
        }
      }, 3000);
    }
  } catch (error) {
    // Log the full error for debugging
    console.error("Password reset error:", {
      code: error.code,
      message: error.message,
      email: email,
    });

    // Handle specific Firebase error codes
    switch (error.code) {
      case "auth/user-not-found":
        showFeedback(
          "البريد الإلكتروني غير موجود في النظام. يرجى التحقق من البريد الإلكتروني",
          "error",
        );
        break;

      case "auth/invalid-email":
        showFeedback(
          "البريد الإلكتروني غير صحيح. يرجى إدخال بريد إلكتروني صالح",
          "error",
        );
        break;

      case "auth/too-many-requests":
        showFeedback(
          "تم إرسال الكثير من ��لطلبات. يرجى المحاولة بعد قليل",
          "error",
        );
        break;

      case "auth/network-request-failed":
        showFeedback(
          "فشل في الاتصال بالشبكة. يرجى التحقق من اتصال الإنترنت",
          "error",
        );
        break;

      default:
        showFeedback("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى", "error");
        console.error("Unknown Firebase error:", error.code, error.message);
    }
  } finally {
    window.simpleLoader.hide(forgotPasswordButton);
  }

  return false;
}

// Helper Functions
function clearMessages() {
  const feedback = document.getElementById("feedback");
  if (feedback) {
    feedback.style.display = "none";
    feedback.className = "text";
    feedback.textContent = "";
  }
  if (emailError) {
    emailError.textContent = "";
  }
}

function showFeedback(message, type) {
  const feedback = document.getElementById("feedback");
  feedback.textContent = message;
  feedback.className = `text ${type}`; // Apply text class with success/error class
  feedback.style.display = "block";

  // Hide the feedback after 5 seconds
  setTimeout(() => {
    feedback.style.display = "none";
    feedback.className = "text";
  }, 5000);
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
