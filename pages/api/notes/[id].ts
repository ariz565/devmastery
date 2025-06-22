import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const note = await prisma.note.findUnique({
        where: { id: id as string },
        include: {
          author: {
            select: {
              name: true,
            },
          },
          topic: {
            select: {
              name: true,
              slug: true,
              icon: true,
            },
          },
          subTopic: {
            select: {
              name: true,
              slug: true,
              icon: true,
            },
          },
        },
      });

      if (!note) {
        return res.status(404).json({ error: "Note not found" });
      }

      res.status(200).json({ note });
    } catch (error) {
      console.error("Failed to fetch note:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
