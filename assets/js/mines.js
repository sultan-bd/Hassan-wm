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
  
  // Add character illustration to feedback
  enhanceFeedbackWithCharacters();
});

function enhanceFeedbackWithCharacters() {
  const feedback = document.getElementById("feedback");
  if (feedback) {
    // Create character container
    const characterContainer = document.createElement('div');
    characterContainer.className = 'feedback-character-container';
    characterContainer.style.display = 'none';
    feedback.parentNode.insertBefore(characterContainer, feedback);
  }
}

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
    const sar = document.getElementById("sar").value;
    const date = document.getElementById("date").value;

    const formData = { number, name, sar, date };

    // Apps Script Web App URL
    const scriptURL =
      "https://script.google.com/macros/s/AKfycbxp52CxLGoAqfJh9PEkappyGVYTU0LjZjwEAXrVjtYMPXi-UhI6AkQnP4SlflcB6ec7/exec"; // Replace with your Web App URL

    try {
      const response = await fetch(scriptURL, {
        method: "POST",
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.status === "success") {
        // Show success message
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
  const characterContainer = document.querySelector('.feedback-character-container');
  
  // Add character illustration
  if (characterContainer) {
    characterContainer.style.display = 'block';
    characterContainer.innerHTML = type === 'success' ? getSuccessCharacter() : getErrorCharacter();
  }
  
  feedback.textContent = message;
  feedback.className = type; // Add the class based on the type (success/error)
  feedback.style.display = "block";

  // Hide the feedback after 3 seconds
  setTimeout(() => {
    feedback.style.display = "none";
    if (characterContainer) {
      characterContainer.style.display = 'none';
    }
  }, 3000);
}

function getSuccessCharacter() {
  return `
    <svg viewBox="0 0 200 200" class="feedback-character">
      <defs>
        <linearGradient id="successGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#28a745;stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:#20c997;stop-opacity:0.6" />
        </linearGradient>
      </defs>
      
      <!-- Happy character celebrating -->
      <ellipse cx="100" cy="160" rx="30" ry="6" fill="#ddd" opacity="0.3"/>
      
      <!-- Body -->
      <ellipse cx="100" cy="130" rx="18" ry="22" fill="url(#successGrad)"/>
      
      <!-- Head -->
      <circle cx="100" cy="90" r="16" fill="url(#successGrad)"/>
      
      <!-- Happy eyes -->
      <path d="M 92 87 Q 95 84 98 87" stroke="#333" stroke-width="2" fill="none"/>
      <path d="M 102 87 Q 105 84 108 87" stroke="#333" stroke-width="2" fill="none"/>
      
      <!-- Big smile -->
      <path d="M 90 95 Q 100 105 110 95" stroke="#333" stroke-width="2" fill="none"/>
      
      <!-- Arms up celebrating -->
      <ellipse cx="80" cy="110" rx="6" ry="12" fill="url(#successGrad)" transform="rotate(-30 80 110)"/>
      <ellipse cx="120" cy="110" rx="6" ry="12" fill="url(#successGrad)" transform="rotate(30 120 110)"/>
    </svg>
  `;
}

function getErrorCharacter() {
  return `
    <svg viewBox="0 0 200 200" class="feedback-character">
      <defs>
        <linearGradient id="errorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#dc3545;stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:#c82333;stop-opacity:0.6" />
        </linearGradient>
      </defs>
      
      <!-- Sad character -->
      <ellipse cx="100" cy="160" rx="30" ry="6" fill="#ddd" opacity="0.3"/>
      
      <!-- Body -->
      <ellipse cx="100" cy="130" rx="18" ry="22" fill="url(#errorGrad)"/>
      
      <!-- Head -->
      <circle cx="100" cy="90" r="16" fill="url(#errorGrad)"/>
      
      <!-- Sad eyes -->
      <circle cx="94" cy="87" r="2" fill="#333"/>
      <circle cx="106" cy="87" r="2" fill="#333"/>
      
      <!-- Sad mouth -->
      <path d="M 92 100 Q 100 95 108 100" stroke="#333" stroke-width="2" fill="none"/>
    </svg>
  `;
}

function getNextNumber() {
  const scriptURL =
    "https://script.google.com/macros/s/AKfycbxp52CxLGoAqfJh9PEkappyGVYTU0LjZjwEAXrVjtYMPXi-UhI6AkQnP4SlflcB6ec7/exec"; // Replace with your Apps Script URL

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
