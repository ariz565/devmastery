import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { prisma } from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    return handleGet(req, res);
  } else if (req.method === "POST") {
    return handlePost(req, res);
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  try {
    const {
      page = "1",
      limit = "12",
      search = "",
      type = "",
      category = "",
      difficulty = "",
      sort = "newest",
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause for public resources only
    const where: any = {
      isPublic: true,
    };

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

    // Define sort options
    let orderBy: any = { createdAt: "desc" };
    switch (sort) {
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      case "mostViewed":
        orderBy = { views: "desc" };
        break;
      case "mostDownloaded":
        orderBy = { downloads: "desc" };
        break;
      case "highestRated":
        orderBy = { rating: "desc" };
        break;
      case "alphabetical":
        orderBy = { title: "asc" };
        break;
    }

    const [resources, total] = await Promise.all([
      prisma.interviewResource.findMany({
        where,
        skip,
        take: limitNum,
        orderBy,
        include: {
          author: {
            select: {
              id: true,
              name: true,
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
  } catch (error) {
    console.error("Error fetching interview resources:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const {
      title,
      description,
      content,
      type,
      category,
      difficulty,
      tags,
      url,
      fileUrl,
      fileName,
      fileSize,
      youtubeVideoId,
      youtubeEmbedUrl,
      youtubeThumbnail,
      isPremium,
      isPublic,
    } = req.body;

    // Validate required fields
    if (!title || !description || !type || !category || !difficulty) {
      return res.status(400).json({
        message:
          "Missing required fields: title, description, type, category, difficulty",
      });
    }

    // Check if user exists in our database
    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      // Create user if doesn't exist
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          name: "User", // You might want to get this from Clerk
          email: "user@example.com", // You might want to get this from Clerk
        },
      });
    }

    // Create the interview resource
    const resource = await prisma.interviewResource.create({
      data: {
        title,
        description,
        content: content || "",
        type,
        category,
        difficulty,
        tags: tags || [],
        url: url || "",
        fileUrl: fileUrl || "",
        fileName: fileName || "",
        fileSize: fileSize || 0,
        isPremium: isPremium || false,
        isPublic: isPublic !== false, // Default to true unless explicitly false
        authorId: user.id,
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
  } catch (error) {
    console.error("Error creating interview resource:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
