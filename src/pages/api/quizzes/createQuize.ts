import { NextApiRequest, NextApiResponse } from "next";
import { fetchWithAuth } from "../refreshToken/refreshAccessToken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const accessToken = req.cookies.accessToken || "";
      const refreshToken = req.cookies.refreshToken || "";

      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/quizzes/`,
        {
          method: "POST",
          body: JSON.stringify(req.body),
        },
        { accessToken, refreshToken }
      );

      if (response.ok) {
        const apiResponse = await response.json();
        return res.status(200).json(apiResponse);
      } else {
        const errorData = await response.json();
        return res.status(response.status).json(errorData);
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
