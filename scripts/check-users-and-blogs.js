const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function checkUsersAndBlogs() {
  try {
    console.log("\n=== USERS ===");
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        clerkId: true,
        createdAt: true,
      },
    });
    console.log("Total users:", users.length);
    users.forEach((user) => {
      console.log(`- User ${user.id}: ${user.email} (Clerk: ${user.clerkId})`);
    });

    console.log("\n=== BLOGS ===");
    const blogs = await prisma.blog.findMany({
      select: {
        id: true,
        title: true,
        authorId: true,
        published: true,
        createdAt: true,
        author: {
          select: {
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    console.log("Total blogs:", blogs.length);
    blogs.forEach((blog) => {
      console.log(
        `- Blog ${blog.id}: "${blog.title}" by ${
          blog.author?.email || "Unknown"
        } (authorId: ${blog.authorId}) - Published: ${blog.published}`
      );
    });

    console.log("\n=== BLOGS BY AUTHOR ===");
    const blogsByAuthor = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        clerkId: true,
        blogs: {
          select: {
            id: true,
            title: true,
            published: true,
          },
        },
      },
    });
    blogsByAuthor.forEach((user) => {
      console.log(
        `\nUser ${user.email} (ID: ${user.id}) has ${user.blogs.length} blogs:`
      );
      user.blogs.forEach((blog) => {
        console.log(`  - ${blog.title} (Published: ${blog.published})`);
      });
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsersAndBlogs();
