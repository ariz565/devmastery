import { prisma } from "../lib/prisma";

export async function ensureUserExists(clerkUserId: string) {
  let user = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
  });

  if (!user) {
    // Auto-create user if they don't exist
    try {
      user = await prisma.user.create({
        data: {
          clerkId: clerkUserId,
          email: `user-${clerkUserId}@temp.com`,
          name: "Study Room User",
          role: "USER",
        },
      });
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Failed to create user account");
    }
  }

  return user;
}
