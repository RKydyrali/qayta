import { v, ConvexError } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { assertAuthenticated } from "./internal/auth";
import { reconcilePartnerProfilesForUser } from "./internal/partnerProfiles";

export const getMe = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
  },
});

export const createFromClerk = internalMutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();
    if (existing) return existing._id;

    return await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      phone: args.phone,
      role: "consumer",
      language: "ru",
      createdAt: Date.now(),
    });
  },
});

export const completeOnboarding = mutation({
  args: {
    role: v.union(
      v.literal("consumer"),
      v.literal("partner"),
      v.literal("farmer"),
      v.literal("bio_client"),
    ),
    language: v.union(v.literal("ru"), v.literal("kk")),
    displayName: v.optional(v.string()),
    businessName: v.optional(v.string()),
    businessNameKaz: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(
      v.union(
        v.literal("almaty"),
        v.literal("astana"),
        v.literal("shymkent"),
        v.literal("other"),
      ),
    ),
    farmName: v.optional(v.string()),
    farmNameKaz: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({ code: "UNAUTHENTICATED", message: "Sign in required" });
    }

    let user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      const userId = await ctx.db.insert("users", {
        clerkId: identity.subject,
        email: identity.email ?? "",
        role: args.role,
        language: args.language,
        displayName: args.displayName,
        createdAt: Date.now(),
      });
      user = (await ctx.db.get(userId))!;
    } else {
      await ctx.db.patch(user._id, {
        role: args.role,
        language: args.language,
        displayName: args.displayName,
      });
    }

    if (args.role === "partner" && args.businessName && args.city) {
      const existing = await ctx.db
        .query("partnerProfiles")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .first();

      const profileFields = {
        businessName: args.businessName,
        businessNameKaz: args.businessNameKaz ?? args.businessName,
        address: args.address ?? "",
        city: args.city,
      };

      if (existing) {
        await ctx.db.patch(existing._id, profileFields);
      } else {
        await ctx.db.insert("partnerProfiles", {
          userId: user._id,
          ...profileFields,
          coords: { lat: 43.238949, lng: 76.889709 },
          cuisine: [],
          rating: 0,
          reviewCount: 0,
          isVerified: false,
          isActive: true,
          farmSubscriptionActive: false,
        });
      }
      await reconcilePartnerProfilesForUser(ctx, user._id);
    }

    if (args.role === "farmer" && args.farmName && args.city) {
      const existing = await ctx.db
        .query("farmProfiles")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .first();

      const profileFields = {
        farmName: args.farmName,
        farmNameKaz: args.farmNameKaz ?? args.farmName,
        address: args.address ?? "",
        city: args.city,
      };

      if (existing) {
        await ctx.db.patch(existing._id, profileFields);
      } else {
        await ctx.db.insert("farmProfiles", {
          userId: user._id,
          ...profileFields,
          coords: { lat: 43.238949, lng: 76.889709 },
          animalTypes: ["cattle"],
          capacityKgPerDay: 100,
          certifications: [],
          isVerified: false,
        });
      }
    }

    return user._id;
  },
});

export const updateLanguage = mutation({
  args: { language: v.union(v.literal("ru"), v.literal("kk")) },
  handler: async (ctx, args) => {
    const user = await assertAuthenticated(ctx);
    await ctx.db.patch(user._id, { language: args.language });
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await assertAuthenticated(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});
