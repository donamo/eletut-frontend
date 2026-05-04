import { z } from "zod";
import { API_BASE_URL } from "./config";

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  displayName: z.string().nullable().optional(),
  googleSubject: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type CurrentUser = z.infer<typeof userSchema>;

export async function fetchCurrentUser(): Promise<CurrentUser | null> {
  const response = await fetch(`${API_BASE_URL}/me`, {
    credentials: "include",
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Nem sikerült lekérdezni a bejelentkezett felhasználót.");
  }

  return userSchema.parse(await response.json());
}

export function startGoogleLogin() {
  window.location.assign(`${API_BASE_URL}/auth/login/google`);
}

export async function logout() {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Nem sikerült kijelentkezni.");
  }
}
