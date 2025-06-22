import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { prisma } from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Get or create user in database
    let dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          clerkId: userId,
          email: "",
          name: "",
          role: "ADMIN",
        },
      });
    }

    // Get stats
    const [blogs, notes, leetcode, interviews] = await Promise.all([
      prisma.blog.count({ where: { authorId: dbUser.id } }),
      prisma.note.count({ where: { authorId: dbUser.id } }),
      prisma.leetcodeProblem.count({ where: { authorId: dbUser.id } }),
      prisma.interviewNote.count({ where: { authorId: dbUser.id } }),
    ]);

    res.status(200).json({
      blogs,
      notes,
      leetcode,
      interviews,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
