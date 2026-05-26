import { query } from "../_generated/server";
import { v } from "convex/values";
import { haversineDistance } from "../internal/geo";
import type { Doc } from "../_generated/dataModel";

type BoxSearchResult = {
  box: Doc<"surpriseBoxes">;
  partner: Doc<"partnerProfiles">;
  distanceKm?: number;
};

export const getBoxesByCity = query({
  args: {
    city: v.union(
      v.literal("almaty"),
      v.literal("astana"),
      v.literal("shymkent"),
      v.literal("other"),
    ),
    userLat: v.optional(v.number()),
    userLng: v.optional(v.number()),
    radiusKm: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const activeBoxes = await ctx.db
      .query("surpriseBoxes")
      .withIndex("by_city_status", (q) =>
        q.eq("city", args.city).eq("status", "active"),
      )
      .take(100);

    const results: BoxSearchResult[] = [];
    for (const box of activeBoxes) {
      const partner = await ctx.db.get(box.partnerId);
      if (!partner || !partner.isActive) continue;

      let distanceKm: number | undefined;
      if (args.userLat !== undefined && args.userLng !== undefined) {
        distanceKm = haversineDistance(
          { lat: args.userLat, lng: args.userLng },
          partner.coords,
        );
        if (args.radiusKm !== undefined && distanceKm > args.radiusKm) continue;
      }

      results.push({ box, partner, distanceKm });
    }

    if (args.userLat !== undefined && args.userLng !== undefined) {
      results.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
    } else {
      results.sort((a, b) => a.box.availableUntil - b.box.availableUntil);
    }

    return results;
  },
});

export const getBoxById = query({
  args: { boxId: v.id("surpriseBoxes") },
  handler: async (ctx, args) => {
    const box = await ctx.db.get(args.boxId);
    if (!box) return null;
    const partner = await ctx.db.get(box.partnerId);
    return { box, partner };
  },
});

export const getPartnerBoxes = query({
  args: { partnerId: v.id("partnerProfiles") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("surpriseBoxes")
      .withIndex("by_partner", (q) => q.eq("partnerId", args.partnerId))
      .take(100);
  },
});

export const getActiveBoxes = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("surpriseBoxes")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .take(100);
  },
});
