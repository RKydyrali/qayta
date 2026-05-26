import { query } from "../_generated/server";
import { v } from "convex/values";
import type { Doc } from "../_generated/dataModel";

type ListingResult = {
  listing: Doc<"farmListings">;
  partner: Doc<"partnerProfiles"> | null;
};

type SubscriptionResult = {
  subscription: Doc<"farmSubscriptions">;
  partner: Doc<"partnerProfiles"> | null;
  listing: Doc<"farmListings"> | null;
};

export const getListingsByCity = query({
  args: {
    city: v.union(
      v.literal("almaty"),
      v.literal("astana"),
      v.literal("shymkent"),
      v.literal("other"),
    ),
  },
  handler: async (ctx, args) => {
    const listings = await ctx.db
      .query("farmListings")
      .withIndex("by_city", (q) => q.eq("city", args.city))
      .collect();

    const active = listings.filter((l) => l.status === "active");
    const enriched: ListingResult[] = [];
    for (const listing of active) {
      const partner = await ctx.db.get(listing.partnerId);
      enriched.push({ listing, partner });
    }
    return enriched;
  },
});

export const getFarmerSubscriptions = query({
  args: { farmerId: v.id("users") },
  handler: async (ctx, args) => {
    const subs = await ctx.db
      .query("farmSubscriptions")
      .withIndex("by_farmer", (q) => q.eq("farmerId", args.farmerId))
      .collect();

    const enriched: SubscriptionResult[] = [];
    for (const sub of subs) {
      const partner = await ctx.db.get(sub.partnerId);
      const listing = await ctx.db.get(sub.listingId);
      enriched.push({ subscription: sub, partner, listing });
    }
    return enriched;
  },
});

export const getPartnerFarmActivity = query({
  args: { partnerId: v.id("partnerProfiles") },
  handler: async (ctx, args) => {
    const listing = await ctx.db
      .query("farmListings")
      .withIndex("by_partner", (q) => q.eq("partnerId", args.partnerId))
      .first();

    const subs = await ctx.db
      .query("farmSubscriptions")
      .withIndex("by_partner", (q) => q.eq("partnerId", args.partnerId))
      .collect();

    return { listing, subscriptions: subs };
  },
});

export const getDeliveriesBySubscription = query({
  args: { subscriptionId: v.id("farmSubscriptions") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("farmDeliveries")
      .withIndex("by_subscription", (q) => q.eq("subscriptionId", args.subscriptionId))
      .collect();
  },
});
