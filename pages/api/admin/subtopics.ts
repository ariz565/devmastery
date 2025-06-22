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
      const { topicId } = req.query;

      if (!topicId) {
        return res.status(400).json({ message: "Topic ID is required" });
      }

      const subTopics = await prisma.subTopic.findMany({
        where: { topicId: topicId as string },
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
      });

      return res.status(200).json(subTopics);
    }

    if (req.method === "POST") {
      const { name, slug, description, icon, order, topicId } = req.body;

      if (!name || !slug || !topicId) {
        return res.status(400).json({
          message: "Name, slug, and topicId are required",
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

      // Check if slug already exists for this topic
      const existingSubTopic = await prisma.subTopic.findFirst({
        where: {
          topicId,
          slug,
        },
      });

      if (existingSubTopic) {
        return res.status(400).json({
          message: "A subtopic with this slug already exists in this topic",
        });
      }

      const subTopic = await prisma.subTopic.create({
        data: {
          name,
          slug,
          description: description || "",
          icon: icon || "",
          order: order || 0,
          topicId,
          authorId: dbUser.id,
        },
      });

      return res.status(201).json(subTopic);
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("Error in subtopics API:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
