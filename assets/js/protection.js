// Advanced Protection System - Hassan Office
// Multi-layer security and anti-debugging system

(function () {
  "use strict";

  // Detect and prevent debugging attempts
  let debugging = false;

  // Anti-debugging technique 1: DevTools detection
  function detectDevTools() {
    const threshold = 160;
    let devtools = false;

    if (
      window.outerHeight - window.innerHeight > threshold ||
      window.outerWidth - window.innerWidth > threshold
    ) {
      devtools = true;
    }

    // Additional check for Firefox
    if (
      typeof window.console !== "undefined" &&
      typeof window.console.firebug !== "undefined"
    ) {
      devtools = true;
    }

    return devtools;
  }

  // Anti-debugging technique 2: Timing attack
  function timingAttack() {
    const start = performance.now();
    debugger; // This will pause execution if DevTools is open
    const end = performance.now();
    return end - start > 100; // If execution took too long, debugger was hit
  }

  // Anti-debugging technique 3: Console detection
  function detectConsole() {
    let devtools = false;
    const element = new Image();

    Object.defineProperty(element, "id", {
      get: function () {
        devtools = true;
        return "devtools-detected";
      },
    });

    console.log("%c ", element);
    console.clear && console.clear();

    return devtools;
  }

  // Code obfuscation helper
  function obfuscate(str) {
    return str
      .split("")
      .map((char) => String.fromCharCode(char.charCodeAt(0) ^ 42))
      .join("");
  }

  function deobfuscate(str) {
    return str
      .split("")
      .map((char) => String.fromCharCode(char.charCodeAt(0) ^ 42))
      .join("");
  }

  // Dynamic function generation to hide real authentication
  function generateAuthFunction() {
    const funcBody = `
            return function(u, p) {
                const real = atob('U3VsdGFu'); // Hassan
                const pass = atob('OTAxMQ=='); // 1454
                return u === real && p === pass;
            };
        `;
    return new Function(funcBody)();
  }

  // Hide the real auth function in a complex object structure
  const systemRegistry = {
    core: {
      modules: {
        authentication: {
          service: {
            verify: generateAuthFunction(),
          },
        },
      },
    },
  };

  // Protection monitoring
  let protectionActive = true;

  function activateProtection() {
    // Clear console periodically
    setInterval(() => {
      if (detectDevTools() || detectConsole()) {
        console.clear();
        // Optional: redirect or disable functionality
        debugging = true;
      }
    }, 1000);

    // Disable right-click context menu
    document.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      return false;
    });

    // Disable common keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      // F12, Ctrl+Shift+I, Ctrl+Shift+C, Ctrl+U
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "C")) ||
        (e.ctrlKey && e.key === "U")
      ) {
        e.preventDefault();
        return false;
      }
    });

    // Detect selection attempts on critical elements
    document.addEventListener("selectstart", (e) => {
      if (e.target.tagName === "SCRIPT") {
        e.preventDefault();
        return false;
      }
    });
  }

  // Advanced source protection
  function protectSource() {
    // Minify and obfuscate critical functions
    const protectedFunctions = {
      auth: obfuscate("authentication_function"),
      verify: obfuscate("verification_process"),
      validate: obfuscate("validation_system"),
    };

    // Create multiple layers of fake functions
    window.authenticationSystem = {
      level1: {
        verify: () => false,
        authenticate: (u, p) => u === "fake" && p === "fake",
      },
      level2: {
        core: {
          validate: systemRegistry.core.modules.authentication.service.verify,
        },
      },
    };

    // Ensure systemCore exists before accessing it
    if (!window.systemCore) {
      window.systemCore = {
        database: {
          connection: {},
        },
      };
    }

    // Hide real function deeper
    if (
      window.systemCore &&
      window.systemCore.database &&
      window.systemCore.database.connection
    ) {
      window.systemCore.database.connection.authenticate =
        window.authenticationSystem.level2.core.validate;
    }
  }

  // Initialize protection when DOM is ready
  document.addEventListener("DOMContentLoaded", () => {
    activateProtection();
    protectSource();

    // Additional runtime protection
    if (window.systemCore) {
      Object.freeze(window.systemCore);
    }
    if (window.authenticationSystem) {
      Object.freeze(window.authenticationSystem);
    }

    // Periodic integrity check
    setInterval(() => {
      if (!protectionActive) {
        window.location.reload();
      }
    }, 5000);
  });

  // Self-destruct mechanism (commented out for safety)
  /*
    setInterval(() => {
        if (debugging) {
            document.body.innerHTML = '<h1>Access Denied</h1>';
            window.location.href = 'about:blank';
        }
    }, 10000);
    */

  // Export minimal interface
  window.protectionStatus = () => protectionActive;
})();

// Additional fake security code to confuse
const FakeSecurityLayer = {
  apiKey: "sk-hassan-fake-api-key-2024",
  secretToken: "fake-secret-token-123456",

  authenticate: (username, password) => {
    // Completely fake authentication
    const fakeUsers = {
      admin: "password123",
      hassan: "hassan123",
      user: "user123",
    };
    return fakeUsers[username] === password;
  },

  generateToken: () => {
    return "fake-jwt-token-" + Math.random().toString(36);
  },

  validateToken: (token) => {
    return token && token.startsWith("fake-jwt-token-");
  },
};

window.FakeSecurityLayer = FakeSecurityLayer;
