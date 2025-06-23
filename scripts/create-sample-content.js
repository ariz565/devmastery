const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function createSampleContent() {
  try {
    console.log("🚀 Creating sample blogs and notes...\n");

    // Get the admin user and topics
    const adminUser = await prisma.user.findFirst({
      where: {
        email: "admin@example.com",
      },
    });

    if (!adminUser) {
      console.log("❌ Admin user not found. Please run check-topics.js first.");
      return;
    }

    const topics = await prisma.topic.findMany({
      select: { id: true, name: true, slug: true },
    });

    if (topics.length === 0) {
      console.log("❌ No topics found. Please run check-topics.js first.");
      return;
    }

    const javaTopicId = topics.find((t) => t.slug === "java")?.id;
    const pythonTopicId = topics.find((t) => t.slug === "python")?.id;

    console.log(
      `📊 Found ${topics.length} topics and admin user: ${adminUser.name}`
    );

    // Sample blogs data
    const sampleBlogs = [
      {
        title: "Getting Started with Java: Your First Steps",
        content: `# Getting Started with Java

Java is one of the most popular programming languages in the world, known for its "write once, run anywhere" philosophy. In this comprehensive guide, we'll explore the fundamentals of Java programming.

## What is Java?

Java is a high-level, object-oriented programming language developed by Sun Microsystems (now owned by Oracle) in 1995. It was designed to be platform-independent, meaning Java programs can run on any device that has the Java Virtual Machine (JVM) installed.

## Key Features of Java

### 1. Platform Independence
Java code is compiled into bytecode, which can run on any platform with a JVM.

### 2. Object-Oriented Programming
Java follows OOP principles:
- **Encapsulation**: Bundling data and methods together
- **Inheritance**: Creating new classes based on existing ones
- **Polymorphism**: Objects can take multiple forms
- **Abstraction**: Hiding implementation details

### 3. Memory Management
Java has automatic garbage collection, which manages memory allocation and deallocation.

## Your First Java Program

\`\`\`java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
\`\`\`

This simple program demonstrates the basic structure of a Java application.

## Setting Up Your Development Environment

1. **Install JDK**: Download and install the Java Development Kit
2. **Choose an IDE**: Popular choices include IntelliJ IDEA, Eclipse, or VS Code
3. **Set up PATH**: Configure your system's PATH variable
4. **Write your first program**: Create a .java file and compile it

## Conclusion

Java is an excellent language for beginners and experienced developers alike. Its robust ecosystem, strong community support, and enterprise-grade capabilities make it a valuable skill to learn.

In the next post, we'll dive deeper into Java syntax and basic programming concepts.`,
        excerpt:
          "Learn the fundamentals of Java programming and set up your development environment in this beginner-friendly guide.",
        category: "Programming Languages",
        topicId: javaTopicId,
        authorId: adminUser.id,
        published: true,
      },
      {
        title: "Python Data Structures: Lists, Tuples, and Dictionaries",
        content: `# Python Data Structures: A Comprehensive Guide

Python offers several built-in data structures that are essential for effective programming. Understanding these structures is crucial for writing efficient and readable code.

## Lists: Dynamic Arrays

Lists are ordered, mutable collections that can store items of different data types.

\`\`\`python
# Creating lists
fruits = ['apple', 'banana', 'orange']
numbers = [1, 2, 3, 4, 5]
mixed = [1, 'hello', 3.14, True]

# List operations
fruits.append('grape')  # Add item
fruits.remove('banana')  # Remove item
fruits[0] = 'mango'  # Update item
\`\`\`

### Common List Methods
- \`append()\`: Add item to end
- \`insert()\`: Insert item at specific position
- \`remove()\`: Remove first occurrence of item
- \`pop()\`: Remove and return item at index
- \`sort()\`: Sort list in place

## Tuples: Immutable Sequences

Tuples are ordered, immutable collections. Once created, you cannot modify them.

\`\`\`python
# Creating tuples
coordinates = (10, 20)
colors = ('red', 'green', 'blue')
single_item = ('hello',)  # Note the comma

# Tuple unpacking
x, y = coordinates
print(f"X: {x}, Y: {y}")
\`\`\`

### When to Use Tuples
- Storing coordinates or database records
- Function return values
- Dictionary keys (since they're immutable)

## Dictionaries: Key-Value Pairs

Dictionaries store data in key-value pairs and are highly optimized for lookups.

\`\`\`python
# Creating dictionaries
person = {
    'name': 'John Doe',
    'age': 30,
    'city': 'New York'
}

# Dictionary operations
person['email'] = 'john@example.com'  # Add new key-value pair
age = person['age']  # Access value
del person['city']  # Remove key-value pair

# Safe access with get()
phone = person.get('phone', 'Not provided')
\`\`\`

### Dictionary Methods
- \`keys()\`: Get all keys
- \`values()\`: Get all values
- \`items()\`: Get key-value pairs
- \`get()\`: Safe value access
- \`update()\`: Merge dictionaries

## Performance Considerations

| Operation | List | Tuple | Dictionary |
|-----------|------|-------|------------|
| Access by index | O(1) | O(1) | N/A |
| Access by key | N/A | N/A | O(1) |
| Search | O(n) | O(n) | O(1) |
| Insert/Delete | O(n) | Immutable | O(1) |

## Best Practices

1. **Use lists** for ordered, mutable data
2. **Use tuples** for immutable sequences
3. **Use dictionaries** for key-value mappings
4. **Choose the right structure** based on your use case

## Conclusion

Mastering Python's data structures is fundamental to becoming an effective Python programmer. Each structure has its strengths and ideal use cases. Practice with these examples and experiment with different scenarios to build your understanding.`,
        excerpt:
          "Master Python's essential data structures: lists, tuples, and dictionaries with practical examples and best practices.",
        category: "Programming Languages",
        topicId: pythonTopicId,
        authorId: adminUser.id,
        published: true,
      },
      {
        title: "Understanding Object-Oriented Programming in Java",
        content: `# Object-Oriented Programming in Java

Object-Oriented Programming (OOP) is a programming paradigm that organizes code into objects and classes. Java is fundamentally an object-oriented language, making it essential to understand these concepts.

## The Four Pillars of OOP

### 1. Encapsulation

Encapsulation is the practice of bundling data (attributes) and methods that operate on that data within a single unit (class).

\`\`\`java
public class BankAccount {
    private double balance;  // Private attribute
    private String accountNumber;
    
    // Constructor
    public BankAccount(String accountNumber, double initialBalance) {
        this.accountNumber = accountNumber;
        this.balance = initialBalance;
    }
    
    // Public methods to access private data
    public double getBalance() {
        return balance;
    }
    
    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
        }
    }
    
    public boolean withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            return true;
        }
        return false;
    }
}
\`\`\`

### 2. Inheritance

Inheritance allows a class to inherit properties and methods from another class.

\`\`\`java
// Base class
public class Vehicle {
    protected String brand;
    protected String model;
    
    public Vehicle(String brand, String model) {
        this.brand = brand;
        this.model = model;
    }
    
    public void start() {
        System.out.println("Starting the vehicle...");
    }
}

// Derived class
public class Car extends Vehicle {
    private int numberOfDoors;
    
    public Car(String brand, String model, int doors) {
        super(brand, model);  // Call parent constructor
        this.numberOfDoors = doors;
    }
    
    @Override
    public void start() {
        System.out.println("Starting the car engine...");
    }
}
\`\`\`

### 3. Polymorphism

Polymorphism allows objects of different types to be treated as objects of a common base type.

\`\`\`java
public class Animal {
    public void makeSound() {
        System.out.println("Some generic animal sound");
    }
}

public class Dog extends Animal {
    @Override
    public void makeSound() {
        System.out.println("Woof!");
    }
}

public class Cat extends Animal {
    @Override
    public void makeSound() {
        System.out.println("Meow!");
    }
}

// Using polymorphism
Animal[] animals = {new Dog(), new Cat()};
for (Animal animal : animals) {
    animal.makeSound();  // Calls the appropriate method
}
\`\`\`

### 4. Abstraction

Abstraction hides implementation details and shows only the essential features.

\`\`\`java
abstract class Shape {
    protected String color;
    
    public Shape(String color) {
        this.color = color;
    }
    
    // Abstract method - must be implemented by subclasses
    public abstract double calculateArea();
    
    // Concrete method
    public void displayColor() {
        System.out.println("Color: " + color);
    }
}

public class Circle extends Shape {
    private double radius;
    
    public Circle(String color, double radius) {
        super(color);
        this.radius = radius;
    }
    
    @Override
    public double calculateArea() {
        return Math.PI * radius * radius;
    }
}
\`\`\`

## Benefits of OOP

1. **Modularity**: Code is organized into discrete objects
2. **Reusability**: Classes can be reused across different programs
3. **Maintainability**: Changes to one class don't affect others
4. **Scalability**: Easy to add new features by extending existing classes

## Best Practices

1. **Use meaningful class and method names**
2. **Keep classes focused on a single responsibility**
3. **Favor composition over inheritance when appropriate**
4. **Use interfaces to define contracts**
5. **Apply the principle of least privilege (make fields private)**

## Conclusion

Understanding OOP principles is crucial for Java development. These concepts provide a solid foundation for building robust, maintainable applications. Practice implementing these patterns in your own projects to master object-oriented design.`,
        excerpt:
          "Dive deep into Java's object-oriented programming concepts including encapsulation, inheritance, polymorphism, and abstraction.",
        category: "Programming Languages",
        topicId: javaTopicId,
        authorId: adminUser.id,
        published: true,
      },
      {
        title: "Python Web Development with Flask: Building Your First API",
        content: `# Python Web Development with Flask

Flask is a lightweight and flexible Python web framework that's perfect for building APIs and web applications. In this tutorial, we'll create a simple REST API from scratch.

## What is Flask?

Flask is a micro web framework written in Python. It's called a "micro" framework because it doesn't require particular tools or libraries, giving developers the flexibility to choose their components.

## Setting Up Flask

First, let's install Flask and create our project structure:

\`\`\`bash
pip install flask flask-cors
mkdir flask-api
cd flask-api
touch app.py
\`\`\`

## Creating Your First Flask Application

\`\`\`python
from flask import Flask, jsonify, request
from flask_cors import CORS

# Create Flask application
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Sample data
books = [
    {
        'id': 1,
        'title': 'The Great Gatsby',
        'author': 'F. Scott Fitzgerald',
        'year': 1925
    },
    {
        'id': 2,
        'title': 'To Kill a Mockingbird',
        'author': 'Harper Lee',
        'year': 1960
    }
]

# Routes
@app.route('/', methods=['GET'])
def home():
    return jsonify({'message': 'Welcome to the Book API!'})

@app.route('/api/books', methods=['GET'])
def get_books():
    return jsonify({'books': books})

@app.route('/api/books/<int:book_id>', methods=['GET'])
def get_book(book_id):
    book = next((book for book in books if book['id'] == book_id), None)
    if book:
        return jsonify({'book': book})
    return jsonify({'error': 'Book not found'}), 404

@app.route('/api/books', methods=['POST'])
def create_book():
    data = request.json
    
    # Validation
    if not data or 'title' not in data or 'author' not in data:
        return jsonify({'error': 'Title and author are required'}), 400
    
    # Create new book
    new_book = {
        'id': len(books) + 1,
        'title': data['title'],
        'author': data['author'],
        'year': data.get('year', 2024)
    }
    
    books.append(new_book)
    return jsonify({'book': new_book}), 201

@app.route('/api/books/<int:book_id>', methods=['PUT'])
def update_book(book_id):
    book = next((book for book in books if book['id'] == book_id), None)
    if not book:
        return jsonify({'error': 'Book not found'}), 404
    
    data = request.json
    book.update({
        'title': data.get('title', book['title']),
        'author': data.get('author', book['author']),
        'year': data.get('year', book['year'])
    })
    
    return jsonify({'book': book})

@app.route('/api/books/<int:book_id>', methods=['DELETE'])
def delete_book(book_id):
    global books
    books = [book for book in books if book['id'] != book_id]
    return jsonify({'message': 'Book deleted successfully'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
\`\`\`

## Testing Your API

You can test your API using curl or tools like Postman:

\`\`\`bash
# Get all books
curl http://localhost:5000/api/books

# Get specific book
curl http://localhost:5000/api/books/1

# Create new book
curl -X POST http://localhost:5000/api/books \
  -H "Content-Type: application/json" \
  -d '{"title": "1984", "author": "George Orwell", "year": 1949}'

# Update book
curl -X PUT http://localhost:5000/api/books/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "The Great Gatsby (Updated)"}'

# Delete book
curl -X DELETE http://localhost:5000/api/books/1
\`\`\`

## Advanced Features

### Error Handling

\`\`\`python
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Resource not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500
\`\`\`

### Request Validation

\`\`\`python
from functools import wraps

def validate_json(*expected_args):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            json_object = request.get_json()
            if not json_object:
                return jsonify({'error': 'No JSON data provided'}), 400
            
            for expected_arg in expected_args:
                if expected_arg not in json_object:
                    return jsonify({'error': f'{expected_arg} is required'}), 400
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator

@app.route('/api/books', methods=['POST'])
@validate_json('title', 'author')
def create_book():
    # Your code here
    pass
\`\`\`

## Best Practices

1. **Use virtual environments** to manage dependencies
2. **Implement proper error handling** for all routes
3. **Validate input data** before processing
4. **Use environment variables** for configuration
5. **Implement logging** for debugging and monitoring
6. **Add authentication** for protected endpoints
7. **Use a proper database** instead of in-memory data

## Next Steps

- Learn about Flask-SQLAlchemy for database integration
- Implement user authentication with Flask-Login
- Add API documentation with Flask-RESTX
- Deploy your API to cloud platforms like Heroku or AWS

## Conclusion

Flask provides an excellent foundation for building web APIs in Python. Its simplicity and flexibility make it perfect for both beginners and experienced developers. Start with this basic structure and gradually add more features as your application grows.`,
        excerpt:
          "Learn how to build a REST API with Python Flask, including CRUD operations, error handling, and best practices.",
        category: "Web Development",
        topicId: pythonTopicId,
        authorId: adminUser.id,
        published: true,
      },
      {
        title: "Java Collections Framework: ArrayList vs LinkedList",
        content: `# Java Collections Framework: ArrayList vs LinkedList

The Java Collections Framework provides several implementations of the List interface. Two of the most commonly used are ArrayList and LinkedList. Understanding their differences is crucial for writing efficient Java code.

## Overview

Both ArrayList and LinkedList implement the List interface, but they have different internal structures that affect their performance characteristics.

### ArrayList
- Backed by a dynamic array
- Good for random access
- Better memory efficiency
- Implements RandomAccess interface

### LinkedList
- Backed by a doubly-linked list
- Good for frequent insertions/deletions
- Implements Deque interface
- More memory overhead per element

## Performance Comparison

### Access Operations

\`\`\`java
import java.util.*;

public class ListPerformanceTest {
    public static void main(String[] args) {
        List<Integer> arrayList = new ArrayList<>();
        List<Integer> linkedList = new LinkedList<>();
        
        // Populate lists
        for (int i = 0; i < 100000; i++) {
            arrayList.add(i);
            linkedList.add(i);
        }
        
        // Test random access
        long startTime = System.nanoTime();
        for (int i = 0; i < 1000; i++) {
            int randomIndex = (int) (Math.random() * 100000);
            arrayList.get(randomIndex);
        }
        long arrayListTime = System.nanoTime() - startTime;
        
        startTime = System.nanoTime();
        for (int i = 0; i < 1000; i++) {
            int randomIndex = (int) (Math.random() * 100000);
            linkedList.get(randomIndex);
        }
        long linkedListTime = System.nanoTime() - startTime;
        
        System.out.println("ArrayList access time: " + arrayListTime + " ns");
        System.out.println("LinkedList access time: " + linkedListTime + " ns");
    }
}
\`\`\`

### Insertion Operations

\`\`\`java
public class InsertionTest {
    public static void testInsertion() {
        List<Integer> arrayList = new ArrayList<>();
        List<Integer> linkedList = new LinkedList<>();
        
        // Test insertion at beginning
        long startTime = System.nanoTime();
        for (int i = 0; i < 10000; i++) {
            arrayList.add(0, i);  // Insert at beginning
        }
        long arrayListTime = System.nanoTime() - startTime;
        
        startTime = System.nanoTime();
        for (int i = 0; i < 10000; i++) {
            linkedList.add(0, i);  // Insert at beginning
        }
        long linkedListTime = System.nanoTime() - startTime;
        
        System.out.println("ArrayList insertion time: " + arrayListTime + " ns");
        System.out.println("LinkedList insertion time: " + linkedListTime + " ns");
    }
}
\`\`\`

## Time Complexity Analysis

| Operation | ArrayList | LinkedList |
|-----------|-----------|------------|
| get(index) | O(1) | O(n) |
| add(element) | O(1) amortized | O(1) |
| add(index, element) | O(n) | O(n) |
| remove(index) | O(n) | O(n) |
| remove(element) | O(n) | O(n) |
| contains(element) | O(n) | O(n) |
| size() | O(1) | O(1) |

## Memory Usage

### ArrayList Memory Structure
\`\`\`java
// ArrayList stores elements in a continuous array
[element1][element2][element3][element4]...
// Each element takes up the size of the reference (8 bytes on 64-bit)
// Plus array overhead
\`\`\`

### LinkedList Memory Structure
\`\`\`java
// LinkedList stores elements in nodes
class Node {
    E item;          // 8 bytes (reference)
    Node next;       // 8 bytes (reference)
    Node prev;       // 8 bytes (reference)
    // Total: 24 bytes per node + element size
}
\`\`\`

## When to Use Each

### Use ArrayList When:
- You need frequent random access by index
- Memory usage is a concern
- You're doing more reading than writing
- You need to implement binary search

\`\`\`java
// Example: High-frequency trading system
public class TradingSystem {
    private List<Trade> trades = new ArrayList<>();
    
    public Trade getTrade(int index) {
        return trades.get(index);  // O(1) access
    }
    
    public List<Trade> findTradesByPrice(double price) {
        // Binary search requires random access
        int index = Collections.binarySearch(trades, 
            new Trade(price), Trade.PRICE_COMPARATOR);
        // Process results...
    }
}
\`\`\`

### Use LinkedList When:
- You frequently insert/delete at the beginning or middle
- You're implementing a queue or deque
- The list size varies significantly
- You don't need random access

\`\`\`java
// Example: Job queue implementation
public class JobQueue {
    private LinkedList<Job> jobs = new LinkedList<>();
    
    public void addJob(Job job) {
        jobs.addLast(job);  // O(1) operation
    }
    
    public Job getNextJob() {
        return jobs.removeFirst();  // O(1) operation
    }
    
    public void addPriorityJob(Job job) {
        jobs.addFirst(job);  // O(1) operation
    }
}
\`\`\`

## Best Practices

### 1. Choose Based on Usage Pattern
\`\`\`java
// For frequent access by index
List<String> names = new ArrayList<>();

// For frequent insertions/deletions
List<String> queue = new LinkedList<>();
\`\`\`

### 2. Consider Initial Capacity for ArrayList
\`\`\`java
// If you know the approximate size
List<Integer> numbers = new ArrayList<>(1000);
\`\`\`

### 3. Use Enhanced For Loop When Possible
\`\`\`java
// Efficient for both ArrayList and LinkedList
for (String item : list) {
    System.out.println(item);
}

// Avoid this with LinkedList
for (int i = 0; i < list.size(); i++) {
    System.out.println(list.get(i));  // O(n²) for LinkedList!
}
\`\`\`

### 4. Use Iterator for Safe Removal
\`\`\`java
Iterator<String> iterator = list.iterator();
while (iterator.hasNext()) {
    String item = iterator.next();
    if (shouldRemove(item)) {
        iterator.remove();  // Safe removal
    }
}
\`\`\`

## Conclusion

The choice between ArrayList and LinkedList depends on your specific use case:

- **ArrayList**: Better for read-heavy operations and random access
- **LinkedList**: Better for write-heavy operations at the beginning/middle

In most cases, ArrayList is the better choice due to its better cache locality and lower memory overhead. Use LinkedList only when you have a specific need for efficient insertion/deletion operations.

Understanding these differences will help you write more efficient Java applications and make informed decisions about data structure selection.`,
        excerpt:
          "Compare ArrayList and LinkedList performance characteristics, memory usage, and learn when to use each in your Java applications.",
        category: "Programming Languages",
        topicId: javaTopicId,
        authorId: adminUser.id,
        published: true,
      },
    ];

    // Sample notes data
    const sampleNotes = [
      {
        title: "Java Syntax Cheat Sheet",
        content: `# Java Syntax Quick Reference

## Basic Structure
\`\`\`java
public class ClassName {
    public static void main(String[] args) {
        // Your code here
    }
}
\`\`\`

## Data Types
- **Primitive Types**: int, double, boolean, char, byte, short, long, float
- **Reference Types**: String, Arrays, Objects

## Variables
\`\`\`java
int age = 25;
String name = "John";
final double PI = 3.14159;  // Constant
\`\`\`

## Control Structures
### If-Else
\`\`\`java
if (condition) {
    // code
} else if (anotherCondition) {
    // code
} else {
    // code
}
\`\`\`

### Loops
\`\`\`java
// For loop
for (int i = 0; i < 10; i++) {
    System.out.println(i);
}

// While loop
while (condition) {
    // code
}

// Enhanced for loop
for (String item : array) {
    System.out.println(item);
}
\`\`\`

## Methods
\`\`\`java
public static returnType methodName(parameters) {
    // method body
    return value;  // if returnType is not void
}
\`\`\`

## Arrays
\`\`\`java
int[] numbers = new int[5];
int[] values = {1, 2, 3, 4, 5};
String[] names = {"Alice", "Bob", "Charlie"};
\`\`\`

## Common String Methods
- \`length()\`: Get string length
- \`charAt(index)\`: Get character at index
- \`substring(start, end)\`: Extract substring
- \`toUpperCase()\` / \`toLowerCase()\`: Change case
- \`equals()\`: Compare strings
- \`contains()\`: Check if contains substring`,
        category: "Programming Languages",
        topicId: javaTopicId,
        authorId: adminUser.id,
      },
      {
        title: "Python List Comprehensions Guide",
        content: `# Python List Comprehensions

List comprehensions provide a concise way to create lists in Python.

## Basic Syntax
\`\`\`python
[expression for item in iterable]
\`\`\`

## Examples

### Basic List Comprehension
\`\`\`python
# Traditional way
squares = []
for x in range(10):
    squares.append(x**2)

# List comprehension
squares = [x**2 for x in range(10)]
\`\`\`

### With Conditions
\`\`\`python
# Even numbers only
evens = [x for x in range(20) if x % 2 == 0]

# Conditional expression
values = [x if x > 0 else 0 for x in [-1, 2, -3, 4]]
\`\`\`

### Nested Loops
\`\`\`python
# Matrix flattening
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
flattened = [num for row in matrix for num in row]
\`\`\`

### String Processing
\`\`\`python
words = ['hello', 'world', 'python']
uppercase = [word.upper() for word in words]
lengths = [len(word) for word in words]
\`\`\`

## Dictionary Comprehensions
\`\`\`python
# Create dictionary from lists
names = ['Alice', 'Bob', 'Charlie']
ages = [25, 30, 35]
people = {name: age for name, age in zip(names, ages)}

# Filter dictionary
filtered = {k: v for k, v in people.items() if v > 25}
\`\`\`

## Set Comprehensions
\`\`\`python
# Unique squares
unique_squares = {x**2 for x in [1, 2, 2, 3, 3, 4]}
\`\`\`

## Performance Tips
- Use list comprehensions for simple transformations
- Consider generator expressions for large datasets: \`(x**2 for x in range(1000000))\`
- Don't sacrifice readability for conciseness`,
        category: "Programming Languages",
        topicId: pythonTopicId,
        authorId: adminUser.id,
      },
      {
        title: "Git Commands Reference",
        content: `# Essential Git Commands

## Repository Setup
\`\`\`bash
git init                    # Initialize new repository
git clone <url>            # Clone remote repository
git remote add origin <url> # Add remote repository
\`\`\`

## Basic Workflow
\`\`\`bash
git status                 # Check working directory status
git add <file>            # Stage specific file
git add .                 # Stage all changes
git commit -m "message"   # Commit staged changes
git push origin main      # Push to remote repository
git pull origin main      # Pull from remote repository
\`\`\`

## Branching
\`\`\`bash
git branch                # List branches
git branch <name>         # Create new branch
git checkout <branch>     # Switch to branch
git checkout -b <branch>  # Create and switch to branch
git merge <branch>        # Merge branch into current
git branch -d <branch>    # Delete branch
\`\`\`

## Viewing History
\`\`\`bash
git log                   # View commit history
git log --oneline         # Compact log view
git log --graph           # Visual branch graph
git show <commit>         # Show specific commit
git diff                  # Show unstaged changes
git diff --staged         # Show staged changes
\`\`\`

## Undoing Changes
\`\`\`bash
git checkout -- <file>    # Discard working changes
git reset HEAD <file>     # Unstage file
git reset --soft HEAD~1   # Undo last commit (keep changes)
git reset --hard HEAD~1   # Undo last commit (discard changes)
git revert <commit>       # Create commit that undoes changes
\`\`\`

## Stashing
\`\`\`bash
git stash                 # Stash current changes
git stash pop             # Apply and remove last stash
git stash list            # List all stashes
git stash apply <stash>   # Apply specific stash
\`\`\`

## Configuration
\`\`\`bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
git config --list         # Show all configurations
\`\`\``,
        category: "Development Tools",
        topicId: null,
        authorId: adminUser.id,
      },
      {
        title: "Java Exception Handling Best Practices",
        content: `# Java Exception Handling Best Practices

## Exception Hierarchy
- **Throwable**: Root of all exceptions
  - **Error**: System-level errors (OutOfMemoryError)
  - **Exception**: Application-level exceptions
    - **RuntimeException**: Unchecked exceptions
    - **Checked Exceptions**: Must be handled or declared

## Try-Catch-Finally
\`\`\`java
try {
    // risky code
} catch (SpecificException e) {
    // handle specific exception
} catch (Exception e) {
    // handle general exception
} finally {
    // cleanup code (always executes)
}
\`\`\`

## Try-with-Resources
\`\`\`java
try (FileReader file = new FileReader("file.txt");
     BufferedReader buffer = new BufferedReader(file)) {
    
    return buffer.readLine();
} catch (IOException e) {
    System.err.println("Error reading file: " + e.getMessage());
}
// Resources automatically closed
\`\`\`

## Custom Exceptions
\`\`\`java
public class InsufficientFundsException extends Exception {
    private final double amount;
    private final double balance;
    
    public InsufficientFundsException(double amount, double balance) {
        super(String.format("Insufficient funds: tried to withdraw %.2f, balance is %.2f", 
              amount, balance));
        this.amount = amount;
        this.balance = balance;
    }
    
    public double getAmount() { return amount; }
    public double getBalance() { return balance; }
}
\`\`\`

## Best Practices
1. **Catch specific exceptions first**
2. **Don't catch and ignore exceptions**
3. **Use try-with-resources for cleanup**
4. **Create meaningful custom exceptions**
5. **Log exceptions appropriately**
6. **Don't use exceptions for control flow**

## Common Antipatterns
\`\`\`java
// DON'T DO THIS
try {
    // code
} catch (Exception e) {
    // empty catch block - BAD!
}

// DON'T DO THIS
public void method() throws Exception {
    // too generic - BAD!
}
\`\`\`

## Exception Safety Levels
1. **Basic Guarantee**: No resource leaks
2. **Strong Guarantee**: Operation succeeds or has no effect
3. **No-throw Guarantee**: Operation never throws exceptions`,
        category: "Programming Languages",
        topicId: javaTopicId,
        authorId: adminUser.id,
      },
      {
        title: "Python Virtual Environments Setup",
        content: `# Python Virtual Environments Guide

Virtual environments create isolated Python installations for each project, preventing dependency conflicts.

## Why Use Virtual Environments?
- Avoid dependency conflicts between projects
- Keep global Python installation clean
- Ensure reproducible development environments
- Easy dependency management

## Creating Virtual Environments

### Using venv (Python 3.3+)
\`\`\`bash
# Create virtual environment
python -m venv myproject_env

# Activate (Windows)
myproject_env\\Scripts\\activate

# Activate (macOS/Linux)
source myproject_env/bin/activate

# Deactivate
deactivate
\`\`\`

### Using virtualenv
\`\`\`bash
# Install virtualenv
pip install virtualenv

# Create environment
virtualenv myproject_env

# Activate/deactivate same as venv
\`\`\`

### Using conda
\`\`\`bash
# Create environment with specific Python version
conda create --name myproject python=3.9

# Activate
conda activate myproject

# Deactivate
conda deactivate
\`\`\`

## Managing Dependencies

### requirements.txt
\`\`\`bash
# Generate requirements file
pip freeze > requirements.txt

# Install from requirements
pip install -r requirements.txt
\`\`\`

### Example requirements.txt
\`\`\`
Flask==2.3.3
requests==2.31.0
numpy==1.24.3
pandas==2.0.3
\`\`\`

## Best Practices
1. **One environment per project**
2. **Always activate before working**
3. **Keep requirements.txt updated**
4. **Use .gitignore for environment folders**
5. **Document setup instructions**

## Common Workflow
\`\`\`bash
# Start new project
mkdir myproject
cd myproject
python -m venv venv
source venv/bin/activate  # or venv\\Scripts\\activate on Windows

# Install packages
pip install flask requests

# Save dependencies
pip freeze > requirements.txt

# When sharing project
git clone <project>
cd <project>
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
\`\`\`

## IDE Integration
- **VS Code**: Python extension automatically detects virtual environments
- **PyCharm**: Configure project interpreter to use virtual environment
- **Jupyter**: Install ipykernel in environment for notebook support

\`\`\`bash
# Make environment available in Jupyter
pip install ipykernel
python -m ipykernel install --user --name=myproject
\`\`\``,
        category: "Development Tools",
        topicId: pythonTopicId,
        authorId: adminUser.id,
      },
      {
        title: "Database Design Fundamentals",
        content: `# Database Design Fundamentals

## Normalization
Process of organizing data to reduce redundancy and improve data integrity.

### First Normal Form (1NF)
- Each column contains atomic (indivisible) values
- Each column contains values of the same type
- Each column has a unique name
- Order doesn't matter

### Second Normal Form (2NF)
- Must be in 1NF
- All non-key attributes are fully dependent on primary key
- Eliminates partial dependencies

### Third Normal Form (3NF)
- Must be in 2NF
- No transitive dependencies
- Non-key attributes depend only on primary key

## Entity-Relationship Modeling
### Entities
- Objects or concepts about which data is stored
- Example: Customer, Order, Product

### Attributes
- Properties that describe entities
- Example: Customer (name, email, phone)

### Relationships
- Connections between entities
- One-to-One, One-to-Many, Many-to-Many

## Primary Keys
- Uniquely identify each record
- Cannot be NULL
- Should be stable (not change)
- Consider surrogate keys (auto-increment IDs)

## Foreign Keys
- Reference primary key of another table
- Maintain referential integrity
- Can be NULL (unless specified otherwise)

## Indexes
- Improve query performance
- Trade-off: faster reads, slower writes
- Consider compound indexes for multi-column queries

## ACID Properties
- **Atomicity**: All or nothing transactions
- **Consistency**: Database remains in valid state
- **Isolation**: Concurrent transactions don't interfere
- **Durability**: Committed changes persist

## Best Practices
1. **Use meaningful table and column names**
2. **Choose appropriate data types**
3. **Implement proper constraints**
4. **Plan for scalability**
5. **Document your schema**
6. **Regular backups and maintenance**

## Common Mistakes
- Over-normalization (too many joins)
- Under-normalization (data redundancy)
- Poor naming conventions
- Missing indexes on foreign keys
- Not considering future requirements`,
        category: "Database Systems",
        topicId: null,
        authorId: adminUser.id,
      },
    ];

    // Create blogs
    console.log("📝 Creating sample blogs...");
    const createdBlogs = [];
    for (const blogData of sampleBlogs) {
      const blog = await prisma.blog.create({
        data: blogData,
      });
      createdBlogs.push(blog);
      console.log(`   ✅ Created blog: "${blog.title}"`);
    }

    // Create notes
    console.log("\n📋 Creating sample notes...");
    const createdNotes = [];
    for (const noteData of sampleNotes) {
      const note = await prisma.note.create({
        data: noteData,
      });
      createdNotes.push(note);
      console.log(`   ✅ Created note: "${note.title}"`);
    }

    console.log("\n🎉 Sample content creation completed!");
    console.log(`📊 Summary:`);
    console.log(`   - Created ${createdBlogs.length} blogs`);
    console.log(`   - Created ${createdNotes.length} notes`);
    console.log(
      `   - Total content items: ${createdBlogs.length + createdNotes.length}`
    );

    // Show what was created
    console.log("\n📚 Created Blogs:");
    createdBlogs.forEach((blog, index) => {
      console.log(`   ${index + 1}. ${blog.title} (${blog.category})`);
    });

    console.log("\n📝 Created Notes:");
    createdNotes.forEach((note, index) => {
      console.log(`   ${index + 1}. ${note.title} (${note.category})`);
    });
  } catch (error) {
    console.error("❌ Error creating sample content:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createSampleContent();
