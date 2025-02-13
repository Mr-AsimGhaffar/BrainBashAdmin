import { NextApiRequest, NextApiResponse } from "next";
import { fetchWithAuth } from "../refreshToken/refreshAccessToken";
import { Readable } from "stream";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { id } = req.query;

    try {
      const accessToken = req.cookies.accessToken || "";
      const refreshToken = req.cookies.refreshToken || "";

      // Send credentials to external API
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/files/${id}`,
        {
          method: "GET",
        },
        { accessToken, refreshToken }
      );

      if (response.ok) {
        // Forward the binary file response to the client
        const contentType =
          response.headers.get("content-type") || "application/octet-stream";
        const contentDisposition =
          response.headers.get("content-disposition") || "";

        // Set headers for the client response
        res.setHeader("Content-Type", contentType);
        if (contentDisposition) {
          res.setHeader("Content-Disposition", contentDisposition);
        }

        // Convert the ReadableStream to a Node.js Readable stream
        const nodeStream = Readable.from(await streamToBuffer(response.body));

        // Stream the file data to the client
        nodeStream.pipe(res); // Use Node.js stream piping
        return;
      } else {
        // Handle non-200 responses
        const errorData = await response.json();
        return res.status(response.status).json({
          message: errorData.message || "Failed to fetch file",
        });
      }
    } catch (error) {
      console.error("Error fetching file:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// Helper function to convert a ReadableStream to a Buffer
async function streamToBuffer(
  stream: ReadableStream<Uint8Array> | null
): Promise<Buffer> {
  if (!stream) {
    return Buffer.alloc(0);
  }

  const chunks: Uint8Array[] = [];
  const reader = stream.getReader();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  return Buffer.concat(chunks);
}
