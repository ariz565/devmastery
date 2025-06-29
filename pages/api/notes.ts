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
      const where: any = {};

      if (subTopicSlug) {
        where.subTopic = { slug: subTopicSlug };
      } else if (topicSlug) {
        where.topic = { slug: topicSlug };
      }

      // Get all notes for public access
      const notes = await prisma.note.findMany({
        where,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          content: true,
          category: true,
          tags: true,
          createdAt: true,
          author: {
            select: {
              id: true,
              name: true,
            },
          },
          topic: {
            select: {
              id: true,
              name: true,
              slug: true,
              icon: true,
            },
          },
          subTopic: {
            select: {
              id: true,
              name: true,
              slug: true,
              icon: true,
            },
          },
        },
      });

      // Transform notes to ensure all fields exist
      const transformedNotes = notes.map((note) => ({
        id: note.id,
        title: note.title,
        content: note.content,
        category: note.category,
        tags: note.tags || [],
        createdAt: note.createdAt,
        // Generate slug from title
        slug: note.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
        // Author with null checks
        author: {
          id: note.author?.id || "anonymous",
          name: note.author?.name || "Anonymous",
        },
        authorName: note.author?.name || "Anonymous",
        // Topic with null checks
        topic: note.topic
          ? {
              id: note.topic.id,
              name: note.topic.name,
              title: note.topic.name,
              slug: note.topic.slug,
              icon: note.topic.icon || "Code",
            }
          : null,
        // SubTopic with null checks
        subTopic: note.subTopic
          ? {
              id: note.subTopic.id,
              name: note.subTopic.name,
              title: note.subTopic.name,
              slug: note.subTopic.slug,
              icon: note.subTopic.icon || "FileText",
            }
          : null,
      }));

      return res.status(200).json({
        success: true,
        notes: transformedNotes,
        total: transformedNotes.length,
      });
    } catch (error) {
      console.error("Error fetching notes:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  res.setHeader("Allow", ["GET"]);
  res.status(405).json({ message: "Method not allowed" });
}
