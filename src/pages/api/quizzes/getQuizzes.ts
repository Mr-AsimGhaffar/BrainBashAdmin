import { NextApiRequest, NextApiResponse } from "next";
import { fetchWithAuth } from "../refreshToken/refreshAccessToken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const accessToken = req.cookies.accessToken || "";
      const refreshToken = req.cookies.refreshToken || "";
      const { page = 1, limit = 10 } = req.query;

      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/quizzes?page=${page}&limit=${limit}`,
        { method: "GET" },
        { accessToken, refreshToken }
      );

      if (response.ok) {
        const apiResponse = await response.json();
        return res.status(200).json({
          quizzes: apiResponse.data,
          pagination: apiResponse.metadata,
          message: "Successfully fetch quizzes",
        });
      }
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    } catch (error) {
      return res.status(500).json([]);
    }
  }
  res.setHeader("Allow", ["GET"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
