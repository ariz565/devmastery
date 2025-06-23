const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const cachingContent = {
  blog: {
    title: "Caching Strategies: Complete Guide to Web Performance Optimization",
    excerpt:
      "Master different caching strategies including browser caching, CDN, Redis, and application-level caching to dramatically improve web performance.",
    content: `# Caching Strategies: Complete Guide to Web Performance Optimization

## Introduction

Caching is one of the most effective ways to improve web application performance. By storing frequently accessed data in faster storage locations, we can reduce load times, decrease server load, and improve user experience.

## What is Caching?

Caching is the process of storing copies of data in a cache (temporary storage) so that future requests for that data can be served faster. The cache is typically faster to access than the original data source.

## Types of Caching

### 1. Browser Caching
Stores resources locally in the user's browser.

#### HTTP Cache Headers
\`\`\`http
Cache-Control: public, max-age=3600
Expires: Wed, 21 Oct 2024 07:28:00 GMT
ETag: "686897696a7c876b7e"
Last-Modified: Wed, 21 Oct 2023 07:28:00 GMT
\`\`\`

#### Implementation
\`\`\`javascript
// Express.js
app.use(express.static('public', {
  maxAge: '1d', // Cache for 1 day
  etag: true,
  lastModified: true
}));

// Setting custom cache headers
app.get('/api/data', (req, res) => {
  res.set({
    'Cache-Control': 'public, max-age=300', // 5 minutes
    'ETag': generateETag(data)
  });
  res.json(data);
});
\`\`\`

### 2. CDN (Content Delivery Network)
Geographic distribution of cached content.

#### Benefits
- Reduced latency
- Decreased server load
- Global content distribution
- DDoS protection

#### Implementation with Cloudflare
\`\`\`javascript
// Next.js with Cloudflare
module.exports = {
  async headers() {
    return [
      {
        source: '/images/:all*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ];
  }
};
\`\`\`

### 3. Server-Side Caching

#### In-Memory Caching
\`\`\`javascript
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes

function getCachedData(key) {
  return cache.get(key);
}

function setCachedData(key, data, ttl = 600) {
  return cache.set(key, data, ttl);
}

// Express middleware
function cacheMiddleware(duration) {
  return (req, res, next) => {
    const key = req.originalUrl;
    const cached = getCachedData(key);
    
    if (cached) {
      return res.json(cached);
    }
    
    res.sendResponse = res.json;
    res.json = (body) => {
      setCachedData(key, body, duration);
      res.sendResponse(body);
    };
    
    next();
  };
}

// Usage
app.get('/api/expensive-operation', cacheMiddleware(300), (req, res) => {
  const result = performExpensiveOperation();
  res.json(result);
});
\`\`\`

#### Redis Caching
\`\`\`javascript
const redis = require('redis');
const client = redis.createClient();

async function getFromCache(key) {
  try {
    const result = await client.get(key);
    return result ? JSON.parse(result) : null;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
}

async function setCache(key, data, expireInSeconds = 3600) {
  try {
    await client.setex(key, expireInSeconds, JSON.stringify(data));
  } catch (error) {
    console.error('Cache set error:', error);
  }
}

// Usage in API route
app.get('/api/users/:id', async (req, res) => {
  const userId = req.params.id;
  const cacheKey = \`user:\${userId}\`;
  
  // Try cache first
  let user = await getFromCache(cacheKey);
  
  if (!user) {
    // Cache miss - fetch from database
    user = await User.findById(userId);
    
    if (user) {
      // Cache for 1 hour
      await setCache(cacheKey, user, 3600);
    }
  }
  
  res.json(user);
});
\`\`\`

### 4. Database Query Caching

#### MongoDB with Mongoose
\`\`\`javascript
const mongoose = require('mongoose');

// Enable query caching
mongoose.set('cache', true);

// Cache specific queries
User.find({ active: true })
  .cache(300) // Cache for 5 minutes
  .exec();

// Custom cache implementation
const queryCache = new Map();

function cachedFind(model, query, options = {}) {
  const cacheKey = JSON.stringify({ model: model.modelName, query });
  const ttl = options.ttl || 300000; // 5 minutes
  
  const cached = queryCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < ttl) {
    return Promise.resolve(cached.data);
  }
  
  return model.find(query).then(result => {
    queryCache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });
    return result;
  });
}
\`\`\`

### 5. Application-Level Caching

#### Memoization
\`\`\`javascript
function memoize(fn) {
  const cache = new Map();
  
  return function(...args) {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// Usage
const expensiveFunction = memoize((n) => {
  // Expensive computation
  let result = 0;
  for (let i = 0; i < n; i++) {
    result += Math.sqrt(i);
  }
  return result;
});

console.log(expensiveFunction(1000000)); // Computed
console.log(expensiveFunction(1000000)); // Cached
\`\`\`

#### React Query Caching
\`\`\`javascript
import { useQuery, QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProfile />
    </QueryClientProvider>
  );
}

function UserProfile() {
  const { data, isLoading, error } = useQuery(
    ['user', userId],
    () => fetchUser(userId),
    {
      staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
      cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    }
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>{data.name}</div>;
}
\`\`\`

## Caching Strategies

### 1. Cache-Aside (Lazy Loading)
\`\`\`javascript
async function getUserData(userId) {
  // Check cache first
  let user = await cache.get(\`user:\${userId}\`);
  
  if (!user) {
    // Cache miss - load from database
    user = await database.getUser(userId);
    
    if (user) {
      // Store in cache
      await cache.set(\`user:\${userId}\`, user, 3600);
    }
  }
  
  return user;
}
\`\`\`

### 2. Write-Through
\`\`\`javascript
async function updateUser(userId, userData) {
  // Update database
  const updatedUser = await database.updateUser(userId, userData);
  
  // Update cache
  await cache.set(\`user:\${userId}\`, updatedUser, 3600);
  
  return updatedUser;
}
\`\`\`

### 3. Write-Behind (Write-Back)
\`\`\`javascript
const writeQueue = [];

async function updateUser(userId, userData) {
  // Update cache immediately
  await cache.set(\`user:\${userId}\`, userData, 3600);
  
  // Queue database write
  writeQueue.push({ userId, userData, timestamp: Date.now() });
  
  return userData;
}

// Background process to flush writes
setInterval(async () => {
  const batch = writeQueue.splice(0, 100); // Process 100 at a time
  
  for (const write of batch) {
    try {
      await database.updateUser(write.userId, write.userData);
    } catch (error) {
      console.error('Failed to write to database:', error);
      // Could retry or handle error
    }
  }
}, 5000); // Every 5 seconds
\`\`\`

### 4. Refresh-Ahead
\`\`\`javascript
async function getDataWithRefresh(key, fetchFunction, threshold = 0.8) {
  const cached = await cache.get(key);
  
  if (cached) {
    const age = Date.now() - cached.timestamp;
    const ttl = cached.ttl;
    
    // If cache is near expiration, refresh in background
    if (age > (ttl * threshold)) {
      // Async refresh
      fetchFunction().then(newData => {
        cache.set(key, {
          data: newData,
          timestamp: Date.now(),
          ttl: ttl
        });
      }).catch(console.error);
    }
    
    return cached.data;
  }
  
  // Cache miss
  const data = await fetchFunction();
  await cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl: 3600000
  });
  
  return data;
}
\`\`\`

## Cache Invalidation

### Time-Based Expiration
\`\`\`javascript
// TTL (Time To Live)
cache.set('key', data, 3600); // Expires in 1 hour

// Absolute expiration
const expireAt = new Date();
expireAt.setHours(expireAt.getHours() + 1);
cache.setWithExpiration('key', data, expireAt);
\`\`\`

### Event-Based Invalidation
\`\`\`javascript
const EventEmitter = require('events');
const cacheInvalidator = new EventEmitter();

// Listen for user updates
cacheInvalidator.on('user.updated', (userId) => {
  cache.del(\`user:\${userId}\`);
  cache.del(\`user:profile:\${userId}\`);
  cache.del('users:list'); // Invalidate list cache
});

// Trigger invalidation
async function updateUser(userId, data) {
  const user = await database.updateUser(userId, data);
  cacheInvalidator.emit('user.updated', userId);
  return user;
}
\`\`\`

### Cache Tags
\`\`\`javascript
class TaggedCache {
  constructor() {
    this.cache = new Map();
    this.tags = new Map();
  }

  set(key, value, tags = []) {
    this.cache.set(key, value);
    
    // Associate tags with this key
    for (const tag of tags) {
      if (!this.tags.has(tag)) {
        this.tags.set(tag, new Set());
      }
      this.tags.get(tag).add(key);
    }
  }

  get(key) {
    return this.cache.get(key);
  }

  invalidateByTag(tag) {
    const keys = this.tags.get(tag);
    if (keys) {
      for (const key of keys) {
        this.cache.delete(key);
      }
      this.tags.delete(tag);
    }
  }
}

// Usage
const taggedCache = new TaggedCache();

taggedCache.set('user:123', userData, ['user', 'profile']);
taggedCache.set('user:124', userData2, ['user']);

// Invalidate all user-related cache
taggedCache.invalidateByTag('user');
\`\`\`

## Performance Monitoring

### Cache Hit Rate
\`\`\`javascript
class CacheMetrics {
  constructor() {
    this.hits = 0;
    this.misses = 0;
  }

  recordHit() {
    this.hits++;
  }

  recordMiss() {
    this.misses++;
  }

  getHitRate() {
    const total = this.hits + this.misses;
    return total > 0 ? (this.hits / total) * 100 : 0;
  }

  reset() {
    this.hits = 0;
    this.misses = 0;
  }
}

const metrics = new CacheMetrics();

async function cachedGet(key) {
  const value = cache.get(key);
  
  if (value) {
    metrics.recordHit();
    return value;
  } else {
    metrics.recordMiss();
    return null;
  }
}

// Monitor performance
setInterval(() => {
  console.log(\`Cache hit rate: \${metrics.getHitRate().toFixed(2)}%\`);
}, 60000); // Every minute
\`\`\`

## Best Practices

### 1. Choose the Right Cache Level
\`\`\`javascript
// Static assets - Long-term browser cache
app.use('/static', express.static('public', {
  maxAge: '1y',
  immutable: true
}));

// API responses - Short-term cache
app.get('/api/data', cacheMiddleware(300), handler);

// Database queries - Application cache
const result = await cachedQuery('SELECT * FROM users', 600);
\`\`\`

### 2. Implement Cache Warming
\`\`\`javascript
async function warmCache() {
  const popularData = await database.getPopularContent();
  
  for (const item of popularData) {
    await cache.set(\`content:\${item.id}\`, item, 3600);
  }
  
  console.log('Cache warmed with popular content');
}

// Warm cache on startup
warmCache();
\`\`\`

### 3. Handle Cache Failures Gracefully
\`\`\`javascript
async function resilientCachedGet(key, fetchFunction) {
  try {
    const cached = await cache.get(key);
    if (cached) {
      return cached;
    }
  } catch (error) {
    console.error('Cache get failed:', error);
  }

  // Fallback to original data source
  const data = await fetchFunction();
  
  try {
    await cache.set(key, data, 3600);
  } catch (error) {
    console.error('Cache set failed:', error);
  }
  
  return data;
}
\`\`\`

### 4. Implement Circuit Breaker for Cache
\`\`\`javascript
class CacheCircuitBreaker {
  constructor(threshold = 5, timeout = 60000) {
    this.failures = 0;
    this.threshold = threshold;
    this.timeout = timeout;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.nextAttempt = 0;
  }

  async execute(operation) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN');
      }
      this.state = 'HALF_OPEN';
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  onFailure() {
    this.failures++;
    if (this.failures >= this.threshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.timeout;
    }
  }
}
\`\`\`

## Common Patterns

### 1. Multi-Level Caching
\`\`\`javascript
async function getWithMultiLevelCache(key) {
  // Level 1: In-memory cache
  let data = memoryCache.get(key);
  if (data) return data;

  // Level 2: Redis cache
  data = await redisCache.get(key);
  if (data) {
    memoryCache.set(key, data, 60); // Cache in memory for 1 minute
    return data;
  }

  // Level 3: Database
  data = await database.get(key);
  if (data) {
    await redisCache.set(key, data, 3600); // Cache in Redis for 1 hour
    memoryCache.set(key, data, 60); // Cache in memory for 1 minute
  }

  return data;
}
\`\`\`

### 2. Cache Stampede Prevention
\`\`\`javascript
const pendingRequests = new Map();

async function preventStampede(key, fetchFunction) {
  // Check if request is already pending
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key);
  }

  // Create promise for this request
  const promise = fetchFunction()
    .finally(() => {
      pendingRequests.delete(key);
    });

  pendingRequests.set(key, promise);
  return promise;
}
\`\`\`

## Conclusion

Effective caching strategies can dramatically improve application performance:

1. **Use multiple cache levels** for different types of data
2. **Choose appropriate TTL values** based on data volatility
3. **Implement proper invalidation** strategies
4. **Monitor cache performance** regularly
5. **Handle failures gracefully** with fallback mechanisms
6. **Consider consistency requirements** when choosing strategies

The key is to understand your data access patterns and choose the right caching strategy for each use case.
`,
    category: "Performance",
    tags: ["Caching", "Performance", "Redis", "CDN", "Optimization"],
    readTime: 20,
    published: true,
  },
  note: {
    title: "Caching Strategies - Quick Reference",
    content: `# Caching Strategies - Quick Reference

## Cache Types

### 1. Browser Cache
\`\`\`http
Cache-Control: public, max-age=3600
ETag: "686897696a7c876b7e"
Expires: Wed, 21 Oct 2024 07:28:00 GMT
\`\`\`

### 2. CDN Cache
- Geographic distribution
- Edge servers
- Global content delivery

### 3. Server-Side Cache
\`\`\`javascript
const cache = new NodeCache({ stdTTL: 600 });
cache.set('key', data, 300);
const value = cache.get('key');
\`\`\`

### 4. Redis Cache
\`\`\`javascript
await client.setex('key', 3600, JSON.stringify(data));
const cached = await client.get('key');
\`\`\`

## Caching Strategies

### 1. Cache-Aside (Lazy)
1. Check cache
2. If miss, load from DB
3. Store in cache
4. Return data

### 2. Write-Through
1. Write to cache
2. Write to database
3. Return data

### 3. Write-Behind
1. Write to cache immediately
2. Queue database write
3. Background process flushes

### 4. Refresh-Ahead
1. Serve from cache
2. If near expiration, refresh async
3. Update cache in background

## Cache Headers
- **Cache-Control**: Controls caching behavior
- **ETag**: Entity tag for validation
- **Last-Modified**: Resource modification time
- **Expires**: Absolute expiration time

## TTL Guidelines
- **Static assets**: 1 year
- **API responses**: 5-15 minutes
- **User data**: 1-5 minutes
- **Session data**: 15-30 minutes

## Invalidation Strategies
1. **Time-based**: TTL expiration
2. **Event-based**: Triggered by updates
3. **Manual**: Explicit invalidation
4. **Tagged**: Group invalidation

## Best Practices
- ✅ Monitor hit rates (aim for >80%)
- ✅ Handle cache failures gracefully
- ✅ Use appropriate TTL values
- ✅ Implement cache warming
- ✅ Consider consistency requirements
- ❌ Don't cache user-specific data globally
- ❌ Don't cache sensitive information
- ❌ Don't ignore cache invalidation

## Performance Metrics
- **Hit Rate**: % of requests served from cache
- **Miss Rate**: % of requests not in cache
- **Latency**: Cache response time
- **Memory Usage**: Cache storage consumption

## Common Tools
- **Redis**: Distributed cache
- **Memcached**: Simple key-value cache
- **Node-cache**: In-memory Node.js cache
- **React Query**: Frontend data cache
- **Cloudflare**: CDN caching
`,
    category: "Performance",
    tags: ["Caching", "Quick Reference", "Performance"],
  },
};

