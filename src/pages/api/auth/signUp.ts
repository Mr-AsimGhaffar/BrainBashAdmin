import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { username, email, password, phoneNumber } = req.body;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/signup/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password, phoneNumber }),
        }
      );

      if (response.ok) {
        const data = await response.json();

        // Set HTTP-only cookies
        const cookies = [
          serialize("accessToken", data.data.token.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
          }),
          serialize("refreshToken", data.data.refreshToken.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
          }),
        ];

        res.setHeader("Set-Cookie", cookies);
        return res
          .status(200)
          .json({ ...data.data, message: "Successfully signed up!" });
      }

      const errorData = await response.json();
      return res
        .status(response.status)
        .json({ message: errorData.message || "Signup failed" });
    } catch (error) {
      console.error("Signup error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  res.setHeader("Allow", ["POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
