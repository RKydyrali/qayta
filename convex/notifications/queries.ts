import { query } from "../_generated/server";
import { v } from "convex/values";
import { assertAuthenticated } from "../internal/auth";

export const getMyNotifications = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const user = await assertAuthenticated(ctx);
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user_unread", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(args.limit ?? 20);

    const unreadCount = notifications.filter((n) => !n.isRead).length;
    return { notifications, unreadCount };
  },
});
