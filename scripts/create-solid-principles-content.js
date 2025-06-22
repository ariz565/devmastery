const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const solidPrinciplesContent = {
  blogs: [
    {
      title: "Object-Oriented Design Principles: SOLID Principles Explained",
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
    
    public void setName(String name) { this.name = name; }
    public void setEmail(String email) { this.email = email; }
    public String getName() { return name; }
    public String getEmail() { return email; }
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
    public boolean validate(String email) {
        // Email validation logic
        return email != null && email.contains("@");
    }
}
\`\`\`

## 2. Open/Closed Principle (OCP)

**Definition**: Software entities should be open for extension but closed for modification.

### Example: Violating OCP
\`\`\`java
// BAD: Need to modify existing code to add new shapes
public class AreaCalculator {
    public double calculateArea(Object shape) {
        if (shape instanceof Rectangle) {
            Rectangle rectangle = (Rectangle) shape;
            return rectangle.getWidth() * rectangle.getHeight();
        } else if (shape instanceof Circle) {
            Circle circle = (Circle) shape;
            return Math.PI * circle.getRadius() * circle.getRadius();
        }
        // To add Triangle, we need to modify this method
        return 0;
    }
}
\`\`\`

### Example: Following OCP
\`\`\`java
// GOOD: Can extend without modifying existing code
public interface Shape {
    double calculateArea();
}

public class Rectangle implements Shape {
    private double width, height;
    
    public Rectangle(double width, double height) {
        this.width = width;
        this.height = height;
    }
    
    @Override
    public double calculateArea() {
        return width * height;
    }
}

public class Circle implements Shape {
    private double radius;
    
    public Circle(double radius) {
        this.radius = radius;
    }
    
    @Override
    public double calculateArea() {
        return Math.PI * radius * radius;
    }
}

public class AreaCalculator {
    public double calculateArea(Shape shape) {
        return shape.calculateArea();
    }
}

// Adding new shape doesn't require modifying existing code
public class Triangle implements Shape {
    private double base, height;
    
    public Triangle(double base, double height) {
        this.base = base;
        this.height = height;
    }
    
    @Override
    public double calculateArea() {
        return 0.5 * base * height;
    }
}
\`\`\`

## 3. Liskov Substitution Principle (LSP)

**Definition**: Objects of a superclass should be replaceable with objects of its subclasses without breaking the application.

### Example: Violating LSP
\`\`\`java
// BAD: Subclass changes expected behavior
public class Bird {
    public void fly() {
        System.out.println("Flying...");
    }
}

public class Penguin extends Bird {
    @Override
    public void fly() {
        throw new UnsupportedOperationException("Penguins can't fly!");
    }
}

// This will break when penguin is used
public class BirdWatcher {
    public void makeBirdFly(Bird bird) {
        bird.fly(); // Will throw exception for Penguin
    }
}
\`\`\`

### Example: Following LSP
\`\`\`java
// GOOD: Better abstraction that doesn't violate LSP
public abstract class Bird {
    public abstract void move();
}

public class FlyingBird extends Bird {
    @Override
    public void move() {
        fly();
    }
    
    private void fly() {
        System.out.println("Flying...");
    }
}

public class SwimmingBird extends Bird {
    @Override
    public void move() {
        swim();
    }
    
    private void swim() {
        System.out.println("Swimming...");
    }
}

public class Eagle extends FlyingBird {
    // Inherits flying behavior
}

public class Penguin extends SwimmingBird {
    // Inherits swimming behavior
}
\`\`\`

## 4. Interface Segregation Principle (ISP)

**Definition**: A client should never be forced to implement an interface that it doesn't use.

### Example: Violating ISP
\`\`\`java
// BAD: Fat interface forces implementation of unused methods
public interface Worker {
    void work();
    void eat();
    void sleep();
}

public class HumanWorker implements Worker {
    @Override
    public void work() {
        System.out.println("Human working...");
    }
    
    @Override
    public void eat() {
        System.out.println("Human eating...");
    }
    
    @Override
    public void sleep() {
        System.out.println("Human sleeping...");
    }
}

public class RobotWorker implements Worker {
    @Override
    public void work() {
        System.out.println("Robot working...");
    }
    
    @Override
    public void eat() {
        // Robots don't eat! Forced to implement unused method
        throw new UnsupportedOperationException();
    }
    
    @Override
    public void sleep() {
        // Robots don't sleep! Forced to implement unused method
        throw new UnsupportedOperationException();
    }
}
\`\`\`

### Example: Following ISP
\`\`\`java
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

public class HumanWorker implements Workable, Eatable, Sleepable {
    @Override
    public void work() {
        System.out.println("Human working...");
    }
    
    @Override
    public void eat() {
        System.out.println("Human eating...");
    }
    
    @Override
    public void sleep() {
        System.out.println("Human sleeping...");
    }
}

public class RobotWorker implements Workable {
    @Override
    public void work() {
        System.out.println("Robot working...");
    }
    // Only implements what it needs!
}
\`\`\`

## 5. Dependency Inversion Principle (DIP)

**Definition**: High-level modules should not depend on low-level modules. Both should depend on abstractions.

### Example: Violating DIP
\`\`\`java
// BAD: High-level class depends on low-level implementation
public class MySQLDatabase {
    public void save(String data) {
        System.out.println("Saving to MySQL: " + data);
    }
}

public class UserService {
    private MySQLDatabase database; // Direct dependency on concrete class
    
    public UserService() {
        this.database = new MySQLDatabase(); // Tight coupling
    }
    
    public void saveUser(String userData) {
        database.save(userData);
    }
}
\`\`\`

### Example: Following DIP
\`\`\`java
// GOOD: Depend on abstractions
public interface Database {
    void save(String data);
}

public class MySQLDatabase implements Database {
    @Override
    public void save(String data) {
        System.out.println("Saving to MySQL: " + data);
    }
}

public class PostgreSQLDatabase implements Database {
    @Override
    public void save(String data) {
        System.out.println("Saving to PostgreSQL: " + data);
    }
}

public class UserService {
    private Database database; // Depends on abstraction
    
    public UserService(Database database) { // Dependency injection
        this.database = database;
    }
    
    public void saveUser(String userData) {
        database.save(userData);
    }
}

// Usage
public class Application {
    public static void main(String[] args) {
        Database db = new MySQLDatabase(); // Can easily switch to PostgreSQL
        UserService userService = new UserService(db);
        userService.saveUser("John Doe");
    }
}
\`\`\`

## Benefits of SOLID Principles

### 1. **Maintainability**
- Code is easier to understand and modify
- Changes have minimal impact on other parts

### 2. **Testability**
- Dependencies can be easily mocked
- Unit tests are more focused and reliable

### 3. **Flexibility**
- Easy to extend functionality
- Simple to swap implementations

### 4. **Reusability**
- Components can be reused in different contexts
- Abstractions promote code reuse

## Common Anti-Patterns to Avoid

### 1. **God Class**
Violates SRP by having too many responsibilities.

### 2. **Tight Coupling**
Violates DIP by depending on concrete implementations.

### 3. **Fat Interfaces**
Violates ISP by forcing unnecessary method implementations.

### 4. **Inheritance Misuse**
Violates LSP by changing expected behavior in subclasses.

## Practical Application Tips

### 1. **Start with SRP**
Always ask: "What is this class responsible for?"

### 2. **Use Composition Over Inheritance**
Prefer composition to avoid LSP violations.

### 3. **Design by Contract**
Define clear interfaces and stick to their contracts.

### 4. **Dependency Injection**
Use DI frameworks to manage dependencies automatically.

### 5. **Regular Refactoring**
Continuously refactor to maintain SOLID principles.

## Real-World Example: E-commerce System

\`\`\`java
// Following SOLID principles in an e-commerce system

// SRP: Each class has one responsibility
public class Product {
    private String id;
    private String name;
    private BigDecimal price;
    // Only product data management
}

public class ProductRepository {
    public Product findById(String id) { /* ... */ }
    public void save(Product product) { /* ... */ }
    // Only data access
}

public class PriceCalculator {
    public BigDecimal calculateTotal(List<Product> products) { /* ... */ }
    // Only price calculations
}

// OCP: Open for extension, closed for modification
public interface PaymentProcessor {
    PaymentResult process(Payment payment);
}

public class CreditCardProcessor implements PaymentProcessor {
    @Override
    public PaymentResult process(Payment payment) { /* ... */ }
}

public class PayPalProcessor implements PaymentProcessor {
    @Override
    public PaymentResult process(Payment payment) { /* ... */ }
}

// LSP: Substitutable implementations
public class PaymentService {
    public void processPayment(PaymentProcessor processor, Payment payment) {
        PaymentResult result = processor.process(payment); // Works with any implementation
    }
}

// ISP: Segregated interfaces
public interface Readable {
    String read();
}

public interface Writable {
    void write(String data);
}

public interface Deletable {
    void delete();
}

// DIP: Depend on abstractions
public class OrderService {
    private final ProductRepository productRepository;
    private final PaymentProcessor paymentProcessor;
    
    public OrderService(ProductRepository repository, PaymentProcessor processor) {
        this.productRepository = repository; // Injected dependencies
        this.paymentProcessor = processor;
    }
}
\`\`\`

## Conclusion

The SOLID principles are fundamental to writing clean, maintainable object-oriented code. While they might seem academic at first, applying them consistently leads to more robust, flexible, and testable software systems.

Remember: **SOLID principles are guidelines, not rigid rules**. Use judgment to apply them appropriately for your specific context and requirements.`,
      category: "Low Level Design",
      publishedAt: new Date("2024-01-15"),
    },
  ],
};

async function createSOLIDPrinciplesContent() {
  try {
    console.log("Creating SOLID Principles content...");

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

    // Find Low Level Design subtopic
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

    // Create blogs
    for (const blogData of solidPrinciplesContent.blogs) {
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
          subTopicId: lowLevelSubtopic.id,
        },
      });

      console.log(`Created blog: ${blog.title}`);
    }

    console.log("SOLID Principles content creation completed successfully!");
  } catch (error) {
    console.error("Error creating SOLID Principles content:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createSOLIDPrinciplesContent();
