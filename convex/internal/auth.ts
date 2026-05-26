import { ConvexError } from "convex/values";
import type { QueryCtx, MutationCtx } from "../_generated/server";
import type { Doc, Id } from "../_generated/dataModel";

type Ctx = QueryCtx | MutationCtx;

export async function getCurrentUser(ctx: Ctx): Promise<Doc<"users"> | null> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;
  return await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .unique();
}

export async function assertAuthenticated(ctx: Ctx): Promise<Doc<"users">> {
  const user = await getCurrentUser(ctx);
  if (!user) {
    throw new ConvexError({ code: "UNAUTHENTICATED", message: "Sign in required" });
  }
  return user;
}

export async function assertRole(
  ctx: Ctx,
  roles: Array<Doc<"users">["role"]>,
): Promise<Doc<"users">> {
  const user = await assertAuthenticated(ctx);
  if (!roles.includes(user.role)) {
    throw new ConvexError({ code: "FORBIDDEN", message: "Insufficient permissions" });
  }
  return user;
}

export function roleDashboard(role: Doc<"users">["role"]): string {
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
    default:
      return "/";
  }
}

export type UserId = Id<"users">;
