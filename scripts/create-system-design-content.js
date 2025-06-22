const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const systemDesignContent = {
  // Low Level Design Blog Posts
  blogs: [
    {
      title: "Object-Oriented Design Principles: SOLID Principles Explained",
      slug: "solid-principles-oop-design",
      content: `# SOLID Principles in Object-Oriented Design

The SOLID principles are five design principles intended to make software designs more understandable, flexible, and maintainable. These principles form the foundation of clean, well-structured object-oriented code.

## 1. Single Responsibility Principle (SRP)

**Definition**: A class should have only one reason to change, meaning it should have only one job or responsibility.

### Example: Violating SRP
\`\`\`java
// BAD: This class has multiple responsibilities
public class User {
    private String name;
    private String email;
    
    // User data management
    public void setName(String name) { this.name = name; }
    public void setEmail(String email) { this.email = email; }
    
    // Database operations
    public void saveToDatabase() {
        // Database saving logic
    }
    
    // Email operations
    public void sendEmail(String message) {
        // Email sending logic
    }
    
    // Validation
    public boolean validateEmail() {
        // Email validation logic
        return email.contains("@");
    }
}
\`\`\`

### Example: Following SRP
\`\`\`java
// GOOD: Separated responsibilities
public class User {
    private String name;
    private String email;
    
    // Only user data management
    public void setName(String name) { this.name = name; }
    public void setEmail(String email) { this.email = email; }
}

public class UserRepository {
    public void save(User user) {
        // Database saving logic
    }
}

public class EmailService {
    public void sendEmail(User user, String message) {
        // Email sending logic
    }
}

public class EmailValidator {
    public boolean isValid(String email) {
        // Email validation logic
        return email.contains("@");
    }
}
\`\`\`

## 2. Open/Closed Principle (OCP)

**Definition**: Software entities should be open for extension but closed for modification.

### Example: Using Strategy Pattern
\`\`\`java
// Interface for payment processing
public interface PaymentProcessor {
    void processPayment(double amount);
}

// Concrete implementations
public class CreditCardProcessor implements PaymentProcessor {
    public void processPayment(double amount) {
        System.out.println("Processing credit card payment: $" + amount);
    }
}

public class PayPalProcessor implements PaymentProcessor {
    public void processPayment(double amount) {
        System.out.println("Processing PayPal payment: $" + amount);
    }
}

// Context class
public class PaymentService {
    private PaymentProcessor processor;
    
    public PaymentService(PaymentProcessor processor) {
        this.processor = processor;
    }
    
    public void makePayment(double amount) {
        processor.processPayment(amount);
    }
}
\`\`\`

## 3. Liskov Substitution Principle (LSP)

**Definition**: Objects of a superclass should be replaceable with objects of its subclasses without breaking the application.

### Example: Proper Inheritance
\`\`\`java
public abstract class Bird {
    public abstract void makeSound();
    public abstract void move();
}

public class Sparrow extends Bird {
    public void makeSound() {
        System.out.println("Chirp chirp");
    }
    
    public void move() {
        System.out.println("Flying");
    }
}

public class Penguin extends Bird {
    public void makeSound() {
        System.out.println("Squawk");
    }
    
    public void move() {
        System.out.println("Swimming/Walking");
    }
}
\`\`\`

## 4. Interface Segregation Principle (ISP)

**Definition**: No client should be forced to depend on methods it does not use.

### Example: Segregated Interfaces
\`\`\`java
// BAD: Fat interface
public interface Worker {
    void work();
    void eat();
    void sleep();
}

// GOOD: Segregated interfaces
public interface Workable {
    void work();
}

public interface Eatable {
    void eat();
}

public interface Sleepable {
    void sleep();
}

// Implementations
public class Human implements Workable, Eatable, Sleepable {
    public void work() { /* implementation */ }
    public void eat() { /* implementation */ }
    public void sleep() { /* implementation */ }
}

public class Robot implements Workable {
    public void work() { /* implementation */ }
    // Robot doesn't need to eat or sleep
}
\`\`\`

## 5. Dependency Inversion Principle (DIP)

**Definition**: High-level modules should not depend on low-level modules. Both should depend on abstractions.

### Example: Dependency Injection
\`\`\`java
// Abstraction
public interface NotificationService {
    void sendNotification(String message);
}

// Low-level modules
public class EmailNotification implements NotificationService {
    public void sendNotification(String message) {
        System.out.println("Email: " + message);
    }
}

public class SMSNotification implements NotificationService {
    public void sendNotification(String message) {
        System.out.println("SMS: " + message);
    }
}

// High-level module
public class OrderService {
    private NotificationService notificationService;
    
    // Dependency injection
    public OrderService(NotificationService notificationService) {
        this.notificationService = notificationService;
    }
    
    public void processOrder() {
        // Process order logic
        notificationService.sendNotification("Order processed successfully");
    }
}
\`\`\`

## Benefits of SOLID Principles

1. **Maintainability**: Code is easier to modify and extend
2. **Testability**: Classes with single responsibilities are easier to test
3. **Flexibility**: Loose coupling allows for easier changes
4. **Reusability**: Well-designed components can be reused
5. **Scalability**: Architecture can grow without major refactoring

## Common Violations and How to Avoid Them

### 1. God Classes
- **Problem**: Classes that do too much
- **Solution**: Break down into smaller, focused classes

### 2. Tight Coupling
- **Problem**: Classes depend directly on concrete implementations
- **Solution**: Use interfaces and dependency injection

### 3. Rigid Hierarchy
- **Problem**: Inheritance used inappropriately
- **Solution**: Favor composition over inheritance

## Conclusion

SOLID principles are fundamental to writing maintainable, scalable, and testable object-oriented code. They help create software that is easier to understand, modify, and extend over time.

Remember: These are guidelines, not rigid rules. Use them judiciously based on your specific context and requirements.`,
      excerpt:
        "Master the SOLID principles of object-oriented design with practical examples and best practices for writing maintainable code.",
      tags: [
        "Low Level Design",
        "OOP",
        "SOLID",
        "Design Patterns",
        "Software Architecture",
      ],
      category: "System Design",
      readTime: 12,
      featured: true,
      author: "System Design Expert",
      publishedAt: new Date("2024-01-15"),
    },
    {
      title: "Design Patterns: Creational, Structural, and Behavioral Patterns",
      slug: "design-patterns-comprehensive-guide",
      content: `# Design Patterns: A Comprehensive Guide

Design patterns are reusable solutions to commonly occurring problems in software design. They represent best practices and provide a shared vocabulary for developers.

## Creational Patterns

### 1. Singleton Pattern

**Purpose**: Ensure a class has only one instance and provide global access to it.

\`\`\`java
public class DatabaseConnection {
    private static DatabaseConnection instance;
    private static final Object lock = new Object();
    
    private DatabaseConnection() {
        // Private constructor
    }
    
    public static DatabaseConnection getInstance() {
        if (instance == null) {
            synchronized (lock) {
                if (instance == null) {
                    instance = new DatabaseConnection();
                }
            }
        }
        return instance;
    }
    
    public void connect() {
        System.out.println("Connecting to database...");
    }
}
\`\`\`

**Use Cases**: Database connections, logging, configuration settings

### 2. Factory Method Pattern

**Purpose**: Create objects without specifying their exact class.

\`\`\`java
// Product interface
public interface Vehicle {
    void start();
}

// Concrete products
public class Car implements Vehicle {
    public void start() {
        System.out.println("Car engine started");
    }
}

public class Motorcycle implements Vehicle {
    public void start() {
        System.out.println("Motorcycle engine started");
    }
}

// Factory
public class VehicleFactory {
    public static Vehicle createVehicle(String type) {
        switch (type.toLowerCase()) {
            case "car":
                return new Car();
            case "motorcycle":
                return new Motorcycle();
            default:
                throw new IllegalArgumentException("Unknown vehicle type");
        }
    }
}
\`\`\`

### 3. Builder Pattern

**Purpose**: Construct complex objects step by step.

\`\`\`java
public class Computer {
    private String CPU;
    private String GPU;
    private int RAM;
    private int storage;
    
    private Computer(Builder builder) {
        this.CPU = builder.CPU;
        this.GPU = builder.GPU;
        this.RAM = builder.RAM;
        this.storage = builder.storage;
    }
    
    public static class Builder {
        private String CPU;
        private String GPU;
        private int RAM;
        private int storage;
        
        public Builder setCPU(String CPU) {
            this.CPU = CPU;
            return this;
        }
        
        public Builder setGPU(String GPU) {
            this.GPU = GPU;
            return this;
        }
        
        public Builder setRAM(int RAM) {
            this.RAM = RAM;
            return this;
        }
        
        public Builder setStorage(int storage) {
            this.storage = storage;
            return this;
        }
        
        public Computer build() {
            return new Computer(this);
        }
    }
}

// Usage
Computer computer = new Computer.Builder()
    .setCPU("Intel i7")
    .setGPU("RTX 3080")
    .setRAM(32)
    .setStorage(1000)
    .build();
\`\`\`

## Structural Patterns

### 1. Adapter Pattern

**Purpose**: Allow incompatible interfaces to work together.

\`\`\`java
// Target interface
public interface MediaPlayer {
    void play(String audioType, String fileName);
}

// Adaptee
public class AdvancedMediaPlayer {
    public void playVlc(String fileName) {
        System.out.println("Playing vlc file: " + fileName);
    }
    
    public void playMp4(String fileName) {
        System.out.println("Playing mp4 file: " + fileName);
    }
}

// Adapter
public class MediaAdapter implements MediaPlayer {
    private AdvancedMediaPlayer advancedPlayer;
    
    public MediaAdapter(String audioType) {
        if (audioType.equalsIgnoreCase("vlc") || audioType.equalsIgnoreCase("mp4")) {
            advancedPlayer = new AdvancedMediaPlayer();
        }
    }
    
    public void play(String audioType, String fileName) {
        if (audioType.equalsIgnoreCase("vlc")) {
            advancedPlayer.playVlc(fileName);
        } else if (audioType.equalsIgnoreCase("mp4")) {
            advancedPlayer.playMp4(fileName);
        }
    }
}
\`\`\`

### 2. Decorator Pattern

**Purpose**: Add new functionality to objects dynamically without altering their structure.

\`\`\`java
// Component interface
public interface Coffee {
    String getDescription();
    double getCost();
}

// Concrete component
public class SimpleCoffee implements Coffee {
    public String getDescription() {
        return "Simple coffee";
    }
    
    public double getCost() {
        return 2.0;
    }
}

// Decorator
public abstract class CoffeeDecorator implements Coffee {
    protected Coffee coffee;
    
    public CoffeeDecorator(Coffee coffee) {
        this.coffee = coffee;
    }
    
    public String getDescription() {
        return coffee.getDescription();
    }
    
    public double getCost() {
        return coffee.getCost();
    }
}

// Concrete decorators
public class MilkDecorator extends CoffeeDecorator {
    public MilkDecorator(Coffee coffee) {
        super(coffee);
    }
    
    public String getDescription() {
        return coffee.getDescription() + ", milk";
    }
    
    public double getCost() {
        return coffee.getCost() + 0.5;
    }
}

public class SugarDecorator extends CoffeeDecorator {
    public SugarDecorator(Coffee coffee) {
        super(coffee);
    }
    
    public String getDescription() {
        return coffee.getDescription() + ", sugar";
    }
    
    public double getCost() {
        return coffee.getCost() + 0.2;
    }
}
\`\`\`

## Behavioral Patterns

### 1. Observer Pattern

**Purpose**: Define a one-to-many dependency between objects.

\`\`\`java
import java.util.*;

// Subject interface
public interface Subject {
    void registerObserver(Observer observer);
    void removeObserver(Observer observer);
    void notifyObservers();
}

// Observer interface
public interface Observer {
    void update(String news);
}

// Concrete subject
public class NewsAgency implements Subject {
    private List<Observer> observers;
    private String news;
    
    public NewsAgency() {
        this.observers = new ArrayList<>();
    }
    
    public void registerObserver(Observer observer) {
        observers.add(observer);
    }
    
    public void removeObserver(Observer observer) {
        observers.remove(observer);
    }
    
    public void notifyObservers() {
        for (Observer observer : observers) {
            observer.update(news);
        }
    }
    
    public void setNews(String news) {
        this.news = news;
        notifyObservers();
    }
}

// Concrete observer
public class NewsChannel implements Observer {
    private String name;
    
    public NewsChannel(String name) {
        this.name = name;
    }
    
    public void update(String news) {
        System.out.println(name + " received news: " + news);
    }
}
\`\`\`

### 2. Strategy Pattern

**Purpose**: Define a family of algorithms and make them interchangeable.

\`\`\`java
// Strategy interface
public interface SortingStrategy {
    void sort(int[] array);
}

// Concrete strategies
public class BubbleSort implements SortingStrategy {
    public void sort(int[] array) {
        // Bubble sort implementation
        System.out.println("Sorting using bubble sort");
    }
}

public class QuickSort implements SortingStrategy {
    public void sort(int[] array) {
        // Quick sort implementation
        System.out.println("Sorting using quick sort");
    }
}

// Context
public class SortContext {
    private SortingStrategy strategy;
    
    public SortContext(SortingStrategy strategy) {
        this.strategy = strategy;
    }
    
    public void setStrategy(SortingStrategy strategy) {
        this.strategy = strategy;
    }
    
    public void executeSort(int[] array) {
        strategy.sort(array);
    }
}
\`\`\`

## When to Use Design Patterns

1. **Singleton**: When you need exactly one instance (database connections, loggers)
2. **Factory**: When object creation is complex or needs to be centralized
3. **Builder**: When constructing complex objects with many optional parameters
4. **Adapter**: When integrating with legacy code or third-party libraries
5. **Decorator**: When you need to add functionality dynamically
6. **Observer**: When you need loose coupling between subjects and observers
7. **Strategy**: When you have multiple ways to perform a task

## Best Practices

1. **Don't overuse patterns**: Apply them when they solve a real problem
2. **Understand the problem first**: Choose the right pattern for the context
3. **Keep it simple**: Don't add unnecessary complexity
4. **Consider alternatives**: Sometimes a simple solution is better

## Conclusion

Design patterns are powerful tools that help create flexible, maintainable, and reusable code. Understanding when and how to apply them is crucial for effective software design.`,
      excerpt:
        "Comprehensive guide to design patterns including creational, structural, and behavioral patterns with practical examples.",
      tags: [
        "Design Patterns",
        "Low Level Design",
        "Software Architecture",
        "OOP",
      ],
      category: "System Design",
      readTime: 18,
      featured: true,
      author: "Design Patterns Expert",
      publishedAt: new Date("2024-01-20"),
    },
    {
      title: "High Level System Design: Scalable Architecture Patterns",
      slug: "scalable-architecture-patterns",
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
      featured: true,
      author: "System Architect",
      publishedAt: new Date("2024-01-25"),
    },
  ],

  // System Design Notes
  notes: [
    {
      title: "System Design Interview Checklist",
      slug: "system-design-interview-checklist",
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
      excerpt:
        "Complete checklist for system design interviews covering requirements gathering, capacity estimation, and detailed design.",
      tags: ["System Design", "Interview Prep", "Checklist", "Architecture"],
      category: "System Design",
      readTime: 8,
      featured: true,
      author: "Interview Expert",
      publishedAt: new Date("2024-01-10"),
    },
    {
      title: "Database Design Fundamentals",
      slug: "database-design-fundamentals",
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

## 5. Schema Design Patterns

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

### Polymorphic Associations
\`\`\`sql
-- Comments can belong to posts or photos
CREATE TABLE comments (
    id INT PRIMARY KEY,
    content TEXT,
    commentable_type VARCHAR(50),  -- 'Post' or 'Photo'
    commentable_id INT,
    user_id INT,
    created_at TIMESTAMP
);

-- Better approach: Separate tables
CREATE TABLE post_comments (
    id INT PRIMARY KEY,
    post_id INT,
    user_id INT,
    content TEXT,
    created_at TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id)
);

CREATE TABLE photo_comments (
    id INT PRIMARY KEY,
    photo_id INT,
    user_id INT,
    content TEXT,
    created_at TIMESTAMP,
    FOREIGN KEY (photo_id) REFERENCES photos(id)
);
\`\`\`

## 6. Performance Optimization

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

-- Update denormalized data with triggers or application logic
\`\`\`

### Partitioning
\`\`\`sql
-- Horizontal partitioning by date (MySQL)
CREATE TABLE orders (
    id INT,
    customer_id INT,
    created_at DATE,
    total_amount DECIMAL(10,2)
)
PARTITION BY RANGE (YEAR(created_at)) (
    PARTITION p2022 VALUES LESS THAN (2023),
    PARTITION p2023 VALUES LESS THAN (2024),
    PARTITION p2024 VALUES LESS THAN (2025),
    PARTITION future VALUES LESS THAN MAXVALUE
);
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

## 8. Common Design Patterns

### Tree Structures
\`\`\`sql
-- Adjacency List (simple but limited)
CREATE TABLE categories (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    parent_id INT,
    FOREIGN KEY (parent_id) REFERENCES categories(id)
);

-- Nested Set Model (complex but efficient for reads)
CREATE TABLE categories (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    lft INT,
    rgt INT
);
\`\`\`

### Many-to-Many with Attributes
\`\`\`sql
-- Simple many-to-many
CREATE TABLE user_roles (
    user_id INT,
    role_id INT,
    PRIMARY KEY (user_id, role_id)
);

-- Many-to-many with additional attributes
CREATE TABLE user_roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    role_id INT,
    granted_by INT,
    granted_at TIMESTAMP,
    expires_at TIMESTAMP,
    UNIQUE KEY uk_user_role (user_id, role_id)
);
\`\`\`

## 9. Security Considerations

### Data Protection
\`\`\`sql
-- Encrypt sensitive data
CREATE TABLE users (
    id INT PRIMARY KEY,
    username VARCHAR(50),
    password_hash VARCHAR(255),  -- Never store plain passwords
    ssn VARBINARY(255),          -- Encrypted field
    created_at TIMESTAMP
);

-- Use views to hide sensitive data
CREATE VIEW user_public AS
SELECT id, username, created_at
FROM users;
\`\`\`

### Access Control
\`\`\`sql
-- Row-level security (PostgreSQL)
CREATE POLICY user_policy ON orders
FOR ALL TO application_user
USING (customer_id = current_user_id());

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
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

1. **Over-normalization**: Don't normalize beyond what's practical
2. **Under-indexing**: Missing indexes on frequently queried columns
3. **Over-indexing**: Too many indexes slow down writes
4. **Ignoring Constraints**: Letting bad data into the database
5. **Poor Naming**: Unclear or inconsistent naming conventions
6. **Missing Documentation**: Undocumented business rules and relationships
7. **No Performance Testing**: Not testing with realistic data volumes`,
      excerpt:
        "Comprehensive guide to database design covering ER modeling, normalization, indexing, and performance optimization.",
      tags: [
        "Database Design",
        "SQL",
        "Normalization",
        "Performance",
        "Schema Design",
      ],
      category: "System Design",
      readTime: 15,
      featured: false,
      author: "Database Expert",
      publishedAt: new Date("2024-01-12"),
    },
  ],
};

