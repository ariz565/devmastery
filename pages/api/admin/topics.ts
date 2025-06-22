import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { prisma } from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.method === "GET") {
      // Get all topics with their subtopics
      const topics = await prisma.topic.findMany({
        orderBy: { order: "asc" },
        include: {
          subTopics: {
            orderBy: { order: "asc" },
            include: {
              _count: {
                select: {
                  blogs: true,
                  notes: true,
                  leetcodeProblems: true,
                },
              },
            },
          },
          _count: {
            select: {
              blogs: true,
              notes: true,
              leetcodeProblems: true,
            },
          },
        },
      });

      return res.status(200).json(topics);
    }

    if (req.method === "POST") {
      const { name, slug, description, icon, order } = req.body;

      if (!name || !slug) {
        return res.status(400).json({
          message: "Name and slug are required",
        });
      }

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

      // Check if slug already exists
      const existingTopic = await prisma.topic.findUnique({
        where: { slug },
      });

      if (existingTopic) {
        return res.status(400).json({
          message: "A topic with this slug already exists",
        });
      }

      const topic = await prisma.topic.create({
        data: {
          name,
          slug,
          description: description || "",
          icon: icon || "",
          order: order || 0,
          authorId: dbUser.id,
        },
      });
      return res.status(201).json(topic);
    }

    if (req.method === "PUT") {
      const { id, name, slug, description, icon, order } = req.body;

      if (!id || !name || !slug) {
        return res.status(400).json({
          message: "ID, name and slug are required",
        });
      }

      // Check if slug already exists for a different topic
      const existingTopic = await prisma.topic.findFirst({
        where: {
          slug,
          NOT: { id },
        },
      });

      if (existingTopic) {
        return res.status(400).json({
          message: "A topic with this slug already exists",
        });
      }

      const topic = await prisma.topic.update({
        where: { id },
        data: {
          name,
          slug,
          description: description || "",
          icon: icon || "",
          order: order || 0,
        },
        include: {
          subTopics: {
            orderBy: { order: "asc" },
            include: {
              _count: {
                select: {
                  blogs: true,
                  notes: true,
                  leetcodeProblems: true,
                },
              },
            },
          },
          _count: {
            select: {
              blogs: true,
              notes: true,
              leetcodeProblems: true,
            },
          },
        },
      });

      return res.status(200).json(topic);
    }

    if (req.method === "DELETE") {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({
          message: "Topic ID is required",
        });
      }

      // Check if topic has any content
      const topic = await prisma.topic.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              blogs: true,
              notes: true,
              leetcodeProblems: true,
            },
          },
          subTopics: {
            include: {
              _count: {
                select: {
                  blogs: true,
                  notes: true,
                  leetcodeProblems: true,
                },
              },
            },
          },
        },
      });

      if (!topic) {
        return res.status(404).json({
          message: "Topic not found",
        });
      }

      // Check if topic or any subtopic has content
      const hasContent =
        topic._count.blogs > 0 ||
        topic._count.notes > 0 ||
        topic._count.leetcodeProblems > 0 ||
        topic.subTopics.some(
          (subTopic) =>
            subTopic._count.blogs > 0 ||
            subTopic._count.notes > 0 ||
            subTopic._count.leetcodeProblems > 0
        );

      if (hasContent) {
        return res.status(400).json({
          message:
            "Cannot delete topic with existing content. Please remove all blogs, notes, and problems first.",
        });
      }

      // Delete all subtopics first
      await prisma.subTopic.deleteMany({
        where: { topicId: id },
      });

      // Delete the topic
      await prisma.topic.delete({
        where: { id },
      });

      return res.status(200).json({ message: "Topic deleted successfully" });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("Error in topics API:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
