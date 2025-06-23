import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { prisma } from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method === "GET") {
    try {
      // Get user from database
      const dbUser = await prisma.user.findUnique({
        where: { clerkId: userId },
      });

      if (!dbUser) {
        return res.status(404).json({ message: "User not found" });
      } // Get all blogs for admin panel
      const blogs = await prisma.blog.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          excerpt: true,
          published: true,
          createdAt: true,
          category: true,
          tags: true,
          coverImage: true,
          readTime: true,
          author: {
            select: {
              email: true,
              name: true,
            },
          },
        },
      });

      return res.status(200).json(blogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  if (req.method === "POST") {
    try {
      const {
        title,
        content,
        excerpt,
        category,
        tags,
        coverImage,
        published,
        readTime,
        topicId,
        subTopicId,
      } = req.body;

      // Get user from database
      let dbUser = await prisma.user.findUnique({
        where: { clerkId: userId },
      });

      if (!dbUser) {
        dbUser = await prisma.user.create({
          data: {
            clerkId: userId,
            email: "",
            name: "",
            role: "ADMIN",
          },
        });
      }

      // Create blog
      const blog = await prisma.blog.create({
        data: {
          title,
          content,
          excerpt,
          category,
          tags,
          coverImage,
          published,
          readTime,
          publishedAt: published ? new Date() : null,
          authorId: dbUser.id,
          ...(topicId && { topicId }),
          ...(subTopicId && { subTopicId }),
        },
      });

      return res.status(201).json(blog);
    } catch (error) {
      console.error("Error creating blog:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
