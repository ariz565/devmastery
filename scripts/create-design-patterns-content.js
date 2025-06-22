const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const designPatternsContent = {
  blogs: [
    {
      title: "Design Patterns: Creational, Structural, and Behavioral Patterns",
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

### 3. Command Pattern

**Purpose**: Encapsulate a request as an object, allowing you to parameterize clients with different requests.

\`\`\`java
// Command interface
public interface Command {
    void execute();
    void undo();
}

// Receiver
public class Light {
    private boolean isOn = false;
    
    public void turnOn() {
        isOn = true;
        System.out.println("Light is ON");
    }
    
    public void turnOff() {
        isOn = false;
        System.out.println("Light is OFF");
    }
}

// Concrete commands
public class LightOnCommand implements Command {
    private Light light;
    
    public LightOnCommand(Light light) {
        this.light = light;
    }
    
    public void execute() {
        light.turnOn();
    }
    
    public void undo() {
        light.turnOff();
    }
}

public class LightOffCommand implements Command {
    private Light light;
    
    public LightOffCommand(Light light) {
        this.light = light;
    }
    
    public void execute() {
        light.turnOff();
    }
    
    public void undo() {
        light.turnOn();
    }
}

// Invoker
public class RemoteControl {
    private Command command;
    
    public void setCommand(Command command) {
        this.command = command;
    }
    
    public void pressButton() {
        command.execute();
    }
    
    public void pressUndo() {
        command.undo();
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
8. **Command**: When you need to queue, log, or undo operations

## Pattern Categories Summary

### Creational Patterns
- **Purpose**: Deal with object creation mechanisms
- **Examples**: Singleton, Factory, Builder, Abstract Factory, Prototype

### Structural Patterns
- **Purpose**: Deal with object composition and relationships
- **Examples**: Adapter, Decorator, Facade, Composite, Bridge

### Behavioral Patterns
- **Purpose**: Deal with communication between objects and responsibility distribution
- **Examples**: Observer, Strategy, Command, State, Template Method

## Best Practices

1. **Don't overuse patterns**: Apply them when they solve a real problem
2. **Understand the problem first**: Choose the right pattern for the context
3. **Keep it simple**: Don't add unnecessary complexity
4. **Consider alternatives**: Sometimes a simple solution is better
5. **Learn the intent**: Understand why a pattern exists, not just how to implement it
6. **Practice recognition**: Learn to identify when patterns naturally emerge

## Common Mistakes

1. **Pattern obsession**: Forcing patterns where they're not needed
2. **Wrong pattern choice**: Using a pattern that doesn't fit the problem
3. **Over-engineering**: Making simple problems complex with patterns
4. **Ignoring context**: Not considering the specific requirements and constraints

## Conclusion

Design patterns are powerful tools that help create flexible, maintainable, and reusable code. They provide a shared vocabulary among developers and represent proven solutions to common problems. However, remember that patterns are tools, not goals—use them wisely to solve real problems rather than as an end in themselves.`,
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
      publishedAt: new Date("2024-01-20"),
    },
  ],
};

async function createDesignPatternsContent() {
  try {
    console.log("Creating Design Patterns content...");

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
    for (const blogData of designPatternsContent.blogs) {
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

    console.log("Design Patterns content creation completed successfully!");
  } catch (error) {
    console.error("Error creating Design Patterns content:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createDesignPatternsContent();
