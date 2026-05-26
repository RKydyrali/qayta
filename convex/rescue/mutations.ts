import { mutation } from "../_generated/server";
import { v, ConvexError } from "convex/values";
import { assertRole } from "../internal/auth";
import { checkPartnerBoxLimit } from "../internal/subscription";

export const createBox = mutation({
  args: {
    partnerId: v.id("partnerProfiles"),
    title: v.string(),
    titleKaz: v.string(),
    description: v.string(),
    originalPrice: v.number(),
    discountedPrice: v.number(),
    quantity: v.number(),
    estimatedWeightKg: v.optional(v.number()),
    availableFrom: v.number(),
    availableUntil: v.number(),
    allergens: v.array(v.string()),
    isDietaryVeg: v.boolean(),
    isDietaryHalal: v.boolean(),
    imageIds: v.array(v.id("_storage")),
    pickupInstructions: v.string(),
  },
  handler: async (ctx, args) => {
    await assertRole(ctx, ["partner", "admin"]);
    const partner = await ctx.db.get(args.partnerId);
    if (!partner) {
      throw new ConvexError({ code: "NOT_FOUND", message: "Partner not found" });
    }
    return await ctx.db.insert("surpriseBoxes", {
      ...args,
      city: partner.city,
      status: "draft",
    });
  },
});

export const updateBox = mutation({
  args: {
    boxId: v.id("surpriseBoxes"),
    title: v.optional(v.string()),
    titleKaz: v.optional(v.string()),
    description: v.optional(v.string()),
    originalPrice: v.optional(v.number()),
    discountedPrice: v.optional(v.number()),
    quantity: v.optional(v.number()),
    availableFrom: v.optional(v.number()),
    availableUntil: v.optional(v.number()),
    pickupInstructions: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await assertRole(ctx, ["partner", "admin"]);
    const { boxId, ...updates } = args;
    const filtered = Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined),
    );
    await ctx.db.patch(boxId, filtered);
  },
});

export const publishBox = mutation({
  args: { boxId: v.id("surpriseBoxes") },
  handler: async (ctx, args) => {
    await assertRole(ctx, ["partner", "admin"]);
    const box = await ctx.db.get(args.boxId);
    if (!box) throw new ConvexError({ code: "NOT_FOUND", message: "Box not found" });

    const partner = await ctx.db.get(box.partnerId);
    if (!partner?.isVerified) {
      throw new ConvexError({ code: "NOT_VERIFIED", message: "Partner not verified" });
    }

    const activeBoxes = await ctx.db
      .query("surpriseBoxes")
      .withIndex("by_partner", (q) => q.eq("partnerId", box.partnerId))
      .collect();
    const activeCount = activeBoxes.filter((b) => b.status === "active").length;
    const limit = checkPartnerBoxLimit(
      activeCount,
      partner.farmSubscriptionActive,
    );
    if (!limit.allowed) {
      throw new ConvexError({
        code: "BOX_LIMIT",
        message: `Free plan allows ${limit.limit} active boxes`,
      });
    }

    await ctx.db.patch(args.boxId, { status: "active" });
  },
});

export const closeBox = mutation({
  args: { boxId: v.id("surpriseBoxes") },
  handler: async (ctx, args) => {
    await assertRole(ctx, ["partner", "admin"]);
    await ctx.db.patch(args.boxId, { status: "sold_out", quantity: 0 });
  },
});

export const submitPickup = mutation({
  args: {
    orderId: v.id("boxOrders"),
    pickupCode: v.string(),
  },
  handler: async (ctx, args) => {
    await assertRole(ctx, ["partner", "admin"]);
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new ConvexError({ code: "NOT_FOUND", message: "Order not found" });

    const normalized = args.pickupCode.toUpperCase().trim();
    if (order.pickupCode !== normalized) {
      throw new ConvexError({ code: "INVALID_CODE", message: "Invalid pickup code" });
    }

    if (order.status !== "paid") {
      throw new ConvexError({ code: "INVALID_STATUS", message: "Order not paid" });
    }

    await ctx.db.patch(args.orderId, {
      status: "picked_up",
      pickedUpAt: Date.now(),
    });

    const box = await ctx.db.get(order.boxId);
    const wasteKg = (box?.estimatedWeightKg ?? 1.5) * order.quantity;

    const { internal } = await import("../_generated/api");
    await ctx.scheduler.runAfter(0, internal.impact.mutations.recalculateImpact, {
      wasteDeltaKg: wasteKg,
      boxesSoldDelta: 1,
    });

    if (box) {
      const { pointsForOrder, levelFromPoints } = await import("../internal/ecoPoints");
      const pts = pointsForOrder(box.discountedPrice, box.originalPrice);
      const existing = await ctx.db
        .query("ecoHeroPoints")
        .withIndex("by_user", (q) => q.eq("userId", order.consumerId))
        .first();
      if (existing) {
        const totalPoints = existing.totalPoints + pts;
        await ctx.db.patch(existing._id, {
          totalPoints,
          weeklyPoints: existing.weeklyPoints + pts,
          level: levelFromPoints(totalPoints),
        });
      } else {
        await ctx.db.insert("ecoHeroPoints", {
          userId: order.consumerId,
          totalPoints: pts,
          weeklyPoints: pts,
          level: levelFromPoints(pts),
          weeklyResetAt: Date.now() + 7 * 86400000,
        });
      }
    }
  },
});

