import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { assertAuthenticated, assertRole } from "../internal/auth";

export const createInquiry = mutation({
  args: {
    productId: v.id("bioProducts"),
    quantity: v.number(),
    installAddress: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await assertRole(ctx, ["bio_client", "admin"]);
    return await ctx.db.insert("bioOrders", {
      clientId: user._id,
      productId: args.productId,
      quantity: args.quantity,
      installAddress: args.installAddress,
      status: "inquiry",
    });
  },
});

export const updateOrderStatus = mutation({
  args: {
    orderId: v.id("bioOrders"),
    status: v.union(
      v.literal("inquiry"),
      v.literal("quoted"),
      v.literal("confirmed"),
      v.literal("installed"),
      v.literal("serviced"),
    ),
    totalQuoteKzt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await assertRole(ctx, ["admin"]);
    const updates: Record<string, unknown> = { status: args.status };
    if (args.totalQuoteKzt !== undefined) updates.totalQuoteKzt = args.totalQuoteKzt;
    if (args.status === "installed") updates.installedAt = Date.now();
    await ctx.db.patch(args.orderId, updates);
  },
});

export const logServiceVisit = mutation({
  args: {
    orderId: v.id("bioOrders"),
    technicianNote: v.string(),
    outputM3: v.number(),
    fertiliserKg: v.number(),
    issuesFound: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await assertRole(ctx, ["admin"]);
    await ctx.db.insert("bioServiceLogs", {
      orderId: args.orderId,
      technicianNote: args.technicianNote,
      visitedAt: Date.now(),
      outputM3: args.outputM3,
      fertiliserKg: args.fertiliserKg,
      issuesFound: args.issuesFound,
    });
    await ctx.db.patch(args.orderId, {
      status: "serviced",
      nextServiceAt: Date.now() + 90 * 86400000,
    });
  },
});
