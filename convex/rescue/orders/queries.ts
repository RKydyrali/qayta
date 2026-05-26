import { query } from "../../_generated/server";
import { v } from "convex/values";
import { assertAuthenticated } from "../../internal/auth";
import type { Doc } from "../../_generated/dataModel";

type MyOrderResult = {
  order: Doc<"boxOrders">;
  box: Doc<"surpriseBoxes"> | null;
  partner: Doc<"partnerProfiles"> | null;
};

type IncomingOrderResult = {
  order: Doc<"boxOrders">;
  box: Doc<"surpriseBoxes"> | null;
};

export const getMyOrders = query({
  args: {},
  handler: async (ctx) => {
    const user = await assertAuthenticated(ctx);
    const orders = await ctx.db
      .query("boxOrders")
      .withIndex("by_consumer", (q) => q.eq("consumerId", user._id))
      .order("desc")
      .collect();

    const enriched: MyOrderResult[] = [];
    for (const order of orders) {
      const box = await ctx.db.get(order.boxId);
      const partner = box ? await ctx.db.get(box.partnerId) : null;
      enriched.push({ order, box, partner });
    }
    return enriched;
  },
});

export const getIncomingOrders = query({
  args: { partnerId: v.id("partnerProfiles") },
  handler: async (ctx, args) => {
    const orders = await ctx.db
      .query("boxOrders")
      .withIndex("by_partner_status", (q) => q.eq("partnerId", args.partnerId))
      .collect();

    const enriched: IncomingOrderResult[] = [];
    for (const order of orders) {
      const box = await ctx.db.get(order.boxId);
      enriched.push({ order, box });
    }
    return enriched.sort((a, b) => (b.order.paidAt ?? 0) - (a.order.paidAt ?? 0));
  },
});
