const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createTableTestBlog() {
  try {
    const existingUser = await prisma.user.findFirst();
    if (!existingUser) {
      console.log("No users found");
      return;
    }

    const blog = await prisma.blog.create({
      data: {
        title: "Table Test Blog",
        content: `# Table Test

Here is a simple table test:

| Operation | ArrayList | LinkedList |
|-----------|-----------|------------|
| get(index) | O(1) | O(n) |
| add(element) | O(1) amortized | O(1) |
| add(index, element) | O(n) | O(n) |
| remove(index) | O(n) | O(n) |

This should render as a proper table.`,
        excerpt: "Testing table rendering with ReactMarkdown and remark-gfm",
        category: "Test",
        tags: ["Table", "Test"],
        readTime: 1,
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        authorId: existingUser.id,
      },
    });

    console.log("Created test blog with ID:", blog.id);
    console.log("View at: http://localhost:3000/blog/" + blog.id);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createTableTestBlog();
