const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkUsers() {
  try {
    const users = await prisma.user.findMany();
    console.log("Users in database:", users);

    if (users.length === 0) {
      console.log("No users found. Creating a default user...");
      const defaultUser = await prisma.user.create({
        data: {
          clerkId: "default_clerk_id",
          email: "admin@example.com",
          name: "System Admin",
          role: "ADMIN",
        },
      });
      console.log("Created default user:", defaultUser);
      return defaultUser.id;
    } else {
      console.log("Using first user:", users[0]);
      return users[0].id;
    }
  } catch (error) {
    console.error("Error checking users:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
