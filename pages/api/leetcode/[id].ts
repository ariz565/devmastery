import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const problem = await prisma.leetcodeProblem.findUnique({
        where: { id: id as string },
        include: {
          author: {
            select: {
              name: true,
            },
          },
          solutions: {
            orderBy: {
              isOptimal: "desc",
            },
          },
          resources: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });

      if (!problem) {
        return res.status(404).json({ error: "Problem not found" });
      }

      res.status(200).json({ problem });
    } catch (error) {
      console.error("Error fetching problem:", error);
      res.status(500).json({ error: "Failed to fetch problem" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
