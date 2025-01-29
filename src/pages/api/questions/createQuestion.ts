import { NextApiRequest, NextApiResponse } from "next";
import { fetchWithAuth } from "../refreshToken/refreshAccessToken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { quizId, question, type, options, answer } = req.body;
      const accessToken = req.cookies.accessToken || "";
      const refreshToken = req.cookies.refreshToken || "";

      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/questions`,
        {
          method: "POST",
          body: JSON.stringify({
            quizId: Number(quizId),
            question,
            type,
            options,
            answer,
          }),
        },
        { accessToken, refreshToken }
      );

      if (response.ok) {
        const apiResponse = await response.json();
        return res.status(201).json(apiResponse);
      }
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  res.setHeader("Allow", ["POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
