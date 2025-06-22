const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Java programming language comprehensive structure
const javaTopicStructure = {
  name: "Programming Languages",
  slug: "programming-languages",
  description: "Core programming languages and their ecosystem",
  icon: "💻",
  order: 1,
  subTopics: [
    {
      name: "Java",
      slug: "java",
      description: "Complete Java programming guide from basics to advanced",
      icon: "☕",
      order: 1,
      sections: [
        {
          name: "Java Fundamentals",
          slug: "fundamentals",
          description: "Core Java concepts and basics",
          icon: "🔧",
          order: 1,
          topics: [
            "JVM, JRE, and JDK",
            "Variables and Data Types",
            "Keywords and Identifiers",
            "Operators and Expressions",
            "Control Flow Statements",
          ],
        },
        {
          name: "Object-Oriented Programming",
          slug: "oop",
          description: "OOP concepts in Java",
          icon: "🏗️",
          order: 2,
          topics: [
            "Classes and Objects",
            "Inheritance",
            "Polymorphism",
            "Encapsulation",
            "Abstraction",
            "Interfaces vs Abstract Classes",
          ],
        },
        {
          name: "Advanced Java Features",
          slug: "advanced",
          description: "Advanced Java programming concepts",
          icon: "🚀",
          order: 3,
          topics: [
            "Exception Handling",
            "Collections Framework",
            "Generics",
            "Lambda Expressions",
            "Stream API",
            "Annotations",
          ],
        },
        {
          name: "Concurrency & Multithreading",
          slug: "concurrency",
          description: "Concurrent programming in Java",
          icon: "⚡",
          order: 4,
          topics: [
            "Thread Fundamentals",
            "Synchronization",
            "Thread Pool",
            "Concurrent Collections",
            "CompletableFuture",
            "Parallel Streams",
          ],
        },
        {
          name: "Memory Management",
          slug: "memory",
          description: "Java memory model and garbage collection",
          icon: "🧠",
          order: 5,
          topics: [
            "Heap and Stack Memory",
            "Garbage Collection",
            "Memory Leaks",
            "JVM Tuning",
            "Static vs Instance",
          ],
        },
      ],
    },
  ],
};

