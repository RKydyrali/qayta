import { query } from "../_generated/server";
import { assertRole } from "../internal/auth";
import type { Doc } from "../_generated/dataModel";

type PartnerAdminResult = {
  partner: Doc<"partnerProfiles">;
  user: Doc<"users"> | null;
};

export const getAllPartners = query({
  args: {},
  handler: async (ctx) => {
    await assertRole(ctx, ["admin"]);
    const partners = await ctx.db.query("partnerProfiles").take(200);
    const enriched: PartnerAdminResult[] = [];
    for (const partner of partners) {
      const user = await ctx.db.get(partner.userId);
      enriched.push({ partner, user });
    }
    return enriched;
  },
});

export const getPendingVerifications = query({
  args: {},
  handler: async (ctx) => {
    await assertRole(ctx, ["admin"]);
    const partners = await ctx.db.query("partnerProfiles").collect();
    const farmers = await ctx.db.query("farmProfiles").collect();
    return {
      partners: partners.filter((p) => !p.isVerified),
      farmers: farmers.filter((f) => !f.isVerified),
    };
  },
});

export const getSystemStats = query({
  args: {},
  handler: async (ctx) => {
    await assertRole(ctx, ["admin"]);
    const partners = await ctx.db.query("partnerProfiles").collect();
    const farmers = await ctx.db.query("farmProfiles").collect();
    const bioClients = await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", "bio_client"))
      .collect();
    const impact = await ctx.db.query("impactStats").first();

    return {
      totalPartners: partners.length,
      totalFarmers: farmers.length,
      totalBioClients: bioClients.length,
      pendingVerifications: partners.filter((p) => !p.isVerified).length +
        farmers.filter((f) => !f.isVerified).length,
      impact,
    };
  },
});

export const getLogs = query({
  args: {},
  handler: async (ctx) => {
    await assertRole(ctx, ["admin"]);
    return await ctx.db.query("adminLogs").order("desc").take(100);
  },
});
