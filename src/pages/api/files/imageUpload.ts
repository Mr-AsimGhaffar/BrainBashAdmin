import { NextApiRequest, NextApiResponse } from "next";
import * as formidable from "formidable";
import { readFile } from "fs/promises";
import { fetchWithAuth } from "../refreshToken/refreshAccessToken";

export const config = {
  api: {
    bodyParser: false, // ✅ Disable Next.js default body parsing
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ message: `Method ${req.method} Not Allowed` });
  }

  try {
    const accessToken = req.cookies.accessToken || "";
    const refreshToken = req.cookies.refreshToken || "";

    const form = formidable.default({ multiples: false });

    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(500).json({ message: "File parsing error" });

      const file: any = files.file?.[0]; // ✅ Get uploaded file
      if (!file) return res.status(400).json({ message: "No file uploaded" });

      // ✅ Read file as a buffer
      const fileBuffer = await readFile(file.filepath);
      const formData = new FormData();
      formData.append(
        "file",
        new Blob([fileBuffer], { type: "application/pdf" }),
        file?.originalFilename
      );
      console.log(process.env.NEXT_PUBLIC_API_BASE_URL);
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/files`,
        {
          method: "POST",
          body: formData,
        },
        { accessToken, refreshToken }
      );

      if (response.ok) {
        const apiResponse = await response.json();
        console.log("data", apiResponse);
        return res.status(200).json({
          ...apiResponse,
          message: "Successfully uploaded file",
        });
      } else {
        const errorData = await response.json();
        return res
          .status(response.status)
          .json({ message: errorData.message || "Failed to upload file" });
      }
    });
  } catch (error) {
    console.error("Upload Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
