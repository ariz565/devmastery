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

      return res.status(200).json({ problems });
    } catch (error) {
      console.error("Error fetching leetcode problems:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  res.setHeader("Allow", ["GET"]);
  res.status(405).json({ message: "Method not allowed" });
}
