const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Additional content for remaining topics
const additionalContent = {
  jwt: {
    blog: {
      title: "JWT (JSON Web Tokens): Complete Guide to Modern Authentication",
      excerpt:
        "Master JWT authentication, understand token structure, security best practices, and implementation in modern web applications.",
      content: `# JWT (JSON Web Tokens): Complete Guide to Modern Authentication

## Introduction

JSON Web Tokens (JWT) are a compact, URL-safe means of representing claims between two parties. They have become the standard for stateless authentication in modern web applications.

## What is JWT?

JWT is an open standard (RFC 7519) that defines a way to securely transmit information between parties as a JSON object. This information can be verified and trusted because it's digitally signed.

## JWT Structure

A JWT consists of three parts separated by dots (.):

\`\`\`
header.payload.signature
\`\`\`

### 1. Header
Contains metadata about the token:
\`\`\`json
{
  "alg": "HS256",
  "typ": "JWT"
}
\`\`\`

### 2. Payload
Contains the claims (statements about an entity):
\`\`\`json
{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022,
  "exp": 1516242622
}
\`\`\`

### 3. Signature
Ensures the token hasn't been tampered with:
\`\`\`javascript
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)
\`\`\`

## JWT Claims

### Standard Claims (Reserved)
- **iss** (issuer): Who issued the token
- **sub** (subject): Who the token is about
- **aud** (audience): Who the token is intended for
- **exp** (expiration): When the token expires
- **iat** (issued at): When the token was issued
- **nbf** (not before): When the token becomes valid
- **jti** (JWT ID): Unique identifier for the token

### Custom Claims
You can add any custom data:
\`\`\`json
{
  "userId": "12345",
  "role": "admin",
  "permissions": ["read", "write", "delete"]
}
\`\`\`

## Implementation Examples

### Node.js with jsonwebtoken Library

#### Installation
\`\`\`bash
npm install jsonwebtoken
\`\`\`

#### Creating Tokens
\`\`\`javascript
const jwt = require('jsonwebtoken');

// Create a token
function generateToken(user) {
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    iat: Math.floor(Date.now() / 1000)
  };

  const options = {
    expiresIn: '1h',
    issuer: 'your-app-name',
    audience: 'your-app-users'
  };

  return jwt.sign(payload, process.env.JWT_SECRET, options);
}

// Usage
const token = generateToken({
  id: '12345',
  email: 'user@example.com',
  role: 'user'
});
\`\`\`

#### Verifying Tokens
\`\`\`javascript
function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { valid: true, decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

// Usage
const result = verifyToken(token);
if (result.valid) {
  console.log('User:', result.decoded);
} else {
  console.log('Invalid token:', result.error);
}
\`\`\`

### Express.js Middleware
\`\`\`javascript
const jwt = require('jsonwebtoken');

// JWT Authentication Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    
    req.user = user;
    next();
  });
}

// Protected route
app.get('/profile', authenticateToken, (req, res) => {
  res.json({
    message: 'Protected data',
    user: req.user
  });
});
\`\`\`

### Role-based Authorization
\`\`\`javascript
function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (req.user.role !== role) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
}

// Admin-only route
app.delete('/users/:id', authenticateToken, requireRole('admin'), (req, res) => {
  // Delete user logic
});
\`\`\`

## Frontend Implementation

### Storing Tokens
\`\`\`javascript
// Store token in localStorage (simple but less secure)
localStorage.setItem('token', jwtToken);

// Store token in httpOnly cookie (more secure)
// This requires server-side setting
document.cookie = \`token=\${jwtToken}; HttpOnly; Secure; SameSite=Strict\`;

// Store in memory (most secure but lost on refresh)
let authToken = jwtToken;
\`\`\`

### Making Authenticated Requests
\`\`\`javascript
// Using fetch
async function makeAuthenticatedRequest(url, options = {}) {
  const token = localStorage.getItem('token');
  
  const config = {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': \`Bearer \${token}\`,
      'Content-Type': 'application/json'
    }
  };

  const response = await fetch(url, config);
  
  if (response.status === 401) {
    // Token expired, redirect to login
    window.location.href = '/login';
    return;
  }

  return response;
}

// Usage
const response = await makeAuthenticatedRequest('/api/profile');
const userData = await response.json();
\`\`\`

### React Hook for JWT
\`\`\`javascript
import { useState, useEffect, createContext, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Decode token to get user info
      try {
        const decoded = jwt.decode(token);
        if (decoded.exp > Date.now() / 1000) {
          setUser(decoded);
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    const decoded = jwt.decode(token);
    setUser(decoded);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
\`\`\`

## Security Best Practices

### 1. Use Strong Secrets
\`\`\`javascript
// Generate a strong secret
const crypto = require('crypto');
const secret = crypto.randomBytes(64).toString('hex');

// Use environment variables
const JWT_SECRET = process.env.JWT_SECRET || secret;
\`\`\`

### 2. Set Appropriate Expiration
\`\`\`javascript
const shortLivedToken = jwt.sign(payload, secret, { expiresIn: '15m' });
const longLivedToken = jwt.sign(payload, secret, { expiresIn: '7d' });
\`\`\`

### 3. Validate All Claims
\`\`\`javascript
function validateToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'your-app',
      audience: 'your-users',
      algorithms: ['HS256']
    });

    // Additional validation
    if (!decoded.sub || !decoded.email) {
      throw new Error('Invalid token payload');
    }

    return decoded;
  } catch (error) {
    throw new Error('Token validation failed: ' + error.message);
  }
}
\`\`\`

### 4. Implement Token Blacklisting
\`\`\`javascript
const blacklistedTokens = new Set();

function blacklistToken(token) {
  blacklistedTokens.add(token);
}

function isTokenBlacklisted(token) {
  return blacklistedTokens.has(token);
}

// Enhanced verification
function verifyTokenWithBlacklist(token) {
  if (isTokenBlacklisted(token)) {
    throw new Error('Token has been revoked');
  }
  
  return jwt.verify(token, JWT_SECRET);
}
\`\`\`

## Common Vulnerabilities

### 1. None Algorithm Attack
\`\`\`javascript
// Vulnerable - allows 'none' algorithm
jwt.verify(token, secret);

// Secure - explicitly specify algorithms
jwt.verify(token, secret, { algorithms: ['HS256'] });
\`\`\`

### 2. Weak Secrets
\`\`\`javascript
// Vulnerable
const secret = 'secret123';

// Secure
const secret = crypto.randomBytes(64).toString('hex');
\`\`\`

### 3. No Expiration
\`\`\`javascript
// Vulnerable - no expiration
const token = jwt.sign(payload, secret);

// Secure - with expiration
const token = jwt.sign(payload, secret, { expiresIn: '1h' });
\`\`\`

## JWT vs Sessions

| Aspect | JWT | Sessions |
|--------|-----|----------|
| Storage | Client-side | Server-side |
| Scalability | High | Lower |
| Revocation | Difficult | Easy |
| Size | Larger | Smaller |
| Security | Self-contained | Server-controlled |

## When to Use JWT

### ✅ Good for:
- Microservices architecture
- Single Sign-On (SSO)
- API authentication
- Stateless applications
- Cross-domain authentication

### ❌ Avoid for:
- Long-lived sessions
- Frequently changing permissions
- High-security applications requiring immediate revocation

## Advanced Patterns

### Refresh Token Implementation
\`\`\`javascript
function generateTokenPair(user) {
  const accessToken = jwt.sign(
    { sub: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { sub: user.id, type: 'refresh' },
    process.env.REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
}

function refreshAccessToken(refreshToken) {
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    
    if (decoded.type !== 'refresh') {
      throw new Error('Invalid token type');
    }

    // Generate new access token
    return generateAccessToken({ id: decoded.sub });
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
}
\`\`\`

## Testing JWT

### Unit Tests
\`\`\`javascript
const jwt = require('jsonwebtoken');

describe('JWT Utils', () => {
  const secret = 'test-secret';
  const payload = { userId: '123', role: 'user' };

  test('should generate valid token', () => {
    const token = jwt.sign(payload, secret);
    expect(typeof token).toBe('string');
  });

  test('should verify valid token', () => {
    const token = jwt.sign(payload, secret);
    const decoded = jwt.verify(token, secret);
    expect(decoded.userId).toBe('123');
  });

  test('should reject expired token', () => {
    const token = jwt.sign(payload, secret, { expiresIn: '0s' });
    expect(() => jwt.verify(token, secret)).toThrow();
  });
});
\`\`\`

## Conclusion

JWT is a powerful tool for modern authentication, but it requires careful implementation. Key takeaways:

1. **Always validate tokens properly**
2. **Use strong secrets and secure algorithms**
3. **Implement appropriate expiration times**
4. **Consider refresh token patterns for better UX**
5. **Be aware of security implications**

JWT works best in stateless, distributed systems where you need to share authentication across services without requiring a central session store.
`,
      category: "Authentication",
      tags: ["JWT", "Authentication", "Security", "Tokens", "Node.js"],
      readTime: 15,
      published: true,
    },
    note: {
      title: "JWT - Quick Reference",
      content: `# JWT - Quick Reference

## Structure
\`\`\`
header.payload.signature
\`\`\`

## Standard Claims
- **iss**: issuer
- **sub**: subject (user ID)
- **aud**: audience
- **exp**: expiration time
- **iat**: issued at
- **nbf**: not before
- **jti**: JWT ID

## Node.js Implementation
\`\`\`javascript
const jwt = require('jsonwebtoken');

// Create token
const token = jwt.sign(payload, secret, { expiresIn: '1h' });

// Verify token
const decoded = jwt.verify(token, secret);
\`\`\`

## Express Middleware
\`\`\`javascript
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'No token' });
  
  jwt.verify(token, secret, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}
\`\`\`

## Security Best Practices
- ✅ Use strong secrets (64+ bytes)
- ✅ Set expiration times
- ✅ Specify algorithms explicitly
- ✅ Validate all claims
- ✅ Use HTTPS only
- ❌ Never store secrets in code
- ❌ Don't use 'none' algorithm

## Storage Options
1. **localStorage**: Simple but XSS vulnerable
2. **httpOnly Cookies**: More secure
3. **Memory**: Most secure but lost on refresh

## Token Types
- **Access Token**: Short-lived (15-30 min)
- **Refresh Token**: Long-lived (days/weeks)

## Common Patterns
\`\`\`javascript
// Refresh token flow
if (accessTokenExpired) {
  newAccessToken = refreshAccessToken(refreshToken);
}

// Role-based access
const requireRole = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};
\`\`\`

## When to Use JWT
✅ Microservices, APIs, SSO, Stateless apps
❌ Long sessions, Frequent permission changes
`,
      category: "Authentication",
      tags: ["JWT", "Quick Reference", "Authentication"],
    },
  },

  cookies: {
    blog: {
      title: "HTTP Cookies: Complete Guide to Web Session Management",
      excerpt:
        "Master HTTP cookies for session management, authentication, and user tracking. Learn security best practices and implementation techniques.",
      content: `# HTTP Cookies: Complete Guide to Web Session Management

## Introduction

HTTP cookies are small pieces of data stored by the web browser and sent back to the server with subsequent requests. They're essential for maintaining state in the stateless HTTP protocol.

## What are HTTP Cookies?

Cookies are name-value pairs stored by the browser and automatically included in HTTP requests to the same domain. They enable servers to remember information about users between requests.

## Cookie Anatomy

### Basic Structure
\`\`\`
Set-Cookie: name=value; attribute1=value1; attribute2=value2
\`\`\`

### Example
\`\`\`http
Set-Cookie: sessionId=abc123; Domain=.example.com; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=3600
\`\`\`

## Cookie Attributes

### 1. Domain
Specifies which hosts can receive the cookie:
\`\`\`http
Set-Cookie: user=john; Domain=.example.com
\`\`\`
- \`.example.com\` includes all subdomains
- \`example.com\` only includes exact domain

### 2. Path
Limits the cookie to specific URL paths:
\`\`\`http
Set-Cookie: sessionId=123; Path=/admin
\`\`\`

### 3. Expires / Max-Age
Controls cookie lifetime:
\`\`\`http
Set-Cookie: session=abc; Expires=Wed, 09 Jun 2024 10:18:14 GMT
Set-Cookie: session=abc; Max-Age=3600
\`\`\`

### 4. Secure
Cookie only sent over HTTPS:
\`\`\`http
Set-Cookie: sessionId=123; Secure
\`\`\`

### 5. HttpOnly
Prevents JavaScript access:
\`\`\`http
Set-Cookie: sessionId=123; HttpOnly
\`\`\`

### 6. SameSite
CSRF protection:
\`\`\`http
Set-Cookie: sessionId=123; SameSite=Strict
Set-Cookie: sessionId=123; SameSite=Lax
Set-Cookie: sessionId=123; SameSite=None; Secure
\`\`\`

## Cookie Types

### 1. Session Cookies
Deleted when browser closes:
\`\`\`http
Set-Cookie: sessionId=abc123
\`\`\`

### 2. Persistent Cookies
Survive browser restarts:
\`\`\`http
Set-Cookie: remember=true; Max-Age=2592000
\`\`\`

### 3. Secure Cookies
Only sent over HTTPS:
\`\`\`http
Set-Cookie: token=secret; Secure; HttpOnly
\`\`\`

## Implementation Examples

### Node.js with Express

#### Setting Cookies
\`\`\`javascript
const express = require('express');
const app = express();

// Basic cookie
app.get('/login', (req, res) => {
  res.cookie('sessionId', 'abc123', {
    maxAge: 3600000, // 1 hour
    httpOnly: true,
    secure: true,
    sameSite: 'strict'
  });
  res.send('Cookie set');
});

// Multiple cookies
app.get('/dashboard', (req, res) => {
  res.cookie('user', 'john', { httpOnly: true });
  res.cookie('theme', 'dark', { maxAge: 86400000 }); // 24 hours
  res.send('Welcome to dashboard');
});
\`\`\`

#### Reading Cookies
\`\`\`javascript
const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.get('/profile', (req, res) => {
  const sessionId = req.cookies.sessionId;
  const user = req.cookies.user;
  
  if (!sessionId) {
    return res.status(401).send('Not authenticated');
  }
  
  res.json({
    sessionId,
    user,
    message: 'Profile data'
  });
});
\`\`\`

#### Deleting Cookies
\`\`\`javascript
app.post('/logout', (req, res) => {
  res.clearCookie('sessionId');
  res.clearCookie('user');
  res.send('Logged out');
});
\`\`\`

### Advanced Cookie Management

#### Signed Cookies
\`\`\`javascript
const cookieParser = require('cookie-parser');
app.use(cookieParser('your-secret-key'));

// Set signed cookie
app.get('/secure-login', (req, res) => {
  res.cookie('secureSession', 'abc123', { 
    signed: true,
    httpOnly: true 
  });
  res.send('Secure cookie set');
});

// Read signed cookie
app.get('/secure-profile', (req, res) => {
  const secureSession = req.signedCookies.secureSession;
  if (!secureSession) {
    return res.status(401).send('Invalid session');
  }
  res.send('Secure profile');
});
\`\`\`

#### Cookie-based Sessions
\`\`\`javascript
const session = require('express-session');

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true, // HTTPS only
    httpOnly: true,
    maxAge: 3600000 // 1 hour
  }
}));

app.post('/login', (req, res) => {
  // Authenticate user
  req.session.userId = user.id;
  req.session.role = user.role;
  res.send('Logged in');
});

app.get('/dashboard', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send('Please log in');
  }
  res.send(\`Welcome user \${req.session.userId}\`);
});
\`\`\`

## Frontend Implementation

### JavaScript Cookie Manipulation

#### Setting Cookies
\`\`\`javascript
// Basic cookie
document.cookie = "username=john";

// With attributes
document.cookie = "sessionId=abc123; max-age=3600; secure; samesite=strict";

// Helper function
function setCookie(name, value, options = {}) {
  let cookieString = \`\${name}=\${value}\`;
  
  if (options.maxAge) {
    cookieString += \`; max-age=\${options.maxAge}\`;
  }
  
  if (options.domain) {
    cookieString += \`; domain=\${options.domain}\`;
  }
  
  if (options.path) {
    cookieString += \`; path=\${options.path}\`;
  }
  
  if (options.secure) {
    cookieString += '; secure';
  }
  
  if (options.sameSite) {
    cookieString += \`; samesite=\${options.sameSite}\`;
  }
  
  document.cookie = cookieString;
}

// Usage
setCookie('theme', 'dark', {
  maxAge: 86400,
  secure: true,
  sameSite: 'strict'
});
\`\`\`

#### Reading Cookies
\`\`\`javascript
function getCookie(name) {
  const cookies = document.cookie.split(';');
  
  for (let cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=');
    if (cookieName === name) {
      return cookieValue;
    }
  }
  
  return null;
}

// Alternative approach
function getAllCookies() {
  return document.cookie
    .split(';')
    .reduce((cookies, cookie) => {
      const [name, value] = cookie.trim().split('=');
      cookies[name] = value;
      return cookies;
    }, {});
}

// Usage
const theme = getCookie('theme');
const allCookies = getAllCookies();
\`\`\`

#### Deleting Cookies
\`\`\`javascript
function deleteCookie(name, path = '/', domain = '') {
  let cookieString = \`\${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=\${path}\`;
  
  if (domain) {
    cookieString += \`; domain=\${domain}\`;
  }
  
  document.cookie = cookieString;
}

// Usage
deleteCookie('sessionId');
\`\`\`

### React Cookie Hook
\`\`\`javascript
import { useState, useEffect } from 'react';

function useCookie(name, defaultValue = null) {
  const [value, setValue] = useState(() => {
    const cookie = getCookie(name);
    return cookie || defaultValue;
  });

  const updateCookie = (newValue, options = {}) => {
    setCookie(name, newValue, options);
    setValue(newValue);
  };

  const deleteCookie = () => {
    document.cookie = \`\${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT\`;
    setValue(null);
  };

  return [value, updateCookie, deleteCookie];
}

// Usage in component
function App() {
  const [theme, setTheme, deleteTheme] = useCookie('theme', 'light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme, { maxAge: 86400 });
  };

  return (
    <div className={theme}>
      <button onClick={toggleTheme}>
        Switch to {theme === 'light' ? 'dark' : 'light'} theme
      </button>
    </div>
  );
}
\`\`\`

## Security Considerations

### 1. XSS Protection
\`\`\`javascript
// Always use HttpOnly for sensitive cookies
res.cookie('sessionId', token, {
  httpOnly: true, // Prevents JavaScript access
  secure: true,
  sameSite: 'strict'
});
\`\`\`

### 2. CSRF Protection
\`\`\`javascript
// Use SameSite attribute
res.cookie('sessionId', token, {
  sameSite: 'strict' // or 'lax'
});

// Double-submit cookie pattern
res.cookie('csrfToken', csrfToken, {
  httpOnly: false // Accessible to JavaScript
});
\`\`\`

### 3. Secure Transmission
\`\`\`javascript
// Always use Secure in production
res.cookie('sessionId', token, {
  secure: process.env.NODE_ENV === 'production'
});
\`\`\`

### 4. Cookie Encryption
\`\`\`javascript
const crypto = require('crypto');

function encryptCookie(value, secret) {
  const cipher = crypto.createCipher('aes-256-cbc', secret);
  let encrypted = cipher.update(value, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decryptCookie(encryptedValue, secret) {
  const decipher = crypto.createDecipher('aes-256-cbc', secret);
  let decrypted = decipher.update(encryptedValue, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
\`\`\`

## Cookie vs Other Storage

| Storage | Size Limit | Accessible to JS | Sent with Requests | Persistent |
|---------|------------|------------------|-------------------|------------|
| Cookies | 4KB | Yes (unless HttpOnly) | Always | Yes |
| localStorage | 5-10MB | Yes | No | Yes |
| sessionStorage | 5-10MB | Yes | No | No |

## GDPR and Cookie Compliance

### Cookie Consent Implementation
\`\`\`javascript
class CookieConsent {
  constructor() {
    this.consentGiven = this.getConsent();
    this.showBannerIfNeeded();
  }

  getConsent() {
    return localStorage.getItem('cookieConsent') === 'true';
  }

  setConsent(consent) {
    localStorage.setItem('cookieConsent', consent.toString());
    this.consentGiven = consent;
  }

  showBannerIfNeeded() {
    if (!this.consentGiven) {
      this.showConsentBanner();
    }
  }

  showConsentBanner() {
    const banner = document.createElement('div');
    banner.innerHTML = \`
      <div style="position: fixed; bottom: 0; left: 0; right: 0; background: #333; color: white; padding: 20px;">
        <p>We use cookies to improve your experience.</p>
        <button onclick="cookieConsent.acceptAll()">Accept All</button>
        <button onclick="cookieConsent.acceptNecessary()">Necessary Only</button>
      </div>
    \`;
    document.body.appendChild(banner);
  }

  acceptAll() {
    this.setConsent(true);
    this.enableAllCookies();
    this.hideBanner();
  }

  acceptNecessary() {
    this.setConsent(false);
    this.enableNecessaryCookies();
    this.hideBanner();
  }
}

const cookieConsent = new CookieConsent();
\`\`\`

## Best Practices

### 1. Minimize Cookie Usage
- Use cookies only for essential data
- Consider localStorage for client-side data

### 2. Secure Configuration
\`\`\`javascript
const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 3600000 // 1 hour
};
\`\`\`

### 3. Regular Cleanup
\`\`\`javascript
// Clean expired sessions
setInterval(() => {
  // Remove expired session cookies from database
  cleanExpiredSessions();
}, 300000); // Every 5 minutes
\`\`\`

### 4. Monitor Cookie Size
\`\`\`javascript
function getCookieSize() {
  return document.cookie.length;
}

if (getCookieSize() > 3000) {
  console.warn('Cookies approaching size limit');
}
\`\`\`

## Troubleshooting Common Issues

### 1. Cookies Not Being Set
- Check domain and path attributes
- Verify HTTPS for Secure cookies
- Ensure proper encoding

### 2. Cookies Not Being Sent
- Check SameSite policy
- Verify domain matches
- Check if cookies are expired

### 3. Size Limitations
- Use multiple cookies if needed
- Store references, not full data
- Consider alternative storage methods

## Conclusion

HTTP cookies are fundamental to web session management. Key takeaways:

1. **Always use security attributes** (HttpOnly, Secure, SameSite)
2. **Minimize sensitive data** in cookies
3. **Implement proper expiration** policies
4. **Consider GDPR compliance** requirements
5. **Monitor cookie size** limitations

Cookies work best for session management and small pieces of state that need to be sent with every request.
`,
      category: "Web Security",
      tags: [
        "Cookies",
        "Session Management",
        "HTTP",
        "Security",
        "Web Development",
      ],
      readTime: 12,
      published: true,
    },
    note: {
      title: "HTTP Cookies - Quick Reference",
      content: `# HTTP Cookies - Quick Reference

## Basic Syntax
\`\`\`http
Set-Cookie: name=value; attribute1=value1; attribute2
\`\`\`

## Key Attributes
- **Domain**: \`.example.com\` (includes subdomains)
- **Path**: \`/admin\` (restricts to path)
- **Expires**: \`Wed, 09 Jun 2024 10:18:14 GMT\`
- **Max-Age**: \`3600\` (seconds)
- **Secure**: HTTPS only
- **HttpOnly**: No JavaScript access
- **SameSite**: \`Strict\`, \`Lax\`, or \`None\`

## Node.js/Express
\`\`\`javascript
// Set cookie
res.cookie('name', 'value', {
  maxAge: 3600000,
  httpOnly: true,
  secure: true,
  sameSite: 'strict'
});

// Read cookie (with cookie-parser)
const value = req.cookies.name;

// Delete cookie
res.clearCookie('name');
\`\`\`

## JavaScript
\`\`\`javascript
// Set cookie
document.cookie = "name=value; max-age=3600; secure";

// Read cookie
function getCookie(name) {
  return document.cookie
    .split(';')
    .find(c => c.trim().startsWith(name + '='))
    ?.split('=')[1];
}

// Delete cookie
document.cookie = "name=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
\`\`\`

## Security Best Practices
- ✅ Use \`HttpOnly\` for session cookies
- ✅ Use \`Secure\` in production (HTTPS)
- ✅ Use \`SameSite=Strict\` for CSRF protection
- ✅ Set appropriate expiration
- ✅ Minimize sensitive data
- ❌ Never store passwords
- ❌ Don't rely on client-side validation

## Cookie Types
1. **Session**: Deleted when browser closes
2. **Persistent**: Survive browser restarts
3. **Secure**: HTTPS only
4. **HttpOnly**: No JavaScript access

## Size Limits
- **Maximum**: 4KB per cookie
- **Total**: ~50 cookies per domain
- **Browser limit**: Varies (usually 300+ total)

## SameSite Values
- **Strict**: Never sent cross-site
- **Lax**: Sent on top-level navigation
- **None**: Always sent (requires Secure)

## Common Use Cases
- Session management
- User preferences
- Shopping carts
- Authentication tokens
- Tracking (with consent)

## GDPR Compliance
- Obtain consent for non-essential cookies
- Provide clear information
- Allow opt-out
- Document cookie usage
`,
      category: "Web Security",
      tags: ["Cookies", "Quick Reference", "HTTP"],
    },
  },
};

