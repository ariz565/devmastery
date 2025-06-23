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

  if (req.method !== "POST") {
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

    const { data, format } = req.body;

    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ message: "Invalid data format" });
    }

    // Validate required fields for each problem
    const errors: string[] = [];
    const validProblems: any[] = [];

    data.forEach((problem, index) => {
      const rowErrors: string[] = [];

      if (!problem.title) {
        rowErrors.push("Title is required");
      }
      if (
        !problem.difficulty ||
        !["Easy", "Medium", "Hard"].includes(problem.difficulty)
      ) {
        rowErrors.push("Valid difficulty (Easy, Medium, Hard) is required");
      }
      if (!problem.description) {
        rowErrors.push("Description is required");
      }

      if (rowErrors.length > 0) {
        errors.push(`Row ${index + 1}: ${rowErrors.join(", ")}`);
      } else {
        validProblems.push({
          title: problem.title,
          description: problem.description,
          difficulty: problem.difficulty,
          category: problem.category || "DSA",
          tags: Array.isArray(problem.tags)
            ? problem.tags
            : problem.tags
            ? problem.tags.split(",").map((t: string) => t.trim())
            : [],
          companies: Array.isArray(problem.companies)
            ? problem.companies
            : problem.companies
            ? problem.companies.split(",").map((c: string) => c.trim())
            : [],
          hints: Array.isArray(problem.hints)
            ? problem.hints
            : problem.hints
            ? problem.hints.split(",").map((h: string) => h.trim())
            : [],
          followUp: problem.followUp || "",
          leetcodeUrl: problem.leetcodeUrl || "",
          problemNumber: problem.problemNumber
            ? parseInt(problem.problemNumber)
            : null,
          frequency: problem.frequency || "",
          acceptance: problem.acceptance
            ? parseFloat(problem.acceptance)
            : null,
          isPremium:
            problem.isPremium === true ||
            problem.isPremium === "true" ||
            problem.isPremium === "1",
          timeComplex: problem.timeComplex || "",
          spaceComplex: problem.spaceComplex || "",
          solution: problem.solution || "",
          explanation: problem.explanation || "",
          authorId: dbUser.id,
        });
      }
    });

    if (errors.length > 0) {
      return res.status(400).json({
        message: "Validation errors found",
        errors,
        totalRows: data.length,
        validRows: validProblems.length,
      });
    }

    // Create problems in batch
    const createdProblems = await prisma.leetcodeProblem.createMany({
      data: validProblems,
      skipDuplicates: true,
    });

    return res.status(200).json({
      message: `Successfully imported ${createdProblems.count} problems`,
      imported: createdProblems.count,
      total: data.length,
    });
  } catch (error) {
    console.error("Error in bulk import:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};
