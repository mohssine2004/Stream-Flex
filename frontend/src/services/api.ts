import type { Video } from "@/types/video";
import { toast } from "sonner";

const API_URL = (import.meta.env.VITE_API_URL as string | undefined) || "";

/**
 * Generic fetch wrapper for backend API calls.
 */
async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (!API_URL) {
    throw new Error("Configuration Error: VITE_API_URL is not defined.");
  }

  const token = localStorage.getItem("token");
  const headers = {
    ...(options.headers || {}),
  } as Record<string, string>;

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP Error ${res.status}`);
    }
    return (await res.json()) as T;
  } catch (err: any) {
    console.error(`API Connection Failure [${path}]:`, err);
    throw err;
  }
}

/**
 * Fetches the list of all videos from the database.
 */
export async function getVideos(): Promise<Video[]> {
  try {
    const videos = await apiFetch<Video[]>("/api/videos/");
    return Array.isArray(videos) ? videos : [];
  } catch (err) {
    return [];
  }
}

/**
 * Fetches a single video by its ID from the database.
 */
export async function getVideoById(id: string | number): Promise<Video> {
  return await apiFetch<Video>(`/api/videos/${id}`);
}

/**
 * Uploads a video and thumbnail to the server.
 */
export async function uploadVideo(formData: FormData): Promise<any> {
  return await apiFetch<any>("/api/videos/upload", {
    method: "POST",
    body: formData,
  });
}

/**
 * Fetches the list of all users (admin only).
 */
export async function getUsers(): Promise<any[]> {
  try {
    const users = await apiFetch<any[]>("/api/admin/users");
    return Array.isArray(users) ? users : [];
  } catch (err) {
    return [];
  }
}

/**
 * Fetches admin dashboard stats.
 */
export async function getAdminStats(): Promise<any> {
  return await apiFetch<any>("/api/admin/stats");
}

/**
 * Deletes a video by ID.
 */
export async function deleteVideo(id: number): Promise<any> {
  return await apiFetch<any>(`/api/videos/${id}`, {
    method: "DELETE",
  });
}
