import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";

// YouTube URL patterns
const YOUTUBE_REGEX =
  /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ message: "YouTube URL is required" });
    }

    // Extract YouTube video ID
    const match = url.match(YOUTUBE_REGEX);
    if (!match) {
      return res.status(400).json({ message: "Invalid YouTube URL" });
    }

    const videoId = match[1];
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

    // Try to get video metadata from YouTube oEmbed API
    let videoTitle = "";
    let videoDescription = "";
    let videoDuration = "";

    try {
      const oEmbedResponse = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
      );

      if (oEmbedResponse.ok) {
        const oEmbedData = await oEmbedResponse.json();
        videoTitle = oEmbedData.title || "";
        videoDescription = oEmbedData.author_name || "";
      }
    } catch (error) {
      console.error("Error fetching YouTube metadata:", error);
    }

    return res.status(200).json({
      message: "YouTube URL processed successfully",
      video: {
        id: videoId,
        url: url,
        embedUrl: embedUrl,
        thumbnailUrl: thumbnailUrl,
        title: videoTitle,
        description: videoDescription,
        duration: videoDuration,
      },
    });
  } catch (error) {
    console.error("Error processing YouTube URL:", error);
    return res.status(500).json({ message: "Failed to process YouTube URL" });
  }
}
