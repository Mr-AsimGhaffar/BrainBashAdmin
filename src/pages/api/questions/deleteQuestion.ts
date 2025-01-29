import { NextApiRequest, NextApiResponse } from "next";
import { fetchWithAuth } from "../refreshToken/refreshAccessToken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    try {
      const { id } = req.query;
      const accessToken = req.cookies.accessToken || "";
      const refreshToken = req.cookies.refreshToken || "";

      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/questions/${id}`,
        { method: "DELETE" },
        { accessToken, refreshToken }
      );

      if (response.ok) return res.status(204).end();
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  res.setHeader("Allow", ["DELETE"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