// Sample content for key Java topics
const javaContent = {
  "jvm-jre-jdk": {
    blog: {
      title: "Understanding JVM, JRE, and JDK: The Java Platform Foundation",
      excerpt:
        "Master the core components of Java platform - JVM, JRE, and JDK, and understand how they work together to run Java applications.",
      content: `# Understanding JVM, JRE, and JDK: The Java Platform Foundation

## Introduction

Understanding JVM, JRE, and JDK is fundamental to Java development. These three components form the foundation of the Java platform and are essential for writing, compiling, and running Java applications.

## JDK (Java Development Kit)

The JDK is a complete development environment for Java applications.

### What's Included in JDK:
- **JRE (Java Runtime Environment)**
- **Development Tools**: javac (compiler), jar, javadoc
- **Debugging Tools**: jdb, jconsole, jvisualvm
- **Documentation and Examples**

### JDK Components:
\`\`\`
JDK/
├── bin/           # Executable tools (javac, java, jar, etc.)
├── lib/           # Library files and tools.jar
├── jre/           # Complete Java Runtime Environment
├── include/       # Header files for native code
└── src.zip        # Source code for Java API classes
\`\`\`

### Common JDK Tools:
\`\`\`bash
# Compile Java source code
javac MyClass.java

# Create JAR files
jar cvf myapp.jar *.class

# Generate documentation
javadoc *.java

# Java debugger
jdb MyClass
\`\`\`

## JRE (Java Runtime Environment)

The JRE provides the runtime environment for executing Java applications.

### JRE Components:
- **JVM (Java Virtual Machine)**
- **Core Libraries**: java.lang, java.util, java.io, etc.
- **Supporting Files**: property files, resource bundles

### JRE Structure:
\`\`\`
JRE/
├── bin/           # Runtime executables (java, javaw)
├── lib/           # Library files and JAR files
│   ├── rt.jar     # Runtime library
│   ├── charsets.jar
│   └── ext/       # Extension libraries
└── etc/           # Configuration files
\`\`\`

## JVM (Java Virtual Machine)

The JVM is the runtime engine that executes Java bytecode.

### JVM Architecture:
\`\`\`
┌─────────────────────────────────┐
│         Class Loader            │
├─────────────────────────────────┤
│         Runtime Data Areas      │
│  ┌─────────┐ ┌─────────────────┐│
│  │  Heap   │ │    Method Area  ││
│  └─────────┘ └─────────────────┘│
│  ┌─────────┐ ┌─────────────────┐│
│  │ PC Reg  │ │   Native Stack  ││
│  └─────────┘ └─────────────────┘│
├─────────────────────────────────┤
│      Execution Engine           │
│  ┌─────────┐ ┌─────────────────┐│
│  │Interpreter│ │   JIT Compiler ││
│  └─────────┘ └─────────────────┘│
└─────────────────────────────────┘
\`\`\`

### JVM Components:

#### 1. Class Loader
- **Bootstrap Class Loader**: Loads core Java classes
- **Extension Class Loader**: Loads extension classes
- **Application Class Loader**: Loads application classes

#### 2. Memory Areas
- **Heap Memory**: Object storage (Young + Old Generation)
- **Method Area**: Class metadata, constant pool
- **PC Register**: Program counter for current instruction
- **JVM Stack**: Method call frames
- **Native Method Stack**: Native method calls

#### 3. Execution Engine
- **Interpreter**: Executes bytecode line by line
- **JIT Compiler**: Compiles frequently used code to native
- **Garbage Collector**: Manages memory cleanup

## Java Compilation and Execution Process

### Step-by-Step Process:
\`\`\`
1. Source Code (.java)
          ↓
2. Java Compiler (javac)
          ↓
3. Bytecode (.class)
          ↓
4. Class Loader
          ↓
5. JVM Execution Engine
          ↓
6. Native Machine Code
\`\`\`

### Example:
\`\`\`java
// HelloWorld.java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
\`\`\`

\`\`\`bash
# Compilation
javac HelloWorld.java  # Creates HelloWorld.class

# Execution
java HelloWorld        # JVM loads and executes bytecode
\`\`\`

## Platform Independence

### "Write Once, Run Anywhere" (WORA):
\`\`\`
Java Source → Bytecode → JVM (Windows)
                      → JVM (Linux)
                      → JVM (macOS)
\`\`\`

The bytecode is platform-independent, but JVM is platform-specific.

## JVM Memory Management

### Heap Memory Structure:
\`\`\`
Heap Memory
├── Young Generation
│   ├── Eden Space
│   ├── Survivor Space 0 (S0)
│   └── Survivor Space 1 (S1)
└── Old Generation (Tenured Space)
\`\`\`

### Memory Allocation:
1. **New objects** → Eden Space
2. **Surviving objects** → Survivor Spaces
3. **Long-lived objects** → Old Generation

## Performance Considerations

### JIT Compilation:
- **Initial execution**: Interpreted (slower)
- **Frequent code**: JIT compiled to native (faster)
- **Hotspot detection**: Identifies frequently executed code

### Memory Tuning:
\`\`\`bash
# Set heap size
java -Xmx4g -Xms2g MyApplication

# Enable garbage collection logging
java -XX:+PrintGC -XX:+PrintGCDetails MyApp

# Choose garbage collector
java -XX:+UseG1GC MyApplication
\`\`\`

## Best Practices

### 1. Version Management
- Use specific JDK versions for projects
- Consider LTS (Long Term Support) versions
- Keep JDK updated for security patches

### 2. Development Environment
- Set JAVA_HOME environment variable
- Use IDE with proper JDK configuration
- Understand classpath management

### 3. Performance Optimization
- Choose appropriate garbage collector
- Monitor memory usage and GC behavior
- Profile applications for bottlenecks

## Common Issues and Solutions

### 1. ClassNotFoundException
- Check classpath configuration
- Verify JAR file locations
- Ensure proper package structure

### 2. OutOfMemoryError
- Increase heap size with -Xmx
- Analyze memory leaks
- Optimize object creation

### 3. Performance Issues
- Enable JIT compilation
- Monitor garbage collection
- Use appropriate data structures

## Conclusion

Understanding JVM, JRE, and JDK is crucial for Java developers:

1. **JDK**: Complete development environment
2. **JRE**: Runtime environment for execution
3. **JVM**: Virtual machine that executes bytecode

This foundation enables Java's platform independence and robust performance characteristics that make it suitable for enterprise applications.
`,
      category: "Java Fundamentals",
      tags: ["Java", "JVM", "JRE", "JDK", "Platform Independence"],
      readTime: 12,
      published: true,
    },
    note: {
      title: "JVM, JRE, JDK - Quick Reference",
      content: `# JVM, JRE, JDK - Quick Reference

## Key Differences

| Component | Purpose | Contains |
|-----------|---------|----------|
| **JDK** | Development | JRE + Development Tools |
| **JRE** | Runtime | JVM + Core Libraries |
| **JVM** | Execution | Virtual Machine Engine |

## JDK Tools

### Compilation & Packaging
- \`javac\` - Java compiler
- \`jar\` - Archive tool
- \`javadoc\` - Documentation generator

### Debugging & Monitoring
- \`jdb\` - Java debugger
- \`jconsole\` - JVM monitoring
- \`jvisualvm\` - Visual profiler

## JVM Architecture

### Memory Areas
- **Heap**: Object storage (Young + Old Gen)
- **Method Area**: Class metadata
- **PC Register**: Program counter
- **Stack**: Method frames
- **Native Stack**: Native calls

### Execution Engine
- **Interpreter**: Line-by-line execution
- **JIT Compiler**: Hot code compilation
- **GC**: Memory management

## Class Loading Process

1. **Loading**: Find and load .class files
2. **Linking**: Verify, prepare, resolve
3. **Initialization**: Execute static initializers

### Class Loaders
- Bootstrap → Extension → Application

## Memory Management

### Heap Structure
\`\`\`
Young Generation:
├── Eden Space (new objects)
├── Survivor 0 (S0)
└── Survivor 1 (S1)

Old Generation:
└── Tenured Space (long-lived objects)
\`\`\`

### GC Process
1. Minor GC: Young Generation cleanup
2. Major GC: Old Generation cleanup
3. Full GC: Complete heap cleanup

## JVM Tuning

### Heap Size
\`\`\`bash
-Xms<size>    # Initial heap size
-Xmx<size>    # Maximum heap size
-Xmn<size>    # Young generation size
\`\`\`

### Garbage Collectors
\`\`\`bash
-XX:+UseSerialGC      # Single-threaded
-XX:+UseParallelGC    # Multi-threaded
-XX:+UseG1GC          # Low-latency
-XX:+UseZGC           # Ultra-low latency
\`\`\`

## Environment Setup

### JAVA_HOME
\`\`\`bash
# Windows
set JAVA_HOME=C:\\Program Files\\Java\\jdk-17

# Linux/macOS
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk
\`\`\`

### PATH Configuration
\`\`\`bash
# Add to PATH
PATH=$JAVA_HOME/bin:$PATH
\`\`\`

## Common Commands

\`\`\`bash
# Check Java version
java -version
javac -version

# Compile and run
javac MyClass.java
java MyClass

# Run with options
java -Xmx1g -XX:+UseG1GC MyApp

# Create JAR
jar cvf myapp.jar *.class

# View JVM options
java -XX:+PrintFlagsFinal -version
\`\`\`

## Troubleshooting

### Memory Issues
- OutOfMemoryError → Increase heap
- StackOverflowError → Increase stack size
- Memory leaks → Use profiler

### ClassPath Issues
- ClassNotFoundException → Check classpath
- NoClassDefFoundError → Missing dependencies
- Version conflicts → Check JAR versions

## Best Practices

✅ Use LTS Java versions
✅ Set appropriate heap sizes  
✅ Monitor GC performance
✅ Keep JDK updated
✅ Use profiling tools

❌ Don't ignore memory warnings
❌ Don't use default GC for production
❌ Don't mix Java versions
❌ Don't ignore classpath issues
`,
      category: "Java Fundamentals",
      tags: ["Java", "JVM", "Quick Reference"],
    },
  },

  "exception-handling": {
    blog: {
      title:
        "Java Exception Handling: Complete Guide to Robust Error Management",
      excerpt:
        "Master Java exception handling with try-catch blocks, custom exceptions, best practices, and advanced error handling patterns.",
      content: `# Java Exception Handling: Complete Guide to Robust Error Management

## Introduction

Exception handling is a critical aspect of Java programming that allows developers to create robust, fault-tolerant applications. Understanding how to properly handle exceptions can prevent applications from crashing and provide meaningful feedback to users.

## Exception Hierarchy

### Java Exception Class Hierarchy:
\`\`\`
Throwable
├── Error (System errors - don't catch)
│   ├── OutOfMemoryError
│   ├── StackOverflowError
│   └── VirtualMachineError
└── Exception
    ├── Checked Exceptions (Compile-time)
    │   ├── IOException
    │   ├── SQLException
    │   ├── ClassNotFoundException
    │   └── ParseException
    └── RuntimeException (Unchecked)
        ├── NullPointerException
        ├── ArrayIndexOutOfBoundsException
        ├── IllegalArgumentException
        └── NumberFormatException
\`\`\`

### Types of Exceptions:

#### 1. Checked Exceptions
Must be handled at compile time:
\`\`\`java
// Must handle IOException
try {
    FileReader file = new FileReader("data.txt");
} catch (IOException e) {
    System.err.println("File not found: " + e.getMessage());
}
\`\`\`

#### 2. Unchecked Exceptions (Runtime)
Optional to handle, occur at runtime:
\`\`\`java
// May throw NullPointerException
String str = null;
int length = str.length(); // Runtime exception
\`\`\`

#### 3. Errors
System-level problems, shouldn't be caught:
\`\`\`java
// Don't catch these
OutOfMemoryError
StackOverflowError
\`\`\`

## Basic Exception Handling

### Try-Catch Block:
\`\`\`java
try {
    // Risky code that might throw exception
    int result = divide(10, 0);
    System.out.println("Result: " + result);
} catch (ArithmeticException e) {
    // Handle specific exception
    System.err.println("Cannot divide by zero: " + e.getMessage());
} catch (Exception e) {
    // Handle any other exception
    System.err.println("Unexpected error: " + e.getMessage());
} finally {
    // Always executes (cleanup code)
    System.out.println("Cleanup completed");
}
\`\`\`

### Multiple Catch Blocks:
\`\`\`java
try {
    String[] array = {"1", "2", "abc"};
    int index = Integer.parseInt(args[0]);
    int value = Integer.parseInt(array[index]);
    System.out.println("Value: " + value);
} catch (ArrayIndexOutOfBoundsException e) {
    System.err.println("Invalid array index");
} catch (NumberFormatException e) {
    System.err.println("Invalid number format");
} catch (Exception e) {
    System.err.println("General error: " + e.getMessage());
}
\`\`\`

### Multi-Catch (Java 7+):
\`\`\`java
try {
    // Some risky operation
    performOperation();
} catch (IOException | SQLException | ParseException e) {
    // Handle multiple exception types
    System.err.println("Operation failed: " + e.getMessage());
    logError(e);
}
\`\`\`

## Try-with-Resources (Java 7+)

### Automatic Resource Management:
\`\`\`java
// Automatically closes resources
try (FileReader fileReader = new FileReader("data.txt");
     BufferedReader bufferedReader = new BufferedReader(fileReader)) {
    
    String line;
    while ((line = bufferedReader.readLine()) != null) {
        System.out.println(line);
    }
} catch (IOException e) {
    System.err.println("Error reading file: " + e.getMessage());
}
// Resources automatically closed here
\`\`\`

### Custom Resource Classes:
\`\`\`java
public class CustomResource implements AutoCloseable {
    private String name;
    
    public CustomResource(String name) {
        this.name = name;
        System.out.println("Opening resource: " + name);
    }
    
    public void doWork() {
        System.out.println("Working with: " + name);
    }
    
    @Override
    public void close() {
        System.out.println("Closing resource: " + name);
    }
}

// Usage
try (CustomResource resource = new CustomResource("MyResource")) {
    resource.doWork();
} // Automatically calls close()
\`\`\`

## Throwing Exceptions

### Throw Statement:
\`\`\`java
public void validateAge(int age) {
    if (age < 0) {
        throw new IllegalArgumentException("Age cannot be negative");
    }
    if (age > 150) {
        throw new IllegalArgumentException("Age seems unrealistic");
    }
}
\`\`\`

### Throws Clause:
\`\`\`java
public void readFile(String fileName) throws IOException {
    FileReader file = new FileReader(fileName);
    // Method declares it might throw IOException
}

public void processFile() {
    try {
        readFile("data.txt");
    } catch (IOException e) {
        System.err.println("Error processing file: " + e.getMessage());
    }
}
\`\`\`

## Custom Exceptions

### Creating Custom Exception Classes:
\`\`\`java
// Custom checked exception
public class InsufficientFundsException extends Exception {
    private double amount;
    private double balance;
    
    public InsufficientFundsException(double amount, double balance) {
        super("Insufficient funds: Required " + amount + ", Available " + balance);
        this.amount = amount;
        this.balance = balance;
    }
    
    public double getAmount() { return amount; }
    public double getBalance() { return balance; }
}

// Custom unchecked exception
public class InvalidAccountException extends RuntimeException {
    public InvalidAccountException(String message) {
        super(message);
    }
    
    public InvalidAccountException(String message, Throwable cause) {
        super(message, cause);
    }
}
\`\`\`

### Using Custom Exceptions:
\`\`\`java
public class BankAccount {
    private double balance;
    
    public void withdraw(double amount) throws InsufficientFundsException {
        if (amount > balance) {
            throw new InsufficientFundsException(amount, balance);
        }
        balance -= amount;
    }
}

// Usage
try {
    account.withdraw(1000);
} catch (InsufficientFundsException e) {
    System.err.println(e.getMessage());
    System.err.println("Shortfall: " + (e.getAmount() - e.getBalance()));
}
\`\`\`

## Exception Handling Best Practices

### 1. Be Specific with Exceptions:
\`\`\`java
// Bad: Too generic
catch (Exception e) {
    e.printStackTrace();
}

// Good: Specific handling
catch (FileNotFoundException e) {
    createDefaultFile();
} catch (IOException e) {
    notifyUser("File operation failed");
}
\`\`\`

### 2. Don't Ignore Exceptions:
\`\`\`java
// Bad: Silent failure
try {
    riskyOperation();
} catch (Exception e) {
    // Ignoring exception
}

// Good: Proper handling
try {
    riskyOperation();
} catch (Exception e) {
    logger.error("Operation failed", e);
    notifyUser("Operation could not be completed");
}
\`\`\`

### 3. Use Finally for Cleanup:
\`\`\`java
FileInputStream input = null;
try {
    input = new FileInputStream("data.txt");
    // Process file
} catch (IOException e) {
    logger.error("File processing error", e);
} finally {
    if (input != null) {
        try {
            input.close();
        } catch (IOException e) {
            logger.warn("Error closing file", e);
        }
    }
}
\`\`\`

### 4. Don't Use Exceptions for Control Flow:
\`\`\`java
// Bad: Using exceptions for logic
try {
    return array[index];
} catch (ArrayIndexOutOfBoundsException e) {
    return defaultValue;
}

// Good: Check before access
if (index >= 0 && index < array.length) {
    return array[index];
} else {
    return defaultValue;
}
\`\`\`

## Advanced Exception Handling Patterns

### 1. Exception Translation:
\`\`\`java
public class DataService {
    public User getUser(int id) throws ServiceException {
        try {
            return database.findUser(id);
        } catch (SQLException e) {
            // Translate low-level exception to high-level
            throw new ServiceException("Unable to retrieve user", e);
        }
    }
}
\`\`\`

### 2. Exception Chaining:
\`\`\`java
public void processData() throws ProcessingException {
    try {
        parseData();
    } catch (ParseException e) {
        // Chain the original exception
        throw new ProcessingException("Data processing failed", e);
    }
}

// Access the original cause
catch (ProcessingException e) {
    Throwable cause = e.getCause();
    if (cause instanceof ParseException) {
        // Handle parse-specific logic
    }
}
\`\`\`

### 3. Suppressed Exceptions:
\`\`\`java
try (FileInputStream input = new FileInputStream("file.txt")) {
    // If this throws and close() also throws,
    // close() exception is suppressed
    processFile(input);
}

// Access suppressed exceptions
catch (IOException e) {
    Throwable[] suppressed = e.getSuppressed();
    for (Throwable t : suppressed) {
        logger.warn("Suppressed exception", t);
    }
}
\`\`\`

## Exception Handling in Different Scenarios

### 1. Multi-threaded Applications:
\`\`\`java
public class WorkerThread extends Thread {
    @Override
    public void run() {
        try {
            doWork();
        } catch (Exception e) {
            // Log the exception
            logger.error("Worker thread failed", e);
            // Notify main thread or restart logic
            handleFailure(e);
        }
    }
    
    private void handleFailure(Exception e) {
        // Cleanup resources
        // Notify other threads
        // Implement retry logic if needed
    }
}
\`\`\`

### 2. Web Applications:
\`\`\`java
@RestController
public class UserController {
    
    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUser(@PathVariable int id) {
        try {
            User user = userService.findById(id);
            return ResponseEntity.ok(user);
        } catch (UserNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (ServiceException e) {
            return ResponseEntity.status(500).build();
        }
    }
}
\`\`\`

### 3. Batch Processing:
\`\`\`java
public void processBatch(List<Item> items) {
    List<Item> failed = new ArrayList<>();
    
    for (Item item : items) {
        try {
            processItem(item);
        } catch (ProcessingException e) {
            logger.warn("Failed to process item: " + item.getId(), e);
            failed.add(item);
            // Continue with next item
        }
    }
    
    if (!failed.isEmpty()) {
        handleFailedItems(failed);
    }
}
\`\`\`

## Performance Considerations

### 1. Exception Creation Cost:
\`\`\`java
// Expensive: Creates stack trace
throw new Exception("Error occurred");

// Less expensive: Pre-created exception
private static final Exception CACHED_EXCEPTION = 
    new Exception("Common error");

// Reuse when appropriate (be careful with stack traces)
\`\`\`

### 2. Exception Handling Overhead:
\`\`\`java
// Avoid exceptions in tight loops
for (int i = 0; i < 1000000; i++) {
    try {
        // This is expensive if exceptions occur frequently
        riskyOperation(i);
    } catch (Exception e) {
        // Handle exception
    }
}

// Better: Validate before operation
for (int i = 0; i < 1000000; i++) {
    if (isValidInput(i)) {
        riskyOperation(i);
    } else {
        handleInvalidInput(i);
    }
}
\`\`\`

## Testing Exception Handling

### JUnit Testing:
\`\`\`java
@Test
public void testInsufficientFunds() {
    BankAccount account = new BankAccount(100);
    
    // Test that exception is thrown
    assertThrows(InsufficientFundsException.class, () -> {
        account.withdraw(200);
    });
}

@Test
public void testExceptionMessage() {
    BankAccount account = new BankAccount(100);
    
    InsufficientFundsException exception = assertThrows(
        InsufficientFundsException.class, 
        () -> account.withdraw(200)
    );
    
    assertTrue(exception.getMessage().contains("Insufficient funds"));
    assertEquals(200, exception.getAmount());
    assertEquals(100, exception.getBalance());
}
\`\`\`

## Conclusion

Effective exception handling is crucial for building robust Java applications:

1. **Understand the exception hierarchy** and when to use checked vs unchecked exceptions
2. **Be specific** in exception handling and avoid catching generic Exception
3. **Use try-with-resources** for automatic resource management
4. **Create meaningful custom exceptions** for domain-specific errors
5. **Don't ignore exceptions** - always log or handle appropriately
6. **Consider performance implications** of exception handling
7. **Test exception scenarios** thoroughly

Proper exception handling makes applications more reliable, maintainable, and user-friendly.
`,
      category: "Java Advanced",
      tags: ["Java", "Exception Handling", "Error Management", "Try-Catch"],
      readTime: 15,
      published: true,
    },
    note: {
      title: "Java Exception Handling - Quick Reference",
      content: `# Java Exception Handling - Quick Reference

## Exception Hierarchy

\`\`\`
Throwable
├── Error (Don't catch)
└── Exception
    ├── Checked (Compile-time)
    └── RuntimeException (Unchecked)
\`\`\`

## Basic Syntax

### Try-Catch-Finally
\`\`\`java
try {
    // Risky code
} catch (SpecificException e) {
    // Handle specific exception
} catch (Exception e) {
    // Handle general exception
} finally {
    // Cleanup code (always runs)
}
\`\`\`

### Try-with-Resources
\`\`\`java
try (FileReader file = new FileReader("data.txt")) {
    // Use resource
} catch (IOException e) {
    // Handle exception
}
// Resource auto-closed
\`\`\`

### Multi-Catch (Java 7+)
\`\`\`java
try {
    // Code
} catch (IOException | SQLException e) {
    // Handle multiple types
}
\`\`\`

## Throwing Exceptions

### Throw Statement
\`\`\`java
if (age < 0) {
    throw new IllegalArgumentException("Invalid age");
}
\`\`\`

### Throws Clause
\`\`\`java
public void method() throws IOException {
    // Method that might throw IOException
}
\`\`\`

## Custom Exceptions

### Checked Exception
\`\`\`java
public class CustomException extends Exception {
    public CustomException(String message) {
        super(message);
    }
}
\`\`\`

### Unchecked Exception
\`\`\`java
public class CustomRuntimeException extends RuntimeException {
    public CustomRuntimeException(String message) {
        super(message);
    }
}
\`\`\`

## Common Exception Types

### Checked Exceptions
- **IOException**: File/IO operations
- **SQLException**: Database operations
- **ClassNotFoundException**: Class loading
- **ParseException**: Parsing operations

### Unchecked Exceptions
- **NullPointerException**: Null reference access
- **ArrayIndexOutOfBoundsException**: Array bounds
- **IllegalArgumentException**: Invalid arguments
- **NumberFormatException**: Number parsing

## Best Practices

### Do's ✅
- Be specific with exception types
- Use try-with-resources for cleanup
- Log exceptions properly
- Create meaningful custom exceptions
- Handle exceptions at appropriate level

### Don'ts ❌
- Don't catch generic Exception
- Don't ignore exceptions silently
- Don't use exceptions for control flow
- Don't catch Error types
- Don't create unnecessary exceptions

## Exception Information

### Getting Exception Details
\`\`\`java
try {
    // Code
} catch (Exception e) {
    String message = e.getMessage();
    String className = e.getClass().getName();
    StackTraceElement[] trace = e.getStackTrace();
    Throwable cause = e.getCause();
}
\`\`\`

### Stack Trace
\`\`\`java
e.printStackTrace();                    // To console
e.printStackTrace(printWriter);        // To writer
StringWriter sw = new StringWriter();
e.printStackTrace(new PrintWriter(sw));
String stackTrace = sw.toString();     // To string
\`\`\`

## Advanced Patterns

### Exception Translation
\`\`\`java
try {
    // Low-level operation
} catch (LowLevelException e) {
    throw new HighLevelException("Operation failed", e);
}
\`\`\`

### Exception Suppression
\`\`\`java
// Occurs with try-with-resources
Throwable[] suppressed = exception.getSuppressed();
\`\`\`

### Exception Chaining
\`\`\`java
throw new Exception("New message", originalException);
\`\`\`

## Testing Exceptions

### JUnit 5
\`\`\`java
@Test
void testException() {
    assertThrows(IllegalArgumentException.class, () -> {
        methodThatThrows();
    });
}

@Test
void testExceptionMessage() {
    Exception e = assertThrows(Exception.class, () -> {
        methodThatThrows();
    });
    assertEquals("Expected message", e.getMessage());
}
\`\`\`

## Performance Tips

- Avoid exceptions in loops
- Don't use exceptions for control flow
- Consider validation before risky operations
- Reuse exceptions when appropriate
- Be mindful of stack trace creation cost

## Cleanup Patterns

### Manual Cleanup
\`\`\`java
Resource resource = null;
try {
    resource = acquireResource();
    // Use resource
} finally {
    if (resource != null) {
        resource.close();
    }
}
\`\`\`

### Try-with-Resources (Preferred)
\`\`\`java
try (Resource resource = acquireResource()) {
    // Use resource
} // Automatically closed
\`\`\`

## Common Pitfalls

1. **Catching too broadly**: \`catch (Exception e)\`
2. **Silent failures**: Empty catch blocks
3. **Resource leaks**: Not closing resources
4. **Exception swallowing**: Catching without handling
5. **Performance impact**: Using exceptions for logic
`,
      category: "Java Advanced",
      tags: ["Java", "Exception Handling", "Quick Reference"],
    },
  },
};

