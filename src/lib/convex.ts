import { ConvexReactClient } from "convex/react";

export const convex = new ConvexReactClient(
  import.meta.env.VITE_CONVEX_URL ?? "https://placeholder.convex.cloud"
);

export type UserRole = "consumer" | "partner" | "farmer" | "bio_client" | "admin";

export function roleDashboard(role: UserRole): string {
  switch (role) {
    case "consumer":
      return "/";
    case "partner":
      return "/partner/dashboard";
    case "farmer":
      return "/farmer/dashboard";
    case "bio_client":
      return "/bio";
    case "admin":
      return "/admin";
  }
}

export function roleFromPath(path: string): UserRole | null {
  if (path.startsWith("/partner")) return "partner";
  if (path.startsWith("/farmer")) return "farmer";
  if (path.startsWith("/bio")) return "bio_client";
  if (path.startsWith("/admin")) return "admin";
  if (path.startsWith("/auth")) return null;
  return "consumer";
}
