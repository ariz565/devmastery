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

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("Error in topics API:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
