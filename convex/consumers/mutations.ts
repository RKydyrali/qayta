import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { assertAuthenticated } from "../internal/auth";
import { pointsForOrder, levelFromPoints } from "../internal/ecoPoints";

export const updatePreferences = mutation({
  args: {
    language: v.optional(v.union(v.literal("ru"), v.literal("kk"))),
    displayName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await assertAuthenticated(ctx);
    const updates: Record<string, unknown> = {};
    if (args.language) updates.language = args.language;
    if (args.displayName) updates.displayName = args.displayName;
    await ctx.db.patch(user._id, updates);
  },
});

export const awardPointsForOrder = mutation({
  args: {
    userId: v.id("users"),
    discountedPrice: v.number(),
    originalPrice: v.number(),
  },
  handler: async (ctx, args) => {
    const points = pointsForOrder(args.discountedPrice, args.originalPrice);
    const existing = await ctx.db
      .query("ecoHeroPoints")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (existing) {
      const newTotal = existing.totalPoints + points;
      await ctx.db.patch(existing._id, {
        totalPoints: newTotal,
        weeklyPoints: existing.weeklyPoints + points,
        level: levelFromPoints(newTotal),
      });
    } else {
      await ctx.db.insert("ecoHeroPoints", {
        userId: args.userId,
        totalPoints: points,
        level: levelFromPoints(points),
        weeklyPoints: points,
        weeklyResetAt: Date.now(),
      });
    }
  },
});
