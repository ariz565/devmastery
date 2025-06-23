const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createJavaTableOfContents() {
  console.log("Creating Java Table of Contents...");

  // Find Java topic
  const javaTopic = await prisma.topic.findFirst({
    where: { slug: "java" },
  });

  if (!javaTopic) {
    console.log("Java topic not found. Please create it first.");
    return;
  }

  const javaTableOfContents = [
    // Level 1 - Main Topics
    {
      title: "Java Basics",
      slug: "java-basics",
      description: "Introduction to Java programming language fundamentals",
      order: 1,
      level: 1,
      contentType: "section",
      estimatedReadTime: 0,
      difficulty: "beginner",
      isPublished: true,
    },
    {
      title: "Object-Oriented Programming",
      slug: "oop-concepts",
      description: "Core OOP principles in Java",
      order: 2,
      level: 1,
      contentType: "section",
      estimatedReadTime: 0,
      difficulty: "intermediate",
      isPublished: true,
    },
    {
      title: "Advanced Java",
      slug: "advanced-java",
      description: "Advanced Java concepts and features",
      order: 3,
      level: 1,
      contentType: "section",
      estimatedReadTime: 0,
      difficulty: "advanced",
      isPublished: true,
    },
  ];

  // Create main topics first
  const createdMainTopics = [];
  for (const item of javaTableOfContents) {
    const created = await prisma.tableOfContents.create({
      data: {
        ...item,
        topicId: javaTopic.id,
      },
    });
    createdMainTopics.push(created);
    console.log(`✅ Created main topic: ${created.title}`);
  }

  // Level 2 - Subtopics for Java Basics
  const javaBasicsSubtopics = [
    {
      title: "Introduction to Java",
      slug: "introduction-to-java",
      description: "What is Java? History, features, and advantages",
      order: 1,
      level: 2,
      contentType: "blog",
      estimatedReadTime: 10,
      difficulty: "beginner",
      isPublished: true,
      parentId: createdMainTopics[0].id,
    },
    {
      title: "Setting up Development Environment",
      slug: "java-development-setup",
      description: "Installing JDK, IDE setup, and first program",
      order: 2,
      level: 2,
      contentType: "blog",
      estimatedReadTime: 15,
      difficulty: "beginner",
      isPublished: true,
      parentId: createdMainTopics[0].id,
    },
    {
      title: "Variables and Data Types",
      slug: "java-variables-data-types",
      description: "Primitive and reference data types in Java",
      order: 3,
      level: 2,
      contentType: "blog",
      estimatedReadTime: 12,
      difficulty: "beginner",
      isPublished: true,
      parentId: createdMainTopics[0].id,
    },
    {
      title: "Operators in Java",
      slug: "java-operators",
      description: "Arithmetic, logical, and bitwise operators",
      order: 4,
      level: 2,
      contentType: "note",
      estimatedReadTime: 8,
      difficulty: "beginner",
      isPublished: true,
      parentId: createdMainTopics[0].id,
    },
    {
      title: "Control Flow Statements",
      slug: "java-control-flow",
      description: "if-else, switch, loops (for, while, do-while)",
      order: 5,
      level: 2,
      contentType: "blog",
      estimatedReadTime: 20,
      difficulty: "beginner",
      isPublished: true,
      parentId: createdMainTopics[0].id,
    },
    {
      title: "Arrays in Java",
      slug: "java-arrays",
      description: "Single and multi-dimensional arrays",
      order: 6,
      level: 2,
      contentType: "blog",
      estimatedReadTime: 15,
      difficulty: "beginner",
      isPublished: true,
      parentId: createdMainTopics[0].id,
    },
    {
      title: "Methods and Functions",
      slug: "java-methods",
      description: "Method declaration, parameters, return types, overloading",
      order: 7,
      level: 2,
      contentType: "blog",
      estimatedReadTime: 18,
      difficulty: "beginner",
      isPublished: true,
      parentId: createdMainTopics[0].id,
    },
  ];

  // Create Java Basics subtopics
  const createdBasicsSubtopics = [];
  for (const item of javaBasicsSubtopics) {
    const created = await prisma.tableOfContents.create({
      data: {
        ...item,
        topicId: javaTopic.id,
      },
    });
    createdBasicsSubtopics.push(created);
    console.log(`✅ Created basics subtopic: ${created.title}`);
  }

  // Level 2 - Subtopics for OOP
  const oopSubtopics = [
    {
      title: "Classes and Objects",
      slug: "java-classes-objects",
      description: "Creating classes, objects, constructors, and destructors",
      order: 1,
      level: 2,
      contentType: "blog",
      estimatedReadTime: 25,
      difficulty: "intermediate",
      isPublished: true,
      parentId: createdMainTopics[1].id,
    },
    {
      title: "Inheritance",
      slug: "java-inheritance",
      description: "extends keyword, super keyword, method overriding",
      order: 2,
      level: 2,
      contentType: "blog",
      estimatedReadTime: 20,
      difficulty: "intermediate",
      isPublished: true,
      parentId: createdMainTopics[1].id,
    },
    {
      title: "Polymorphism",
      slug: "java-polymorphism",
      description: "Method overloading, overriding, dynamic binding",
      order: 3,
      level: 2,
      contentType: "blog",
      estimatedReadTime: 18,
      difficulty: "intermediate",
      isPublished: true,
      parentId: createdMainTopics[1].id,
    },
    {
      title: "Encapsulation",
      slug: "java-encapsulation",
      description: "Access modifiers, getters, setters, data hiding",
      order: 4,
      level: 2,
      contentType: "note",
      estimatedReadTime: 12,
      difficulty: "intermediate",
      isPublished: true,
      parentId: createdMainTopics[1].id,
    },
    {
      title: "Abstraction",
      slug: "java-abstraction",
      description: "Abstract classes, interfaces, abstract methods",
      order: 5,
      level: 2,
      contentType: "blog",
      estimatedReadTime: 22,
      difficulty: "intermediate",
      isPublished: true,
      parentId: createdMainTopics[1].id,
    },
    {
      title: "Static Keyword",
      slug: "java-static-keyword",
      description: "Static variables, methods, blocks, and nested classes",
      order: 6,
      level: 2,
      contentType: "note",
      estimatedReadTime: 15,
      difficulty: "intermediate",
      isPublished: true,
      parentId: createdMainTopics[1].id,
    },
    {
      title: "this and super Keywords",
      slug: "java-this-super-keywords",
      description: "Understanding this and super references",
      order: 7,
      level: 2,
      contentType: "note",
      estimatedReadTime: 10,
      difficulty: "intermediate",
      isPublished: true,
      parentId: createdMainTopics[1].id,
    },
  ];

  // Create OOP subtopics
  const createdOOPSubtopics = [];
  for (const item of oopSubtopics) {
    const created = await prisma.tableOfContents.create({
      data: {
        ...item,
        topicId: javaTopic.id,
      },
    });
    createdOOPSubtopics.push(created);
    console.log(`✅ Created OOP subtopic: ${created.title}`);
  }

  // Level 2 - Subtopics for Advanced Java
  const advancedSubtopics = [
    {
      title: "Collections Framework",
      slug: "java-collections-framework",
      description: "List, Set, Map, Queue interfaces and implementations",
      order: 1,
      level: 2,
      contentType: "blog",
      estimatedReadTime: 30,
      difficulty: "advanced",
      isPublished: true,
      parentId: createdMainTopics[2].id,
    },
    {
      title: "Multithreading",
      slug: "java-multithreading",
      description: "Thread creation, synchronization, thread pool",
      order: 2,
      level: 2,
      contentType: "blog",
      estimatedReadTime: 35,
      difficulty: "advanced",
      isPublished: true,
      parentId: createdMainTopics[2].id,
    },
    {
      title: "Exception Handling",
      slug: "java-exception-handling",
      description: "try-catch, throw, throws, custom exceptions",
      order: 3,
      level: 2,
      contentType: "blog",
      estimatedReadTime: 25,
      difficulty: "advanced",
      isPublished: true,
      parentId: createdMainTopics[2].id,
    },
    {
      title: "File I/O and Streams",
      slug: "java-file-io-streams",
      description: "File handling, byte streams, character streams",
      order: 4,
      level: 2,
      contentType: "blog",
      estimatedReadTime: 28,
      difficulty: "advanced",
      isPublished: true,
      parentId: createdMainTopics[2].id,
    },
    {
      title: "Generics",
      slug: "java-generics",
      description: "Generic classes, methods, wildcards, type erasure",
      order: 5,
      level: 2,
      contentType: "blog",
      estimatedReadTime: 20,
      difficulty: "advanced",
      isPublished: true,
      parentId: createdMainTopics[2].id,
    },
    {
      title: "Lambda Expressions and Streams",
      slug: "java-lambda-streams",
      description: "Functional programming, lambda expressions, Stream API",
      order: 6,
      level: 2,
      contentType: "blog",
      estimatedReadTime: 32,
      difficulty: "advanced",
      isPublished: true,
      parentId: createdMainTopics[2].id,
    },
    {
      title: "Design Patterns",
      slug: "java-design-patterns",
      description: "Common design patterns implementation in Java",
      order: 7,
      level: 2,
      contentType: "blog",
      estimatedReadTime: 40,
      difficulty: "advanced",
      isPublished: true,
      parentId: createdMainTopics[2].id,
    },
  ];

  // Create Advanced Java subtopics
  const createdAdvancedSubtopics = [];
  for (const item of advancedSubtopics) {
    const created = await prisma.tableOfContents.create({
      data: {
        ...item,
        topicId: javaTopic.id,
      },
    });
    createdAdvancedSubtopics.push(created);
    console.log(`✅ Created advanced subtopic: ${created.title}`);
  }

  // Level 3 - Sub-subtopics for Collections Framework
  const collectionsFrameworkId = createdAdvancedSubtopics.find(
    (item) => item.slug === "java-collections-framework"
  );

  if (collectionsFrameworkId) {
    const collectionsSubSubtopics = [
      {
        title: "ArrayList vs LinkedList",
        slug: "arraylist-vs-linkedlist",
        description: "Comparison of ArrayList and LinkedList performance",
        order: 1,
        level: 3,
        contentType: "note",
        estimatedReadTime: 8,
        difficulty: "advanced",
        isPublished: true,
        parentId: collectionsFrameworkId.id,
      },
      {
        title: "HashMap Implementation",
        slug: "hashmap-implementation",
        description: "Internal working of HashMap, hash collision handling",
        order: 2,
        level: 3,
        contentType: "blog",
        estimatedReadTime: 15,
        difficulty: "advanced",
        isPublished: true,
        parentId: collectionsFrameworkId.id,
      },
      {
        title: "TreeMap and TreeSet",
        slug: "treemap-treeset",
        description: "Sorted collections using Red-Black trees",
        order: 3,
        level: 3,
        contentType: "note",
        estimatedReadTime: 12,
        difficulty: "advanced",
        isPublished: true,
        parentId: collectionsFrameworkId.id,
      },
      {
        title: "Concurrent Collections",
        slug: "concurrent-collections",
        description:
          "Thread-safe collections: ConcurrentHashMap, CopyOnWriteArrayList",
        order: 4,
        level: 3,
        contentType: "blog",
        estimatedReadTime: 18,
        difficulty: "advanced",
        isPublished: true,
        parentId: collectionsFrameworkId.id,
      },
    ];

    for (const item of collectionsSubSubtopics) {
      const created = await prisma.tableOfContents.create({
        data: {
          ...item,
          topicId: javaTopic.id,
        },
      });
      console.log(`✅ Created collections sub-subtopic: ${created.title}`);
    }
  }

  // Level 3 - Sub-subtopics for Multithreading
  const multithreadingId = createdAdvancedSubtopics.find(
    (item) => item.slug === "java-multithreading"
  );

  if (multithreadingId) {
    const multithreadingSubSubtopics = [
      {
        title: "Thread Lifecycle",
        slug: "thread-lifecycle",
        description: "Understanding thread states and transitions",
        order: 1,
        level: 3,
        contentType: "note",
        estimatedReadTime: 10,
        difficulty: "advanced",
        isPublished: true,
        parentId: multithreadingId.id,
      },
      {
        title: "Synchronization Mechanisms",
        slug: "synchronization-mechanisms",
        description: "synchronized, locks, semaphores, and barriers",
        order: 2,
        level: 3,
        contentType: "blog",
        estimatedReadTime: 20,
        difficulty: "advanced",
        isPublished: true,
        parentId: multithreadingId.id,
      },
      {
        title: "ExecutorService and Thread Pools",
        slug: "executor-service-thread-pools",
        description: "Managing thread pools and async execution",
        order: 3,
        level: 3,
        contentType: "blog",
        estimatedReadTime: 25,
        difficulty: "advanced",
        isPublished: true,
        parentId: multithreadingId.id,
      },
    ];

    for (const item of multithreadingSubSubtopics) {
      const created = await prisma.tableOfContents.create({
        data: {
          ...item,
          topicId: javaTopic.id,
        },
      });
      console.log(`✅ Created multithreading sub-subtopic: ${created.title}`);
    }
  }

  console.log("✅ Java Table of Contents created successfully!");
  console.log(
    `📚 Total items created: ${await prisma.tableOfContents.count({
      where: { topicId: javaTopic.id },
    })}`
  );
}

createJavaTableOfContents()
  .catch((e) => {
    console.error("❌ Error creating Java table of contents:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
