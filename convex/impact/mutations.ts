import { internalMutation } from "../_generated/server";
import { v } from "convex/values";
import { calculateCo2Saved } from "../internal/impact";

export const recalculateImpact = internalMutation({
  args: {
    wasteDeltaKg: v.number(),
    boxesSoldDelta: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const stats = await ctx.db.query("impactStats").first();
    const co2Delta = calculateCo2Saved(args.wasteDeltaKg);

    if (stats) {
      await ctx.db.patch(stats._id, {
        totalWasteSavedKg: stats.totalWasteSavedKg + args.wasteDeltaKg,
        totalCo2SavedKg: stats.totalCo2SavedKg + co2Delta,
        totalBoxesSold: stats.totalBoxesSold + (args.boxesSoldDelta ?? 0),
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("impactStats", {
        totalWasteSavedKg: args.wasteDeltaKg,
        totalCo2SavedKg: co2Delta,
        totalBoxesSold: args.boxesSoldDelta ?? 0,
        totalPartners: 0,
        totalFarmers: 0,
        updatedAt: Date.now(),
      });
    }
  },
});
