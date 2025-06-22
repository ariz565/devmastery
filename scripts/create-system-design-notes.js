const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const systemDesignNotesContent = {
  notes: [
    {
      title: "System Design Interview Checklist",
      content: `# System Design Interview Checklist

## 1. Requirements Gathering (5-10 minutes)

### Functional Requirements
- [ ] **Core Features**: What are the main features the system should support?
- [ ] **User Actions**: What can users do with the system?
- [ ] **Business Logic**: What are the key business rules?
- [ ] **APIs**: What APIs need to be exposed?

### Non-Functional Requirements
- [ ] **Scale**: How many users? Requests per second?
- [ ] **Performance**: Latency requirements? Throughput needs?
- [ ] **Availability**: Uptime requirements (99.9%, 99.99%)?
- [ ] **Consistency**: Strong vs eventual consistency needs?
- [ ] **Security**: Authentication, authorization, data protection?

### Example Questions to Ask
\`\`\`
Functional:
- Should users be able to edit posts after publishing?
- Do we need real-time notifications?
- Should the system support multimedia content?
- Are there different user types/roles?

Non-Functional:
- How many daily active users?
- What's the read/write ratio?
- Are there any geographic requirements?
- What's the acceptable latency for critical operations?
\`\`\`

## 2. Capacity Estimation (5-10 minutes)

### User Metrics
- [ ] **Daily Active Users (DAU)**
- [ ] **Monthly Active Users (MAU)**
- [ ] **Peak concurrent users**
- [ ] **User growth rate**

### Traffic Estimates
\`\`\`
Example Calculation:
- 100M DAU
- Average user posts 1 post/day
- Peak traffic = 2x average
- Posts/second = 100M / 86400 = ~1200/sec
- Peak posts/second = 2400/sec
- Read/Write ratio = 100:1
- Reads/second = 240K/sec
\`\`\`

### Storage Estimates
\`\`\`
Example:
- Average post size: 1KB
- Posts per day: 100M
- Daily storage: 100GB
- With metadata (2x): 200GB/day
- Annual storage: ~70TB
- With replication (3x): ~210TB
\`\`\`

### Bandwidth Estimates
\`\`\`
Example:
- Incoming: 200GB/day = ~2.5MB/sec
- Outgoing: 240K reads * 1KB = 240MB/sec
- Peak outgoing: ~500MB/sec
\`\`\`

## 3. System Interface Design (5-10 minutes)

### API Design
\`\`\`
REST APIs:
POST /api/posts
GET /api/posts/{id}
PUT /api/posts/{id}
DELETE /api/posts/{id}
GET /api/users/{id}/posts
GET /api/feed/{userId}

Parameters:
- Pagination: limit, offset
- Filtering: category, date_range
- Sorting: created_at, popularity
\`\`\`

### Response Formats
\`\`\`json
{
  "post": {
    "id": "12345",
    "title": "Sample Post",
    "content": "Post content...",
    "author_id": "user123",
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2024-01-15T10:30:00Z",
    "tags": ["tech", "programming"],
    "metadata": {
      "views": 1250,
      "likes": 89,
      "comments": 12
    }
  }
}
\`\`\`

## 4. High-Level Design (10-15 minutes)

### Basic Architecture
\`\`\`
[Client] → [Load Balancer] → [Web Servers] → [App Servers] → [Database]
                                ↓
                          [Cache Layer]
                                ↓
                          [File Storage]
\`\`\`

### Key Components
- [ ] **Load Balancer**: Distribute traffic
- [ ] **Web Servers**: Handle HTTP requests
- [ ] **Application Servers**: Business logic
- [ ] **Database**: Data persistence
- [ ] **Cache**: Performance optimization
- [ ] **CDN**: Static content delivery
- [ ] **Message Queue**: Async processing

### Data Flow
1. **Write Path**: Client → LB → App Server → Database → Cache
2. **Read Path**: Client → LB → App Server → Cache → Database (if miss)

## 5. Database Design (10-15 minutes)

### Schema Design
\`\`\`sql
-- Users table
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Posts table
CREATE TABLE posts (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36),
    title VARCHAR(200),
    content TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    INDEX idx_user_created (user_id, created_at),
    INDEX idx_created (created_at)
);

-- Relationships table (for social features)
CREATE TABLE user_follows (
    follower_id VARCHAR(36),
    followee_id VARCHAR(36),
    created_at TIMESTAMP,
    PRIMARY KEY (follower_id, followee_id)
);
\`\`\`

### Database Choices
- [ ] **SQL vs NoSQL**: Based on consistency needs
- [ ] **ACID vs BASE**: Transaction requirements
- [ ] **Relational**: PostgreSQL, MySQL for structured data
- [ ] **Document**: MongoDB for flexible schema
- [ ] **Key-Value**: Redis for caching
- [ ] **Graph**: Neo4j for social networks

## 6. Detailed Design (15-20 minutes)

### Scalability Patterns
- [ ] **Database Sharding**: Horizontal partitioning
- [ ] **Read Replicas**: Scale read operations
- [ ] **Microservices**: Service decomposition
- [ ] **Event-Driven**: Async communication
- [ ] **CQRS**: Separate read/write models

### Caching Strategy
\`\`\`
Cache Layers:
1. Browser Cache (Client)
2. CDN (Edge)
3. Load Balancer Cache
4. Application Cache (Redis)
5. Database Cache

Cache Patterns:
- Cache-aside for user data
- Write-through for critical data
- Write-behind for analytics
\`\`\`

### Specific Components

#### News Feed Generation
\`\`\`
Pull Model:
- Generate feed on request
- Good for users with many follows
- Higher latency, lower storage

Push Model:
- Pre-generate feeds
- Good for active users
- Lower latency, higher storage

Hybrid:
- Pull for users with many follows
- Push for others
- Balance latency and storage
\`\`\`

#### Search Service
\`\`\`
Components:
- Elasticsearch for full-text search
- Separate indexing service
- Search result ranking
- Auto-complete service
\`\`\`

## 7. Addressing Non-Functional Requirements (10-15 minutes)

### Availability
- [ ] **Redundancy**: Multiple availability zones
- [ ] **Failover**: Automatic switching
- [ ] **Health Checks**: Monitor service health
- [ ] **Circuit Breakers**: Prevent cascade failures

### Consistency
- [ ] **Strong Consistency**: ACID transactions
- [ ] **Eventual Consistency**: BASE properties
- [ ] **Conflict Resolution**: Last-write-wins, vector clocks

### Security
- [ ] **Authentication**: JWT, OAuth
- [ ] **Authorization**: RBAC, ABAC
- [ ] **Data Protection**: Encryption, PII handling
- [ ] **Rate Limiting**: Prevent abuse

### Performance
- [ ] **Latency**: P95, P99 targets
- [ ] **Throughput**: Requests per second
- [ ] **Optimization**: Database indexing, query optimization

## 8. Monitoring and Alerting (5 minutes)

### Metrics to Monitor
- [ ] **Application Metrics**: Response time, error rate
- [ ] **Infrastructure Metrics**: CPU, memory, disk
- [ ] **Business Metrics**: User engagement, revenue
- [ ] **Database Metrics**: Query performance, connections

### Alerting Strategy
\`\`\`
Critical Alerts:
- Service down
- High error rates (>5%)
- Database connection failures
- Security breaches

Warning Alerts:
- High latency (>2s)
- High CPU/memory usage (>80%)
- Low disk space (<20%)
- Unusual traffic patterns
\`\`\`

## Common Mistakes to Avoid

1. **Jumping to solutions**: Gather requirements first
2. **Over-engineering**: Start simple, then scale
3. **Ignoring trade-offs**: Every decision has pros/cons
4. **Forgetting about data**: Consider data consistency, backup
5. **Not asking questions**: Clarify unclear requirements
6. **Skipping monitoring**: Plan for observability
7. **Ignoring security**: Consider security from the start

## Time Management Tips

- **25% Requirements & Estimation** (10 minutes)
- **25% High-level Design** (10 minutes)  
- **35% Detailed Design** (15 minutes)
- **15% Scale & Wrap-up** (5 minutes)

## Final Checklist

- [ ] Addressed all functional requirements
- [ ] Met non-functional requirements
- [ ] Considered scalability bottlenecks
- [ ] Discussed trade-offs
- [ ] Planned for failure scenarios
- [ ] Included monitoring strategy
- [ ] Kept design simple and extensible`,
      tags: ["System Design", "Interview Prep", "Checklist", "Architecture"],
      category: "System Design",
    },
    {
      title: "Database Design Fundamentals",
      content: `# Database Design Fundamentals

## 1. Database Design Process

### Requirements Analysis
1. **Identify Entities**: What are the main objects/concepts?
2. **Define Relationships**: How do entities relate to each other?
3. **Determine Attributes**: What properties does each entity have?
4. **Define Constraints**: What rules must the data follow?

### Conceptual Design (ER Modeling)
- **Entities**: Things that exist independently
- **Attributes**: Properties of entities
- **Relationships**: Connections between entities
- **Cardinalities**: One-to-one, one-to-many, many-to-many

### Logical Design (Normalization)
- **1NF**: Each cell contains atomic values
- **2NF**: No partial dependencies on composite keys
- **3NF**: No transitive dependencies
- **BCNF**: Every determinant is a candidate key

### Physical Design
- **Storage structures**: How data is stored on disk
- **Indexing strategy**: Which columns to index
- **Partitioning**: How to split large tables
- **Performance optimization**: Query optimization

## 2. Entity-Relationship (ER) Modeling

### Entity Types
\`\`\`
Strong Entity: Exists independently
Example: Customer, Product, Order

Weak Entity: Depends on another entity
Example: OrderItem (depends on Order)

Associative Entity: Represents many-to-many relationship
Example: StudentCourse (between Student and Course)
\`\`\`

### Relationship Types
\`\`\`
One-to-One (1:1):
Person ←→ Passport

One-to-Many (1:M):
Customer → Orders

Many-to-Many (M:N):
Students ←→ Courses
\`\`\`

### ER Diagram Example
\`\`\`
[Customer] --1:M-- [Order] --1:M-- [OrderItem] --M:1-- [Product]
    |                  |                              |
attributes:        attributes:                   attributes:
- customer_id      - order_id                   - product_id
- name             - customer_id (FK)           - name
- email            - order_date                 - price
- phone            - total_amount               - description
\`\`\`

## 3. Normalization

### First Normal Form (1NF)
**Rule**: Each cell contains only atomic (indivisible) values.

\`\`\`sql
-- Violates 1NF (multiple values in phone column)
CREATE TABLE customers_bad (
    id INT,
    name VARCHAR(100),
    phones VARCHAR(200)  -- "123-456-7890, 987-654-3210"
);

-- Follows 1NF
CREATE TABLE customers (
    id INT PRIMARY KEY,
    name VARCHAR(100)
);

CREATE TABLE customer_phones (
    customer_id INT,
    phone VARCHAR(20),
    phone_type VARCHAR(10),  -- 'home', 'work', 'mobile'
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);
\`\`\`

### Second Normal Form (2NF)
**Rule**: Must be in 1NF and have no partial dependencies.

\`\`\`sql
-- Violates 2NF (product_name depends only on product_id, not full key)
CREATE TABLE order_items_bad (
    order_id INT,
    product_id INT,
    product_name VARCHAR(100),  -- Partial dependency
    quantity INT,
    price DECIMAL(10,2),
    PRIMARY KEY (order_id, product_id)
);

-- Follows 2NF
CREATE TABLE order_items (
    order_id INT,
    product_id INT,
    quantity INT,
    price DECIMAL(10,2),
    PRIMARY KEY (order_id, product_id),
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE products (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    description TEXT,
    base_price DECIMAL(10,2)
);
\`\`\`

### Third Normal Form (3NF)
**Rule**: Must be in 2NF and have no transitive dependencies.

\`\`\`sql
-- Violates 3NF (city_name depends on city_id, not customer_id)
CREATE TABLE customers_bad (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    city_id INT,
    city_name VARCHAR(100),  -- Transitive dependency
    city_state VARCHAR(50)   -- Transitive dependency
);

-- Follows 3NF
CREATE TABLE customers (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    city_id INT,
    FOREIGN KEY (city_id) REFERENCES cities(id)
);

CREATE TABLE cities (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    state VARCHAR(50)
);
\`\`\`

## 4. Indexing Strategies

### Types of Indexes
\`\`\`sql
-- Primary Index (automatically created for PRIMARY KEY)
CREATE TABLE users (
    id INT PRIMARY KEY,  -- Clustered index
    username VARCHAR(50),
    email VARCHAR(100)
);

-- Secondary Index
CREATE INDEX idx_username ON users(username);
CREATE INDEX idx_email ON users(email);

-- Composite Index
CREATE INDEX idx_user_created ON posts(user_id, created_at);

-- Unique Index
CREATE UNIQUE INDEX idx_unique_email ON users(email);

-- Partial Index (PostgreSQL)
CREATE INDEX idx_active_users ON users(username) WHERE active = true;

-- Functional Index
CREATE INDEX idx_lower_email ON users(LOWER(email));
\`\`\`

### When to Use Indexes
\`\`\`
Create indexes for:
✓ Primary keys (automatic)
✓ Foreign keys
✓ Frequently queried columns
✓ Columns used in WHERE clauses
✓ Columns used in ORDER BY
✓ Columns used in JOIN conditions

Avoid indexes for:
✗ Columns with low cardinality (few unique values)
✗ Tables with heavy writes and few reads
✗ Small tables (< 1000 rows)
✗ Columns that change frequently
\`\`\`

## 5. Performance Optimization

### Query Optimization
\`\`\`sql
-- Use EXPLAIN to analyze query plans
EXPLAIN SELECT * FROM orders o
JOIN customers c ON o.customer_id = c.id
WHERE o.created_at >= '2024-01-01'
AND c.status = 'active';

-- Optimize with proper indexes
CREATE INDEX idx_orders_date ON orders(created_at);
CREATE INDEX idx_customers_status ON customers(status);
\`\`\`

### Denormalization for Performance
\`\`\`sql
-- Add calculated fields to avoid expensive JOINs
CREATE TABLE orders (
    id INT PRIMARY KEY,
    customer_id INT,
    customer_name VARCHAR(100),  -- Denormalized
    total_amount DECIMAL(10,2),
    item_count INT,              -- Denormalized
    created_at TIMESTAMP
);
\`\`\`

## 6. Common Design Patterns

### Lookup Tables
\`\`\`sql
-- Instead of storing status as string everywhere
CREATE TABLE order_statuses (
    id INT PRIMARY KEY,
    name VARCHAR(50) UNIQUE,  -- 'pending', 'confirmed', 'shipped'
    description TEXT
);

CREATE TABLE orders (
    id INT PRIMARY KEY,
    customer_id INT,
    status_id INT,
    created_at TIMESTAMP,
    FOREIGN KEY (status_id) REFERENCES order_statuses(id)
);
\`\`\`

### Audit Trail Pattern
\`\`\`sql
-- Track changes to important entities
CREATE TABLE user_audit (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(20),  -- 'INSERT', 'UPDATE', 'DELETE'
    field_name VARCHAR(50),
    old_value TEXT,
    new_value TEXT,
    changed_by INT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### Soft Delete Pattern
\`\`\`sql
-- Don't actually delete data, mark as deleted
CREATE TABLE users (
    id INT PRIMARY KEY,
    username VARCHAR(50),
    email VARCHAR(100),
    deleted_at TIMESTAMP NULL,
    INDEX idx_active_users (id) WHERE deleted_at IS NULL
);

-- Queries for active users
SELECT * FROM users WHERE deleted_at IS NULL;
\`\`\`

## 7. Data Types and Constraints

### Choosing Appropriate Data Types
\`\`\`sql
-- Numeric types
TINYINT     -- 1 byte (-128 to 127)
SMALLINT    -- 2 bytes (-32,768 to 32,767)
INT         -- 4 bytes (-2B to 2B)
BIGINT      -- 8 bytes (very large numbers)
DECIMAL(p,s) -- Exact decimal (for money)
FLOAT/DOUBLE -- Approximate decimal

-- String types
CHAR(n)     -- Fixed length (padded)
VARCHAR(n)  -- Variable length (up to n)
TEXT        -- Large text (up to 65KB)
LONGTEXT    -- Very large text (up to 4GB)

-- Date/Time types
DATE        -- Date only (YYYY-MM-DD)
TIME        -- Time only (HH:MM:SS)
DATETIME    -- Date and time
TIMESTAMP   -- Date/time with timezone awareness

-- Boolean
BOOLEAN     -- TRUE/FALSE (stored as TINYINT in MySQL)
\`\`\`

### Constraints
\`\`\`sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL,
    age INT CHECK (age >= 18 AND age <= 120),
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT uk_email UNIQUE (email),
    CONSTRAINT chk_email_format CHECK (email LIKE '%@%')
);
\`\`\`

## Best Practices

1. **Name Consistently**: Use clear, consistent naming conventions
2. **Document Everything**: Comment your schema and relationships
3. **Plan for Growth**: Design for future scalability needs
4. **Use Constraints**: Enforce data integrity at the database level
5. **Monitor Performance**: Regularly analyze and optimize queries
6. **Backup Strategy**: Plan for data recovery and disaster scenarios
7. **Version Control**: Track schema changes with migrations
8. **Test Thoroughly**: Test with realistic data volumes

## Common Pitfalls to Avoid

1. **Over-normalization**: Don't normalize everything if performance suffers
2. **Under-normalization**: Don't ignore normalization principles entirely
3. **Poor indexing**: Too many or too few indexes
4. **Ignoring constraints**: Let application handle all validation
5. **Wrong data types**: Using VARCHAR for everything
6. **No backup plan**: Not planning for data recovery
7. **Premature optimization**: Optimizing before understanding the actual bottlenecks`,
      tags: ["Database Design", "SQL", "Normalization", "Performance"],
      category: "System Design",
    },
  ],
};

