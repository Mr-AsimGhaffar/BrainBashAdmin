import { User, ProjectSettings } from "@/lib/definitions";
import { fetchWithAuth } from "@/pages/api/refreshToken/refreshAccessToken";
import { cookies } from "next/headers";

export async function getUser(): Promise<User | null> {
  try {
    const id = cookies().get("id")?.value;
    const accessToken = cookies().get("accessToken")?.value;
    const refreshToken = cookies().get("refreshToken")?.value;

    if (!id || !accessToken || !refreshToken) {
      return null;
    }

    const response = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${id}`,
      {
        method: "GET",
      },
      { accessToken, refreshToken }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized. Please log in again.");
      }
      throw new Error("Failed to fetch user data");
    }

    const user = await response.json();
    return user.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

export async function getProjectSettings(): Promise<ProjectSettings | null> {
  try {
    const accessToken = cookies().get("accessToken")?.value;
    const refreshToken = cookies().get("refreshToken")?.value;

    if (!accessToken || !refreshToken) {
      return null;
    }

    const response = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/project-settings/`,
      {
        method: "GET",
      },
      { accessToken, refreshToken }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized. Please log in again.");
      }
      throw new Error("Failed to fetch project settings");
    }

    const user = await response.json();
    return user.data;
  } catch (error) {
    console.error("Error fetching project settings data:", error);
    throw error;
  }
}
