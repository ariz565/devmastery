import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { problemId, direction, newOrder } = req.body;

    if (!problemId || !direction) {
      return res
        .status(400)
        .json({ message: "Problem ID and direction are required" });
    } // Get the problem to be moved
    const problemToMove = await prisma.leetcodeProblem.findFirst({
      where: {
        id: problemId,
        authorId: userId,
      },
    });

    if (!problemToMove) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // Get all problems for this user ordered by creation date
    const allProblems = await prisma.leetcodeProblem.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: "asc" },
    });

    // Find current index
    const currentIndex = allProblems.findIndex((p) => p.id === problemId);
    if (currentIndex === -1) {
      return res.status(404).json({ message: "Problem not found in list" });
    }

    // Calculate new index
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    // Validate bounds
    if (newIndex < 0 || newIndex >= allProblems.length) {
      return res
        .status(400)
        .json({ message: "Cannot move problem beyond bounds" });
    }

    // Get the problem that will be swapped with
    const problemToSwapWith = allProblems[newIndex];

    // Since we don't have an order field, we'll swap the createdAt timestamps
    // This is a simple way to change the ordering without schema changes
    await prisma.$transaction(async (tx) => {
      const tempTimestamp = new Date();

      // Temporarily set one to a unique timestamp
      await tx.leetcodeProblem.update({
        where: { id: problemToMove.id },
        data: { createdAt: tempTimestamp },
      });

      // Update the second problem to the first's original timestamp
      await tx.leetcodeProblem.update({
        where: { id: problemToSwapWith.id },
        data: { createdAt: problemToMove.createdAt },
      });

      // Update the first problem to the second's original timestamp
      await tx.leetcodeProblem.update({
        where: { id: problemToMove.id },
        data: { createdAt: problemToSwapWith.createdAt },
      });
    });

    res.status(200).json({
      message: "Problem order updated successfully",
      movedProblem: {
        id: problemToMove.id,
        title: problemToMove.title,
        oldOrder: currentIndex,
        newOrder: newIndex,
      },
    });
  } catch (error) {
    console.error("Error reordering problem:", error);
    res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  } finally {
    await prisma.$disconnect();
  }
}
