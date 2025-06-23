const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createPythonTableOfContents() {
  console.log("Creating Python Table of Contents...");

  // Find Python topic
  const pythonTopic = await prisma.topic.findFirst({
    where: { slug: "python" },
  });

  if (!pythonTopic) {
    console.log("Python topic not found. Please create it first.");
    return;
  }

  const pythonTableOfContents = [
    // Level 1 - Main Topics
    {
      title: "Python Fundamentals",
      slug: "python-fundamentals",
      description: "Basic Python programming concepts and syntax",
      order: 1,
      level: 1,
      contentType: "section",
      estimatedReadTime: 0,
      difficulty: "beginner",
      isPublished: true,
    },
    {
      title: "Data Structures and Algorithms",
      slug: "python-data-structures",
      description: "Built-in data structures and algorithmic thinking",
      order: 2,
      level: 1,
      contentType: "section",
      estimatedReadTime: 0,
      difficulty: "intermediate",
      isPublished: true,
    },
    {
      title: "Object-Oriented Programming",
      slug: "python-oop",
      description: "Classes, objects, inheritance, and design patterns",
      order: 3,
      level: 1,
      contentType: "section",
      estimatedReadTime: 0,
      difficulty: "intermediate",
      isPublished: true,
    },
    {
      title: "Advanced Python",
      slug: "python-advanced",
      description: "Advanced features, decorators, generators, and more",
      order: 4,
      level: 1,
      contentType: "section",
      estimatedReadTime: 0,
      difficulty: "advanced",
      isPublished: true,
    },
    {
      title: "Libraries and Frameworks",
      slug: "python-libraries",
      description: "Popular Python libraries and frameworks",
      order: 5,
      level: 1,
      contentType: "section",
      estimatedReadTime: 0,
      difficulty: "advanced",
      isPublished: true,
    },
  ];

  // Create main topics first
  const createdMainTopics = [];
  for (const item of pythonTableOfContents) {
    const created = await prisma.tableOfContents.create({
      data: {
        ...item,
        topicId: pythonTopic.id,
      },
    });
    createdMainTopics.push(created);
    console.log(`✅ Created main topic: ${created.title}`);
  }

  // Level 2 - Subtopics for Python Fundamentals
  const fundamentalsSubtopics = [
    {
      title: "Introduction to Python",
      slug: "python-introduction",
      description: "What is Python? Installation and setup",
      order: 1,
      level: 2,
      contentType: "blog",
      estimatedReadTime: 8,
      difficulty: "beginner",
      isPublished: true,
      parentId: createdMainTopics[0].id,
    },
    {
      title: "Variables and Data Types",
      slug: "python-variables-datatypes",
      description: "Numbers, strings, booleans, and type conversion",
      order: 2,
      level: 2,
      contentType: "blog",
      estimatedReadTime: 12,
      difficulty: "beginner",
      isPublished: true,
      parentId: createdMainTopics[0].id,
    },
    {
      title: "Operators and Expressions",
      slug: "python-operators",
      description: "Arithmetic, comparison, logical, and assignment operators",
      order: 3,
      level: 2,
      contentType: "note",
      estimatedReadTime: 10,
      difficulty: "beginner",
      isPublished: true,
      parentId: createdMainTopics[0].id,
    },
    {
      title: "Control Structures",
      slug: "python-control-structures",
      description: "if-elif-else, for loops, while loops, break and continue",
      order: 4,
      level: 2,
      contentType: "blog",
      estimatedReadTime: 18,
      difficulty: "beginner",
      isPublished: true,
      parentId: createdMainTopics[0].id,
    },
    {
      title: "Functions",
      slug: "python-functions",
      description: "Defining functions, parameters, return values, scope",
      order: 5,
      level: 2,
      contentType: "blog",
      estimatedReadTime: 20,
      difficulty: "beginner",
      isPublished: true,
      parentId: createdMainTopics[0].id,
    },
    {
      title: "Input/Output and File Handling",
      slug: "python-io-files",
      description: "Reading user input, file operations, and error handling",
      order: 6,
      level: 2,
      contentType: "blog",
      estimatedReadTime: 15,
      difficulty: "beginner",
      isPublished: true,
      parentId: createdMainTopics[0].id,
    },
  ];

  // Create Python Fundamentals subtopics
  for (const item of fundamentalsSubtopics) {
    const created = await prisma.tableOfContents.create({
      data: {
        ...item,
        topicId: pythonTopic.id,
      },
    });
    console.log(`✅ Created fundamentals subtopic: ${created.title}`);
  }

  // Level 2 - Subtopics for Data Structures
  const dataStructuresSubtopics = [
    {
      title: "Lists and Tuples",
      slug: "python-lists-tuples",
      description: "Working with ordered collections",
      order: 1,
      level: 2,
      contentType: "blog",
      estimatedReadTime: 15,
      difficulty: "intermediate",
      isPublished: true,
      parentId: createdMainTopics[1].id,
    },
    {
      title: "Dictionaries and Sets",
      slug: "python-dictionaries-sets",
      description: "Key-value pairs and unique collections",
      order: 2,
      level: 2,
      contentType: "blog",
      estimatedReadTime: 18,
      difficulty: "intermediate",
      isPublished: true,
      parentId: createdMainTopics[1].id,
    },
    {
      title: "String Manipulation",
      slug: "python-strings",
      description: "String methods, formatting, and regular expressions",
      order: 3,
      level: 2,
      contentType: "blog",
      estimatedReadTime: 20,
      difficulty: "intermediate",
      isPublished: true,
      parentId: createdMainTopics[1].id,
    },
    {
      title: "List Comprehensions",
      slug: "python-list-comprehensions",
      description: "Efficient list creation and filtering",
      order: 4,
      level: 2,
      contentType: "note",
      estimatedReadTime: 12,
      difficulty: "intermediate",
      isPublished: true,
      parentId: createdMainTopics[1].id,
    },
    {
      title: "Sorting and Searching",
      slug: "python-sorting-searching",
      description: "Built-in sorting functions and search algorithms",
      order: 5,
      level: 2,
      contentType: "blog",
      estimatedReadTime: 22,
      difficulty: "intermediate",
      isPublished: true,
      parentId: createdMainTopics[1].id,
    },
  ];

  // Create Data Structures subtopics
  for (const item of dataStructuresSubtopics) {
    const created = await prisma.tableOfContents.create({
      data: {
        ...item,
        topicId: pythonTopic.id,
      },
    });
    console.log(`✅ Created data structures subtopic: ${created.title}`);
  }

  // Level 2 - Subtopics for OOP
  const oopSubtopics = [
    {
      title: "Classes and Objects",
      slug: "python-classes-objects",
      description: "Creating classes, instantiating objects, __init__ method",
      order: 1,
      level: 2,
      contentType: "blog",
      estimatedReadTime: 25,
      difficulty: "intermediate",
      isPublished: true,
      parentId: createdMainTopics[2].id,
    },
    {
      title: "Inheritance and Polymorphism",
      slug: "python-inheritance",
      description: "Class inheritance, method overriding, super()",
      order: 2,
      level: 2,
      contentType: "blog",
      estimatedReadTime: 20,
      difficulty: "intermediate",
      isPublished: true,
      parentId: createdMainTopics[2].id,
    },
    {
      title: "Encapsulation and Properties",
      slug: "python-encapsulation",
      description: "Private methods, getters/setters, @property decorator",
      order: 3,
      level: 2,
      contentType: "blog",
      estimatedReadTime: 18,
      difficulty: "intermediate",
      isPublished: true,
      parentId: createdMainTopics[2].id,
    },
    {
      title: "Magic Methods",
      slug: "python-magic-methods",
      description: "__str__, __repr__, __len__, operator overloading",
      order: 4,
      level: 2,
      contentType: "note",
      estimatedReadTime: 15,
      difficulty: "intermediate",
      isPublished: true,
      parentId: createdMainTopics[2].id,
    },
  ];

  // Create OOP subtopics
  for (const item of oopSubtopics) {
    const created = await prisma.tableOfContents.create({
      data: {
        ...item,
        topicId: pythonTopic.id,
      },
    });
    console.log(`✅ Created OOP subtopic: ${created.title}`);
  }

  // Level 2 - Subtopics for Advanced Python
  const advancedSubtopics = [
    {
      title: "Decorators",
      slug: "python-decorators",
      description: "Function decorators, class decorators, built-in decorators",
      order: 1,
      level: 2,
      contentType: "blog",
      estimatedReadTime: 25,
      difficulty: "advanced",
      isPublished: true,
      parentId: createdMainTopics[3].id,
    },
    {
      title: "Generators and Iterators",
      slug: "python-generators",
      description: "yield keyword, iterator protocol, generator expressions",
      order: 2,
      level: 2,
      contentType: "blog",
      estimatedReadTime: 20,
      difficulty: "advanced",
      isPublished: true,
      parentId: createdMainTopics[3].id,
    },
    {
      title: "Context Managers",
      slug: "python-context-managers",
      description: "with statement, __enter__ and __exit__ methods",
      order: 3,
      level: 2,
      contentType: "note",
      estimatedReadTime: 12,
      difficulty: "advanced",
      isPublished: true,
      parentId: createdMainTopics[3].id,
    },
    {
      title: "Metaclasses",
      slug: "python-metaclasses",
      description: "Understanding metaclasses and class creation",
      order: 4,
      level: 2,
      contentType: "blog",
      estimatedReadTime: 30,
      difficulty: "advanced",
      isPublished: true,
      parentId: createdMainTopics[3].id,
    },
    {
      title: "Async Programming",
      slug: "python-async",
      description: "asyncio, async/await, concurrent programming",
      order: 5,
      level: 2,
      contentType: "blog",
      estimatedReadTime: 35,
      difficulty: "advanced",
      isPublished: true,
      parentId: createdMainTopics[3].id,
    },
  ];

  // Create Advanced Python subtopics
  for (const item of advancedSubtopics) {
    const created = await prisma.tableOfContents.create({
      data: {
        ...item,
        topicId: pythonTopic.id,
      },
    });
    console.log(`✅ Created advanced subtopic: ${created.title}`);
  }

  // Level 2 - Subtopics for Libraries and Frameworks
  const librariesSubtopics = [
    {
      title: "NumPy and Pandas",
      slug: "python-numpy-pandas",
      description: "Data analysis and numerical computing",
      order: 1,
      level: 2,
      contentType: "blog",
      estimatedReadTime: 40,
      difficulty: "advanced",
      isPublished: true,
      parentId: createdMainTopics[4].id,
    },
    {
      title: "Web Development with Flask/Django",
      slug: "python-web-frameworks",
      description: "Building web applications with Python frameworks",
      order: 2,
      level: 2,
      contentType: "blog",
      estimatedReadTime: 45,
      difficulty: "advanced",
      isPublished: true,
      parentId: createdMainTopics[4].id,
    },
    {
      title: "Data Visualization",
      slug: "python-data-visualization",
      description: "Matplotlib, Seaborn, Plotly for creating charts",
      order: 3,
      level: 2,
      contentType: "blog",
      estimatedReadTime: 30,
      difficulty: "advanced",
      isPublished: true,
      parentId: createdMainTopics[4].id,
    },
    {
      title: "Machine Learning with scikit-learn",
      slug: "python-machine-learning",
      description: "Introduction to ML algorithms and implementation",
      order: 4,
      level: 2,
      contentType: "blog",
      estimatedReadTime: 50,
      difficulty: "advanced",
      isPublished: true,
      parentId: createdMainTopics[4].id,
    },
    {
      title: "Testing with pytest",
      slug: "python-testing",
      description: "Unit testing, fixtures, mocking, and test coverage",
      order: 5,
      level: 2,
      contentType: "blog",
      estimatedReadTime: 25,
      difficulty: "advanced",
      isPublished: true,
      parentId: createdMainTopics[4].id,
    },
  ];

  // Create Libraries subtopics
  for (const item of librariesSubtopics) {
    const created = await prisma.tableOfContents.create({
      data: {
        ...item,
        topicId: pythonTopic.id,
      },
    });
    console.log(`✅ Created libraries subtopic: ${created.title}`);
  }

  console.log("✅ Python Table of Contents created successfully!");
  console.log(
    `📚 Total items created: ${await prisma.tableOfContents.count({
      where: { topicId: pythonTopic.id },
    })}`
  );
}

createPythonTableOfContents()
  .catch((e) => {
    console.error("❌ Error creating Python table of contents:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
