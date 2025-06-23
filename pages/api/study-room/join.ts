import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { prisma } from "../../../lib/prisma";

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

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { roomCode } = req.body;

    if (!roomCode?.trim()) {
      return res.status(400).json({ message: "Room code is required" });
    }

    // Find the study room
    const studyRoom = await prisma.studyRoom.findUnique({
      where: { roomCode: roomCode.toUpperCase() },
      include: {
        members: true,
      },
    });

    if (!studyRoom) {
      return res.status(404).json({ message: "Study room not found" });
    }

    // Check if user is already a member
    const existingMember = await prisma.studyRoomMember.findUnique({
      where: {
        userId_studyRoomId: {
          userId: user.id,
          studyRoomId: studyRoom.id,
        },
      },
    });

    if (existingMember) {
      return res
        .status(400)
        .json({ message: "You are already a member of this room" });
    }

    // Check if room is full
    if (studyRoom.members.length >= studyRoom.maxMembers) {
      return res.status(400).json({ message: "Study room is full" });
    }

    // Add user as a member
    await prisma.studyRoomMember.create({
      data: {
        userId: user.id,
        studyRoomId: studyRoom.id,
        role: "MEMBER",
      },
    });

    res.status(200).json({
      message: "Successfully joined the study room",
      roomCode: studyRoom.roomCode,
    });
  } catch (error) {
    console.error("Error joining study room:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
