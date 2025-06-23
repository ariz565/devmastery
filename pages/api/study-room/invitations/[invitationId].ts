import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { prisma } from "../../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { invitationId } = req.query;

  if (!invitationId || typeof invitationId !== "string") {
    return res.status(400).json({ message: "Invalid invitation ID" });
  }

  if (req.method !== "PATCH") {
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

    const { accept } = req.body;

    // Find the invitation
    const invitation = await prisma.studyRoomInvitation.findUnique({
      where: { id: invitationId },
      include: {
        studyRoom: true,
      },
    });

    if (!invitation) {
      return res.status(404).json({ message: "Invitation not found" });
    }

    if (invitation.receiverId !== user.id) {
      return res
        .status(403)
        .json({ message: "This invitation is not for you" });
    }

    if (invitation.status !== "PENDING") {
      return res
        .status(400)
        .json({ message: "Invitation has already been responded to" });
    }

    if (accept) {
      // Check if room is full
      const memberCount = await prisma.studyRoomMember.count({
        where: { studyRoomId: invitation.studyRoomId },
      });

      if (memberCount >= invitation.studyRoom.maxMembers) {
        await prisma.studyRoomInvitation.update({
          where: { id: invitationId },
          data: { status: "EXPIRED" },
        });
        return res.status(400).json({ message: "Study room is full" });
      }

      // Accept invitation - add user as member
      await prisma.$transaction([
        prisma.studyRoomMember.create({
          data: {
            userId: user.id,
            studyRoomId: invitation.studyRoomId,
            role: "MEMBER",
          },
        }),
        prisma.studyRoomInvitation.update({
          where: { id: invitationId },
          data: { status: "ACCEPTED" },
        }),
      ]);

      res.status(200).json({
        message: "Invitation accepted",
        roomCode: invitation.studyRoom.roomCode,
      });
    } else {
      // Decline invitation
      await prisma.studyRoomInvitation.update({
        where: { id: invitationId },
        data: { status: "DECLINED" },
      });

      res.status(200).json({ message: "Invitation declined" });
    }
  } catch (error) {
    console.error("Error responding to invitation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
