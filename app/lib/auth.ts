export type UserRole = "ADMIN" | "STAFF";

export type CurrentUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};

export function getCurrentUser(): CurrentUser | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem("user");

  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;

  return localStorage.getItem("access_token");
}

export function isLoggedIn(): boolean {
  return !!getAccessToken() && !!getCurrentUser();
}

export function isAdmin(): boolean {
  return getCurrentUser()?.role === "ADMIN";
}

export function isStaff(): boolean {
  return getCurrentUser()?.role === "STAFF";
}

export function logout() {
  if (typeof window === "undefined") return;

  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
}
