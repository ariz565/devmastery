const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function checkTopics() {
  try {
    console.log("Checking existing users...");

    // Check for existing users first
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    console.log("Found users:", users);

    let authorId;
    if (users.length === 0) {
      console.log("No users found. Creating a default admin user...");
      const adminUser = await prisma.user.create({
        data: {
          clerkId: "admin_clerk_id",
          email: "admin@example.com",
          name: "Admin User",
          role: "ADMIN",
        },
      });
      authorId = adminUser.id;
      console.log("Created admin user:", adminUser);
    } else {
      authorId = users[0].id;
      console.log("Using existing user:", users[0]);
    }

    console.log("Checking existing topics...");

    const topics = await prisma.topic.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        _count: {
          select: {
            tableOfContents: true,
          },
        },
      },
    });

    console.log("Found topics:", topics);

    if (topics.length === 0) {
      console.log("No topics found. Creating sample topics...");

      // Create Java topic
      const javaTopic = await prisma.topic.create({
        data: {
          name: "Java",
          slug: "java",
          description:
            "Java programming language fundamentals and advanced concepts",
          authorId: authorId,
        },
      });

      // Create Python topic
      const pythonTopic = await prisma.topic.create({
        data: {
          name: "Python",
          slug: "python",
          description:
            "Python programming language fundamentals and advanced concepts",
          authorId: authorId,
        },
      });

      console.log("Created topics:", { javaTopic, pythonTopic });
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTopics();
