import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { prisma } from "../../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req);
  const { id } = req.query;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Invalid problem ID" });
  }

  try {
    // Get user from database
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.method === "GET") {
      const problem = await prisma.leetcodeProblem.findFirst({
        where: {
          id: id,
          authorId: dbUser.id,
        },
      });

      if (!problem) {
        return res.status(404).json({ message: "Problem not found" });
      }

      return res.status(200).json(problem);
    }

    if (req.method === "PUT") {
      const { title, difficulty, description, solution, explanation, tags } =
        req.body;

      if (!title || !difficulty || !description || !solution) {
        return res.status(400).json({
          message: "Title, difficulty, description, and solution are required",
        });
      }

      const problem = await prisma.leetcodeProblem.update({
        where: { id: id },
        data: {
          title,
          difficulty,
          description,
          solution,
          explanation: explanation || "",
          tags: tags || [],
          updatedAt: new Date(),
        },
      });

      return res.status(200).json(problem);
    }

    if (req.method === "DELETE") {
      await prisma.leetcodeProblem.delete({
        where: {
          id: id,
          authorId: dbUser.id,
        },
      });

      return res.status(200).json({ message: "Problem deleted successfully" });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("Error in LeetCode problem API:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
