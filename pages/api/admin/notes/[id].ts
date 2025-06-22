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
    return res.status(400).json({ message: "Invalid note ID" });
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
      const note = await prisma.note.findFirst({
        where: {
          id: id,
          authorId: dbUser.id,
        },
      });

      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }

      return res.status(200).json(note);
    }

    if (req.method === "PUT") {
      const { title, category, content, tags } = req.body;

      if (!title || !category || !content) {
        return res.status(400).json({
          message: "Title, category, and content are required",
        });
      }

      const note = await prisma.note.update({
        where: { id: id },
        data: {
          title,
          category,
          content,
          tags: tags || [],
          updatedAt: new Date(),
        },
      });

      return res.status(200).json(note);
    }

    if (req.method === "DELETE") {
      await prisma.note.delete({
        where: {
          id: id,
          authorId: dbUser.id,
        },
      });

      return res.status(200).json({ message: "Note deleted successfully" });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("Error in note API:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
