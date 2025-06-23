import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Topic ID is required" });
  }

  try {
    switch (req.method) {
      case "GET":
        const tableOfContents = await prisma.tableOfContents.findMany({
          where: { topicId: id },
          orderBy: { order: "asc" },
        });
        return res.status(200).json(tableOfContents);

      case "POST":
        const {
          title,
          slug,
          description,
          order,
          level,
          parentId,
          contentType,
          estimatedReadTime,
          difficulty,
          isPublished,
        } = req.body;

        // Check if slug already exists for this topic
        const existingItem = await prisma.tableOfContents.findFirst({
          where: {
            topicId: id,
            slug: slug,
          },
        });

        if (existingItem) {
          return res
            .status(400)
            .json({ message: "Slug already exists for this topic" });
        }

        const newItem = await prisma.tableOfContents.create({
          data: {
            title,
            slug,
            description,
            order,
            level,
            parentId: parentId || null,
            contentType,
            estimatedReadTime,
            difficulty,
            isPublished,
            topicId: id,
          },
        });

        return res.status(201).json(newItem);

      case "PUT":
        const { itemId, ...updateData } = req.body;

        const updatedItem = await prisma.tableOfContents.update({
          where: { id: itemId },
          data: updateData,
        });

        return res.status(200).json(updatedItem);

      case "DELETE":
        const { itemId: deleteItemId } = req.body;

        // Delete the item and all its children
        await prisma.tableOfContents.deleteMany({
          where: {
            OR: [{ id: deleteItemId }, { parentId: deleteItemId }],
          },
        });

        return res
          .status(200)
          .json({ message: "Table of contents item deleted successfully" });

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error("Table of contents API error:", error);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
}
