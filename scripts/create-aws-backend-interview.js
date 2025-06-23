const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createAWSBackendInterviewResources() {
  try {
    console.log('🚀 Creating AWS Backend Developer Interview Resources...');

    // First, get or create a user (admin)
    let user = await prisma.user.findFirst({
      where: { email: { contains: 'admin' } }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'admin@example.com',
          name: 'Admin User',
          clerkId: 'admin_clerk_id_' + Date.now()
        }
      });
      console.log('✅ Created admin user');
    }

    // AWS Backend Interview Resources
    const resources = [
      {
        title: "AWS Core Services Overview",
        description: "Comprehensive guide covering essential AWS services for backend development including EC2, S3, RDS, Lambda, and API Gateway.",
        type: "study-guide",
        category: "Backend",
        difficulty: "medium",
        content: `# AWS Core Services for Backend Development

## 1. Amazon EC2 (Elastic Compute Cloud)
### Key Concepts:
- Virtual servers in the cloud
- Instance types and sizing
- Auto Scaling Groups
- Elastic Load Balancing
- Security Groups and NACLs

### Interview Questions:
- How do you choose the right EC2 instance type?
- Explain the difference between horizontal and vertical scaling
- What are the benefits of using Auto Scaling Groups?

## 2. Amazon S3 (Simple Storage Service)
### Key Features:
- Object storage with 99.999999999% (11 9's) durability
- Storage classes (Standard, IA, Glacier, etc.)
- Versioning and lifecycle policies
- Cross-region replication
- Event notifications

### Common Use Cases:
- Static website hosting
- Data backup and archival
- Data lakes and analytics
- Content distribution

## 3. Amazon RDS (Relational Database Service)
### Supported Engines:
- MySQL, PostgreSQL, MariaDB
- Oracle, SQL Server
- Amazon Aurora

### Key Features:
- Automated backups and point-in-time recovery
- Multi-AZ deployments for high availability
- Read replicas for performance
- Parameter groups and option groups

## 4. AWS Lambda
### Serverless Computing Benefits:
- No server management
- Automatic scaling
- Pay-per-request pricing
- Event-driven execution

### Best Practices:
- Keep functions stateless
- Optimize cold start times
- Use environment variables for configuration
- Implement proper error handling

## 5. Amazon API Gateway
### Features:
- RESTful and WebSocket APIs
- Request/response transformation
- Authentication and authorization
- Rate limiting and throttling
- Integration with AWS services`,
        tags: ["aws", "ec2", "s3", "rds", "lambda", "api-gateway", "backend"],
        isPublic: true,
        isPremium: false,
        views: Math.floor(Math.random() * 100) + 50,
        downloads: Math.floor(Math.random() * 30) + 10,
        rating: 4.7,
        authorId: user.id
      },

      {
        title: "AWS Lambda Coding Challenge: Event Processing",
        description: "Build a serverless event processing system using AWS Lambda, SQS, and DynamoDB. Includes solution and explanation.",
        type: "coding-question",
        category: "Backend",
        difficulty: "hard",
        content: `# AWS Lambda Event Processing Challenge

## Problem Statement
Design and implement a serverless event processing system that:
1. Receives events via API Gateway
2. Processes events asynchronously using Lambda
3. Stores results in DynamoDB
4. Handles failures with dead letter queues

## Architecture Requirements
- API Gateway → Lambda → SQS → Lambda → DynamoDB
- Error handling and retry logic
- Monitoring and logging
- Cost optimization

## Solution

### 1. API Gateway Lambda Function
\`\`\`javascript
const AWS = require('aws-sdk');
const sqs = new AWS.SQS();

exports.handler = async (event) => {
    try {
        const body = JSON.parse(event.body);
        
        // Validate input
        if (!body.eventType || !body.data) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing required fields' })
            };
        }
        
        // Add metadata
        const message = {
            id: generateUUID(),
            eventType: body.eventType,
            data: body.data,
            timestamp: new Date().toISOString(),
            source: event.requestContext.identity.sourceIp
        };
        
        // Send to SQS
        const params = {
            QueueUrl: process.env.QUEUE_URL,
            MessageBody: JSON.stringify(message),
            MessageAttributes: {
                eventType: {
                    DataType: 'String',
                    StringValue: body.eventType
                }
            }
        };
        
        await sqs.sendMessage(params).promise();
        
        return {
            statusCode: 202,
            body: JSON.stringify({ 
                message: 'Event accepted for processing',
                eventId: message.id 
            })
        };
        
    } catch (error) {
        console.error('Error processing event:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
\`\`\`

### 2. Event Processor Lambda Function
\`\`\`javascript
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const results = [];
    
    for (const record of event.Records) {
        try {
            const message = JSON.parse(record.body);
            const processedEvent = await processEvent(message);
            
            // Store in DynamoDB
            await storeEvent(processedEvent);
            
            results.push({
                messageId: record.messageId,
                status: 'success'
            });
            
        } catch (error) {
            console.error('Error processing record:', error);
            results.push({
                messageId: record.messageId,
                status: 'error',
                error: error.message
            });
        }
    }
    
    return { results };
};

async function processEvent(event) {
    // Business logic based on event type
    switch (event.eventType) {
        case 'user_signup':
            return processUserSignup(event);
        case 'order_placed':
            return processOrderPlaced(event);
        case 'payment_completed':
            return processPaymentCompleted(event);
        default:
            throw new Error(\`Unknown event type: \${event.eventType}\`);
    }
}

async function processUserSignup(event) {
    // Simulate user signup processing
    return {
        ...event,
        processed: true,
        welcome_email_sent: true,
        user_id: \`user_\${Date.now()}\`,
        processedAt: new Date().toISOString()
    };
}

async function storeEvent(event) {
    const params = {
        TableName: process.env.EVENTS_TABLE,
        Item: {
            id: event.id,
            eventType: event.eventType,
            data: event.data,
            processed: event.processed,
            timestamp: event.timestamp,
            processedAt: event.processedAt,
            ttl: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60) // 30 days
        }
    };
    
    return dynamodb.put(params).promise();
}
\`\`\`

### 3. CloudFormation Template
\`\`\`yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31

Resources:
  EventsQueue:
    Type: AWS::SQS::Queue
    Properties:
      VisibilityTimeoutSeconds: 60
      RedrivePolicy:
        deadLetterTargetArn: !GetAtt DeadLetterQueue.Arn
        maxReceiveCount: 3
      
  DeadLetterQueue:
    Type: AWS::SQS::Queue
    
  EventsTable:
    Type: AWS::DynamoDB::Table
    Properties:
      BillingMode: PAY_PER_REQUEST
      AttributeDefinitions:
        - AttributeName: id
          AttributeType: S
      KeySchema:
        - AttributeName: id
          KeyType: HASH
      TimeToLiveSpecification:
        AttributeName: ttl
        Enabled: true
\`\`\`

## Key Learning Points
1. **Async Processing**: Using SQS for decoupling
2. **Error Handling**: Dead letter queues for failed messages
3. **Scaling**: Lambda automatically scales based on queue depth
4. **Cost Optimization**: TTL for DynamoDB, efficient Lambda sizing
5. **Monitoring**: CloudWatch metrics and custom dashboards

## Follow-up Questions
- How would you handle message ordering?
- What monitoring would you implement?
- How would you handle traffic spikes?
- What security considerations are important?`,
        tags: ["aws", "lambda", "sqs", "dynamodb", "serverless", "event-driven"],
        isPublic: true,
        isPremium: true,
        views: Math.floor(Math.random() * 200) + 100,
        downloads: Math.floor(Math.random() * 50) + 20,
        rating: 4.9,
        authorId: user.id
      },

      {
        title: "AWS System Design: Scalable E-commerce Backend",
        description: "Design a scalable e-commerce backend on AWS handling millions of users. Covers architecture patterns, database design, and performance optimization.",
        type: "study-guide",
        category: "System Design",
        difficulty: "hard",
        content: `# Scalable E-commerce Backend on AWS

## System Requirements
- Handle 10M+ users
- 100K+ concurrent users
- 1M+ orders per day
- Global availability
- 99.99% uptime

## High-Level Architecture

### 1. Frontend Layer
- **CloudFront CDN**: Global content delivery
- **S3**: Static assets (images, CSS, JS)
- **Route 53**: DNS management

### 2. API Layer
- **Application Load Balancer**: Traffic distribution
- **API Gateway**: Rate limiting, authentication
- **ECS Fargate**: Containerized microservices
- **Lambda**: Serverless functions for specific tasks

### 3. Business Logic Layer
#### Microservices:
- **User Service**: Authentication, profiles
- **Product Service**: Catalog management
- **Order Service**: Order processing
- **Payment Service**: Payment processing
- **Inventory Service**: Stock management
- **Notification Service**: Email/SMS alerts

### 4. Data Layer
- **RDS Aurora**: Transactional data (orders, users)
- **DynamoDB**: Session data, shopping carts
- **ElastiCache Redis**: Caching layer
- **OpenSearch**: Product search
- **S3**: File storage, data lake

### 5. Integration Layer
- **SQS**: Async message processing
- **SNS**: Event notifications
- **EventBridge**: Event routing
- **Step Functions**: Workflow orchestration

## Database Design

### RDS Aurora (MySQL)
\`\`\`sql
-- Users table
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);

-- Products table
CREATE TABLE products (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category_id BIGINT,
    brand_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category_id),
    INDEX idx_brand (brand_id),
    INDEX idx_price (price)
);

-- Orders table
CREATE TABLE orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled'),
    total_amount DECIMAL(10,2) NOT NULL,
    shipping_address JSON,
    billing_address JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);
\`\`\`

### DynamoDB Tables
\`\`\`json
// Shopping Cart
{
  "TableName": "shopping-carts",
  "KeySchema": [
    {
      "AttributeName": "user_id",
      "KeyType": "HASH"
    }
  ],
  "AttributeDefinitions": [
    {
      "AttributeName": "user_id",
      "AttributeType": "S"
    }
  ],
  "TimeToLiveSpecification": {
    "AttributeName": "ttl",
    "Enabled": true
  }
}

// User Sessions
{
  "TableName": "user-sessions",
  "KeySchema": [
    {
      "AttributeName": "session_id",
      "KeyType": "HASH"
    }
  ],
  "AttributeDefinitions": [
    {
      "AttributeName": "session_id",
      "AttributeType": "S"
    }
  ],
  "TimeToLiveSpecification": {
    "AttributeName": "expires_at",
    "Enabled": true
  }
}
\`\`\`

## Scaling Strategies

### 1. Horizontal Scaling
- **Auto Scaling Groups**: Scale EC2/ECS based on metrics
- **Application Load Balancer**: Distribute traffic
- **Database Read Replicas**: Scale read operations
- **Sharding**: Partition data across multiple databases

### 2. Caching Strategy
\`\`\`javascript
// Redis caching example
const redis = require('redis');
const client = redis.createClient();

async function getProduct(productId) {
    const cacheKey = \`product:\${productId}\`;
    
    // Try cache first
    let product = await client.get(cacheKey);
    if (product) {
        return JSON.parse(product);
    }
    
    // Fetch from database
    product = await db.query('SELECT * FROM products WHERE id = ?', [productId]);
    
    // Cache for 1 hour
    await client.setex(cacheKey, 3600, JSON.stringify(product));
    
    return product;
}
\`\`\`

### 3. Performance Optimization
- **CDN**: Cache static content globally
- **Database Indexing**: Optimize query performance
- **Connection Pooling**: Efficient database connections
- **Async Processing**: Use queues for heavy operations

## Security Considerations

### 1. Authentication & Authorization
- **Cognito**: User authentication
- **IAM Roles**: Service-to-service auth
- **API Keys**: Rate limiting and access control
- **JWT Tokens**: Stateless authentication

### 2. Data Protection
- **Encryption at Rest**: RDS, DynamoDB, S3
- **Encryption in Transit**: TLS/SSL
- **VPC**: Network isolation
- **WAF**: Web application firewall

### 3. Monitoring & Logging
- **CloudWatch**: Metrics and alerts
- **X-Ray**: Distributed tracing
- **CloudTrail**: API audit logs
- **Custom Dashboards**: Business metrics

## Cost Optimization

### 1. Compute
- **Spot Instances**: For non-critical workloads
- **Reserved Instances**: For predictable workloads
- **Auto Scaling**: Scale down during low traffic

### 2. Storage
- **S3 Intelligent Tiering**: Automatic cost optimization
- **EBS GP3**: Better price/performance ratio
- **Data Lifecycle Policies**: Archive old data

### 3. Database
- **Aurora Serverless**: Pay per use
- **Read Replicas**: Only where needed
- **Query Optimization**: Reduce compute costs

## Disaster Recovery

### 1. Backup Strategy
- **RDS Automated Backups**: Point-in-time recovery
- **DynamoDB Backup**: On-demand and continuous
- **S3 Cross-Region Replication**: Data redundancy

### 2. Multi-Region Setup
- **Active-Passive**: Primary region with standby
- **Active-Active**: Traffic distributed across regions
- **Route 53 Health Checks**: Automatic failover

## Sample Implementation - Order Service
\`\`\`javascript
const express = require('express');
const AWS = require('aws-sdk');
const app = express();

const dynamodb = new AWS.DynamoDB.DocumentClient();
const sqs = new AWS.SQS();

app.post('/orders', async (req, res) => {
    try {
        const { userId, items, shippingAddress } = req.body;
        
        // Validate inventory
        const inventoryCheck = await checkInventory(items);
        if (!inventoryCheck.available) {
            return res.status(400).json({ error: 'Insufficient inventory' });
        }
        
        // Create order
        const order = await createOrder({ userId, items, shippingAddress });
        
        // Send to processing queue
        await sendToQueue('order-processing', order);
        
        res.status(201).json({ orderId: order.id, status: 'pending' });
        
    } catch (error) {
        console.error('Order creation failed:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

async function createOrder(orderData) {
    const order = {
        id: generateOrderId(),
        ...orderData,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    await dynamodb.put({
        TableName: 'orders',
        Item: order
    }).promise();
    
    return order;
}
\`\`\`

This architecture can handle millions of users while maintaining high availability and performance!`,
        tags: ["aws", "system-design", "microservices", "scalability", "architecture"],
        isPublic: true,
        isPremium: true,
        views: Math.floor(Math.random() * 300) + 150,
        downloads: Math.floor(Math.random() * 80) + 40,
        rating: 4.8,
        authorId: user.id
      },

      {
        title: "AWS Security Best Practices Checklist",
        description: "Comprehensive security checklist for AWS backend applications. Covers IAM, VPC, encryption, monitoring, and compliance.",
        type: "document",
        category: "DevOps",
        difficulty: "medium",
        content: `# AWS Security Best Practices Checklist

## 1. Identity and Access Management (IAM)

### ✅ User Management
- [ ] Enable MFA for all users
- [ ] Use individual IAM users, not shared accounts
- [ ] Regularly review and remove unused users
- [ ] Implement password policies
- [ ] Use IAM roles for applications

### ✅ Permissions
- [ ] Follow principle of least privilege
- [ ] Use IAM policies instead of inline policies
- [ ] Regularly audit permissions
- [ ] Use AWS managed policies when possible
- [ ] Implement resource-based policies where appropriate

### ✅ Access Keys
- [ ] Rotate access keys regularly
- [ ] Don't embed access keys in code
- [ ] Use IAM roles for EC2 instances
- [ ] Monitor access key usage

## 2. Network Security

### ✅ VPC Configuration
- [ ] Use private subnets for backend resources
- [ ] Configure NAT gateways for outbound internet access
- [ ] Implement network ACLs as additional security layer
- [ ] Use VPC Flow Logs for monitoring

### ✅ Security Groups
- [ ] Follow whitelist approach (deny by default)
- [ ] Use specific port ranges, not 0.0.0.0/0
- [ ] Regularly review security group rules
- [ ] Use security group references instead of IP ranges

### ✅ Load Balancers
- [ ] Use HTTPS/TLS termination
- [ ] Configure health checks
- [ ] Enable access logs
- [ ] Use WAF for application layer protection

## 3. Data Protection

### ✅ Encryption at Rest
- [ ] Enable EBS encryption
- [ ] Use S3 server-side encryption
- [ ] Enable RDS encryption
- [ ] Encrypt DynamoDB tables
- [ ] Use AWS KMS for key management

### ✅ Encryption in Transit
- [ ] Use TLS 1.2 or higher
- [ ] Configure SSL certificates
- [ ] Enable HTTPS redirect
- [ ] Use VPN or Direct Connect for hybrid connections

### ✅ Data Backup
- [ ] Enable automated backups
- [ ] Test backup restoration procedures
- [ ] Use cross-region backup for critical data
- [ ] Implement data retention policies

## 4. Monitoring and Logging

### ✅ CloudTrail
- [ ] Enable CloudTrail in all regions
- [ ] Configure log file integrity validation
- [ ] Send logs to S3 with appropriate permissions
- [ ] Set up CloudWatch alarms for suspicious activities

### ✅ CloudWatch
- [ ] Monitor key metrics and set alarms
- [ ] Use CloudWatch Logs for application logs
- [ ] Implement custom metrics for business logic
- [ ] Create dashboards for visibility

### ✅ AWS Config
- [ ] Enable Config rules for compliance
- [ ] Monitor configuration changes
- [ ] Set up remediation actions
- [ ] Regular compliance reporting

## 5. Application Security

### ✅ API Gateway
- [ ] Implement authentication (Cognito, Lambda authorizers)
- [ ] Use API keys for partner access
- [ ] Configure throttling and rate limiting
- [ ] Enable request/response logging

### ✅ Lambda Security
- [ ] Use environment variables for configuration
- [ ] Implement least privilege IAM roles
- [ ] Enable VPC configuration when needed
- [ ] Monitor function performance and errors

### ✅ Database Security
- [ ] Use parameter groups for secure configurations
- [ ] Enable database activity streams
- [ ] Implement database-level encryption
- [ ] Use connection pooling

## 6. Incident Response

### ✅ Preparation
- [ ] Create incident response plan
- [ ] Define roles and responsibilities
- [ ] Set up automated alerting
- [ ] Prepare forensic tools and procedures

### ✅ Detection
- [ ] Use GuardDuty for threat detection
- [ ] Configure Security Hub for centralized findings
- [ ] Monitor unusual API activity
- [ ] Set up automated response workflows

## 7. Compliance and Governance

### ✅ Resource Tagging
- [ ] Implement consistent tagging strategy
- [ ] Tag resources for cost allocation
- [ ] Use tags for automation
- [ ] Regular tag compliance audits

### ✅ Cost Management
- [ ] Set up billing alerts
- [ ] Use Cost Explorer for analysis
- [ ] Implement resource scheduling
- [ ] Regular cost optimization reviews

## Sample IAM Policy - Least Privilege
\`\`\`json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem"
      ],
      "Resource": "arn:aws:dynamodb:us-east-1:123456789012:table/MyTable"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": "arn:aws:s3:::my-bucket/*"
    }
  ]
}
\`\`\`

## Security Group Example
\`\`\`json
{
  "GroupDescription": "Web server security group",
  "SecurityGroupRules": [
    {
      "IpPermissions": [
        {
          "IpProtocol": "tcp",
          "FromPort": 443,
          "ToPort": 443,
          "IpRanges": [{"CidrIp": "0.0.0.0/0"}],
          "Description": "HTTPS access"
        },
        {
          "IpProtocol": "tcp",
          "FromPort": 22,
          "ToPort": 22,
          "IpRanges": [{"CidrIp": "10.0.0.0/8"}],
          "Description": "SSH from private network"
        }
      ]
    }
  ]
}
\`\`\`

## CloudWatch Alarm Example
\`\`\`yaml
HighErrorRateAlarm:
  Type: AWS::CloudWatch::Alarm
  Properties:
    AlarmDescription: High error rate detected
    MetricName: 4XXError
    Namespace: AWS/ApiGateway
    Statistic: Sum
    Period: 300
    EvaluationPeriods: 2
    Threshold: 10
    ComparisonOperator: GreaterThanThreshold
    AlarmActions:
      - !Ref SNSTopicArn
\`\`\`

Remember: Security is not a one-time setup, it's an ongoing process that requires regular reviews and updates!`,
        tags: ["aws", "security", "iam", "vpc", "compliance", "best-practices"],
        isPublic: true,
        isPremium: false,
        views: Math.floor(Math.random() * 150) + 75,
        downloads: Math.floor(Math.random() * 60) + 30,
        rating: 4.6,
        authorId: user.id
      },

      {
        title: "Common AWS Backend Interview Questions",
        description: "Collection of frequently asked AWS interview questions for backend developers with detailed answers and explanations.",
        type: "coding-question",
        category: "Backend",
        difficulty: "medium",
        content: `# Common AWS Backend Interview Questions

## 1. EC2 and Compute Services

### Q: Explain the difference between vertical and horizontal scaling in AWS.
**Answer:**
- **Vertical Scaling (Scale Up)**: Increasing the size/capacity of existing instances
  - Example: t3.micro → t3.large
  - Pros: Simple, no architecture changes
  - Cons: Limited by instance size, single point of failure

- **Horizontal Scaling (Scale Out)**: Adding more instances
  - Example: 1 instance → 5 instances
  - Pros: Better fault tolerance, unlimited scaling potential
  - Cons: Requires load balancing, more complex architecture

### Q: How would you handle sudden traffic spikes?
**Answer:**
1. **Auto Scaling Groups**: Automatically add/remove instances based on metrics
2. **Application Load Balancer**: Distribute traffic across instances
3. **CloudFront CDN**: Cache static content at edge locations
4. **ElastiCache**: Cache frequently accessed data
5. **Lambda**: Handle spikes with serverless architecture

\`\`\`yaml
# Auto Scaling Configuration
AutoScalingGroup:
  Type: AWS::AutoScaling::AutoScalingGroup
  Properties:
    MinSize: 2
    MaxSize: 10
    DesiredCapacity: 2
    TargetGroupARNs:
      - !Ref ALBTargetGroup
    HealthCheckType: ELB
    HealthCheckGracePeriod: 300
\`\`\`

## 2. Database Questions

### Q: When would you choose DynamoDB over RDS?
**Answer:**
Choose **DynamoDB** when:
- Need single-digit millisecond latency
- Unpredictable workloads requiring auto-scaling
- Simple query patterns (key-value or simple queries)
- Serverless applications
- Global distribution needed

Choose **RDS** when:
- Complex queries and transactions needed
- ACID compliance required
- Existing SQL-based applications
- Complex relationships between data
- Reporting and analytics workloads

### Q: How do you optimize database performance in AWS?
**Answer:**
1. **Read Replicas**: Offload read traffic
2. **Connection Pooling**: Reduce connection overhead
3. **Indexing**: Optimize query performance
4. **Caching**: Use ElastiCache for frequently accessed data
5. **Partitioning**: Distribute data across multiple databases
6. **Parameter Tuning**: Optimize database configuration

\`\`\`javascript
// Connection pooling example
const mysql = require('mysql2');
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000
});
\`\`\`

## 3. Serverless and Lambda

### Q: What are Lambda cold starts and how do you minimize them?
**Answer:**
**Cold Start**: Delay when Lambda initializes a new execution environment

**Minimization Strategies:**
1. **Provisioned Concurrency**: Keep functions warm
2. **Optimize Package Size**: Smaller deployment packages
3. **Use Layers**: Share common code across functions
4. **Connection Reuse**: Keep database connections alive
5. **Choose Runtime Wisely**: Node.js and Python have faster cold starts

\`\`\`javascript
// Optimize Lambda for cold starts
const AWS = require('aws-sdk');

// Initialize outside handler (reused across invocations)
const dynamodb = new AWS.DynamoDB.DocumentClient();
let dbConnection;

exports.handler = async (event) => {
    // Reuse connection if available
    if (!dbConnection) {
        dbConnection = await initializeDbConnection();
    }
    
    // Your function logic here
    return { statusCode: 200, body: 'Success' };
};
\`\`\`

### Q: How do you handle errors in Lambda functions?
**Answer:**
1. **Try-Catch Blocks**: Handle synchronous errors
2. **Dead Letter Queues**: Handle failed async invocations
3. **Retry Logic**: Implement exponential backoff
4. **Circuit Breaker Pattern**: Prevent cascading failures
5. **CloudWatch Alarms**: Monitor error rates

## 4. Security Questions

### Q: How do you secure API endpoints in AWS?
**Answer:**
1. **API Gateway**: Use authorizers (Lambda, Cognito)
2. **WAF**: Filter malicious requests
3. **Rate Limiting**: Prevent abuse
4. **HTTPS Only**: Encrypt data in transit
5. **API Keys**: Control access to APIs
6. **CORS Configuration**: Control cross-origin requests

\`\`\`javascript
// Lambda authorizer example
exports.authorize = async (event) => {
    const token = event.authorizationToken;
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return generatePolicy(decoded.sub, 'Allow', event.methodArn);
    } catch (error) {
        return generatePolicy('user', 'Deny', event.methodArn);
    }
};

function generatePolicy(principalId, effect, resource) {
    return {
        principalId,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [{
                Action: 'execute-api:Invoke',
                Effect: effect,
                Resource: resource
            }]
        }
    };
}
\`\`\`

### Q: Explain IAM roles vs IAM users.
**Answer:**
**IAM Users:**
- Long-term credentials
- For human users or specific applications
- Access keys for programmatic access

**IAM Roles:**
- Temporary credentials
- Assumed by AWS services or federated users
- No long-term credentials stored
- Better security practice for applications

## 5. Architecture and Design

### Q: Design a URL shortener service like bit.ly on AWS.
**Answer:**
**Components:**
1. **API Gateway + Lambda**: Handle requests
2. **DynamoDB**: Store URL mappings
3. **CloudFront**: Cache popular URLs
4. **S3**: Store analytics data
5. **SQS**: Async processing for analytics

\`\`\`javascript
// URL shortener Lambda function
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const { httpMethod, pathParameters } = event;
    
    if (httpMethod === 'POST') {
        // Create short URL
        const { longUrl } = JSON.parse(event.body);
        const shortCode = generateShortCode();
        
        await dynamodb.put({
            TableName: 'urls',
            Item: {
                shortCode,
                longUrl,
                createdAt: new Date().toISOString(),
                clickCount: 0
            }
        }).promise();
        
        return {
            statusCode: 201,
            body: JSON.stringify({ shortUrl: \`https://short.ly/\${shortCode}\` })
        };
    }
    
    if (httpMethod === 'GET') {
        // Redirect to long URL
        const { shortCode } = pathParameters;
        
        const result = await dynamodb.get({
            TableName: 'urls',
            Key: { shortCode }
        }).promise();
        
        if (!result.Item) {
            return { statusCode: 404, body: 'URL not found' };
        }
        
        // Increment click count (async)
        await incrementClickCount(shortCode);
        
        return {
            statusCode: 301,
            headers: { Location: result.Item.longUrl }
        };
    }
};
\`\`\`

## 6. Monitoring and Troubleshooting

### Q: How do you troubleshoot performance issues in AWS?
**Answer:**
1. **CloudWatch Metrics**: Monitor CPU, memory, network
2. **Application Performance Monitoring**: Use X-Ray for distributed tracing
3. **Database Performance**: Use Performance Insights for RDS
4. **Load Testing**: Simulate traffic to identify bottlenecks
5. **Log Analysis**: Use CloudWatch Logs Insights

### Q: How do you implement blue-green deployment on AWS?
**Answer:**
1. **Route 53**: Use weighted routing for traffic shifting
2. **Load Balancer**: Switch target groups
3. **Auto Scaling**: Deploy to new Auto Scaling Groups
4. **Lambda**: Use aliases and versions
5. **CodeDeploy**: Automate deployment process

## 7. Cost Optimization

### Q: How do you optimize AWS costs for a backend application?
**Answer:**
1. **Right-sizing**: Choose appropriate instance types
2. **Reserved Instances**: For predictable workloads
3. **Spot Instances**: For fault-tolerant applications
4. **Auto Scaling**: Scale down during low usage
5. **S3 Intelligent Tiering**: Automatic storage optimization
6. **Lambda**: Pay per execution instead of always-on servers

Remember to always ask follow-up questions and explain your reasoning during interviews!`,
        tags: ["aws", "interview", "backend", "questions", "preparation"],
        isPublic: true,
        isPremium: false,
        views: Math.floor(Math.random() * 400) + 200,
        downloads: Math.floor(Math.random() * 100) + 50,
        rating: 4.9,
        authorId: user.id
      }
    ];

    // Create all resources
    for (let i = 0; i < resources.length; i++) {
      const resource = resources[i];
      console.log(`📝 Creating resource ${i + 1}/${resources.length}: ${resource.title}`);
      
      await prisma.interviewResource.create({
        data: resource
      });
      
      console.log(`✅ Created: ${resource.title}`);
    }

    console.log('🎉 Successfully created all AWS Backend Interview Resources!');
    console.log(`📊 Created ${resources.length} resources total`);

  } catch (error) {
    console.error('❌ Error creating interview resources:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAWSBackendInterviewResources();
