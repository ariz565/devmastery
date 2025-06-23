import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import pdf from "pdf-parse";

export const config = {
  api: {
    bodyParser: false,
  },
};

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
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "interviews"
    );
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const form = formidable({
      uploadDir: uploadsDir,
      keepExtensions: true,
      maxFileSize: 50 * 1024 * 1024, // 50MB
      filter: function ({ name, originalFilename, mimetype }) {
        // Allow specific file types
        const allowedTypes = [
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/webp",
          "application/pdf",
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "text/plain",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "video/mp4",
          "video/webm",
          "video/ogg",
        ];

        return name === "file" && allowedTypes.includes(mimetype || "");
      },
    });

    const [fields, files] = await form.parse(req);

    if (!files.file || !files.file[0]) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const file = files.file[0];
    const originalName = file.originalFilename || "unknown";
    const fileExtension = path.extname(originalName);
    const timestamp = Date.now();
    const newFileName = `${timestamp}_${originalName.replace(
      /[^a-zA-Z0-9.-]/g,
      "_"
    )}`;
    const newFilePath = path.join(uploadsDir, newFileName);

    // Move file to final location
    fs.renameSync(file.filepath, newFilePath);

    // Generate public URL
    const fileUrl = `/uploads/interviews/${newFileName}`;

    // Get file stats
    const stats = fs.statSync(newFilePath);
    const fileSize = stats.size;

    // Determine file type category
    let fileType = "document";
    let extractedContent = "";

    if (file.mimetype?.startsWith("image/")) {
      fileType = "image";
    } else if (file.mimetype?.startsWith("video/")) {
      fileType = "video";
    } else if (
      file.mimetype?.includes("excel") ||
      file.mimetype?.includes("spreadsheet")
    ) {
      fileType = "excel";
    } else if (file.mimetype === "application/pdf") {
      fileType = "pdf";

      // Extract text from PDF
      try {
        const pdfBuffer = fs.readFileSync(newFilePath);
        const pdfData = await pdf(pdfBuffer);
        extractedContent = pdfData.text;
      } catch (pdfError) {
        console.error("Error extracting PDF content:", pdfError);
        extractedContent = "";
      }
    }

    return res.status(200).json({
      message: "File uploaded successfully",
      file: {
        url: fileUrl,
        fileName: originalName,
        size: fileSize,
        type: fileType,
        mimetype: file.mimetype,
        extractedContent: extractedContent,
      },
      fileUrl: fileUrl,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return res.status(500).json({ message: "Upload failed" });
  }
}
