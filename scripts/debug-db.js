const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugDatabase() {
  try {
    console.log('🔍 Debugging database...');
    
    // Check users
    const users = await prisma.user.findMany();
    console.log(`\n👥 Users (${users.length}):`);
    users.forEach(user => {
      console.log(`  - ${user.name} (${user.email}) - Clerk ID: ${user.clerkId}`);
    });
    
    // Check problems
    const problems = await prisma.leetcodeProblem.findMany({
      include: {
        author: { select: { name: true, email: true } },
        solutions: true,
        resources: true
      }
    });
    
    console.log(`\n📝 LeetCode Problems (${problems.length}):`);
    problems.forEach(problem => {
      console.log(`  - "${problem.title}" by ${problem.author.name} (${problem.difficulty})`);
      console.log(`    Solutions: ${problem.solutions.length}, Resources: ${problem.resources.length}`);
      console.log(`    Author ID: ${problem.authorId}`);
    });
    
    // Check if there are any problems without proper author association
    const orphanProblems = await prisma.leetcodeProblem.findMany({
      where: {
        author: null
      }
    });
    
    if (orphanProblems.length > 0) {
      console.log(`\n⚠️  Orphan problems (${orphanProblems.length}):`);
      orphanProblems.forEach(problem => {
        console.log(`  - "${problem.title}" - Author ID: ${problem.authorId}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugDatabase();
