import type { Doc, Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";

type Ctx = QueryCtx | MutationCtx;

async function countPartnerReferences(
  ctx: Ctx,
  partnerId: Id<"partnerProfiles">,
): Promise<number> {
  const [boxes, orders, reviews, listings, subscriptions] = await Promise.all([
    ctx.db
      .query("surpriseBoxes")
      .withIndex("by_partner", (q) => q.eq("partnerId", partnerId))
      .collect(),
    ctx.db
      .query("boxOrders")
      .withIndex("by_partner_status", (q) => q.eq("partnerId", partnerId))
      .collect(),
    ctx.db
      .query("reviews")
      .withIndex("by_partner", (q) => q.eq("partnerId", partnerId))
      .collect(),
    ctx.db
      .query("farmListings")
      .withIndex("by_partner", (q) => q.eq("partnerId", partnerId))
      .collect(),
    ctx.db
      .query("farmSubscriptions")
      .withIndex("by_partner", (q) => q.eq("partnerId", partnerId))
      .collect(),
  ]);
  return (
    boxes.length +
    orders.length +
    reviews.length +
    listings.length +
    subscriptions.length
  );
}

export async function pickCanonicalPartnerProfile(
  ctx: Ctx,
  profiles: Doc<"partnerProfiles">[],
): Promise<Doc<"partnerProfiles">> {
  let best = profiles[0]!;
  let bestScore = await countPartnerReferences(ctx, best._id);

  for (const profile of profiles.slice(1)) {
    const score = await countPartnerReferences(ctx, profile._id);
    if (
      score > bestScore ||
      (score === bestScore && profile._creationTime > best._creationTime)
    ) {
      best = profile;
      bestScore = score;
    }
  }

  return best;
}

export async function getPartnerProfileForUser(
  ctx: Ctx,
  userId: Id<"users">,
): Promise<Doc<"partnerProfiles"> | null> {
  const profiles = await ctx.db
    .query("partnerProfiles")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .collect();

  if (profiles.length === 0) return null;
  if (profiles.length === 1) return profiles[0]!;
  return await pickCanonicalPartnerProfile(ctx, profiles);
}

async function reassignPartnerReferences(
  ctx: MutationCtx,
  fromId: Id<"partnerProfiles">,
  toId: Id<"partnerProfiles">,
): Promise<void> {
  const boxes = await ctx.db
    .query("surpriseBoxes")
    .withIndex("by_partner", (q) => q.eq("partnerId", fromId))
    .collect();
  for (const box of boxes) {
    await ctx.db.patch(box._id, { partnerId: toId });
  }

  const orders = await ctx.db
    .query("boxOrders")
    .withIndex("by_partner_status", (q) => q.eq("partnerId", fromId))
    .collect();
  for (const order of orders) {
    await ctx.db.patch(order._id, { partnerId: toId });
  }

  const reviews = await ctx.db
    .query("reviews")
    .withIndex("by_partner", (q) => q.eq("partnerId", fromId))
    .collect();
  for (const review of reviews) {
    await ctx.db.patch(review._id, { partnerId: toId });
  }

  const listings = await ctx.db
    .query("farmListings")
    .withIndex("by_partner", (q) => q.eq("partnerId", fromId))
    .collect();
  for (const listing of listings) {
    await ctx.db.patch(listing._id, { partnerId: toId });
  }

  const subscriptions = await ctx.db
    .query("farmSubscriptions")
    .withIndex("by_partner", (q) => q.eq("partnerId", fromId))
    .collect();
  for (const subscription of subscriptions) {
    await ctx.db.patch(subscription._id, { partnerId: toId });
  }
}

/** Merges duplicate partner profiles for one user; returns the canonical profile id. */
export async function reconcilePartnerProfilesForUser(
  ctx: MutationCtx,
  userId: Id<"users">,
): Promise<Id<"partnerProfiles"> | null> {
  const profiles = await ctx.db
    .query("partnerProfiles")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .collect();

  if (profiles.length === 0) return null;
  if (profiles.length === 1) return profiles[0]!._id;

  const canonical = await pickCanonicalPartnerProfile(ctx, profiles);
  for (const profile of profiles) {
    if (profile._id === canonical._id) continue;
    await reassignPartnerReferences(ctx, profile._id, canonical._id);
    await ctx.db.delete(profile._id);
  }
  return canonical._id;
}

/** Merges duplicate partner profiles across all users. */
export async function reconcileAllPartnerProfiles(
  ctx: MutationCtx,
): Promise<{ mergedUsers: number; removedProfiles: number }> {
  const profiles = await ctx.db.query("partnerProfiles").collect();
  const byUser = new Map<Id<"users">, Doc<"partnerProfiles">[]>();
  for (const profile of profiles) {
    const list = byUser.get(profile.userId) ?? [];
    list.push(profile);
    byUser.set(profile.userId, list);
  }

  let mergedUsers = 0;
  let removedProfiles = 0;

  for (const [userId, userProfiles] of byUser) {
    if (userProfiles.length <= 1) continue;
    const before = userProfiles.length;
    await reconcilePartnerProfilesForUser(ctx, userId);
    mergedUsers += 1;
    removedProfiles += before - 1;
  }

  return { mergedUsers, removedProfiles };
}
