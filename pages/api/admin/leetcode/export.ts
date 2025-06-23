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

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Get user from database
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const {
      format = "json",
      filter,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build filter conditions
    const where: any = {
      authorId: dbUser.id,
    };

    if (filter && typeof filter === "string") {
      const filterObj = JSON.parse(filter);

      if (filterObj.difficulty) {
        where.difficulty = filterObj.difficulty;
      }
      if (filterObj.category) {
        where.category = filterObj.category;
      }
      if (filterObj.tags && filterObj.tags.length > 0) {
        where.tags = {
          hasEvery: filterObj.tags,
        };
      }
      if (filterObj.companies && filterObj.companies.length > 0) {
        where.companies = {
          hasEvery: filterObj.companies,
        };
      }
      if (filterObj.isPremium !== undefined) {
        where.isPremium = filterObj.isPremium;
      }
    }

    // Get all problems with solutions and resources
    const problems = await prisma.leetcodeProblem.findMany({
      where,
      include: {
        solutions: true,
        resources: true,
      },
      orderBy: {
        [sortBy as string]: sortOrder === "desc" ? "desc" : "asc",
      },
    });

    if (format === "json") {
      return res.status(200).json({
        problems,
        total: problems.length,
        exportedAt: new Date().toISOString(),
      });
    }

    // For CSV/Excel format, flatten the data
    const flattenedData = problems.map((problem) => ({
      id: problem.id,
      title: problem.title,
      description: problem.description,
      difficulty: problem.difficulty,
      category: problem.category,
      tags: problem.tags.join(", "),
      companies: problem.companies.join(", "),
      hints: problem.hints.join("; "),
      followUp: problem.followUp,
      leetcodeUrl: problem.leetcodeUrl,
      problemNumber: problem.problemNumber,
      frequency: problem.frequency,
      acceptance: problem.acceptance,
      isPremium: problem.isPremium,
      timeComplex: problem.timeComplex,
      spaceComplex: problem.spaceComplex,
      solution: problem.solution,
      explanation: problem.explanation,
      createdAt: problem.createdAt,
      updatedAt: problem.updatedAt,
      solutionsCount: problem.solutions.length,
      resourcesCount: problem.resources.length,
      solutions: problem.solutions.map((s) => ({
        language: s.language,
        approach: s.approach,
        code: s.code,
        timeComplex: s.timeComplex,
        spaceComplex: s.spaceComplex,
        explanation: s.explanation,
        isOptimal: s.isOptimal,
      })),
      resources: problem.resources.map((r) => ({
        title: r.title,
        type: r.type,
        url: r.url,
        description: r.description,
      })),
    }));

    if (format === "csv") {
      // Set headers for CSV download
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="leetcode-problems-${
          new Date().toISOString().split("T")[0]
        }.csv"`
      );

      // Generate CSV content
      const csvHeaders = [
        "ID",
        "Title",
        "Description",
        "Difficulty",
        "Category",
        "Tags",
        "Companies",
        "Hints",
        "Follow Up",
        "LeetCode URL",
        "Problem Number",
        "Frequency",
        "Acceptance",
        "Is Premium",
        "Time Complexity",
        "Space Complexity",
        "Solution",
        "Explanation",
        "Solutions Count",
        "Resources Count",
        "Created At",
      ];

      const csvRows = flattenedData.map((problem) => [
        problem.id,
        `"${problem.title.replace(/"/g, '""')}"`,
        `"${problem.description.replace(/"/g, '""')}"`,
        problem.difficulty,
        problem.category,
        `"${problem.tags}"`,
        `"${problem.companies}"`,
        `"${problem.hints}"`,
        `"${problem.followUp?.replace(/"/g, '""') || ""}"`,
        problem.leetcodeUrl,
        problem.problemNumber || "",
        problem.frequency,
        problem.acceptance || "",
        problem.isPremium,
        problem.timeComplex,
        problem.spaceComplex,
        `"${problem.solution?.replace(/"/g, '""') || ""}"`,
        `"${problem.explanation?.replace(/"/g, '""') || ""}"`,
        problem.solutionsCount,
        problem.resourcesCount,
        problem.createdAt,
      ]);

      const csvContent = [
        csvHeaders.join(","),
        ...csvRows.map((row) => row.join(",")),
      ].join("\n");
      return res.status(200).send(csvContent);
    }

    return res.status(200).json({
      data: flattenedData,
      total: problems.length,
      format,
      exportedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in export:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
