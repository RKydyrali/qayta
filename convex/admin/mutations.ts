import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { assertRole } from "../internal/auth";

export const verifyPartner = mutation({
  args: { partnerId: v.id("partnerProfiles") },
  handler: async (ctx, args) => {
    const admin = await assertRole(ctx, ["admin"]);
    await ctx.db.patch(args.partnerId, { isVerified: true });
    await ctx.db.insert("adminLogs", {
      adminId: admin._id,
      action: "verify_partner",
      targetId: args.partnerId,
      targetType: "partnerProfiles",
      createdAt: Date.now(),
    });
  },
});

export const verifyFarmer = mutation({
  args: { farmerProfileId: v.id("farmProfiles") },
  handler: async (ctx, args) => {
    const admin = await assertRole(ctx, ["admin"]);
    await ctx.db.patch(args.farmerProfileId, { isVerified: true });
    await ctx.db.insert("adminLogs", {
      adminId: admin._id,
      action: "verify_farmer",
      targetId: args.farmerProfileId,
      targetType: "farmProfiles",
      createdAt: Date.now(),
    });
  },
});

export const suspendPartner = mutation({
  args: { partnerId: v.id("partnerProfiles") },
  handler: async (ctx, args) => {
    const admin = await assertRole(ctx, ["admin"]);
    await ctx.db.patch(args.partnerId, { isActive: false });
    await ctx.db.insert("adminLogs", {
      adminId: admin._id,
      action: "suspend_partner",
      targetId: args.partnerId,
      targetType: "partnerProfiles",
      createdAt: Date.now(),
    });
  },
});

export const updateBioOrderStatus = mutation({
  args: {
    orderId: v.id("bioOrders"),
    status: v.union(
      v.literal("inquiry"),
      v.literal("quoted"),
      v.literal("confirmed"),
      v.literal("installed"),
      v.literal("serviced"),
    ),
  },
  handler: async (ctx, args) => {
    const admin = await assertRole(ctx, ["admin"]);
    await ctx.db.patch(args.orderId, { status: args.status });
    await ctx.db.insert("adminLogs", {
      adminId: admin._id,
      action: "update_bio_order",
      targetId: args.orderId,
      targetType: "bioOrders",
      note: args.status,
      createdAt: Date.now(),
    });
  },
});
