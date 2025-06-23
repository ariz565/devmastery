import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { prisma } from "../../../lib/prisma";

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

    // Find the study room and check if user has access
    const studyRoom = await prisma.studyRoom.findUnique({
      where: { roomCode: roomCode.toUpperCase() },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
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

    res.status(200).json(studyRoom);
  } catch (error) {
    console.error("Error fetching study room:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
