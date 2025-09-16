// Simple Button Loading System - Exactly as requested
// Shows "انتظار...." text with circular spinner animation

class SimpleButtonLoader {
  constructor() {
    this.originalContents = new Map();
  }

  // Show loading state with Arabic text and spinner
  show(button) {
    if (!button || this.originalContents.has(button)) return;

    // Store original content
    this.originalContents.set(button, button.innerHTML);

    // Create loading content
    const loadingHTML = `
      <span style="display: flex; align-items: center; justify-content: center; gap: 8px;">
        <span>انتظار....</span>
        <span class="simple-spinner"></span>
      </span>
    `;

    // Update button with dark orange/golden loading state
    button.innerHTML = loadingHTML;
    button.disabled = true;
    button.style.pointerEvents = "none";
    // Keep original orange/golden colors but make them darker
    button.style.filter = "brightness(0.7) saturate(1.2) contrast(1.1)";
    button.style.opacity = "1";
    button.style.transform = "scale(0.98)"; // Slight scale down to show it's loading
  }

  // Hide loading and restore original state
  hide(button) {
    if (!button || !this.originalContents.has(button)) return;

    // Restore original content
    button.innerHTML = this.originalContents.get(button);
    button.disabled = false;
    button.style.pointerEvents = "";
    button.style.filter = "";
    button.style.opacity = "";
    button.style.transform = "";

    // Remove from storage
    this.originalContents.delete(button);
  }

  // Check if button is loading
  isLoading(button) {
    return this.originalContents.has(button);
  }
}

// Create global instance
window.simpleLoader = new SimpleButtonLoader();

// Add CSS for spinner animation
const spinnerCSS = `
.simple-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-right: 2px solid currentColor;
  border-radius: 50%;
  animation: simple-spin 1s linear infinite;
  display: inline-block;
}

@keyframes simple-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .simple-spinner {
    width: 14px;
    height: 14px;
  }
}
`;

// Inject CSS into page
if (!document.getElementById("simple-spinner-css")) {
  const style = document.createElement("style");
  style.id = "simple-spinner-css";
  style.textContent = spinnerCSS;
  document.head.appendChild(style);
}

// Helper function for form validation
window.validateAndShowLoading = function (form, button) {
  // Check if all required fields are filled
  const requiredInputs = form.querySelectorAll(
    "input[required], select[required], textarea[required]",
  );

  for (let input of requiredInputs) {
    if (!input.value.trim()) {
      input.focus();
      // Let browser show validation message
      form.reportValidity();
      return false;
    }
  }

  // Validation passed, show loading
  window.simpleLoader.show(button);
  return true;
};
