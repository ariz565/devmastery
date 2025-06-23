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

    // Get rooms where user is a member or owner
    const rooms = await prisma.studyRoom.findMany({
      where: {
        OR: [
          { ownerId: user.id },
          {
            members: {
              some: {
                userId: user.id,
              },
            },
          },
        ],
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        members: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    // Transform data to include member count
    const roomsWithMemberCount = rooms.map((room) => ({
      ...room,
      memberCount: room.members.length,
      members: undefined, // Remove the members array from response
    }));

    res.status(200).json(roomsWithMemberCount);
  } catch (error) {
    console.error("Error fetching my rooms:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
