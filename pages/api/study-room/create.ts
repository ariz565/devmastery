import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { prisma } from "../../../lib/prisma";
import { ensureUserExists } from "../../../lib/auth-utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Ensure user exists in database
    const user = await ensureUserExists(userId);

    const { name, description, isPrivate, maxMembers } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ message: "Room name is required" });
    }

    // Generate unique room code
    const generateRoomCode = () => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let result = "";
      for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };

    let roomCode = generateRoomCode();
    let existingRoom = await prisma.studyRoom.findUnique({
      where: { roomCode },
    });

    // Ensure room code is unique
    while (existingRoom) {
      roomCode = generateRoomCode();
      existingRoom = await prisma.studyRoom.findUnique({
        where: { roomCode },
      });
    }

    // Create the study room
    const studyRoom = await prisma.studyRoom.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        isPrivate: Boolean(isPrivate),
        maxMembers: Math.min(Math.max(parseInt(maxMembers) || 10, 2), 100),
        roomCode,
        ownerId: user.id,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Add owner as the first member with admin role
    await prisma.studyRoomMember.create({
      data: {
        userId: user.id,
        studyRoomId: studyRoom.id,
        role: "ADMIN",
      },
    });

    res.status(201).json(studyRoom);
  } catch (error) {
    console.error("Error creating study room:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
