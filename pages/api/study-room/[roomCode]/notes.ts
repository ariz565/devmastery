import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { prisma } from "../../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { roomCode } = req.query;

  if (!roomCode || typeof roomCode !== "string") {
    return res.status(400).json({ message: "Invalid room code" });
  }

  if (req.method === "GET") {
    return handleGet(req, res, roomCode);
  } else if (req.method === "POST") {
    return handlePost(req, res, roomCode);
  }

  return res.status(405).json({ message: "Method not allowed" });
}

async function handleGet(
  req: NextApiRequest,
  res: NextApiResponse,
  roomCode: string
) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the study room and verify access
    const studyRoom = await prisma.studyRoom.findUnique({
      where: { roomCode: roomCode.toUpperCase() },
      include: {
        members: {
          where: {
            userId: user.id,
          },
        },
      },
    });

    if (!studyRoom) {
      return res.status(404).json({ message: "Study room not found" });
    }

    // Check if user is a member or owner
    const isMember =
      studyRoom.members.length > 0 || studyRoom.ownerId === user.id;

    if (!isMember) {
      return res
        .status(403)
        .json({ message: "You are not a member of this study room" });
    }

    // Get study notes
    const notes = await prisma.studyNote.findMany({
      where: {
        studyRoomId: studyRoom.id,
        OR: [
          { isPublic: true },
          { authorId: user.id }, // User can see their own private notes
        ],
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
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(notes);
  } catch (error) {
    console.error("Error fetching study notes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function handlePost(
  req: NextApiRequest,
  res: NextApiResponse,
  roomCode: string
) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { title, content, isPublic, tags } = req.body;

    if (!title?.trim() || !content?.trim()) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    // Find the study room and verify access
    const studyRoom = await prisma.studyRoom.findUnique({
      where: { roomCode: roomCode.toUpperCase() },
      include: {
        members: {
          where: {
            userId: user.id,
          },
        },
      },
    });

    if (!studyRoom) {
      return res.status(404).json({ message: "Study room not found" });
    }

    // Check if user is a member or owner
    const isMember =
      studyRoom.members.length > 0 || studyRoom.ownerId === user.id;

    if (!isMember) {
      return res
        .status(403)
        .json({ message: "You are not a member of this study room" });
    }

    // Create the study note
    const note = await prisma.studyNote.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        isPublic: Boolean(isPublic),
        tags: Array.isArray(tags) ? tags : [],
        authorId: user.id,
        studyRoomId: studyRoom.id,
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

    res.status(201).json(note);
  } catch (error) {
    console.error("Error creating study note:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
