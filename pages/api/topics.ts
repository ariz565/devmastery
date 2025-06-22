import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      // Get all topics with their subtopics and content counts
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

      // Transform to Nextra navigation format
      const navigationStructure = topics.reduce((acc, topic) => {
        acc[topic.slug] = {
          title: `${topic.icon} ${topic.name}`,
          type: "page",
          href: `/topics/${topic.slug}`,
        };

        // Add subtopics
        topic.subTopics.forEach((subTopic) => {
          acc[`${topic.slug}/${subTopic.slug}`] = {
            title: `${subTopic.icon} ${subTopic.name}`,
            type: "page",
            href: `/topics/${topic.slug}/${subTopic.slug}`,
          };
        });

        return acc;
      }, {} as any);

      return res.status(200).json({
        topics,
        navigation: navigationStructure,
      });
    } catch (error) {
      console.error("Error fetching topics:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  res.setHeader("Allow", ["GET"]);
  res.status(405).json({ message: "Method not allowed" });
}
