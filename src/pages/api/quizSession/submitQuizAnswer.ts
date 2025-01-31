import { NextApiRequest, NextApiResponse } from "next";
import { fetchWithAuth } from "../refreshToken/refreshAccessToken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { sessionId, questionId, answer } = req.body;

    try {
      const accessToken = req.cookies.accessToken || "";
      const refreshToken = req.cookies.refreshToken || "";

      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/quizzes/submit-answer`,
        {
          method: "POST",
          body: JSON.stringify({
            sessionId,
            questionId,
            answer,
          }),
        },
        { accessToken, refreshToken }
      );

      if (response.ok) {
        const apiResponse = await response.json();
        return res.status(200).json({
          data: apiResponse.data,
          message: "Answer submitted successfully",
        });
      } else {
        const errorData = await response.json();
        return res.status(response.status).json({ message: errorData.message });
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
