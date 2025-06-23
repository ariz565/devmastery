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
    } // Get stats - for admin dashboard, show total counts across all users
    const [blogs, notes, leetcode, interviews, topics] = await Promise.all([
      prisma.blog.count(),
      prisma.note.count(),
      prisma.leetcodeProblem.count(),
      prisma.interviewNote.count(),
      prisma.topic.count(),
    ]);

    // Get recent activity
    const recentActivity = await Promise.all([
      // Recent blogs
      prisma.blog.findMany({
        take: 3,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          createdAt: true,
          author: { select: { name: true } },
        },
      }),
      // Recent notes
      prisma.note.findMany({
        take: 3,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          createdAt: true,
          author: { select: { name: true } },
        },
      }),
      // Recent leetcode problems
      prisma.leetcodeProblem.findMany({
        take: 2,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          createdAt: true,
          author: { select: { name: true } },
        },
      }),
    ]); // Combine and sort recent activity
    const allRecentActivity = [
      ...recentActivity[0].map((item) => ({ ...item, type: "blog" as const })),
      ...recentActivity[1].map((item) => ({ ...item, type: "note" as const })),
      ...recentActivity[2].map((item) => ({
        ...item,
        type: "leetcode" as const,
      })),
    ]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5); // Take top 5 most recent

    res.status(200).json({
      blogs,
      notes,
      leetcode,
      interviews,
      topics,
      recentActivity: allRecentActivity,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
