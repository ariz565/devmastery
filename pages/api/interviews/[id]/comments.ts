import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { prisma } from "../../../../lib/prisma";

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
      // Get comments for the resource
      const comments = await prisma.comment.findMany({
        where: {
          interviewResourceId: id,
          parentId: null, // Only get top-level comments
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          replies: {
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
              replies: {
                include: {
                  author: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                    },
                  },
                },
              },
            },
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json({ comments });
    }

    if (req.method === "POST") {
      const { userId } = getAuth(req);
      const { content, parentId, authorName, authorEmail } = req.body;

      if (!content || content.trim().length === 0) {
        return res.status(400).json({ message: "Comment content is required" });
      }

      // Check if resource exists
      const resource = await prisma.interviewResource.findUnique({
        where: { id },
      });

      if (!resource) {
        return res.status(404).json({ message: "Resource not found" });
      }

      let dbUser = null;
      if (userId) {
        dbUser = await prisma.user.findUnique({
          where: { clerkId: userId },
        });
      }

      // Create comment
      const comment = await prisma.comment.create({
        data: {
          content: content.trim(),
          interviewResourceId: id,
          authorId: dbUser?.id,
          authorName: dbUser ? dbUser.name : authorName,
          authorEmail: dbUser ? dbUser.email : authorEmail,
          parentId: parentId || null,
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

      return res.status(201).json(comment);
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("Error handling comments:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