async function createJavaContent() {
  try {
    console.log("🚀 Creating Java Programming Content...");

    const user = await prisma.user.findFirst();
    if (!user) {
      throw new Error("No users found. Please create a user first.");
    }

    // Create the main Programming Languages topic
    const mainTopic = await prisma.topic.upsert({
      where: { slug: javaTopicStructure.slug },
      update: {},
      create: {
        name: javaTopicStructure.name,
        slug: javaTopicStructure.slug,
        description: javaTopicStructure.description,
        icon: javaTopicStructure.icon,
        order: javaTopicStructure.order,
        authorId: user.id,
      },
    });

    console.log(`✅ Created main topic: ${mainTopic.name}`);

    // Create Java subtopic
    const javaSubTopic = javaTopicStructure.subTopics[0];
    const subTopic = await prisma.subTopic.upsert({
      where: {
        topicId_slug: {
          topicId: mainTopic.id,
          slug: javaSubTopic.slug,
        },
      },
      update: {},
      create: {
        name: javaSubTopic.name,
        slug: javaSubTopic.slug,
        description: javaSubTopic.description,
        icon: javaSubTopic.icon,
        order: javaSubTopic.order,
        topicId: mainTopic.id,
        authorId: user.id,
      },
    });

    console.log(`✅ Created subtopic: ${subTopic.name}`);

    // Create content for key topics
    for (const [key, content] of Object.entries(javaContent)) {
      console.log(`\n📝 Creating content for: ${key}`);

      // Create blog
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
            topicId: mainTopic.id,
            subTopicId: subTopic.id,
            authorId: user.id,
          },
        });
        console.log(`✅ Created blog: ${content.blog.title}`);
      } else {
        console.log(`⏭️ Blog already exists: ${content.blog.title}`);
      }

      // Create note
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
            topicId: mainTopic.id,
            subTopicId: subTopic.id,
            authorId: user.id,
          },
        });
        console.log(`✅ Created note: ${content.note.title}`);
      } else {
        console.log(`⏭️ Note already exists: ${content.note.title}`);
      }
    }

    console.log("\n✅ Successfully created Java programming content!");
  } catch (error) {
    console.error("❌ Error creating Java content:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createJavaContent();
