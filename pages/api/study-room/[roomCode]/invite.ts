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

    const { email, message } = req.body;

    if (!email?.trim()) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find the study room and verify user is owner or admin
    const studyRoom = await prisma.studyRoom.findUnique({
      where: { roomCode: roomCode.toUpperCase() },
      include: {
        members: {
          where: {
            userId: user.id,
            role: { in: ["ADMIN", "MODERATOR"] },
          },
        },
      },
    });

    if (!studyRoom) {
      return res.status(404).json({ message: "Study room not found" });
    }

    // Check if user can invite (owner or admin/moderator)
    const canInvite =
      studyRoom.ownerId === user.id || studyRoom.members.length > 0;

    if (!canInvite) {
      return res
        .status(403)
        .json({ message: "You don't have permission to invite users" });
    }

    // Find the user to invite
    const invitee = await prisma.user.findUnique({
      where: { email: email.trim() },
    });

    if (!invitee) {
      return res
        .status(404)
        .json({ message: "User with this email not found" });
    }

    if (invitee.id === user.id) {
      return res.status(400).json({ message: "You cannot invite yourself" });
    }

    // Check if user is already a member
    const existingMember = await prisma.studyRoomMember.findUnique({
      where: {
        userId_studyRoomId: {
          userId: invitee.id,
          studyRoomId: studyRoom.id,
        },
      },
    });

    if (existingMember) {
      return res
        .status(400)
        .json({ message: "User is already a member of this room" });
    }

    // Check if invitation already exists
    const existingInvitation = await prisma.studyRoomInvitation.findUnique({
      where: {
        senderId_receiverId_studyRoomId: {
          senderId: user.id,
          receiverId: invitee.id,
          studyRoomId: studyRoom.id,
        },
      },
    });

    if (existingInvitation && existingInvitation.status === "PENDING") {
      return res
        .status(400)
        .json({ message: "Invitation already sent to this user" });
    }

    // Create or update the invitation
    const invitation = await prisma.studyRoomInvitation.upsert({
      where: {
        senderId_receiverId_studyRoomId: {
          senderId: user.id,
          receiverId: invitee.id,
          studyRoomId: studyRoom.id,
        },
      },
      update: {
        status: "PENDING",
        message: message?.trim() || null,
        updatedAt: new Date(),
      },
      create: {
        senderId: user.id,
        receiverId: invitee.id,
        studyRoomId: studyRoom.id,
        status: "PENDING",
        message: message?.trim() || null,
      },
    });

    res.status(201).json({
      message: "Invitation sent successfully",
      invitation,
    });
  } catch (error) {
    console.error("Error sending invitation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