async function createAdditionalContent() {
  try {
    console.log("🚀 Creating Additional Web Development Content...");

    const user = await prisma.user.findFirst();
    if (!user) {
      throw new Error("No users found. Please create a user first.");
    }

    for (const [slug, content] of Object.entries(additionalContent)) {
      console.log(`\n📝 Creating content for: ${slug}`);

      // Find the subtopic
      const subTopic = await prisma.subTopic.findFirst({
        where: { slug },
        include: { topic: true },
      });

      if (!subTopic) {
        console.log(`⚠️ SubTopic not found: ${slug}`);
        continue;
      }

      // Create blog
      if (content.blog) {
        const existingBlog = await prisma.blog.findFirst({
          where: {
            title: content.blog.title,
            authorId: user.id,
          },
        });

        if (!existingBlog) {
          await prisma.blog.create({
            data: {
              ...content.blog,
              topicId: subTopic.topicId,
              subTopicId: subTopic.id,
              authorId: user.id,
            },
          });
          console.log(`  ✅ Created blog: ${content.blog.title}`);
        } else {
          console.log(`  ⏭️ Blog already exists: ${content.blog.title}`);
        }
      }

      // Create note
      if (content.note) {
        const existingNote = await prisma.note.findFirst({
          where: {
            title: content.note.title,
            authorId: user.id,
          },
        });

        if (!existingNote) {
          await prisma.note.create({
            data: {
              ...content.note,
              topicId: subTopic.topicId,
              subTopicId: subTopic.id,
              authorId: user.id,
            },
          });
          console.log(`  ✅ Created note: ${content.note.title}`);
        } else {
          console.log(`  ⏭️ Note already exists: ${content.note.title}`);
        }
      }
    }

    console.log("\n✅ Successfully created additional content!");
  } catch (error) {
    console.error("❌ Error creating additional content:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdditionalContent();
