import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const blog = await prisma.blog.findUnique({
        where: {
          id: id as string,
          published: true, // Only serve published blogs publicly
        },
        select: {
          id: true,
          title: true,
          content: true,
          excerpt: true,
          category: true,
          tags: true,
          readTime: true,
          createdAt: true,
          coverImage: true,
          author: {
            select: {
              name: true,
            },
          },
        },
      });

      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }

      return res.status(200).json(blog);
    } catch (error) {
      console.error("Error fetching blog:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  res.setHeader("Allow", ["GET"]);
  res.status(405).json({ message: "Method not allowed" });
}
