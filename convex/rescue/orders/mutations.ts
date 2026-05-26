import { mutation } from "../../_generated/server";
import { v, ConvexError } from "convex/values";
import { customAlphabet } from "nanoid";
import { assertRole, assertAuthenticated } from "../../internal/auth";

const generatePickupCode = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 6);

export const createOrder = mutation({
  args: {
    boxId: v.id("surpriseBoxes"),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await assertRole(ctx, ["consumer", "admin"]);
    const box = await ctx.db.get(args.boxId);

    if (!box || box.status !== "active") {
      throw new ConvexError({ code: "BOX_UNAVAILABLE", message: "Box not available" });
    }
    if (box.quantity < args.quantity) {
      throw new ConvexError({ code: "INSUFFICIENT_QTY", message: "Not enough boxes" });
    }

    const newQty = box.quantity - args.quantity;
    await ctx.db.patch(args.boxId, {
      quantity: newQty,
      status: newQty === 0 ? "sold_out" : "active",
    });

    const orderId = await ctx.db.insert("boxOrders", {
      consumerId: user._id,
      boxId: args.boxId,
      partnerId: box.partnerId,
      quantity: args.quantity,
      totalPaid: box.discountedPrice * args.quantity,
      status: "pending",
      pickupCode: generatePickupCode(),
    });

    return orderId;
  },
});

export const confirmPayment = mutation({
  args: { orderId: v.id("boxOrders") },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new ConvexError({ code: "NOT_FOUND", message: "Order not found" });
    await ctx.db.patch(args.orderId, { status: "paid", paidAt: Date.now() });
  },
});

export const cancelOrder = mutation({
  args: { orderId: v.id("boxOrders") },
  handler: async (ctx, args) => {
    const user = await assertAuthenticated(ctx);
    const order = await ctx.db.get(args.orderId);
    if (!order || order.consumerId !== user._id) {
      throw new ConvexError({ code: "NOT_FOUND", message: "Order not found" });
    }
    if (order.status !== "pending" && order.status !== "paid") {
      throw new ConvexError({ code: "INVALID_STATUS", message: "Cannot cancel" });
    }

    const box = await ctx.db.get(order.boxId);
    if (box) {
      await ctx.db.patch(order.boxId, {
        quantity: box.quantity + order.quantity,
        status: "active",
      });
    }
    await ctx.db.patch(args.orderId, { status: "cancelled" });
  },
});