async function createSystemDesignContent() {
  try {
    console.log("Creating System Design content...");

    // Find System Design topic and subtopics
    const systemDesignTopic = await prisma.topic.findFirst({
      where: { slug: "system-design" },
      include: { subTopics: true },
    });

    if (!systemDesignTopic) {
      console.error("System Design topic not found");
      return;
    }

    const lowLevelSubtopic = systemDesignTopic.subTopics.find(
      (st) => st.slug === "low-level-design"
    );
    const highLevelSubtopic = systemDesignTopic.subTopics.find(
      (st) => st.slug === "high-level-design"
    );

    if (!lowLevelSubtopic || !highLevelSubtopic) {
      console.error("Required subtopics not found");
      return;
    }

    // Create blogs
    for (const blogData of systemDesignContent.blogs) {
      const subtopicId = blogData.tags.includes("Low Level Design")
        ? lowLevelSubtopic.id
        : highLevelSubtopic.id;

      // Check if blog already exists
      const existingBlog = await prisma.blog.findFirst({
        where: { slug: blogData.slug },
      });
      if (existingBlog) {
        console.log(`Blog already exists: ${blogData.title}`);
        continue;
      }

      const blog = await prisma.blog.create({
        data: {
          ...blogData,
          topicId: systemDesignTopic.id,
          subtopicId: subtopicId,
          imageUrl: `https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop`,
        },
      });

      console.log(`Created blog: ${blog.title}`);
    }

    // Create notes
    for (const noteData of systemDesignContent.notes) {
      // Check if note already exists
      const existingNote = await prisma.note.findFirst({
        where: { slug: noteData.slug },
      });
      if (existingNote) {
        console.log(`Note already exists: ${noteData.title}`);
        continue;
      }

      const note = await prisma.note.create({
        data: {
          ...noteData,
          topicId: systemDesignTopic.id,
          subtopicId: lowLevelSubtopic.id, // Default to low-level design
          imageUrl: `https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop`,
        },
      });

      console.log(`Created note: ${note.title}`);
    }

    console.log("System Design content creation completed successfully!");
  } catch (error) {
    console.error("Error creating System Design content:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createSystemDesignContent();
