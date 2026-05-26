import { query } from "../_generated/server";
import { assertAuthenticated } from "../internal/auth";
import { levelFromPoints, levelName } from "../internal/ecoPoints";
import type { Id } from "../_generated/dataModel";

export const getProfile = query({
  args: {},
  handler: async (ctx) => {
    const user = await assertAuthenticated(ctx);
    const eco = await ctx.db
      .query("ecoHeroPoints")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    const orders = await ctx.db
      .query("boxOrders")
      .withIndex("by_consumer", (q) => q.eq("consumerId", user._id))
      .collect();

    const pickedUp = orders.filter((o) => o.status === "picked_up");
    let wasteSaved = 0;
    for (const order of pickedUp) {
      const box = await ctx.db.get(order.boxId);
      wasteSaved += (box?.estimatedWeightKg ?? 1.5) * order.quantity;
    }

    const level = eco ? levelFromPoints(eco.totalPoints) : 1;

    return {
      user,
      eco: eco ?? { totalPoints: 0, weeklyPoints: 0, level: 1 },
      levelName: levelName(level, user.language),
      stats: {
        boxesBought: pickedUp.length,
        wasteSavedKg: wasteSaved,
        co2SavedKg: wasteSaved * 1.5,
      },
    };
  },
});

export const getLeaderboard = query({
  args: {},
  handler: async (ctx) => {
    const top = await ctx.db
      .query("ecoHeroPoints")
      .withIndex("by_points")
      .order("desc")
      .take(50);

    const enriched: Array<{
      userId: Id<"users">;
      nickname: string;
      weeklyPoints: number;
      level: number;
      levelName: string;
    }> = [];
    for (const entry of top) {
      const user = await ctx.db.get(entry.userId);
      if (!user) continue;
      const displayName = user.displayName ?? user.email.split("@")[0] ?? "User";
      const parts = displayName.split(" ");
      const nickname =
        parts.length > 1
          ? `${parts[0]} ${parts[1]![0]}.`
          : `${displayName.slice(0, 8)}.`;
      enriched.push({
        userId: entry.userId,
        nickname,
        weeklyPoints: entry.weeklyPoints,
        level: entry.level,
        levelName: levelName(entry.level, "ru"),
      });
    }
    return enriched;
  },
});
