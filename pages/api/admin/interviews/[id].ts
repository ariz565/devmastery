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
    return res.status(400).json({ message: "Invalid resource ID" });
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

      // Increment views count
      await prisma.interviewResource.update({
        where: { id },
        data: { views: { increment: 1 } },
      });

      return res.status(200).json(resource);
    }

    if (req.method === "PUT") {
      const {
        title,
        description,
        type,
        category,
        difficulty,
        content,
        fileUrl,
        fileName,
        fileSize,
        url,
        tags,
        isPublic,
        isPremium,
      } = req.body;

      const resource = await prisma.interviewResource.update({
        where: { id },
        data: {
          title,
          description,
          type,
          category,
          difficulty,
          content,
          fileUrl,
          fileName,
          fileSize: fileSize ? parseInt(fileSize) : null,
          url,
          tags: tags || [],
          isPublic,
          isPremium,
          updatedAt: new Date(),
        },
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

      return res.status(200).json(resource);
    }

    if (req.method === "DELETE") {
      await prisma.interviewResource.delete({
        where: { id },
      });

      return res.status(200).json({ message: "Resource deleted successfully" });
    }

    if (req.method === "PATCH") {
      // For specific actions like incrementing downloads or rating
      const { action, value } = req.body;

      if (action === "download") {
        await prisma.interviewResource.update({
          where: { id },
          data: { downloads: { increment: 1 } },
        });
        return res.status(200).json({ message: "Download count incremented" });
      }

      if (action === "rate" && value !== undefined) {
        const resource = await prisma.interviewResource.findUnique({
          where: { id },
        });

        if (!resource) {
          return res.status(404).json({ message: "Resource not found" });
        }

        // Simple rating calculation (in a real app, you'd want a separate ratings table)
        const newRating = value;
        await prisma.interviewResource.update({
          where: { id },
          data: { rating: newRating },
        });

        return res.status(200).json({ message: "Rating updated" });
      }

      return res.status(400).json({ message: "Invalid action" });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("Error in interview resource API:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
