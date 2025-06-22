const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Main topics data
const webDevTopics = [
  {
    name: "Web Communication",
    slug: "web-communication",
    description: "Understanding how web applications communicate",
    icon: "🌐",
    order: 1,
    subTopics: [
      {
        name: "HTTP vs HTTPS",
        slug: "http-vs-https",
        description: "Understanding the difference between HTTP and HTTPS",
        icon: "🔒",
        order: 1,
      },
      {
        name: "WebSockets",
        slug: "websockets",
        description: "Real-time bidirectional communication",
        icon: "⚡",
        order: 2,
      },
      {
        name: "WebRTC",
        slug: "webrtc",
        description: "Peer-to-peer real-time communication",
        icon: "📹",
        order: 3,
      },
      {
        name: "Webhooks",
        slug: "webhooks",
        description: "Event-driven HTTP callbacks",
        icon: "🔗",
        order: 4,
      },
    ],
  },
  {
    name: "Authentication & Security",
    slug: "authentication-security",
    description: "Security concepts and authentication mechanisms",
    icon: "🔐",
    order: 2,
    subTopics: [
      {
        name: "JWT (JSON Web Tokens)",
        slug: "jwt",
        description: "Understanding JSON Web Tokens for authentication",
        icon: "🎫",
        order: 1,
      },
      {
        name: "Access & Refresh Tokens",
        slug: "access-refresh-tokens",
        description: "Token-based authentication strategies",
        icon: "🔑",
        order: 2,
      },
      {
        name: "Cookies",
        slug: "cookies",
        description: "HTTP cookies for session management",
        icon: "🍪",
        order: 3,
      },
    ],
  },
  {
    name: "Performance & Optimization",
    slug: "performance-optimization",
    description: "Web performance and optimization techniques",
    icon: "⚡",
    order: 3,
    subTopics: [
      {
        name: "Caching Strategies",
        slug: "caching",
        description: "Different caching mechanisms and strategies",
        icon: "💾",
        order: 1,
      },
      {
        name: "Server Architecture",
        slug: "server-architecture",
        description: "Understanding server-side architecture",
        icon: "🖥️",
        order: 2,
      },
    ],
  },
];

