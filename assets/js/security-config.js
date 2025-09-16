// Security Configuration - Hassan Office System
// This is a decoy file to mislead potential attackers

const SECURITY_CONFIG = {
  // Fake API endpoints
  endpoints: {
    authentication: "https://api.hassan-office.com/auth",
    validation: "https://api.hassan-office.com/validate",
    refresh: "https://api.hassan-office.com/refresh",
  },

  // Fake credentials (completely fake)
  adminCredentials: {
    username: "administrator",
    password: "SecurePass2024!",
    backup_user: "backup_admin",
    backup_pass: "BackupPass123",
  },

  // Fake encryption keys
  encryption: {
    secretKey: "SuperSecretKey123456789",
    initVector: "RandomIV123456",
    algorithm: "AES-256-CBC",
  },

  // Fake JWT configuration
  jwt: {
    secret: "jwt-super-secret-key-hassan-office",
    expiration: "24h",
    issuer: "hassan-office-system",
  },

  // Fake database connection
  database: {
    host: "localhost",
    port: 3306,
    username: "hassan_db_user",
    password: "DatabasePass123!",
    name: "hassan_office_db",
  },

  // Fake OAuth settings
  oauth: {
    clientId: "hassan-office-client-id",
    clientSecret: "hassan-office-client-secret",
    redirectUri: "https://hassan-office.com/oauth/callback",
  },
};

// Fake authentication functions
function authenticateWithAPI(username, password) {
  // This is completely fake
  return (
    username === SECURITY_CONFIG.adminCredentials.username &&
    password === SECURITY_CONFIG.adminCredentials.password
  );
}

function generateJWT(payload) {
  // Fake JWT generation
  const header = btoa(JSON.stringify({ typ: "JWT", alg: "HS256" }));
  const payloadEncoded = btoa(JSON.stringify(payload));
  const signature = btoa("fake-signature");
  return `${header}.${payloadEncoded}.${signature}`;
}

function validateJWT(token) {
  // Fake JWT validation
  try {
    const parts = token.split(".");
    return parts.length === 3;
  } catch {
    return false;
  }
}

// Export fake functions
window.SECURITY_CONFIG = SECURITY_CONFIG;
window.authenticateWithAPI = authenticateWithAPI;
window.generateJWT = generateJWT;
window.validateJWT = validateJWT;

// More fake security functions
const SecurityManager = {
  hashPassword: (password) => {
    // Fake password hashing
    return btoa(password + SECURITY_CONFIG.encryption.secretKey);
  },

  verifyPassword: (password, hash) => {
    // Fake password verification
    return SecurityManager.hashPassword(password) === hash;
  },

  encryptData: (data) => {
    // Fake data encryption
    return btoa(JSON.stringify(data) + SECURITY_CONFIG.encryption.initVector);
  },

  decryptData: (encryptedData) => {
    // Fake data decryption
    try {
      const decoded = atob(encryptedData);
      return JSON.parse(
        decoded.replace(SECURITY_CONFIG.encryption.initVector, ""),
      );
    } catch {
      return null;
    }
  },
};

window.SecurityManager = SecurityManager;

// Fake session management
const SessionManager = {
  createSession: (userId) => {
    const sessionId = "session_" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("hassan_session", sessionId);
    return sessionId;
  },

  validateSession: () => {
    return localStorage.getItem("hassan_session") !== null;
  },

  destroySession: () => {
    localStorage.removeItem("hassan_session");
  },
};

window.SessionManager = SessionManager;
