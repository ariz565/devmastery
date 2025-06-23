const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const tokensContent = {
  blog: {
    title: "Access & Refresh Tokens: Complete Authentication Strategy Guide",
    excerpt:
      "Master token-based authentication with access and refresh tokens. Learn implementation patterns, security best practices, and real-world examples.",
    content: `# Access & Refresh Tokens: Complete Authentication Strategy Guide

## Introduction

Token-based authentication using access and refresh tokens has become the standard for modern web applications. This pattern provides a secure and scalable way to handle user authentication while maintaining good user experience.

## Understanding the Token Pair

### Access Tokens
Short-lived tokens that grant access to protected resources.

**Characteristics:**
- Short lifespan (15-30 minutes)
- Contains user permissions
- Sent with each API request
- Self-contained (JWT) or reference token

### Refresh Tokens
Long-lived tokens used to obtain new access tokens.

**Characteristics:**
- Long lifespan (days to weeks)
- Used only to refresh access tokens
- Stored securely on the client
- Can be revoked by the server

## Why Use This Pattern?

### Security Benefits
1. **Limited exposure**: Short-lived access tokens reduce risk if compromised
2. **Revocation control**: Refresh tokens can be invalidated server-side
3. **Audit trail**: Track token usage and refresh patterns
4. **Granular control**: Different expiration policies for different token types

### User Experience Benefits
1. **Seamless experience**: Automatic token refresh without re-login
2. **Persistent sessions**: Users stay logged in across browser restarts
3. **Quick logout**: Immediate token revocation when needed

## Implementation Patterns

### Basic Token Pair Generation

#### Server-Side (Node.js)
\`\`\`javascript
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

function generateTokenPair(user) {
  // Access token - short lived, contains user info
  const accessToken = jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
      type: 'access'
    },
    process.env.ACCESS_TOKEN_SECRET,
    { 
      expiresIn: '15m',
      issuer: 'your-app',
      audience: 'your-api'
    }
  );

  // Refresh token - long lived, minimal info
  const refreshToken = jwt.sign(
    {
      sub: user.id,
      type: 'refresh',
      tokenId: crypto.randomUUID()
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: '7d',
      issuer: 'your-app'
    }
  );

  return { accessToken, refreshToken };
}
\`\`\`

#### Database Storage for Refresh Tokens
\`\`\`javascript
// Store refresh token in database
async function storeRefreshToken(userId, refreshToken, expiresAt) {
  const hashedToken = crypto
    .createHash('sha256')
    .update(refreshToken)
    .digest('hex');

  await db.refreshTokens.create({
    data: {
      userId,
      tokenHash: hashedToken,
      expiresAt,
      createdAt: new Date(),
      isActive: true
    }
  });
}

// Validate refresh token
async function validateRefreshToken(refreshToken) {
  const hashedToken = crypto
    .createHash('sha256')
    .update(refreshToken)
    .digest('hex');

  const storedToken = await db.refreshTokens.findFirst({
    where: {
      tokenHash: hashedToken,
      isActive: true,
      expiresAt: {
        gt: new Date()
      }
    },
    include: {
      user: true
    }
  });

  return storedToken;
}
\`\`\`

### Login Endpoint
\`\`\`javascript
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate user credentials
    const user = await authenticateUser(email, password);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token pair
    const { accessToken, refreshToken } = generateTokenPair(user);

    // Store refresh token
    const refreshTokenExpiry = new Date();
    refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7);
    await storeRefreshToken(user.id, refreshToken, refreshTokenExpiry);

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Return access token
    res.json({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      },
      expiresIn: 15 * 60 // 15 minutes in seconds
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
\`\`\`

### Token Refresh Endpoint
\`\`\`javascript
app.post('/auth/refresh', async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token not provided' });
    }

    // Validate refresh token
    const storedToken = await validateRefreshToken(refreshToken);
    if (!storedToken) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    // Generate new access token
    const newAccessToken = jwt.sign(
      {
        sub: storedToken.user.id,
        email: storedToken.user.email,
        role: storedToken.user.role,
        type: 'access'
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );

    // Optional: Rotate refresh token
    if (shouldRotateRefreshToken()) {
      const newRefreshToken = generateRefreshToken(storedToken.user);
      
      // Invalidate old refresh token
      await invalidateRefreshToken(refreshToken);
      
      // Store new refresh token
      const newExpiry = new Date();
      newExpiry.setDate(newExpiry.getDate() + 7);
      await storeRefreshToken(storedToken.user.id, newRefreshToken, newExpiry);
      
      // Set new refresh token cookie
      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
    }

    res.json({
      accessToken: newAccessToken,
      expiresIn: 15 * 60
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
\`\`\`

### Logout Endpoint
\`\`\`javascript
app.post('/auth/logout', async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      // Invalidate refresh token
      await invalidateRefreshToken(refreshToken);
    }

    // Clear refresh token cookie
    res.clearCookie('refreshToken');
    
    res.json({ message: 'Logged out successfully' });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

async function invalidateRefreshToken(refreshToken) {
  const hashedToken = crypto
    .createHash('sha256')
    .update(refreshToken)
    .digest('hex');

  await db.refreshTokens.updateMany({
    where: { tokenHash: hashedToken },
    data: { isActive: false }
  });
}
\`\`\`

## Frontend Implementation

### React Hook for Token Management
\`\`\`javascript
import { useState, useEffect, useContext, createContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to refresh token on app start
    refreshToken();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Include cookies
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      setAccessToken(data.accessToken);
      setUser(data.user);

      // Schedule token refresh
      scheduleTokenRefresh(data.expiresIn);
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const refreshToken = async () => {
    try {
      const response = await fetch('/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      setAccessToken(data.accessToken);
      
      // Schedule next refresh
      scheduleTokenRefresh(data.expiresIn);
      
      return data.accessToken;
    } catch (error) {
      console.error('Token refresh error:', error);
      setAccessToken(null);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAccessToken(null);
      setUser(null);
      clearTokenRefresh();
    }
  };

  let refreshTimeoutId;

  const scheduleTokenRefresh = (expiresIn) => {
    clearTokenRefresh();
    
    // Refresh 1 minute before expiration
    const refreshTime = (expiresIn - 60) * 1000;
    
    refreshTimeoutId = setTimeout(() => {
      refreshToken();
    }, refreshTime);
  };

  const clearTokenRefresh = () => {
    if (refreshTimeoutId) {
      clearTimeout(refreshTimeoutId);
      refreshTimeoutId = null;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      accessToken,
      loading,
      login,
      logout,
      refreshToken
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
\`\`\`

### Axios Interceptor for Automatic Token Refresh
\`\`\`javascript
import axios from 'axios';

// Create axios instance
const apiClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Response interceptor for token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = \`Bearer \${token}\`;
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await fetch('/auth/refresh', {
          method: 'POST',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          const newToken = data.accessToken;
          
          // Update authorization header
          originalRequest.headers['Authorization'] = \`Bearer \${newToken}\`;
          
          processQueue(null, newToken);
          
          // Retry original request
          return apiClient(originalRequest);
        } else {
          processQueue(new Error('Token refresh failed'), null);
          // Redirect to login
          window.location.href = '/login';
          return Promise.reject(error);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
\`\`\`

### React Component with Protected API Calls
\`\`\`javascript
import { useAuth } from './AuthContext';
import apiClient from './apiClient';

function ProfileComponent() {
  const { user, accessToken } = useAuth();
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    if (accessToken) {
      fetchProfile();
    }
  }, [accessToken]);

  const fetchProfile = async () => {
    try {
      // Axios interceptor will handle token refresh automatically
      const response = await apiClient.get('/profile', {
        headers: {
          Authorization: \`Bearer \${accessToken}\`
        }
      });
      setProfileData(response.data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  if (!user) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Profile</h1>
      {profileData ? (
        <div>{JSON.stringify(profileData, null, 2)}</div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
\`\`\`

## Security Best Practices

### 1. Secure Token Storage
\`\`\`javascript
// ✅ Store refresh tokens in httpOnly cookies
res.cookie('refreshToken', refreshToken, {
  httpOnly: true,
  secure: true, // HTTPS only
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000
});

// ❌ Don't store refresh tokens in localStorage
localStorage.setItem('refreshToken', refreshToken); // Vulnerable to XSS
\`\`\`

### 2. Token Rotation
\`\`\`javascript
// Rotate refresh tokens on each use
function shouldRotateRefreshToken() {
  // Rotate every time or based on conditions
  return true; // or implement more sophisticated logic
}
\`\`\`

### 3. Rate Limiting
\`\`\`javascript
const rateLimit = require('express-rate-limit');

const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 refresh requests per windowMs
  message: 'Too many refresh attempts',
  standardHeaders: true,
  legacyHeaders: false,
});

app.post('/auth/refresh', refreshLimiter, refreshHandler);
\`\`\`

### 4. Token Binding
\`\`\`javascript
// Bind tokens to specific clients
function generateBoundToken(user, clientFingerprint) {
  return jwt.sign(
    {
      sub: user.id,
      client: clientFingerprint,
      type: 'access'
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  );
}

// Validate token binding
function validateTokenBinding(token, clientFingerprint) {
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  return decoded.client === clientFingerprint;
}
\`\`\`

## Advanced Patterns

### Multi-Device Session Management
\`\`\`javascript
// Track refresh tokens per device
const schema = {
  refreshTokens: {
    id: 'string',
    userId: 'string',
    tokenHash: 'string',
    deviceId: 'string',
    deviceName: 'string',
    ipAddress: 'string',
    userAgent: 'string',
    expiresAt: 'date',
    isActive: 'boolean',
    createdAt: 'date',
    lastUsedAt: 'date'
  }
};

// List active sessions
app.get('/auth/sessions', authenticateUser, async (req, res) => {
  const sessions = await db.refreshTokens.findMany({
    where: {
      userId: req.user.id,
      isActive: true,
      expiresAt: { gt: new Date() }
    },
    select: {
      id: true,
      deviceName: true,
      ipAddress: true,
      createdAt: true,
      lastUsedAt: true
    }
  });

  res.json(sessions);
});

// Revoke specific session
app.delete('/auth/sessions/:sessionId', authenticateUser, async (req, res) => {
  await db.refreshTokens.updateMany({
    where: {
      id: req.params.sessionId,
      userId: req.user.id
    },
    data: { isActive: false }
  });

  res.json({ message: 'Session revoked' });
});
\`\`\`

### Graceful Token Expiry Handling
\`\`\`javascript
// Client-side token expiry prediction
function isTokenExpiringSoon(token, bufferMinutes = 5) {
  try {
    const decoded = jwt.decode(token);
    const expiryTime = decoded.exp * 1000;
    const bufferTime = bufferMinutes * 60 * 1000;
    return Date.now() >= (expiryTime - bufferTime);
  } catch {
    return true; // Treat invalid tokens as expired
  }
}

// Proactive token refresh
setInterval(async () => {
  const currentToken = getAccessToken();
  if (currentToken && isTokenExpiringSoon(currentToken)) {
    await refreshToken();
  }
}, 60000); // Check every minute
\`\`\`

## Testing Strategies

### Unit Tests for Token Logic
\`\`\`javascript
describe('Token Management', () => {
  test('should generate valid token pair', () => {
    const user = { id: '123', email: 'test@example.com' };
    const tokens = generateTokenPair(user);
    
    expect(tokens.accessToken).toBeDefined();
    expect(tokens.refreshToken).toBeDefined();
    
    const accessDecoded = jwt.decode(tokens.accessToken);
    expect(accessDecoded.sub).toBe(user.id);
    expect(accessDecoded.type).toBe('access');
  });

  test('should refresh access token with valid refresh token', async () => {
    // Setup test data
    const user = { id: '123', email: 'test@example.com' };
    const { refreshToken } = generateTokenPair(user);
    
    // Store in test database
    await storeRefreshToken(user.id, refreshToken, new Date(Date.now() + 86400000));
    
    // Test refresh
    const newAccessToken = await refreshAccessToken(refreshToken);
    expect(newAccessToken).toBeDefined();
  });
});
\`\`\`

## Common Pitfalls

### 1. Race Conditions
Problem: Multiple simultaneous requests triggering refresh

Solution: Implement request queuing and single refresh execution

### 2. Infinite Refresh Loops
Problem: Refresh endpoint returning 401 causes loop

Solution: Don't retry refresh endpoint failures

### 3. Token Leakage
Problem: Tokens exposed in logs or client-side storage

Solution: Use httpOnly cookies and sanitize logs

### 4. Stale Token Issues
Problem: Using old tokens after refresh

Solution: Update all pending requests with new token

## Conclusion

Access and refresh tokens provide a secure, scalable authentication solution:

1. **Use short-lived access tokens** (15-30 minutes)
2. **Store refresh tokens securely** (httpOnly cookies)
3. **Implement automatic refresh** with proper error handling
4. **Monitor and audit** token usage patterns
5. **Plan for token revocation** and session management

This pattern balances security with user experience, making it ideal for modern web applications.
`,
    category: "Authentication",
    tags: [
      "Access Tokens",
      "Refresh Tokens",
      "Authentication",
      "JWT",
      "Security",
    ],
    readTime: 18,
    published: true,
  },
  note: {
    title: "Access & Refresh Tokens - Quick Reference",
    content: `# Access & Refresh Tokens - Quick Reference

## Token Types

### Access Token
- **Lifespan**: 15-30 minutes
- **Purpose**: Access protected resources
- **Storage**: Memory or short-term storage
- **Content**: User info, permissions, claims

### Refresh Token
- **Lifespan**: Days to weeks
- **Purpose**: Obtain new access tokens
- **Storage**: httpOnly cookies (secure)
- **Content**: Minimal info, user ID

## Why Use This Pattern?

### Security Benefits
- Limited exposure window
- Server-side revocation control
- Audit trail capability
- Granular access control

### UX Benefits
- Seamless token refresh
- Persistent sessions
- Quick logout capability

## Implementation Flow

### Login Process
1. User provides credentials
2. Server validates user
3. Generate token pair
4. Store refresh token in database
5. Return access token + set refresh cookie

### API Request Flow
1. Send access token in Authorization header
2. If 401 response, attempt refresh
3. Use refresh token to get new access token
4. Retry original request with new token

### Token Refresh
1. Extract refresh token from cookie
2. Validate against database
3. Generate new access token
4. Optional: Rotate refresh token
5. Return new access token

## Storage Best Practices

### Access Token Storage
✅ Memory (React state)
✅ Session storage (temporary)
❌ Local storage (XSS risk)
❌ Cookies (CSRF risk)

### Refresh Token Storage
✅ httpOnly cookies
✅ Secure flag (HTTPS)
✅ SameSite attribute
❌ Local storage
❌ Session storage

## Security Headers
\`\`\`javascript
res.cookie('refreshToken', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000
});
\`\`\`

## Frontend Implementation

### React Hook Pattern
\`\`\`javascript
const { user, accessToken, login, logout, refreshToken } = useAuth();

// Axios interceptor for auto-refresh
apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      await refreshToken();
      return apiClient(originalRequest);
    }
    return Promise.reject(error);
  }
);
\`\`\`

## Common Patterns

### Automatic Refresh
- Schedule refresh before expiration
- Use axios/fetch interceptors
- Handle race conditions

### Token Rotation
- Generate new refresh token on use
- Invalidate old refresh token
- Maintain security chain

### Multi-Device Sessions
- Track refresh tokens per device
- Provide session management UI
- Allow selective revocation

## Error Handling

### Client-Side
- Queue failed requests during refresh
- Redirect to login on refresh failure
- Handle network errors gracefully

### Server-Side
- Validate token format and signature
- Check database for token validity
- Rate limit refresh attempts

## Monitoring & Analytics

### Key Metrics
- Token refresh frequency
- Failed refresh attempts
- Session duration patterns
- Multi-device usage

### Security Monitoring
- Unusual refresh patterns
- Geographic anomalies
- Concurrent session limits
- Brute force attempts

## Best Practices Checklist

✅ Use HTTPS in production
✅ Implement rate limiting
✅ Store minimal data in tokens
✅ Set appropriate expiration times
✅ Implement proper logging
✅ Handle edge cases gracefully
✅ Test token refresh scenarios
✅ Monitor security metrics

❌ Store sensitive data in tokens
❌ Use overly long access token expiry
❌ Ignore token rotation
❌ Skip refresh token validation
❌ Log sensitive token data
❌ Allow unlimited refresh attempts

## Debugging Tips

1. Check token expiration times
2. Verify cookie settings and flags
3. Test network request timing
4. Monitor database token records
5. Validate JWT signatures and claims
6. Check CORS and credentials settings
`,
    category: "Authentication",
    tags: ["Access Tokens", "Refresh Tokens", "Quick Reference"],
  },
};