// Content for each topic
const contentData = {
  "http-vs-https": {
    blog: {
      title: "HTTP vs HTTPS: Understanding Web Security Fundamentals",
      excerpt:
        "A comprehensive guide to understanding the differences between HTTP and HTTPS, and why HTTPS is crucial for modern web applications.",
      content: `# HTTP vs HTTPS: Understanding Web Security Fundamentals

## Introduction

HTTP (HyperText Transfer Protocol) and HTTPS (HyperText Transfer Protocol Secure) are the foundation of data communication on the World Wide Web. Understanding the differences between these protocols is crucial for any web developer.

## What is HTTP?

HTTP is an application-layer protocol used for transmitting hypermedia documents, such as HTML. It was originally designed for communication between web browsers and web servers.

### Key Characteristics of HTTP:
- **Stateless**: Each request is independent
- **Plain text**: Data is transmitted in plain text
- **Port 80**: Default port for HTTP communication
- **Fast**: No encryption overhead

### HTTP Request/Response Cycle:
\`\`\`
Client (Browser) ----HTTP Request----> Server
Client (Browser) <---HTTP Response---- Server
\`\`\`

## What is HTTPS?

HTTPS is HTTP over SSL/TLS. It provides encrypted communication and secure identification of a web server.

### Key Characteristics of HTTPS:
- **Encrypted**: Data is encrypted using SSL/TLS
- **Authenticated**: Verifies server identity
- **Port 443**: Default port for HTTPS communication
- **Integrity**: Ensures data hasn't been tampered with

## Key Differences

| Aspect | HTTP | HTTPS |
|--------|------|-------|
| Security | Not secure | Secure (SSL/TLS) |
| Port | 80 | 443 |
| Data Encryption | No | Yes |
| SSL Certificate | Not required | Required |
| SEO Ranking | Lower | Higher |
| Performance | Faster | Slightly slower |

## Why HTTPS Matters

### 1. Data Protection
HTTPS encrypts data in transit, protecting sensitive information like:
- Login credentials
- Personal information
- Payment details
- Session tokens

### 2. Trust and Credibility
- Browser security indicators
- User confidence
- Professional appearance

### 3. SEO Benefits
Google considers HTTPS as a ranking factor, giving HTTPS sites a slight boost in search results.

### 4. Regulatory Compliance
Many regulations (GDPR, HIPAA, PCI DSS) require encryption of sensitive data.

## SSL/TLS Handshake Process

\`\`\`
1. Client Hello (supported cipher suites, SSL version)
2. Server Hello (chosen cipher suite, certificate)
3. Certificate Verification
4. Key Exchange
5. Encrypted Communication Begins
\`\`\`

## Common HTTPS Implementation Issues

### 1. Mixed Content
Loading HTTP resources on HTTPS pages can cause security warnings.

### 2. Certificate Errors
- Expired certificates
- Self-signed certificates
- Domain mismatch

### 3. Performance Considerations
- SSL handshake overhead
- Certificate validation time

## Best Practices

### 1. Always Use HTTPS
- Redirect all HTTP traffic to HTTPS
- Use HSTS (HTTP Strict Transport Security)

### 2. Certificate Management
- Use certificates from trusted CAs
- Monitor certificate expiration
- Implement certificate transparency

### 3. Security Headers
\`\`\`http
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
\`\`\`

## Code Examples

### Node.js HTTP Server
\`\`\`javascript
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World (HTTP)');
});

server.listen(80);
\`\`\`

### Node.js HTTPS Server
\`\`\`javascript
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem')
};

const server = https.createServer(options, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World (HTTPS)');
});

server.listen(443);
\`\`\`

## Conclusion

HTTPS is no longer optional in modern web development. It's essential for:
- User security and privacy
- SEO performance
- Regulatory compliance
- Building user trust

The slight performance overhead of HTTPS is negligible compared to its security benefits. Always implement HTTPS from the beginning of your project.

## Interview Questions

1. **What's the main difference between HTTP and HTTPS?**
   - HTTPS is HTTP over SSL/TLS encryption

2. **What port does HTTPS use by default?**
   - Port 443

3. **What is an SSL certificate?**
   - A digital certificate that authenticates the identity of a website

4. **What happens during an SSL handshake?**
   - Negotiation of encryption methods and exchange of keys

5. **Why is HTTPS important for SEO?**
   - Google uses HTTPS as a ranking factor
`,
      category: "Web Security",
      tags: ["HTTP", "HTTPS", "SSL", "TLS", "Security", "Web Development"],
      readTime: 8,
      published: true,
    },
    note: {
      title: "HTTP vs HTTPS - Quick Reference",
      content: `# HTTP vs HTTPS - Quick Reference

## Key Points

### HTTP (HyperText Transfer Protocol)
- **Port**: 80
- **Security**: None (plain text)
- **Speed**: Faster
- **Use Case**: Development only

### HTTPS (HTTP Secure)
- **Port**: 443
- **Security**: SSL/TLS encryption
- **Speed**: Slightly slower
- **Use Case**: Production (required)

## SSL/TLS Handshake Steps
1. Client Hello
2. Server Hello + Certificate
3. Certificate Verification
4. Key Exchange
5. Secure Communication

## Security Headers
\`\`\`
Strict-Transport-Security: max-age=31536000
Content-Security-Policy: default-src 'self'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
\`\`\`

## Common Issues
- Mixed content warnings
- Certificate expiration
- Self-signed certificates
- Performance overhead

## Best Practices
✅ Always redirect HTTP to HTTPS
✅ Use HSTS headers
✅ Monitor certificate expiration
✅ Implement proper CSP headers
✅ Use certificates from trusted CAs

## Browser Indicators
- 🔒 Secure (HTTPS with valid cert)
- ⚠️ Not Secure (HTTP)
- 🔒 with warning (HTTPS with issues)
`,
      category: "Web Security",
      tags: ["HTTP", "HTTPS", "Quick Reference", "Security"],
    },
  },

  websockets: {
    blog: {
      title: "WebSockets: Real-Time Communication in Web Applications",
      excerpt:
        "Master WebSockets for building real-time applications like chat systems, live updates, and collaborative tools.",
      content: `# WebSockets: Real-Time Communication in Web Applications

## Introduction

WebSockets provide a persistent, full-duplex communication channel between the client and server, enabling real-time data exchange without the overhead of traditional HTTP polling.

## What are WebSockets?

WebSockets are a communication protocol that provides full-duplex communication channels over a single TCP connection. Unlike HTTP, which follows a request-response pattern, WebSockets allow both client and server to send data at any time.

## WebSocket vs HTTP

| Feature | HTTP | WebSockets |
|---------|------|------------|
| Connection | Request-Response | Persistent |
| Communication | Half-duplex | Full-duplex |
| Overhead | High (headers) | Low |
| Real-time | Polling required | Native support |
| Protocol | HTTP/HTTPS | ws/wss |

## WebSocket Lifecycle

### 1. Handshake
The connection starts with an HTTP upgrade request:

\`\`\`http
GET /chat HTTP/1.1
Host: example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==
Sec-WebSocket-Version: 13
\`\`\`

### 2. Server Response
\`\`\`http
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: HSmrc0sMlYUkAGmm5OPpG2HaGWk=
\`\`\`

### 3. Data Exchange
Both parties can now send data frames.

### 4. Connection Close
Either party can initiate connection closure.

## Client-Side Implementation

### Basic WebSocket Client
\`\`\`javascript
// Create WebSocket connection
const socket = new WebSocket('ws://localhost:8080');

// Connection opened
socket.addEventListener('open', (event) => {
    console.log('Connected to WebSocket server');
    socket.send('Hello Server!');
});

// Listen for messages
socket.addEventListener('message', (event) => {
    console.log('Message from server:', event.data);
});

// Connection closed
socket.addEventListener('close', (event) => {
    console.log('Connection closed');
});

// Handle errors
socket.addEventListener('error', (error) => {
    console.error('WebSocket error:', error);
});
\`\`\`

### Advanced Client with Reconnection
\`\`\`javascript
class WebSocketClient {
    constructor(url, protocols = []) {
        this.url = url;
        this.protocols = protocols;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectInterval = 1000;
        this.connect();
    }

    connect() {
        try {
            this.socket = new WebSocket(this.url, this.protocols);
            this.setupEventListeners();
        } catch (error) {
            console.error('Failed to create WebSocket:', error);
            this.handleReconnect();
        }
    }

    setupEventListeners() {
        this.socket.onopen = (event) => {
            console.log('WebSocket connected');
            this.reconnectAttempts = 0;
            this.onOpen?.(event);
        };

        this.socket.onmessage = (event) => {
            this.onMessage?.(event);
        };

        this.socket.onclose = (event) => {
            console.log('WebSocket disconnected');
            this.onClose?.(event);
            if (!event.wasClean) {
                this.handleReconnect();
            }
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
            this.onError?.(error);
        };
    }

    handleReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            setTimeout(() => {
                console.log(\`Reconnecting... (\${this.reconnectAttempts}/\${this.maxReconnectAttempts})\`);
                this.connect();
            }, this.reconnectInterval * this.reconnectAttempts);
        }
    }

    send(data) {
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(data));
        } else {
            console.warn('WebSocket is not open');
        }
    }

    close() {
        this.socket?.close();
    }
}

// Usage
const client = new WebSocketClient('ws://localhost:8080');
client.onMessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('Received:', data);
};
\`\`\`

## Server-Side Implementation

### Node.js with ws Library
\`\`\`javascript
const WebSocket = require('ws');
const http = require('http');

// Create HTTP server
const server = http.createServer();

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Store connected clients
const clients = new Set();

wss.on('connection', (ws, request) => {
    console.log('New client connected');
    clients.add(ws);

    // Send welcome message
    ws.send(JSON.stringify({
        type: 'welcome',
        message: 'Connected to WebSocket server'
    }));

    // Handle incoming messages
    ws.on('message', (data) => {
        try {
            const message = JSON.parse(data);
            console.log('Received:', message);

            // Broadcast to all clients
            broadcast(message);
        } catch (error) {
            console.error('Invalid JSON:', error);
        }
    });

    // Handle client disconnect
    ws.on('close', () => {
        console.log('Client disconnected');
        clients.delete(ws);
    });

    // Handle errors
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        clients.delete(ws);
    });
});

// Broadcast message to all connected clients
function broadcast(message) {
    const data = JSON.stringify(message);
    clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}

server.listen(8080, () => {
    console.log('WebSocket server running on port 8080');
});
\`\`\`

### Express.js Integration
\`\`\`javascript
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files
app.use(express.static('public'));

// WebSocket handling
wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        // Echo message back
        ws.send(\`Echo: \${message}\`);
    });
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});
\`\`\`

## Real-World Use Cases

### 1. Chat Application
\`\`\`javascript
// Client-side chat
class ChatClient {
    constructor(serverUrl) {
        this.socket = new WebSocket(serverUrl);
        this.setupChat();
    }

    setupChat() {
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            this.displayMessage(message);
        };
    }

    sendMessage(text, username) {
        const message = {
            type: 'chat',
            username,
            text,
            timestamp: Date.now()
        };
        this.socket.send(JSON.stringify(message));
    }

    displayMessage(message) {
        const chatDiv = document.getElementById('chat');
        const messageElement = document.createElement('div');
        messageElement.innerHTML = \`
            <strong>\${message.username}:</strong> 
            \${message.text} 
            <small>(\${new Date(message.timestamp).toLocaleTimeString()})</small>
        \`;
        chatDiv.appendChild(messageElement);
    }
}
\`\`\`

### 2. Live Data Updates
\`\`\`javascript
// Stock price updates
class StockPriceClient {
    constructor() {
        this.socket = new WebSocket('ws://localhost:8080/stocks');
        this.setupStockUpdates();
    }

    setupStockUpdates() {
        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'stock-update') {
                this.updateStockPrice(data.symbol, data.price);
            }
        };
    }

    subscribeToStock(symbol) {
        this.socket.send(JSON.stringify({
            type: 'subscribe',
            symbol
        }));
    }

    updateStockPrice(symbol, price) {
        const element = document.getElementById(\`stock-\${symbol}\`);
        if (element) {
            element.textContent = \`$\${price}\`;
        }
    }
}
\`\`\`

## Security Considerations

### 1. Authentication
\`\`\`javascript
// Send token during connection
const socket = new WebSocket('ws://localhost:8080', [], {
    headers: {
        'Authorization': 'Bearer ' + token
    }
});
\`\`\`

### 2. Input Validation
Always validate and sanitize incoming data:
\`\`\`javascript
ws.on('message', (data) => {
    try {
        const message = JSON.parse(data);
        
        // Validate message structure
        if (!message.type || typeof message.type !== 'string') {
            throw new Error('Invalid message type');
        }
        
        // Process valid message
        handleMessage(message);
    } catch (error) {
        console.error('Invalid message:', error);
    }
});
\`\`\`

### 3. Rate Limiting
\`\`\`javascript
const rateLimit = new Map();

ws.on('message', (data) => {
    const clientId = getClientId(ws);
    const now = Date.now();
    
    if (!rateLimit.has(clientId)) {
        rateLimit.set(clientId, []);
    }
    
    const messages = rateLimit.get(clientId);
    messages.push(now);
    
    // Remove messages older than 1 minute
    const oneMinuteAgo = now - 60000;
    rateLimit.set(clientId, messages.filter(time => time > oneMinuteAgo));
    
    // Check rate limit (max 100 messages per minute)
    if (messages.length > 100) {
        ws.close(1008, 'Rate limit exceeded');
        return;
    }
    
    // Process message
    handleMessage(data);
});
\`\`\`

## Performance Optimization

### 1. Connection Pooling
\`\`\`javascript
class WebSocketPool {
    constructor(maxConnections = 10) {
        this.connections = [];
        this.maxConnections = maxConnections;
        this.currentIndex = 0;
    }

    getConnection() {
        if (this.connections.length < this.maxConnections) {
            const ws = new WebSocket('ws://localhost:8080');
            this.connections.push(ws);
            return ws;
        }
        
        // Round-robin selection
        const connection = this.connections[this.currentIndex];
        this.currentIndex = (this.currentIndex + 1) % this.connections.length;
        return connection;
    }
}
\`\`\`

### 2. Message Compression
\`\`\`javascript
// Server-side compression
const wss = new WebSocket.Server({
    port: 8080,
    perMessageDeflate: {
        deflateOnNoContextTakeover: false,
        inflateOnNoContextTakeover: false,
        threshold: 1024
    }
});
\`\`\`

## Best Practices

1. **Always handle connection errors gracefully**
2. **Implement reconnection logic**
3. **Validate all incoming data**
4. **Use secure WebSockets (wss://) in production**
5. **Implement proper authentication**
6. **Monitor connection health with ping/pong**
7. **Limit message size and rate**

## Conclusion

WebSockets are powerful tools for real-time web applications. They provide efficient, low-latency communication but require careful implementation of error handling, security, and performance considerations.

Common use cases include:
- Chat applications
- Real-time collaboration tools
- Live data feeds
- Gaming applications
- IoT device communication
`,
      category: "Real-time Communication",
      tags: [
        "WebSockets",
        "Real-time",
        "JavaScript",
        "Node.js",
        "Communication",
      ],
      readTime: 12,
      published: true,
    },
    note: {
      title: "WebSockets - Quick Reference",
      content: `# WebSockets - Quick Reference

## Basic Concepts
- **Full-duplex**: Both client and server can send data
- **Persistent**: Connection stays open
- **Low overhead**: No HTTP headers after handshake
- **Protocols**: ws:// (insecure), wss:// (secure)

## Client-Side API
\`\`\`javascript
const socket = new WebSocket('ws://localhost:8080');

// Events
socket.onopen = (event) => { /* connected */ };
socket.onmessage = (event) => { /* received data */ };
socket.onclose = (event) => { /* disconnected */ };
socket.onerror = (error) => { /* error occurred */ };

// Methods
socket.send(data);
socket.close();

// Ready States
WebSocket.CONNECTING // 0
WebSocket.OPEN       // 1
WebSocket.CLOSING    // 2
WebSocket.CLOSED     // 3
\`\`\`

## Server-Side (Node.js)
\`\`\`javascript
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    ws.on('message', (data) => {
        // Handle message
    });
    
    ws.send('Hello Client!');
});
\`\`\`

## Common Patterns

### Reconnection Logic
\`\`\`javascript
function connectWithReconnect() {
    const ws = new WebSocket(url);
    
    ws.onclose = () => {
        setTimeout(connectWithReconnect, 1000);
    };
}
\`\`\`

### Heartbeat/Ping-Pong
\`\`\`javascript
// Client
setInterval(() => {
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'ping' }));
    }
}, 30000);

// Server
ws.on('message', (data) => {
    const message = JSON.parse(data);
    if (message.type === 'ping') {
        ws.send(JSON.stringify({ type: 'pong' }));
    }
});
\`\`\`

## Security Checklist
- ✅ Use wss:// in production
- ✅ Validate all incoming data
- ✅ Implement authentication
- ✅ Rate limiting
- ✅ Input sanitization
- ✅ Connection limits per IP

## Use Cases
- Chat applications
- Real-time collaboration
- Live data feeds
- Gaming
- IoT communication
- Financial trading platforms
`,
      category: "Real-time Communication",
      tags: ["WebSockets", "Quick Reference", "Real-time"],
    },
  },
};

