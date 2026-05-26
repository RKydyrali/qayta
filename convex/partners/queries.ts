import { query } from "../_generated/server";
import { v } from "convex/values";
import { assertRole } from "../internal/auth";
import { getPartnerProfileForUser } from "../internal/partnerProfiles";

export const getPartnerProfile = query({
  args: {},
  handler: async (ctx) => {
    const user = await assertRole(ctx, ["partner", "admin"]);
    return await getPartnerProfileForUser(ctx, user._id);
  },
});

export const getPartnerDashboard = query({
  args: { partnerId: v.id("partnerProfiles") },
  handler: async (ctx, args) => {
    const boxes = await ctx.db
      .query("surpriseBoxes")
      .withIndex("by_partner", (q) => q.eq("partnerId", args.partnerId))
      .collect();

    const activeBoxes = boxes.filter((b) => b.status === "active").length;
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const orders = await ctx.db
      .query("boxOrders")
      .withIndex("by_partner_status", (q) => q.eq("partnerId", args.partnerId))
      .collect();

    const todayOrders = orders.filter(
      (o) => (o.paidAt ?? 0) >= todayStart.getTime() && o.status !== "cancelled",
    );
    const revenueToday = todayOrders.reduce((sum, o) => sum + o.totalPaid, 0);

    let wasteDiverted = 0;
    for (const order of orders.filter((o) => o.status === "picked_up")) {
      const box = await ctx.db.get(order.boxId);
      wasteDiverted += (box?.estimatedWeightKg ?? 1.5) * order.quantity;
    }

    return {
      activeBoxes,
      ordersToday: todayOrders.length,
      revenueToday,
      wasteDivertedToday: wasteDiverted,
      recentOrders: todayOrders.slice(0, 5),
    };
  },
});