async function createCachingContent() {
  try {
    console.log("🚀 Creating Caching Strategies Content...");

    const user = await prisma.user.findFirst();
    if (!user) {
      throw new Error("No users found. Please create a user first.");
    }

    // Find the caching subtopic
    const subTopic = await prisma.subTopic.findFirst({
      where: { slug: "caching" },
      include: { topic: true },
    });

    if (!subTopic) {
      console.log("⚠️ Caching subtopic not found");
      return;
    }

    // Create blog
    const existingBlog = await prisma.blog.findFirst({
      where: {
        title: cachingContent.blog.title,
        authorId: user.id,
      },
    });

    if (!existingBlog) {
      await prisma.blog.create({
        data: {
          ...cachingContent.blog,
          topicId: subTopic.topicId,
          subTopicId: subTopic.id,
          authorId: user.id,
        },
      });
      console.log(`✅ Created blog: ${cachingContent.blog.title}`);
    } else {
      console.log(`⏭️ Blog already exists: ${cachingContent.blog.title}`);
    }

    // Create note
    const existingNote = await prisma.note.findFirst({
      where: {
        title: cachingContent.note.title,
        authorId: user.id,
      },
    });

    if (!existingNote) {
      await prisma.note.create({
        data: {
          ...cachingContent.note,
          topicId: subTopic.topicId,
          subTopicId: subTopic.id,
          authorId: user.id,
        },
      });
      console.log(`✅ Created note: ${cachingContent.note.title}`);
    } else {
      console.log(`⏭️ Note already exists: ${cachingContent.note.title}`);
    }

    console.log("\n✅ Successfully created Caching Strategies content!");
  } catch (error) {
    console.error("❌ Error creating caching content:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createCachingContent();
