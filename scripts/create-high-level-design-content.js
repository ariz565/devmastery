const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const highLevelDesignContent = {
  blogs: [
    {
      title: "High Level System Design: Scalable Architecture Patterns",
      content: `# Scalable Architecture Patterns for High-Level System Design

Building scalable systems requires understanding various architectural patterns and knowing when to apply them. This guide covers essential patterns for designing large-scale distributed systems.

## 1. Microservices Architecture

### Overview
Microservices architecture breaks down applications into small, independent services that communicate over well-defined APIs.

### Key Characteristics
- **Single Responsibility**: Each service handles one business capability
- **Independent Deployment**: Services can be deployed independently
- **Technology Diversity**: Different services can use different technologies
- **Fault Isolation**: Failure in one service doesn't bring down the entire system

### Example Architecture
\`\`\`
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   User      │    │   Order     │    │   Payment   │
│   Service   │    │   Service   │    │   Service   │
└─────────────┘    └─────────────┘    └─────────────┘
      │                    │                    │
      └────────────────────┼────────────────────┘
                          │
                  ┌─────────────┐
                  │  API Gateway │
                  └─────────────┘
                          │
                  ┌─────────────┐
                  │   Client    │
                  └─────────────┘
\`\`\`

### Benefits
- **Scalability**: Scale individual services based on demand
- **Flexibility**: Use different technologies for different services
- **Team Independence**: Teams can work on services independently
- **Fault Tolerance**: Isolated failures

### Challenges
- **Complexity**: Distributed system complexity
- **Network Latency**: Inter-service communication overhead
- **Data Consistency**: Managing transactions across services
- **Monitoring**: Need for distributed tracing and monitoring

### Best Practices
\`\`\`yaml
Service Design:
  - Single business capability per service
  - Database per service
  - API-first design
  - Stateless services

Communication:
  - Synchronous: REST APIs, GraphQL
  - Asynchronous: Message queues, Event streaming
  - Circuit breakers for fault tolerance
  - Service mesh for communication management
\`\`\`

## 2. Event-Driven Architecture

### Overview
Event-driven architecture uses events to trigger and communicate between decoupled services.

### Core Components
1. **Event Producers**: Generate events
2. **Event Router**: Routes events to consumers
3. **Event Consumers**: Process events
4. **Event Store**: Stores events for replay

### Event Patterns

#### Pub/Sub Pattern
\`\`\`
┌─────────────┐    Events    ┌─────────────┐
│  Publisher  │─────────────▶│   Broker    │
└─────────────┘              └─────────────┘
                                    │
                              ┌─────┴─────┐
                              ▼           ▼
                      ┌─────────────┐ ┌─────────────┐
                      │ Subscriber1 │ │ Subscriber2 │
                      └─────────────┘ └─────────────┘
\`\`\`

#### Event Sourcing
\`\`\`
┌─────────────┐    Commands    ┌─────────────┐
│   Client    │───────────────▶│  Command    │
└─────────────┘                │  Handler    │
                               └─────────────┘
                                      │
                                      ▼
                               ┌─────────────┐
                               │ Event Store │
                               └─────────────┘
                                      │
                                      ▼
                               ┌─────────────┐
                               │ Event Stream│
                               └─────────────┘
\`\`\`

### Implementation Example
\`\`\`java
// Event
public class OrderCreatedEvent {
    private String orderId;
    private String customerId;
    private BigDecimal amount;
    private LocalDateTime timestamp;
    
    // constructors, getters, setters
}

// Event Publisher
@Service
public class OrderService {
    @Autowired
    private EventPublisher eventPublisher;
    
    public void createOrder(Order order) {
        // Save order to database
        orderRepository.save(order);
        
        // Publish event
        OrderCreatedEvent event = new OrderCreatedEvent(
            order.getId(),
            order.getCustomerId(),
            order.getAmount(),
            LocalDateTime.now()
        );
        eventPublisher.publish(event);
    }
}

// Event Consumer
@Component
public class PaymentService {
    @EventListener
    public void handleOrderCreated(OrderCreatedEvent event) {
        // Process payment
        Payment payment = new Payment(
            event.getOrderId(),
            event.getAmount()
        );
        processPayment(payment);
    }
}
\`\`\`

## 3. CQRS (Command Query Responsibility Segregation)

### Overview
CQRS separates read and write operations into different models, optimizing each for their specific use case.

### Architecture
\`\`\`
┌─────────────┐    Commands    ┌─────────────┐
│   Client    │───────────────▶│  Command    │
└─────────────┘                │   Model     │
      │                        └─────────────┘
      │                               │
      │ Queries                       ▼
      │                        ┌─────────────┐
      └───────────────────────▶│    Query    │
                               │    Model    │
                               └─────────────┘
\`\`\`

### Benefits
- **Performance**: Optimize reads and writes separately
- **Scalability**: Scale read and write sides independently
- **Flexibility**: Different data models for different needs
- **Security**: Separate security concerns

### Implementation
\`\`\`java
// Command Side
public class CreateOrderCommand {
    private String customerId;
    private List<OrderItem> items;
    // getters, setters
}

@Service
public class OrderCommandHandler {
    public void handle(CreateOrderCommand command) {
        Order order = new Order(command.getCustomerId(), command.getItems());
        orderRepository.save(order);
        
        // Publish event for read side
        eventPublisher.publish(new OrderCreatedEvent(order));
    }
}

// Query Side
public class OrderSummaryQuery {
    private String customerId;
    private LocalDate fromDate;
    private LocalDate toDate;
    // getters, setters
}

@Service
public class OrderQueryHandler {
    public List<OrderSummary> handle(OrderSummaryQuery query) {
        return orderReadRepository.findOrderSummaries(
            query.getCustomerId(),
            query.getFromDate(),
            query.getToDate()
        );
    }
}
\`\`\`

## 4. Database Patterns

### Database per Service
Each microservice owns its data and database.

### Shared Database Anti-Pattern
Multiple services sharing a database creates tight coupling.

### Saga Pattern
Manages distributed transactions across multiple services.

\`\`\`java
// Choreography-based Saga
public class OrderSaga {
    @EventListener
    public void handleOrderCreated(OrderCreatedEvent event) {
        // Reserve inventory
        inventoryService.reserveItems(event.getOrderId(), event.getItems());
    }
    
    @EventListener
    public void handleInventoryReserved(InventoryReservedEvent event) {
        // Process payment
        paymentService.processPayment(event.getOrderId(), event.getAmount());
    }
    
    @EventListener
    public void handlePaymentFailed(PaymentFailedEvent event) {
        // Compensate - release inventory
        inventoryService.releaseItems(event.getOrderId());
    }
}
\`\`\`

## 5. Caching Patterns

### Cache-Aside (Lazy Loading)
\`\`\`java
public User getUser(String userId) {
    // Check cache first
    User user = cache.get(userId);
    if (user == null) {
        // Load from database
        user = userRepository.findById(userId);
        // Store in cache
        cache.put(userId, user);
    }
    return user;
}
\`\`\`

### Write-Through
\`\`\`java
public void updateUser(User user) {
    // Update database
    userRepository.save(user);
    // Update cache
    cache.put(user.getId(), user);
}
\`\`\`

### Write-Behind (Write-Back)
\`\`\`java
public void updateUser(User user) {
    // Update cache immediately
    cache.put(user.getId(), user);
    // Schedule database update
    asyncDatabaseUpdater.schedule(user);
}
\`\`\`

## 6. Load Balancing Patterns

### Round Robin
Distribute requests evenly across servers.

### Least Connections
Route to server with fewest active connections.

### Weighted Round Robin
Assign weights based on server capacity.

### Health Check-Based
Only route to healthy servers.

## 7. API Gateway Pattern

### Responsibilities
- **Request Routing**: Route requests to appropriate services
- **Authentication**: Centralized authentication
- **Rate Limiting**: Protect backend services
- **Response Aggregation**: Combine multiple service responses
- **Protocol Translation**: HTTP to gRPC, etc.

### Example Implementation
\`\`\`java
@RestController
public class ApiGateway {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private OrderService orderService;
    
    @GetMapping("/api/user/{id}/profile")
    public UserProfile getUserProfile(@PathVariable String id) {
        // Aggregate data from multiple services
        User user = userService.getUser(id);
        List<Order> orders = orderService.getUserOrders(id);
        
        return new UserProfile(user, orders);
    }
}
\`\`\`

## Best Practices for Scalable Architecture

### 1. Design for Failure
- Implement circuit breakers
- Use bulkhead patterns
- Plan for graceful degradation

### 2. Monitoring and Observability
- Distributed tracing
- Centralized logging
- Metrics and alerting
- Health checks

### 3. Data Management
- Choose appropriate consistency models
- Implement proper backup strategies
- Plan for data migration
- Use appropriate database types

### 4. Security
- Zero-trust architecture
- API security (OAuth, JWT)
- Service-to-service authentication
- Encryption in transit and at rest

### 5. Performance
- Async processing where possible
- Proper caching strategies
- Connection pooling
- Resource optimization

## Conclusion

Scalable architecture patterns provide proven solutions for building large-scale distributed systems. The key is understanding when and how to apply each pattern based on your specific requirements, constraints, and trade-offs.

Remember: There's no one-size-fits-all solution. The best architecture is one that meets your current needs while allowing for future growth and evolution.`,
      excerpt:
        "Learn essential architectural patterns for building scalable distributed systems including microservices, event-driven architecture, and CQRS.",
      tags: [
        "High Level Design",
        "Microservices",
        "Scalability",
        "Architecture",
        "Distributed Systems",
      ],
      category: "System Design",
      readTime: 25,
      publishedAt: new Date("2024-01-25"),
    },
  ],
};

async function createHighLevelDesignContent() {
  try {
    console.log("Creating High Level System Design content...");

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

    // Find High Level Design subtopic
    const highLevelSubtopic = await prisma.subTopic.findFirst({
      where: {
        name: "High Level Design",
        topicId: systemDesignTopic.id,
      },
    });

    if (!highLevelSubtopic) {
      console.error("High Level Design subtopic not found!");
      return;
    }

    // Create blogs
    for (const blogData of highLevelDesignContent.blogs) {
      // Check if blog already exists
      const existingBlog = await prisma.blog.findFirst({
        where: {
          title: blogData.title,
          authorId: authorId,
        },
      });

      if (existingBlog) {
        console.log(`Blog already exists: ${blogData.title}`);
        continue;
      }
      const blog = await prisma.blog.create({
        data: {
          ...blogData,
          authorId: authorId,
          topicId: systemDesignTopic.id,
          subTopicId: highLevelSubtopic.id,
        },
      });

      console.log(`Created blog: ${blog.title}`);
    }

    console.log(
      "High Level System Design content creation completed successfully!"
    );
  } catch (error) {
    console.error("Error creating High Level System Design content:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createHighLevelDesignContent();
