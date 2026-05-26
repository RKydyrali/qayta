import { mutation } from "../_generated/server";
import { v, ConvexError } from "convex/values";
import { assertRole } from "../internal/auth";
import { FARM_SUBSCRIPTION_PRICE_MONTHLY } from "../internal/subscription";

export const createListing = mutation({
  args: {
    partnerId: v.id("partnerProfiles"),
    wasteType: v.array(v.string()),
    estimatedWeightKg: v.number(),
    availableDays: v.array(v.string()),
    pickupAddress: v.string(),
    city: v.union(
      v.literal("almaty"),
      v.literal("astana"),
      v.literal("shymkent"),
      v.literal("other"),
    ),
    coords: v.object({ lat: v.number(), lng: v.number() }),
    temperatureTreated: v.boolean(),
  },
  handler: async (ctx, args) => {
    await assertRole(ctx, ["partner", "admin"]);
    const partner = await ctx.db.get(args.partnerId);
    if (!partner?.farmSubscriptionActive) {
      throw new ConvexError({ code: "NO_SUBSCRIPTION", message: "Farm subscription required" });
    }
    return await ctx.db.insert("farmListings", {
      partnerId: args.partnerId,
      wasteType: args.wasteType as Array<"bread" | "dairy" | "meat" | "produce" | "mixed">,
      estimatedWeightKg: args.estimatedWeightKg,
      availableDays: args.availableDays as Array<"mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun">,
      pickupAddress: args.pickupAddress,
      city: args.city,
      coords: args.coords,
      temperatureTreated: args.temperatureTreated,
      status: "active",
    });
  },
});

export const subscribeFarmer = mutation({
  args: {
    listingId: v.id("farmListings"),
    plan: v.union(v.literal("monthly"), v.literal("quarterly")),
  },
  handler: async (ctx, args) => {
    const user = await assertRole(ctx, ["farmer", "admin"]);
    const listing = await ctx.db.get(args.listingId);
    if (!listing) throw new ConvexError({ code: "NOT_FOUND", message: "Listing not found" });

    const now = Date.now();
    const billingMs = args.plan === "monthly" ? 30 * 86400000 : 90 * 86400000;

    return await ctx.db.insert("farmSubscriptions", {
      farmerId: user._id,
      partnerId: listing.partnerId,
      listingId: args.listingId,
      plan: args.plan,
      pricePerMonth: FARM_SUBSCRIPTION_PRICE_MONTHLY,
      status: "active",
      startedAt: now,
      nextBillingAt: now + billingMs,
    });
  },
});

export const cancelSubscription = mutation({
  args: { subscriptionId: v.id("farmSubscriptions") },
  handler: async (ctx, args) => {
    await assertRole(ctx, ["farmer", "partner", "admin"]);
    await ctx.db.patch(args.subscriptionId, { status: "cancelled" });
  },
});

export const logDelivery = mutation({
  args: {
    subscriptionId: v.id("farmSubscriptions"),
    weightKg: v.number(),
    driverNote: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await assertRole(ctx, ["partner", "admin"]);
    const deliveryId = await ctx.db.insert("farmDeliveries", {
      subscriptionId: args.subscriptionId,
      scheduledAt: Date.now(),
      actualAt: Date.now(),
      weightKg: args.weightKg,
      status: "delivered",
      driverNote: args.driverNote,
    });

    const { internal } = await import("../_generated/api");
    await ctx.scheduler.runAfter(0, internal.impact.mutations.recalculateImpact, {
      wasteDeltaKg: args.weightKg,
    });

    return deliveryId;
  },
});
