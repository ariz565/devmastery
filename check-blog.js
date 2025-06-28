const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkBlog() {
  try {
    const blog = await prisma.blog.findUnique({
      where: { id: "cmcgt2pw600099qigx2lib0ls" },
      include: { author: true },
    });
    console.log("Blog title:", blog?.title);
    console.log("Blog content:", blog?.content);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkBlog();
