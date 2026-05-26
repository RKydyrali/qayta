import { query } from "../_generated/server";
import { v } from "convex/values";
import { assertAuthenticated } from "../internal/auth";
import type { Doc } from "../_generated/dataModel";

type BioOrderResult = {
  order: Doc<"bioOrders">;
  product: Doc<"bioProducts"> | null;
};

type BioOrderStatus = "inquiry" | "quoted" | "confirmed" | "installed" | "serviced";

export const getProducts = query({
  args: {
    category: v.optional(
      v.union(v.literal("compact"), v.literal("industrial"), v.literal("accessory")),
    ),
  },
  handler: async (ctx, args) => {
    if (args.category) {
      return await ctx.db
        .query("bioProducts")
        .withIndex("by_category", (q) => q.eq("category", args.category!))
        .collect();
    }
    return await ctx.db.query("bioProducts").collect();
  },
});

export const getProductById = query({
  args: { productId: v.id("bioProducts") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.productId);
  },
});

export const getMyOrders = query({
  args: {},
  handler: async (ctx) => {
    const user = await assertAuthenticated(ctx);
    const orders = await ctx.db
      .query("bioOrders")
      .withIndex("by_client", (q) => q.eq("clientId", user._id))
      .collect();

    const enriched: BioOrderResult[] = [];
    for (const order of orders) {
      const product = await ctx.db.get(order.productId);
      enriched.push({ order, product });
    }
    return enriched;
  },
});

export const getServiceHistory = query({
  args: { orderId: v.id("bioOrders") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("bioServiceLogs")
      .withIndex("by_order", (q) => q.eq("orderId", args.orderId))
      .collect();
  },
});

export const getAllOrdersByStatus = query({
  args: {},
  handler: async (ctx) => {
    const statuses = ["inquiry", "quoted", "confirmed", "installed", "serviced"] as const;
    const result: Record<BioOrderStatus, BioOrderResult[]> = {
      inquiry: [],
      quoted: [],
      confirmed: [],
      installed: [],
      serviced: [],
    };

    for (const status of statuses) {
      const orders = await ctx.db
        .query("bioOrders")
        .withIndex("by_status", (q) => q.eq("status", status))
        .collect();
      for (const order of orders) {
        const product = await ctx.db.get(order.productId);
        result[status].push({ order, product });
      }
    }
    return result;
  },
});
