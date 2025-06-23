import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { prisma } from "../../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
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
      const {
        page = "1",
        limit = "10",
        search = "",
        difficulty = "all",
        category = "all",
        language = "all",
        sortBy = "createdAt",
        sortOrder = "desc",
      } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const offset = (pageNum - 1) * limitNum;

      // Build filter conditions
      const where: any = {
        authorId: dbUser.id,
      };

      if (search) {
        where.OR = [
          { title: { contains: search as string, mode: "insensitive" } },
          { description: { contains: search as string, mode: "insensitive" } },
          { tags: { hasSome: [search as string] } },
        ];
      }

      if (difficulty !== "all") {
        where.difficulty = difficulty;
      }

      if (category !== "all") {
        where.category = category;
      }

      // Get problems with solutions and resources
      const problems = await prisma.leetcodeProblem.findMany({
        where,
        include: {
          solutions: {
            where: language !== "all" ? { language: language as string } : {},
            orderBy: { isOptimal: "desc" },
          },
          resources: true,
          topic: { select: { id: true, name: true } },
          subTopic: { select: { id: true, name: true } },
        },
        orderBy: { [sortBy as string]: sortOrder },
        skip: offset,
        take: limitNum,
      });

      // Get total count for pagination
      const total = await prisma.leetcodeProblem.count({ where });

      // Get statistics
      const stats = await prisma.leetcodeProblem.groupBy({
        by: ["difficulty"],
        where: { authorId: dbUser.id },
        _count: { difficulty: true },
      });

      const difficultyStats = stats.reduce((acc, stat) => {
        acc[stat.difficulty] = stat._count.difficulty;
        return acc;
      }, {} as Record<string, number>);

      return res.status(200).json({
        problems,
        pagination: {
          current: pageNum,
          pages: Math.ceil(total / limitNum),
          total,
        },
        stats: {
          total,
          ...difficultyStats,
        },
      });
    }

    if (req.method === "POST") {
      const {
        title,
        description,
        difficulty,
        tags = [],
        leetcodeUrl,
        problemNumber,
        hints = [],
        followUp,
        companies = [],
        frequency,
        acceptance,
        isPremium = false,
        category = "DSA",
        topicId,
        subTopicId,
        solutions = [],
        resources = [],
      } = req.body;

      if (!title || !description || !difficulty) {
        return res.status(400).json({
          message: "Title, description, and difficulty are required",
        });
      }

      // Create problem with solutions and resources
      const problem = await prisma.leetcodeProblem.create({
        data: {
          title,
          description,
          difficulty,
          tags,
          solution: solutions[0]?.code || "", // Keep for backward compatibility
          explanation: solutions[0]?.explanation || "",
          timeComplex: solutions[0]?.timeComplex,
          spaceComplex: solutions[0]?.spaceComplex,
          leetcodeUrl,
          problemNumber,
          hints,
          followUp,
          companies,
          frequency,
          acceptance,
          isPremium,
          category,
          topicId,
          subTopicId,
          authorId: dbUser.id,
          solutions: {
            create: solutions.map((sol: any) => ({
              language: sol.language,
              code: sol.code,
              approach: sol.approach,
              timeComplex: sol.timeComplex,
              spaceComplex: sol.spaceComplex,
              explanation: sol.explanation,
              notes: sol.notes,
              isOptimal: sol.isOptimal || false,
            })),
          },
          resources: {
            create: resources.map((res: any) => ({
              title: res.title,
              type: res.type,
              url: res.url,
              filePath: res.filePath,
              description: res.description,
            })),
          },
        },
        include: {
          solutions: true,
          resources: true,
        },
      });

      return res.status(201).json(problem);
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("Error in LeetCode problems API:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
}