async function createTokensContent() {
  try {
    console.log("🚀 Creating Access & Refresh Tokens Content...");

    const user = await prisma.user.findFirst();
    if (!user) {
      throw new Error("No users found. Please create a user first.");
    }

    // Find the access-refresh-tokens subtopic
    const subTopic = await prisma.subTopic.findFirst({
      where: { slug: "access-refresh-tokens" },
      include: { topic: true },
    });

    if (!subTopic) {
      console.log("⚠️ Access-refresh-tokens subtopic not found");
      return;
    }

    // Create blog
    const existingBlog = await prisma.blog.findFirst({
      where: {
        title: tokensContent.blog.title,
        authorId: user.id,
      },
    });

    if (!existingBlog) {
      await prisma.blog.create({
        data: {
          ...tokensContent.blog,
          topicId: subTopic.topicId,
          subTopicId: subTopic.id,
          authorId: user.id,
        },
      });
      console.log(`✅ Created blog: ${tokensContent.blog.title}`);
    } else {
      console.log(`⏭️ Blog already exists: ${tokensContent.blog.title}`);
    }

    // Create note
    const existingNote = await prisma.note.findFirst({
      where: {
        title: tokensContent.note.title,
        authorId: user.id,
      },
    });

    if (!existingNote) {
      await prisma.note.create({
        data: {
          ...tokensContent.note,
          topicId: subTopic.topicId,
          subTopicId: subTopic.id,
          authorId: user.id,
        },
      });
      console.log(`✅ Created note: ${tokensContent.note.title}`);
    } else {
      console.log(`⏭️ Note already exists: ${tokensContent.note.title}`);
    }

    console.log("\n✅ Successfully created Access & Refresh Tokens content!");
  } catch (error) {
    console.error("❌ Error creating tokens content:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createTokensContent();
