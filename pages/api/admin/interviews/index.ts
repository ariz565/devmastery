import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { prisma } from "../../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
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
      const {
        page = "1",
        limit = "10",
        search = "",
        type = "",
        category = "",
        difficulty = "",
      } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      // Build where clause
      const where: any = {};

      if (search) {
        where.OR = [
          { title: { contains: search as string, mode: "insensitive" } },
          { description: { contains: search as string, mode: "insensitive" } },
          { tags: { has: search as string } },
        ];
      }

      if (type) {
        where.type = type;
      }

      if (category) {
        where.category = category;
      }

      if (difficulty) {
        where.difficulty = difficulty;
      }

      const [resources, total] = await Promise.all([
        prisma.interviewResource.findMany({
          where,
          skip,
          take: limitNum,
          orderBy: { createdAt: "desc" },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        }),
        prisma.interviewResource.count({ where }),
      ]);

      return res.status(200).json({
        resources,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    }

    if (req.method === "POST") {
      const {
        title,
        description,
        type,
        category,
        difficulty,
        content,
        fileUrl,
        fileName,
        fileSize,
        url,
        tags,
        isPublic = true,
        isPremium = false,
      } = req.body;

      if (!title || !type || !category) {
        return res.status(400).json({
          message: "Title, type, and category are required",
        });
      }

      const resource = await prisma.interviewResource.create({
        data: {
          title,
          description,
          type,
          category,
          difficulty,
          content,
          fileUrl,
          fileName,
          fileSize: fileSize ? parseInt(fileSize) : null,
          url,
          tags: tags || [],
          isPublic,
          isPremium,
          authorId: dbUser.id,
          views: 0,
          downloads: 0,
          rating: 0,
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

      return res.status(201).json(resource);
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("Error in interviews API:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
