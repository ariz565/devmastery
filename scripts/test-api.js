const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function testApi() {
  try {
    console.log("🧪 Testing API logic...");

    // Simulate what the API does
    const currentUser = await prisma.user.findFirst({
      where: {
        clerkId: "user_2yqnojbrUx7hh8zof2B28gb7aLT",
      },
    });

    if (!currentUser) {
      console.log("❌ User not found");
      return;
    }

    console.log(
      `✅ Found user: ${currentUser.email || "No email"} (ID: ${
        currentUser.id
      })`
    );

    // Get problems like the API does
    const problems = await prisma.leetcodeProblem.findMany({
      where: { authorId: currentUser.id },
      include: {
        solutions: true,
        resources: true,
        topic: { select: { id: true, name: true } },
        subTopic: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 12,
    });

    console.log(`📝 Found ${problems.length} problems for this user:`);
    problems.forEach((problem, index) => {
      console.log(`  ${index + 1}. "${problem.title}" (${problem.difficulty})`);
      console.log(
        `     Solutions: ${problem.solutions.length}, Resources: ${problem.resources.length}`
      );
    });

    // Get stats
    const stats = await prisma.leetcodeProblem.groupBy({
      by: ["difficulty"],
      where: { authorId: currentUser.id },
      _count: { difficulty: true },
    });

    console.log("\n📊 Stats:");
    const difficultyStats = stats.reduce((acc, stat) => {
      acc[stat.difficulty] = stat._count.difficulty;
      return acc;
    }, {});

    console.log(`  Total: ${problems.length}`);
    console.log(`  Easy: ${difficultyStats.EASY || 0}`);
    console.log(`  Medium: ${difficultyStats.MEDIUM || 0}`);
    console.log(`  Hard: ${difficultyStats.HARD || 0}`);
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testApi();
