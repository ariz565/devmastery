import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Resource ID is required" });
  }

  try {
    if (req.method === "GET") {
      // Get the resource and increment view count
      const resource = await prisma.interviewResource.findUnique({
        where: { id },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!resource) {
        return res.status(404).json({ message: "Resource not found" });
      }

      // Only show public resources to non-admin users
      if (!resource.isPublic) {
        return res.status(403).json({ message: "Resource not accessible" });
      }

      // Increment view count
      await prisma.interviewResource.update({
        where: { id },
        data: { views: { increment: 1 } },
      });

      return res.status(200).json(resource);
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("Error fetching interview resource:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
