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
    return res.status(400).json({ message: "Invalid blog ID" });
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
      const blog = await prisma.blog.findFirst({
        where: {
          id: id,
          authorId: dbUser.id,
        },
        include: {
          author: {
            select: {
              name: true,
            },
          },
        },
      });

      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }

      return res.status(200).json(blog);
    }
    if (req.method === "PUT") {
      const {
        title,
        content,
        excerpt,
        category,
        tags,
        coverImage,
        published,
        readTime,
      } = req.body;

      const blog = await prisma.blog.update({
        where: {
          id: id,
          authorId: dbUser.id,
        },
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
          updatedAt: new Date(),
        },
        include: {
          author: {
            select: {
              name: true,
            },
          },
        },
      });

      return res.status(200).json(blog);
    }

    if (req.method === "PATCH") {
      // For partial updates like toggling publish status
      const updateData: any = {};

      if (req.body.hasOwnProperty("published")) {
        updateData.published = req.body.published;
        updateData.publishedAt = req.body.published ? new Date() : null;
      }

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: "No valid fields to update" });
      }

      updateData.updatedAt = new Date();

      const blog = await prisma.blog.update({
        where: {
          id: id,
          authorId: dbUser.id,
        },
        data: updateData,
        include: {
          author: {
            select: {
              name: true,
            },
          },
        },
      });

      return res.status(200).json(blog);
    }

    if (req.method === "DELETE") {
      await prisma.blog.delete({
        where: {
          id: id,
          authorId: dbUser.id,
        },
      });

      return res.status(200).json({ message: "Blog deleted successfully" });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("Error in blog API:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