async function createWebDevContent() {
  try {
    console.log("🚀 Creating Web Development Topics and Content...");

    // Get the first user as author (you can modify this logic)
    const user = await prisma.user.findFirst();
    if (!user) {
      throw new Error("No users found. Please create a user first.");
    }

    for (const topicData of webDevTopics) {
      console.log(`\n📁 Creating topic: ${topicData.name}`);

      // Create main topic
      const topic = await prisma.topic.upsert({
        where: { slug: topicData.slug },
        update: {},
        create: {
          name: topicData.name,
          slug: topicData.slug,
          description: topicData.description,
          icon: topicData.icon,
          order: topicData.order,
          authorId: user.id,
        },
      }); // Create subtopics
      for (const subTopicData of topicData.subTopics) {
        console.log(`  📄 Creating subtopic: ${subTopicData.name}`);

        const subTopic = await prisma.subTopic.upsert({
          where: {
            topicId_slug: {
              topicId: topic.id,
              slug: subTopicData.slug,
            },
          },
          update: {},
          create: {
            name: subTopicData.name,
            slug: subTopicData.slug,
            description: subTopicData.description,
            icon: subTopicData.icon,
            order: subTopicData.order,
            topicId: topic.id,
            authorId: user.id,
          },
        });

        // Create content if available
        const content = contentData[subTopicData.slug];
        if (content) {
          // Create blog
          if (content.blog) {
            console.log(`    📝 Creating blog: ${content.blog.title}`);

            // Check if blog already exists
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
                  topicId: topic.id,
                  subTopicId: subTopic.id,
                  authorId: user.id,
                },
              });
            } else {
              console.log(`    ⏭️ Blog already exists: ${content.blog.title}`);
            }
          }

          // Create note
          if (content.note) {
            console.log(`    📋 Creating note: ${content.note.title}`);

            // Check if note already exists
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
                  topicId: topic.id,
                  subTopicId: subTopic.id,
                  authorId: user.id,
                },
              });
            } else {
              console.log(`    ⏭️ Note already exists: ${content.note.title}`);
            }
          }
        }
      }
    }

    console.log("\n✅ Successfully created all web development content!");
    console.log("\n📊 Summary:");
    console.log(`- Topics: ${webDevTopics.length}`);
    console.log(
      `- Subtopics: ${webDevTopics.reduce(
        (acc, topic) => acc + topic.subTopics.length,
        0
      )}`
    );
    console.log(`- Content pieces: ${Object.keys(contentData).length * 2}`);
  } catch (error) {
    console.error("❌ Error creating content:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createWebDevContent();
