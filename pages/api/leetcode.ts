import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { topicSlug, subTopicSlug } = req.query;

      // Build where clause for filtering
      const where: any = {};

      if (subTopicSlug) {
        where.subTopic = { slug: subTopicSlug };
      } else if (topicSlug) {
        where.topic = { slug: topicSlug };
      } // Get all leetcode problems for public access
      const problems = await prisma.leetcodeProblem.findMany({
        where,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          description: true,
          difficulty: true,
          tags: true,
          hints: true,
          followUp: true,
          companies: true,
          frequency: true,
          acceptance: true,
          isPremium: true,
          category: true,
          leetcodeUrl: true,
          problemNumber: true,
          createdAt: true,
          author: {
            select: {
              id: true,
              name: true,
            },
          },
          solutions: {
            orderBy: {
              isOptimal: "desc",
            },
          },
          resources: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });

      // Transform problems to ensure all fields exist
      const transformedProblems = problems.map((problem) => ({
        id: problem.id,
        title: problem.title,
        description: problem.description,
        difficulty: problem.difficulty,
        tags: problem.tags || [],
        hints: problem.hints || [],
        followUp: problem.followUp,
        companies: problem.companies || [],
        frequency: problem.frequency,
        acceptance: problem.acceptance,
        isPremium: problem.isPremium,
        category: problem.category,
        leetcodeUrl: problem.leetcodeUrl,
        problemNumber: problem.problemNumber,
        createdAt: problem.createdAt,
        // Author with null checks
        author: {
          id: problem.author?.id || "anonymous",
          name: problem.author?.name || "Anonymous",
        },
        authorName: problem.author?.name || "Anonymous",
        // Transform solutions and resources
        solutions: problem.solutions || [],
        resources: problem.resources || [],
      }));

      return res.status(200).json({
        success: true,
        problems: transformedProblems,
        total: transformedProblems.length,
      });
    } catch (error) {
      console.error("Error fetching leetcode problems:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  res.setHeader("Allow", ["GET"]);
  res.status(405).json({ message: "Method not allowed" });
}
