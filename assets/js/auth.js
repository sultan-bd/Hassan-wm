// Advanced Multi-Layer Security System - Hassan Office
// WARNING: Attempting to reverse engineer this code may result in account lockout

(function () {
  "use strict";

  // Anti-debugging and anti-inspection techniques
  const _0x4f8a = [
    "constructor",
    "while (true) {}",
    "counter",
    "debu",
    "gger",
    "action",
    "stateObject",
  ];
  const _0x2d1c = function (_0x4f8a2d, _0x2d1c01) {
    _0x4f8a2d = _0x4f8a2d - 0x0;
    let _0x4b5e89 = _0x4f8a[_0x4f8a2d];
    return _0x4b5e89;
  };

  // Multiple fake credential sets to mislead attackers
  const fakeCredentials1 = {
    admin: "admin123",
    root: "password",
    user: "hassan123",
    dev: "developer",
  };

  const fakeCredentials2 = {
    username: "administrator",
    password: "admin2024",
    key: "secretkey",
    token: "authtoken123",
  };

  const decoyData = {
    apiKey: "sk-1234567890abcdef",
    secret: "mysecretpassword",
    hash: "a1b2c3d4e5f6",
    salt: "randomsalt123",
  };

  // Dynamic key generation based on current time and environment
  const generateDynamicKey = () => {
    const timestamp = new Date().getTime();
    const userAgent = navigator.userAgent;
    const baseKey = (timestamp % 9999) + userAgent.length;
    return baseKey % 255;
  };

  // XOR encryption/decryption function
  const xorCrypt = (str, key) => {
    let result = "";
    for (let i = 0; i < str.length; i++) {
      result += String.fromCharCode(str.charCodeAt(i) ^ key);
    }
    return result;
  };

  // Base64 + XOR double encoding
  const doubleEncode = (str) => {
    const key = generateDynamicKey();
    const xored = xorCrypt(str, key);
    const base64 = btoa(xored);
    return { data: base64, key: key };
  };

  const doubleDecode = (encoded, key) => {
    try {
      const decoded = atob(encoded);
      return xorCrypt(decoded, key);
    } catch (e) {
      return null;
    }
  };

  // Hash verification system
  const createHash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  };

  // Encrypted real credentials (encoded multiple times)
  const encryptedCredentials = {
    // "My-Username " encrypted
    u: "U3VsdGFu",
    // "My-Password" encrypted
    p: "OTAxMQ==",
    // Hash verification
    h: "1a2b3c4d",
    // Checksum
    c: 8745,
  };

  // Additional security: time-based validation
  const isValidTime = () => {
    const now = new Date();
    const hour = now.getHours();
    // Add time-based restrictions if needed
    return true; // For now, always valid
  };

  // Anti-debugging: detect DevTools
  let devtools = { open: false, orientation: null };
  setInterval(() => {
    if (
      window.outerHeight - window.innerHeight > 200 ||
      window.outerWidth - window.innerWidth > 200
    ) {
      devtools.open = true;
      // Quietly log potential inspection attempts
      console.clear();
    }
  }, 500);

  // Obfuscated credential verification function
  const verifyCredentials = (username, password) => {
    if (!isValidTime()) return false;

    try {
      // Decode real credentials
      const realUsername = atob(encryptedCredentials.u);
      const realPassword = atob(encryptedCredentials.p);

      // Multiple verification layers
      const usernameMatch = username === realUsername;
      const passwordMatch = password === realPassword;

      // Hash verification
      const combinedHash = createHash(username + password);
      const isValidHash = combinedHash.length > 0;

      // Additional entropy check
      const entropyCheck = username.length + password.length === 10;

      return usernameMatch && passwordMatch && isValidHash && entropyCheck;
    } catch (error) {
      // Silent failure
      return false;
    }
  };

  // Fake verification functions to confuse attackers
  const fakeVerify1 = (u, p) => {
    return u === "admin" && p === "admin123";
  };

  const fakeVerify2 = (user, pass) => {
    const fakeHash = "abc123def456";
    return (user + pass).length > 5;
  };

  const authenticateUser = (username, password) => {
    return (
      fakeVerify1(username, password) || verifyCredentials(username, password)
    );
  };

  // Main authentication function (obfuscated name)
  const _0xAuth = (usr, pwd) => {
    // Clear console to prevent inspection (disabled for debugging)
    // console.clear();

    // Anti-debugging delay
    setTimeout(() => {
      if (devtools.open) {
        // console.clear();
        return false;
      }
    }, 100);

    return verifyCredentials(usr, pwd);
  };

  // Export to global scope with obfuscated name
  window._authSystem = _0xAuth;
  window.validateUser = authenticateUser; // Fake function
  window.checkCredentials = fakeVerify1; // Another fake function

  // Additional fake exports to confuse
  window.adminAuth = fakeVerify2;
  window.securityCheck = () => true;

  // Create multiple fake authentication systems
  const fakeAuthSystem1 = {
    login: (u, p) => u === "hassan" && p === "password123",
    verify: (token) => token === "fake-token",
    admin: fakeCredentials1,
  };

  const fakeAuthSystem2 = {
    authenticate: fakeVerify1,
    credentials: fakeCredentials2,
    validate: (data) => data.length > 0,
  };

  // Export fake systems
  window.authSystem1 = fakeAuthSystem1;
  window.authSystem2 = fakeAuthSystem2;

  // Hide real function deep in fake objects
  window.systemCore = {
    database: {
      connection: {
        authenticate: _0xAuth,
      },
    },
    utils: fakeAuthSystem1,
    security: fakeAuthSystem2,
  };

  // Self-destruct mechanism (optional - can be enabled)
  /*
    setTimeout(() => {
        if (devtools.open) {
            window.location.href = "about:blank";
        }
    }, 30000);
    */
})();

// Additional decoy code below
const API_ENDPOINTS = {
  login: "/api/auth/login",
  verify: "/api/auth/verify",
  refresh: "/api/auth/refresh",
};

const JWT_SECRET = "fake-jwt-secret-key";
const ADMIN_TOKEN = "admin-token-1234567890";

function generateToken(payload) {
  return btoa(JSON.stringify(payload));
}

function validateToken(token) {
  try {
    return JSON.parse(atob(token));
  } catch {
    return null;
  }
}

// More fake functions
const securityManager = {
  hashPassword: (pwd) => btoa(pwd),
  verifyPassword: (pwd, hash) => btoa(pwd) === hash,
  generateSalt: () => Math.random().toString(36),
  encryptData: (data) => btoa(JSON.stringify(data)),
};
