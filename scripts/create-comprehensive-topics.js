const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Comprehensive topic structure for technical learning platform
const comprehensiveTopics = [
  {
    name: "Programming Languages",
    slug: "programming-languages",
    description: "Core programming languages and concepts",
    icon: "💻",
    order: 1,
    subTopics: [
      {
        name: "Java",
        slug: "java",
        description: "Complete Java programming guide from basics to advanced",
        icon: "☕",
        order: 1,
      },
      {
        name: "Python",
        slug: "python",
        description: "Python programming language and ecosystem",
        icon: "🐍",
        order: 2,
      },
      {
        name: "JavaScript",
        slug: "javascript",
        description: "JavaScript fundamentals and modern features",
        icon: "🟨",
        order: 3,
      },
      {
        name: "C++",
        slug: "cpp",
        description: "C++ programming language and system programming",
        icon: "⚡",
        order: 4,
      },
      {
        name: "Go",
        slug: "go",
        description: "Go programming language for modern development",
        icon: "🔵",
        order: 5,
      },
    ],
  },
  {
    name: "System Design",
    slug: "system-design",
    description: "System architecture and design principles",
    icon: "🏗️",
    order: 2,
    subTopics: [
      {
        name: "High Level Design",
        slug: "high-level-design",
        description: "Architecture patterns and system design principles",
        icon: "📐",
        order: 1,
      },
      {
        name: "Low Level Design",
        slug: "low-level-design",
        description: "Object-oriented design and design patterns",
        icon: "🔧",
        order: 2,
      },
      {
        name: "Scalability",
        slug: "scalability",
        description: "Building scalable and distributed systems",
        icon: "📈",
        order: 3,
      },
      {
        name: "Microservices",
        slug: "microservices",
        description: "Microservices architecture and patterns",
        icon: "🔗",
        order: 4,
      },
      {
        name: "Load Balancing",
        slug: "load-balancing",
        description: "Load balancing strategies and implementation",
        icon: "⚖️",
        order: 5,
      },
      {
        name: "Caching",
        slug: "system-caching",
        description: "System-level caching strategies",
        icon: "💾",
        order: 6,
      },
    ],
  },
  {
    name: "DBMS & Databases",
    slug: "dbms-databases",
    description: "Database management systems and data storage",
    icon: "🗄️",
    order: 3,
    subTopics: [
      {
        name: "SQL Fundamentals",
        slug: "sql-fundamentals",
        description: "SQL basics, queries, and database operations",
        icon: "📊",
        order: 1,
      },
      {
        name: "Database Design",
        slug: "database-design",
        description: "Normalization, ER diagrams, and schema design",
        icon: "📋",
        order: 2,
      },
      {
        name: "ACID Properties",
        slug: "acid-properties",
        description: "Transaction management and ACID principles",
        icon: "🔒",
        order: 3,
      },
      {
        name: "NoSQL Databases",
        slug: "nosql-databases",
        description: "MongoDB, Redis, Cassandra, and other NoSQL systems",
        icon: "🍃",
        order: 4,
      },
      {
        name: "Database Indexing",
        slug: "database-indexing",
        description: "Index types, optimization, and performance",
        icon: "🔍",
        order: 5,
      },
      {
        name: "Query Optimization",
        slug: "query-optimization",
        description: "SQL query performance and optimization techniques",
        icon: "⚡",
        order: 6,
      },
    ],
  },
  {
    name: "Computer Networks",
    slug: "computer-networks",
    description: "Networking protocols, concepts, and implementation",
    icon: "🌐",
    order: 4,
    subTopics: [
      {
        name: "OSI Model",
        slug: "osi-model",
        description: "Seven-layer OSI model and network protocols",
        icon: "📡",
        order: 1,
      },
      {
        name: "TCP/IP",
        slug: "tcp-ip",
        description: "TCP/IP protocol suite and implementation",
        icon: "🔗",
        order: 2,
      },
      {
        name: "HTTP/HTTPS",
        slug: "http-https",
        description: "Web protocols and secure communication",
        icon: "🔐",
        order: 3,
      },
      {
        name: "DNS",
        slug: "dns",
        description: "Domain Name System and resolution process",
        icon: "📛",
        order: 4,
      },
      {
        name: "Network Security",
        slug: "network-security",
        description: "Firewalls, VPNs, and network security protocols",
        icon: "🛡️",
        order: 5,
      },
      {
        name: "Load Balancers",
        slug: "network-load-balancers",
        description: "Network load balancing and traffic distribution",
        icon: "⚖️",
        order: 6,
      },
    ],
  },
  {
    name: "Data Structures & Algorithms",
    slug: "data-structures-algorithms",
    description: "Core computer science concepts and problem solving",
    icon: "🧮",
    order: 5,
    subTopics: [
      {
        name: "Arrays & Strings",
        slug: "arrays-strings",
        description: "Basic data structures and string manipulation",
        icon: "📝",
        order: 1,
      },
      {
        name: "Linked Lists",
        slug: "linked-lists",
        description: "Singly, doubly, and circular linked lists",
        icon: "🔗",
        order: 2,
      },
      {
        name: "Stacks & Queues",
        slug: "stacks-queues",
        description: "Linear data structures and their applications",
        icon: "📚",
        order: 3,
      },
      {
        name: "Trees",
        slug: "trees",
        description: "Binary trees, BST, AVL, and tree algorithms",
        icon: "🌳",
        order: 4,
      },
      {
        name: "Graphs",
        slug: "graphs",
        description: "Graph representations and traversal algorithms",
        icon: "🕸️",
        order: 5,
      },
      {
        name: "Dynamic Programming",
        slug: "dynamic-programming",
        description: "Optimization problems and memoization techniques",
        icon: "🎯",
        order: 6,
      },
    ],
  },
  {
    name: "Web Development",
    slug: "web-development",
    description: "Frontend and backend web development technologies",
    icon: "🌐",
    order: 6,
    subTopics: [
      {
        name: "HTTP vs HTTPS",
        slug: "http-vs-https",
        description: "Web security and protocol differences",
        icon: "🔒",
        order: 1,
      },
      {
        name: "WebSockets",
        slug: "websockets",
        description: "Real-time communication protocols",
        icon: "🔄",
        order: 2,
      },
      {
        name: "JWT",
        slug: "jwt",
        description: "JSON Web Tokens for authentication",
        icon: "🎫",
        order: 3,
      },
      {
        name: "Cookies",
        slug: "cookies",
        description: "Browser storage and session management",
        icon: "🍪",
        order: 4,
      },
      {
        name: "Caching Strategies",
        slug: "caching",
        description: "Web performance optimization techniques",
        icon: "💾",
        order: 5,
      },
      {
        name: "REST APIs",
        slug: "rest-apis",
        description: "RESTful API design and implementation",
        icon: "🔌",
        order: 6,
      },
    ],
  },
  {
    name: "Cloud & DevOps",
    slug: "cloud-devops",
    description: "Cloud computing and DevOps practices",
    icon: "☁️",
    order: 7,
    subTopics: [
      {
        name: "AWS",
        slug: "aws",
        description: "Amazon Web Services cloud platform",
        icon: "🟠",
        order: 1,
      },
      {
        name: "Docker",
        slug: "docker",
        description: "Containerization and Docker fundamentals",
        icon: "🐳",
        order: 2,
      },
      {
        name: "Kubernetes",
        slug: "kubernetes",
        description: "Container orchestration and management",
        icon: "⚓",
        order: 3,
      },
      {
        name: "CI/CD",
        slug: "ci-cd",
        description: "Continuous integration and deployment",
        icon: "🔄",
        order: 4,
      },
      {
        name: "Infrastructure as Code",
        slug: "infrastructure-as-code",
        description: "IaC tools and automation practices",
        icon: "📜",
        order: 5,
      },
      {
        name: "Monitoring",
        slug: "monitoring",
        description: "Application and infrastructure monitoring",
        icon: "📊",
        order: 6,
      },
    ],
  },
  {
    name: "Data Science & AI",
    slug: "data-science",
    description: "Data analysis, machine learning, and artificial intelligence",
    icon: "🤖",
    order: 8,
    subTopics: [
      {
        name: "Machine Learning",
        slug: "machine-learning",
        description: "ML algorithms and model training",
        icon: "🧠",
        order: 1,
      },
      {
        name: "Deep Learning",
        slug: "deep-learning",
        description: "Neural networks and deep learning frameworks",
        icon: "🕳️",
        order: 2,
      },
      {
        name: "Data Analysis",
        slug: "data-analysis",
        description: "Statistical analysis and data visualization",
        icon: "📈",
        order: 3,
      },
      {
        name: "Natural Language Processing",
        slug: "nlp",
        description: "Text processing and language understanding",
        icon: "💬",
        order: 4,
      },
      {
        name: "Computer Vision",
        slug: "computer-vision",
        description: "Image processing and recognition",
        icon: "👁️",
        order: 5,
      },
      {
        name: "Data Engineering",
        slug: "data-engineering",
        description: "Data pipelines and infrastructure",
        icon: "🔧",
        order: 6,
      },
    ],
  },
];

