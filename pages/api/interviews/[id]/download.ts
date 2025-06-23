import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Resource ID is required" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Check if resource exists and is public
    const resource = await prisma.interviewResource.findUnique({
      where: { id },
    });

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    if (!resource.isPublic) {
      return res.status(403).json({ message: "Resource not accessible" });
    }

    // Increment download count
    await prisma.interviewResource.update({
      where: { id },
      data: { downloads: { increment: 1 } },
    });

    return res.status(200).json({ message: "Download tracked" });
  } catch (error) {
    console.error("Error tracking download:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
