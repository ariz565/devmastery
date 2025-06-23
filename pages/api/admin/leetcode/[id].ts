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
        include: {
          solutions: true,
          resources: true,
        },
      });

      if (!problem) {
        return res.status(404).json({ message: "Problem not found" });
      }

      return res.status(200).json(problem);
    }
    if (req.method === "PUT") {
      const {
        title,
        difficulty,
        description,
        category,
        tags,
        companies,
        hints,
        followUp,
        leetcodeUrl,
        problemNumber,
        frequency,
        acceptance,
        isPremium,
        timeComplex,
        spaceComplex,
        topicId,
        subTopicId,
        solutions,
        resources,
      } = req.body;

      if (!title || !difficulty || !description) {
        return res.status(400).json({
          message: "Title, difficulty, and description are required",
        });
      }

      // First update the problem
      const problem = await prisma.leetcodeProblem.update({
        where: { id: id },
        data: {
          title,
          difficulty,
          description,
          category: category || "DSA",
          tags: tags || [],
          companies: companies || [],
          hints: hints || [],
          followUp: followUp || "",
          leetcodeUrl: leetcodeUrl || "",
          problemNumber: problemNumber || null,
          frequency: frequency || "",
          acceptance: acceptance || null,
          isPremium: isPremium || false,
          timeComplex: timeComplex || "",
          spaceComplex: spaceComplex || "",
          topicId: topicId || null,
          subTopicId: subTopicId || null,
          updatedAt: new Date(),
        },
      });

      // Delete existing solutions and resources
      await prisma.problemSolution.deleteMany({
        where: { problemId: id },
      });
      await prisma.problemResource.deleteMany({
        where: { problemId: id },
      });

      // Create new solutions
      if (solutions && solutions.length > 0) {
        await prisma.problemSolution.createMany({
          data: solutions.map((solution: any) => ({
            problemId: id,
            language: solution.language,
            code: solution.code,
            approach: solution.approach || "",
            explanation: solution.explanation || "",
            timeComplex: solution.timeComplex || "",
            spaceComplex: solution.spaceComplex || "",
            notes: solution.notes || "",
            isOptimal: solution.isOptimal || false,
          })),
        });
      }

      // Create new resources
      if (resources && resources.length > 0) {
        await prisma.problemResource.createMany({
          data: resources.map((resource: any) => ({
            problemId: id,
            title: resource.title,
            type: resource.type,
            url: resource.url || "",
            filePath: resource.filePath || "",
            description: resource.description || "",
          })),
        });
      }

      // Fetch the updated problem with relations
      const updatedProblem = await prisma.leetcodeProblem.findUnique({
        where: { id: id },
        include: {
          solutions: true,
          resources: true,
        },
      });

      return res.status(200).json(updatedProblem);
    }
    if (req.method === "DELETE") {
      // Delete the problem (solutions and resources will be deleted via cascade)
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
