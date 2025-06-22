import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { prisma } from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (req.method === "GET") {
      // Get user from database
      const dbUser = await prisma.user.findUnique({
        where: { clerkId: userId },
      });

      if (!dbUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const problems = await prisma.leetcodeProblem.findMany({
        where: { authorId: dbUser.id },
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json({ problems });
    }
    if (req.method === "POST") {
      const {
        title,
        difficulty,
        description,
        solution,
        explanation,
        tags,
        topicId,
        subTopicId,
      } = req.body;

      if (!title || !difficulty || !description || !solution) {
        return res.status(400).json({
          message: "Title, difficulty, description, and solution are required",
        });
      }

      // Get user from database
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

      const problem = await prisma.leetcodeProblem.create({
        data: {
          title,
          difficulty,
          description,
          solution,
          explanation: explanation || "",
          tags: tags || [],
          authorId: dbUser.id,
          ...(topicId && { topicId }),
          ...(subTopicId && { subTopicId }),
        },
      });

      return res.status(201).json({ problem });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("Error in LeetCode API:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
