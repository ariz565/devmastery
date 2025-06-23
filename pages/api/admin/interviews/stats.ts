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

    // Get total resources count
    const totalResources = await prisma.interviewResource.count();

    // Get coding questions count
    const codingQuestions = await prisma.interviewResource.count({
      where: { type: "coding-question" },
    });

    // Get study guides count
    const studyGuides = await prisma.interviewResource.count({
      where: { type: "study-guide" },
    });

    // Get total views
    const viewsResult = await prisma.interviewResource.aggregate({
      _sum: { views: true },
    });
    const totalViews = viewsResult._sum.views || 0;

    // Get total downloads
    const downloadsResult = await prisma.interviewResource.aggregate({
      _sum: { downloads: true },
    });
    const totalDownloads = downloadsResult._sum.downloads || 0;

    // Get average rating
    const ratingResult = await prisma.interviewResource.aggregate({
      _avg: { rating: true },
    });
    const avgRating = ratingResult._avg.rating || 0;

    const stats = {
      totalResources,
      codingQuestions,
      studyGuides,
      totalViews,
      totalDownloads,
      avgRating,
    };

    return res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching interview stats:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
