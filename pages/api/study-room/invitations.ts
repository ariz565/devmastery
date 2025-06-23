import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { prisma } from "../../../lib/prisma";
import { ensureUserExists } from "../../../lib/auth-utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    } // Ensure user exists in database
    const user = await ensureUserExists(userId);

    // Get pending invitations for the user
    const invitations = await prisma.studyRoomInvitation.findMany({
      where: {
        receiverId: user.id,
        status: "PENDING",
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        studyRoom: {
          select: {
            id: true,
            name: true,
            roomCode: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(invitations);
  } catch (error) {
    console.error("Error fetching invitations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