async function createComprehensiveTopics() {
  try {
    console.log("🚀 Creating Comprehensive Topic Structure...");

    const user = await prisma.user.findFirst();
    if (!user) {
      throw new Error("No users found. Please create a user first.");
    }

    // First, remove the Interviews topic if it exists
    console.log("\n🗑️ Removing Interviews topic...");
    const interviewsTopic = await prisma.topic.findFirst({
      where: { slug: "interviews" },
    });

    if (interviewsTopic) {
      // Delete related subtopics first
      await prisma.subTopic.deleteMany({
        where: { topicId: interviewsTopic.id },
      });

      // Delete the topic
      await prisma.topic.delete({
        where: { id: interviewsTopic.id },
      });
      console.log("✅ Removed Interviews topic");
    } else {
      console.log("ℹ️ Interviews topic not found");
    } // Create or update all comprehensive topics
    for (const topicData of comprehensiveTopics) {
      console.log(`\n📁 Processing topic: ${topicData.name}`);

      // Check if topic exists by name or slug
      let topic = await prisma.topic.findFirst({
        where: {
          OR: [{ slug: topicData.slug }, { name: topicData.name }],
        },
      });

      if (topic) {
        // Update existing topic
        topic = await prisma.topic.update({
          where: { id: topic.id },
          data: {
            name: topicData.name,
            slug: topicData.slug,
            description: topicData.description,
            icon: topicData.icon,
            order: topicData.order,
          },
        });
        console.log(`✅ Updated topic: ${topicData.name}`);
      } else {
        // Create new topic
        topic = await prisma.topic.create({
          data: {
            name: topicData.name,
            slug: topicData.slug,
            description: topicData.description,
            icon: topicData.icon,
            order: topicData.order,
            authorId: user.id,
          },
        });
        console.log(`✅ Created topic: ${topicData.name}`);
      }

      // Create subtopics
      for (const subTopicData of topicData.subTopics) {
        const subTopic = await prisma.subTopic.upsert({
          where: {
            topicId_slug: {
              topicId: topic.id,
              slug: subTopicData.slug,
            },
          },
          update: {
            name: subTopicData.name,
            description: subTopicData.description,
            icon: subTopicData.icon,
            order: subTopicData.order,
          },
          create: {
            name: subTopicData.name,
            slug: subTopicData.slug,
            description: subTopicData.description,
            icon: subTopicData.icon,
            order: subTopicData.order,
            topicId: topic.id,
            authorId: user.id,
          },
        });

        console.log(
          `  ✅ ${subTopic.id ? "Updated" : "Created"} subtopic: ${
            subTopicData.name
          }`
        );
      }
    }

    console.log("\n✅ Successfully created comprehensive topic structure!");
    console.log("\n📋 Topics created:");
    comprehensiveTopics.forEach((topic, index) => {
      console.log(
        `${index + 1}. ${topic.name} (${topic.subTopics.length} subtopics)`
      );
    });
  } catch (error) {
    console.error("❌ Error creating comprehensive topics:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createComprehensiveTopics();
