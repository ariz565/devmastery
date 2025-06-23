import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export const maxDuration = 30;

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages } = req.body;

    const result = streamText({
      model: openai("gpt-4o"),
      messages,
      system: `You are StudyBot, an AI assistant for study groups. You help students with:
      - Answering academic questions
      - Explaining complex concepts
      - Providing study tips and techniques
      - Helping with homework and assignments
      - Creating study schedules
      - Facilitating group discussions
      
      Keep responses helpful, educational, and encouraging. Use emojis appropriately to make interactions friendly.`,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error in chat API:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
