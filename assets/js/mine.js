document.addEventListener("DOMContentLoaded", function () {
  // Get the date field element
  const dateField = document.getElementById("date");

  // Function to set today's date in YYYY-MM-DD format
  const setTodaysDate = () => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    dateField.value = formattedDate;
  };

  // Set today's date when the page loads
  setTodaysDate();

  // Fetch the next number from the backend when the page loads
  getNextNumber();
});

document
  .getElementById("submitForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    // Disable the submit button and show 'Submitting...' text
    const submitButton = document.querySelector("button[type='submit']");
    submitButton.disabled = true;
    submitButton.textContent = "انتظر ....";

    // Collect form data
    const number = document.getElementById("number").value;
    const name = document.getElementById("name").value;
    const work = document.getElementById("work").value;
    const sar = document.getElementById("sar").value;
    const paymentType = document.getElementById("paymentType").value;
    const date = document.getElementById("date").value;

    const formData = { number, name, work, sar, paymentType, date };

    // Apps Script Web App URL
    const scriptURL =
      "https://script.google.com/macros/s/AKfycbwAVi7o8MXYiZb8Yz0Imxy_51j3rm6QGlS2SnhbcBoGLkPV3CGF3bbimVBAA1y7H99U/exec"; // Replace with your Web App URL

    try {
      const response = await fetch(scriptURL, {
        method: "POST",
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.status === "success") {
        showFeedback("لقد تم إرسال بياناتك بنجاح ! ", "success");

        // Auto-reset the form and reload new data after a delay
        setTimeout(() => {
          // Clear the form fields
          document.getElementById("submitForm").reset();
          // Get and set the next number
          getNextNumber();

          // Set today's date again
          const dateField = document.getElementById("date");
          const today = new Date();
          const formattedDate = today.toISOString().split("T")[0];
          dateField.value = formattedDate;
        }, 3000); // 3-second delay before reset
      } else {
        // Show error message
        showFeedback("An error occurred. Please try again!", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      // Show error message
      showFeedback(
        "An error occurred. Please check your network connection!",
        "error"
      );
    } finally {
      // Re-enable the submit button and reset text
      submitButton.disabled = false;
      submitButton.textContent = "إرسال";
    }
  });

function showFeedback(message, type) {
  const feedback = document.getElementById("feedback");
  feedback.textContent = message;
  feedback.className = type; // Add the class based on the type (success/error)
  feedback.style.display = "block";

  // Hide the feedback after 3 seconds
  setTimeout(() => {
    feedback.style.display = "none";
  }, 3000);
}

function getNextNumber() {
  const scriptURL =
    "https://script.google.com/macros/s/AKfycbwAVi7o8MXYiZb8Yz0Imxy_51j3rm6QGlS2SnhbcBoGLkPV3CGF3bbimVBAA1y7H99U/exec"; // Replace with your Apps Script URL

  fetch(scriptURL)
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("number").value = data.nextNumber;
    })
    .catch((error) => {
      console.error("Error fetching next number:", error);
    });
}

// Authentication check is now handled by auth-protection.js

document.addEventListener("DOMContentLoaded", function () {
  const sarInput = document.getElementById("sar");

  function formatToTwoDecimal(input) {
    let value = parseFloat(input.value);
    if (!isNaN(value)) {
      input.value = value.toFixed(2);
    }
  }

  if (sarInput) {
    sarInput.addEventListener("blur", function () {
      formatToTwoDecimal(sarInput);
    });
  }
});

// Logout functionality
function logout(event) {
  const logoutBtn = event.target.closest(".logout-btn") || event.target;

  // Show loading state
  window.simpleLoader.show(logoutBtn);

  // Simulate logout process
  setTimeout(() => {
    // Clear the logged in cookie
    document.cookie =
      "loggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Clear any other stored data if needed
    localStorage.clear();
    sessionStorage.clear();

    // Show success state briefly before redirect
    window.simpleLoader.hide(logoutBtn);

    // Redirect to login page after brief delay
    setTimeout(() => {
      window.location.href = "/login.html";
    }, 500);
  }, 800);
}

// Add logout event listener when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }
});
