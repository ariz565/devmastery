const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const topics = [
  {
    name: "Frontend Development",
    slug: "frontend",
    description: "Client-side web development technologies and frameworks",
    icon: "🎨",
    order: 1,
    subTopics: [
      {
        name: "React",
        slug: "react",
        description: "JavaScript library for building user interfaces",
        icon: "⚛️",
        order: 1,
      },
      {
        name: "Next.js",
        slug: "nextjs",
        description: "Full-stack React framework",
        icon: "▲",
        order: 2,
      },
      {
        name: "Vue.js",
        slug: "vue",
        description: "Progressive JavaScript framework",
        icon: "💚",
        order: 3,
      },
      {
        name: "Angular",
        slug: "angular",
        description: "Platform for building web applications",
        icon: "🅰️",
        order: 4,
      },
      {
        name: "Svelte",
        slug: "svelte",
        description: "Cybernetically enhanced web apps",
        icon: "🧡",
        order: 5,
      },
      {
        name: "TypeScript",
        slug: "typescript",
        description: "Typed superset of JavaScript",
        icon: "🔷",
        order: 6,
      },
      {
        name: "CSS/SCSS",
        slug: "css",
        description: "Styling and layout techniques",
        icon: "🎨",
        order: 7,
      },
      {
        name: "Tailwind CSS",
        slug: "tailwind",
        description: "Utility-first CSS framework",
        icon: "💨",
        order: 8,
      },
    ],
  },
  {
    name: "Backend Development",
    slug: "backend",
    description: "Server-side development and APIs",
    icon: "⚙️",
    order: 2,
    subTopics: [
      {
        name: "Node.js",
        slug: "nodejs",
        description: "JavaScript runtime for server-side development",
        icon: "💚",
        order: 1,
      },
      {
        name: "Express.js",
        slug: "express",
        description: "Fast, unopinionated web framework for Node.js",
        icon: "🚂",
        order: 2,
      },
      {
        name: "NestJS",
        slug: "nestjs",
        description: "Progressive Node.js framework",
        icon: "🐱",
        order: 3,
      },
      {
        name: "Django",
        slug: "django",
        description: "High-level Python web framework",
        icon: "🐍",
        order: 4,
      },
      {
        name: "Flask",
        slug: "flask",
        description: "Lightweight Python web framework",
        icon: "🌶️",
        order: 5,
      },
      {
        name: "Spring Boot",
        slug: "spring-boot",
        description: "Java framework for microservices",
        icon: "🍃",
        order: 6,
      },
      {
        name: "ASP.NET Core",
        slug: "aspnet-core",
        description: "Cross-platform .NET framework",
        icon: "🔵",
        order: 7,
      },
      {
        name: "Go/Golang",
        slug: "golang",
        description: "Modern systems programming language",
        icon: "🐹",
        order: 8,
      },
      {
        name: "Rust",
        slug: "rust",
        description: "Systems programming language",
        icon: "🦀",
        order: 9,
      },
    ],
  },
  {
    name: "Database Systems",
    slug: "databases",
    description: "Data storage and management systems",
    icon: "🗄️",
    order: 3,
    subTopics: [
      {
        name: "PostgreSQL",
        slug: "postgresql",
        description: "Advanced open-source relational database",
        icon: "🐘",
        order: 1,
      },
      {
        name: "MySQL",
        slug: "mysql",
        description: "Popular relational database management system",
        icon: "🐬",
        order: 2,
      },
      {
        name: "MongoDB",
        slug: "mongodb",
        description: "Document-oriented NoSQL database",
        icon: "🍃",
        order: 3,
      },
      {
        name: "Redis",
        slug: "redis",
        description: "In-memory data structure store",
        icon: "🔴",
        order: 4,
      },
      {
        name: "SQLite",
        slug: "sqlite",
        description: "Self-contained SQL database engine",
        icon: "📦",
        order: 5,
      },
      {
        name: "Prisma",
        slug: "prisma",
        description: "Next-generation ORM for Node.js and TypeScript",
        icon: "⚡",
        order: 6,
      },
    ],
  },
  {
    name: "Cloud & DevOps",
    slug: "cloud-devops",
    description: "Cloud computing and DevOps practices",
    icon: "☁️",
    order: 4,
    subTopics: [
      {
        name: "AWS",
        slug: "aws",
        description: "Amazon Web Services cloud platform",
        icon: "🟠",
        order: 1,
      },
      {
        name: "Google Cloud Platform",
        slug: "gcp",
        description: "Google's cloud computing services",
        icon: "🔵",
        order: 2,
      },
      {
        name: "Microsoft Azure",
        slug: "azure",
        description: "Microsoft's cloud computing platform",
        icon: "🔷",
        order: 3,
      },
      {
        name: "Docker",
        slug: "docker",
        description: "Containerization platform",
        icon: "🐳",
        order: 4,
      },
      {
        name: "Kubernetes",
        slug: "kubernetes",
        description: "Container orchestration platform",
        icon: "⚓",
        order: 5,
      },
      {
        name: "CI/CD",
        slug: "cicd",
        description: "Continuous Integration and Deployment",
        icon: "🔄",
        order: 6,
      },
      {
        name: "Terraform",
        slug: "terraform",
        description: "Infrastructure as Code tool",
        icon: "🏗️",
        order: 7,
      },
    ],
  },
  {
    name: "Data Science & AI",
    slug: "data-science",
    description: "Data analysis, machine learning, and artificial intelligence",
    icon: "🤖",
    order: 5,
    subTopics: [
      {
        name: "Python for Data Science",
        slug: "python-data",
        description: "Python libraries for data analysis",
        icon: "🐍",
        order: 1,
      },
      {
        name: "Machine Learning",
        slug: "machine-learning",
        description: "Algorithms and models for learning from data",
        icon: "🧠",
        order: 2,
      },
      {
        name: "Deep Learning",
        slug: "deep-learning",
        description: "Neural networks and deep learning frameworks",
        icon: "🕸️",
        order: 3,
      },
      {
        name: "TensorFlow",
        slug: "tensorflow",
        description: "Open-source machine learning platform",
        icon: "🔢",
        order: 4,
      },
      {
        name: "PyTorch",
        slug: "pytorch",
        description: "Dynamic neural network framework",
        icon: "🔥",
        order: 5,
      },
      {
        name: "Data Visualization",
        slug: "data-viz",
        description: "Techniques for visualizing data",
        icon: "📊",
        order: 6,
      },
    ],
  },
  {
    name: "Programming Languages",
    slug: "programming-languages",
    description: "Core programming languages and concepts",
    icon: "💻",
    order: 6,
    subTopics: [
      {
        name: "JavaScript",
        slug: "javascript",
        description: "The language of the web",
        icon: "🟨",
        order: 1,
      },
      {
        name: "Python",
        slug: "python",
        description: "Versatile, high-level programming language",
        icon: "🐍",
        order: 2,
      },
      {
        name: "Java",
        slug: "java",
        description: "Enterprise-grade object-oriented language",
        icon: "☕",
        order: 3,
      },
      {
        name: "C#",
        slug: "csharp",
        description: "Microsoft's object-oriented programming language",
        icon: "#️⃣",
        order: 4,
      },
      {
        name: "C++",
        slug: "cpp",
        description: "High-performance systems programming language",
        icon: "⚡",
        order: 5,
      },
      {
        name: "Go",
        slug: "go",
        description: "Simple, fast, and reliable language",
        icon: "🐹",
        order: 6,
      },
      {
        name: "Rust",
        slug: "rust",
        description: "Memory-safe systems programming",
        icon: "🦀",
        order: 7,
      },
    ],
  },
];

