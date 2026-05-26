import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";
import { internalMutation } from "./_generated/server";

export const expireOldBoxes = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const active = await ctx.db
      .query("surpriseBoxes")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();

    for (const box of active) {
      if (box.availableUntil < now) {
        await ctx.db.patch(box._id, { status: "expired" });
      }
    }
  },
});

export const resetWeeklyEcoPoints = internalMutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("ecoHeroPoints").collect();
    const nextMonday = Date.now() + 7 * 86400000;
    for (const entry of all) {
      await ctx.db.patch(entry._id, {
        weeklyPoints: 0,
        weeklyResetAt: nextMonday,
      });
    }
  },
});

const crons = cronJobs();

crons.interval("expire-boxes", { minutes: 30 }, internal.crons.expireOldBoxes, {});
crons.weekly(
  "reset-weekly-eco-points",
  { dayOfWeek: "monday", hourUTC: 18, minuteUTC: 0 },
  internal.crons.resetWeeklyEcoPoints,
  {},
);

export default crons;
