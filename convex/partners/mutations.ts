import { internalMutation, mutation } from "../_generated/server";
import { v } from "convex/values";
import { assertRole } from "../internal/auth";
import { reconcileAllPartnerProfiles } from "../internal/partnerProfiles";

export const dedupePartnerProfiles = internalMutation({
  args: {},
  handler: async (ctx) => {
    return await reconcileAllPartnerProfiles(ctx);
  },
});

export const updateProfile = mutation({
  args: {
    partnerId: v.id("partnerProfiles"),
    businessName: v.optional(v.string()),
    businessNameKaz: v.optional(v.string()),
    address: v.optional(v.string()),
    cuisine: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    await assertRole(ctx, ["partner", "admin"]);
    const { partnerId, ...updates } = args;
    const filtered = Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined),
    );
    await ctx.db.patch(partnerId, filtered);
  },
});

export const uploadCover = mutation({
  args: {
    partnerId: v.id("partnerProfiles"),
    coverImageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    await assertRole(ctx, ["partner", "admin"]);
    await ctx.db.patch(args.partnerId, { coverImageId: args.coverImageId });
  },
});

export const toggleFarmSubscription = mutation({
  args: {
    partnerId: v.id("partnerProfiles"),
    active: v.boolean(),
  },
  handler: async (ctx, args) => {
    await assertRole(ctx, ["partner", "admin"]);
    await ctx.db.patch(args.partnerId, {
      farmSubscriptionActive: args.active,
      farmSubscriptionExpiry: args.active ? Date.now() + 30 * 86400000 : undefined,
    });
  },
});
