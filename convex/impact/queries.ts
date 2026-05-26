import { query } from "../_generated/server";
import { v } from "convex/values";

export const getGlobalImpact = query({
  args: {},
  handler: async (ctx) => {
    const stats = await ctx.db.query("impactStats").first();
    return (
      stats ?? {
        totalWasteSavedKg: 0,
        totalCo2SavedKg: 0,
        totalBoxesSold: 0,
        totalPartners: 0,
        totalFarmers: 0,
        updatedAt: Date.now(),
      }
    );
  },
});

export const getPartnerImpact = query({
  args: { partnerId: v.id("partnerProfiles") },
  handler: async (ctx, args) => {
    const orders = await ctx.db
      .query("boxOrders")
      .withIndex("by_partner_status", (q) =>
        q.eq("partnerId", args.partnerId).eq("status", "picked_up"),
      )
      .collect();

    let wasteKg = 0;
    for (const order of orders) {
      const box = await ctx.db.get(order.boxId);
      wasteKg += (box?.estimatedWeightKg ?? 1.5) * order.quantity;
    }

    return {
      wasteKg,
      co2Kg: wasteKg * 1.5,
      boxesSold: orders.length,
    };
  },
});

export const getCityImpact = query({
  args: {
    city: v.union(
      v.literal("almaty"),
      v.literal("astana"),
      v.literal("shymkent"),
      v.literal("other"),
    ),
  },
  handler: async (ctx, args) => {
    const partners = await ctx.db
      .query("partnerProfiles")
      .withIndex("by_city", (q) => q.eq("city", args.city))
      .collect();

    let wasteKg = 0;
    let boxesSold = 0;

    for (const partner of partners) {
      const orders = await ctx.db
        .query("boxOrders")
        .withIndex("by_partner_status", (q) =>
          q.eq("partnerId", partner._id).eq("status", "picked_up"),
        )
        .collect();
      boxesSold += orders.length;
      for (const order of orders) {
        const box = await ctx.db.get(order.boxId);
        wasteKg += (box?.estimatedWeightKg ?? 1.5) * order.quantity;
      }
    }

    return { wasteKg, co2Kg: wasteKg * 1.5, boxesSold, partnerCount: partners.length };
  },
});