async function createSystemDesignNotesContent() {
  try {
    console.log("Creating System Design Notes content...");

    // Get the first user as authorId
    const users = await prisma.user.findMany();
    if (users.length === 0) {
      console.error("No users found! Please create a user first.");
      return;
    }
    const authorId = users[0].id;

    // Find System Design topic
    const systemDesignTopic = await prisma.topic.findFirst({
      where: { name: "System Design" },
    });

    if (!systemDesignTopic) {
      console.error("System Design topic not found!");
      return;
    }

    // Find Low Level Design subtopic (for database design note)
    const lowLevelSubtopic = await prisma.subTopic.findFirst({
      where: {
        name: "Low Level Design",
        topicId: systemDesignTopic.id,
      },
    });

    if (!lowLevelSubtopic) {
      console.error("Low Level Design subtopic not found!");
      return;
    }

    // Create notes
    for (const noteData of systemDesignNotesContent.notes) {
      // Check if note already exists
      const existingNote = await prisma.note.findFirst({
        where: {
          title: noteData.title,
          authorId: authorId,
        },
      });

      if (existingNote) {
        console.log(`Note already exists: ${noteData.title}`);
        continue;
      }
      const note = await prisma.note.create({
        data: {
          ...noteData,
          authorId: authorId,
          topicId: systemDesignTopic.id,
          subTopicId: lowLevelSubtopic.id,
        },
      });

      console.log(`Created note: ${note.title}`);
    }

    console.log("System Design Notes content creation completed successfully!");
  } catch (error) {
    console.error("Error creating System Design Notes content:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createSystemDesignNotesContent();