async function createTopicsAndSubTopics() {
  try {
    console.log("🚀 Starting topics and subtopics creation...");

    // Get or create admin user
    let adminUser = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    });

    if (!adminUser) {
      console.log("Creating admin user...");
      adminUser = await prisma.user.create({
        data: {
          clerkId: "admin-seed",
          email: "admin@devmastery.com",
          name: "DevMastery Admin",
          role: "ADMIN",
        },
      });
    }
    for (const topicData of topics) {
      console.log(`📁 Processing topic: ${topicData.name}`);

      // Check if topic already exists
      let topic = await prisma.topic.findUnique({
        where: { slug: topicData.slug },
      });

      if (!topic) {
        // Create the main topic
        topic = await prisma.topic.create({
          data: {
            name: topicData.name,
            slug: topicData.slug,
            description: topicData.description,
            icon: topicData.icon,
            order: topicData.order,
            authorId: adminUser.id,
          },
        });
        console.log(`✅ Created topic: ${topicData.name}`);
      } else {
        console.log(`⚠️  Topic already exists: ${topicData.name}`);
      }

      // Create subtopics
      for (const subTopicData of topicData.subTopics) {
        // Check if subtopic already exists
        const existingSubTopic = await prisma.subTopic.findFirst({
          where: {
            topicId: topic.id,
            slug: subTopicData.slug,
          },
        });

        if (!existingSubTopic) {
          console.log(`  📝 Creating subtopic: ${subTopicData.name}`);
          await prisma.subTopic.create({
            data: {
              name: subTopicData.name,
              slug: subTopicData.slug,
              description: subTopicData.description,
              icon: subTopicData.icon,
              order: subTopicData.order,
              topicId: topic.id,
              authorId: adminUser.id,
            },
          });
        } else {
          console.log(`  ⚠️  Subtopic already exists: ${subTopicData.name}`);
        }
      }
    }

    console.log("✅ Successfully created all topics and subtopics!");

    // Now let's assign existing content to appropriate topics
    console.log("🔗 Assigning existing content to topics...");

    // Get topics for assignment
    const frontendTopic = await prisma.topic.findUnique({
      where: { slug: "frontend" },
    });
    const programmingTopic = await prisma.topic.findUnique({
      where: { slug: "programming-languages" },
    });
    const dsaTopic = await prisma.topic.findFirst({
      where: { name: { contains: "Data Structures" } },
    });

    // If we don't have a DSA topic, create one
    if (!dsaTopic) {
      const dsaTopicCreated = await prisma.topic.create({
        data: {
          name: "Data Structures & Algorithms",
          slug: "dsa",
          description:
            "Fundamental computer science concepts for problem solving",
          icon: "🧮",
          order: 0,
          authorId: adminUser.id,
        },
      });

      // Create DSA subtopics
      const dsaSubTopics = [
        { name: "Arrays & Strings", slug: "arrays-strings", icon: "📝" },
        { name: "Linked Lists", slug: "linked-lists", icon: "🔗" },
        { name: "Stacks & Queues", slug: "stacks-queues", icon: "📚" },
        { name: "Trees & Graphs", slug: "trees-graphs", icon: "🌳" },
        { name: "Sorting & Searching", slug: "sorting-searching", icon: "🔍" },
        {
          name: "Dynamic Programming",
          slug: "dynamic-programming",
          icon: "🧩",
        },
        {
          name: "Time & Space Complexity",
          slug: "complexity-analysis",
          icon: "⏱️",
        },
      ];

      for (const [index, subTopic] of dsaSubTopics.entries()) {
        await prisma.subTopic.create({
          data: {
            ...subTopic,
            description: "",
            order: index + 1,
            topicId: dsaTopicCreated.id,
            authorId: adminUser.id,
          },
        });
      }
    }

    // Update existing blogs with topic assignments
    await prisma.blog.updateMany({
      where: { title: { contains: "CSS" } },
      data: { topicId: frontendTopic?.id },
    });

    await prisma.blog.updateMany({
      where: {
        OR: [
          { title: { contains: "JavaScript" } },
          { title: { contains: "Compiled" } },
        ],
      },
      data: { topicId: programmingTopic?.id },
    });

    await prisma.blog.updateMany({
      where: {
        OR: [
          { title: { contains: "complexity" } },
          { title: { contains: "Binary Search" } },
          { category: "Data Structures & Algorithms" },
        ],
      },
      data: { topicId: dsaTopic?.id || undefined },
    });

    console.log("✅ Content assignment completed!");
  } catch (error) {
    console.error("❌ Error creating topics:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createTopicsAndSubTopics();
