import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { prisma } from "../../../../lib/prisma";
import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

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

    // Get shared files
    const files = await prisma.sharedFile.findMany({
      where: {
        studyRoomId: studyRoom.id,
      },
      include: {
        uploader: {
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

    res.status(200).json(files);
  } catch (error) {
    console.error("Error fetching shared files:", error);
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

    // Parse the uploaded file
    const form = formidable({
      uploadDir: "./public/uploads",
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parsing form:", err);
        return res.status(400).json({ message: "Error uploading file" });
      }

      const uploadedFile = Array.isArray(files.file)
        ? files.file[0]
        : files.file;

      if (!uploadedFile) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      try {
        // Ensure uploads directory exists
        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }

        // Generate unique filename
        const ext = path.extname(uploadedFile.originalFilename || "");
        const filename = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(7)}${ext}`;
        const filepath = path.join(uploadsDir, filename);

        // Move file to uploads directory
        fs.renameSync(uploadedFile.filepath, filepath);

        // Save file info to database
        const sharedFile = await prisma.sharedFile.create({
          data: {
            filename,
            originalName: uploadedFile.originalFilename || "unknown",
            fileSize: uploadedFile.size || 0,
            mimeType: uploadedFile.mimetype || "application/octet-stream",
            url: `/uploads/${filename}`,
            uploaderId: user.id,
            studyRoomId: studyRoom.id,
          },
          include: {
            uploader: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        });

        res.status(201).json(sharedFile);
      } catch (dbError) {
        console.error("Error saving file to database:", dbError);
        res.status(500).json({ message: "Error saving file" });
      }
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
