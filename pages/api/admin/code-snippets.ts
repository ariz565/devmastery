import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";

// For now, we'll use in-memory storage for code snippets
// In a real application, you would store these in a database
let codeSnippets: any[] = [];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.method === "GET") {
      return res.status(200).json({ snippets: codeSnippets });
    }

    if (req.method === "POST") {
      const { title, language, code, description } = req.body;

      if (!title || !language || !code) {
        return res
          .status(400)
          .json({ message: "Title, language, and code are required" });
      }

      const snippet = {
        id: Date.now().toString(),
        title,
        language,
        code,
        description: description || "",
        createdAt: new Date().toISOString(),
        authorId: userId,
      };

      codeSnippets.push(snippet);

      return res.status(201).json({ snippet });
    }

    if (req.method === "DELETE") {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ message: "Snippet ID is required" });
      }

      const index = codeSnippets.findIndex((snippet) => snippet.id === id);

      if (index === -1) {
        return res.status(404).json({ message: "Snippet not found" });
      }

      codeSnippets.splice(index, 1);

      return res.status(200).json({ message: "Snippet deleted successfully" });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("Error in code snippets API:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
