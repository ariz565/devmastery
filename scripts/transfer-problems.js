const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function transferProblems() {
  try {
    console.log("🔄 Transferring problems to current user...");

    // Find the current user (not the admin seed user)
    const currentUser = await prisma.user.findFirst({
      where: {
        clerkId: {
          not: "admin_clerk_id", // Not the seed admin
        },
      },
    });

    if (!currentUser) {
      console.log("❌ No current user found");
      return;
    }

    console.log(
      `✅ Found current user: ${currentUser.email} (${currentUser.clerkId})`
    );

    // Update all problems to be owned by the current user
    const updateResult = await prisma.leetcodeProblem.updateMany({
      where: {
        authorId: {
          not: currentUser.id, // Don't update if already owned by current user
        },
      },
      data: {
        authorId: currentUser.id,
      },
    });

    console.log(
      `✅ Updated ${updateResult.count} problems to be owned by ${currentUser.email}`
    );

    // Also update any solutions and resources (they should cascade, but let's be sure)
    const problems = await prisma.leetcodeProblem.findMany({
      where: { authorId: currentUser.id },
    });

    console.log(`📊 Current user now owns ${problems.length} problems`);
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

transferProblems();
