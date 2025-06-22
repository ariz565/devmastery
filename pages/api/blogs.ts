import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { topicSlug, subTopicSlug } = req.query;

      // Build where clause for filtering
      const where: any = { published: true };

      if (subTopicSlug) {
        where.subTopic = { slug: subTopicSlug };
      } else if (topicSlug) {
        where.topic = { slug: topicSlug };
      }

      // Get published blogs only for public access
      const blogs = await prisma.blog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          excerpt: true,
          category: true,
          tags: true,
          readTime: true,
          createdAt: true,
          coverImage: true,
          published: true,
          author: {
            select: {
              name: true,
            },
          },
          topic: {
            select: {
              name: true,
              slug: true,
              icon: true,
            },
          },
          subTopic: {
            select: {
              name: true,
              slug: true,
              icon: true,
            },
          },
        },
      });

      return res.status(200).json({ blogs });
    } catch (error) {
      console.error("Error fetching blogs:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  res.setHeader("Allow", ["GET"]);
  res.status(405).json({ message: "Method not allowed" });
}
