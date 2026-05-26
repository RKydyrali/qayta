import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const userRole = v.union(
  v.literal("consumer"),
  v.literal("partner"),
  v.literal("farmer"),
  v.literal("bio_client"),
  v.literal("admin"),
);

export const language = v.union(v.literal("ru"), v.literal("kk"));

export const city = v.union(
  v.literal("almaty"),
  v.literal("astana"),
  v.literal("shymkent"),
  v.literal("other"),
);

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    phone: v.optional(v.string()),
    email: v.string(),
    role: userRole,
    language,
    displayName: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_role", ["role"]),

  partnerProfiles: defineTable({
    userId: v.id("users"),
    businessName: v.string(),
    businessNameKaz: v.string(),
    address: v.string(),
    city,
    coords: v.object({ lat: v.number(), lng: v.number() }),
    cuisine: v.array(v.string()),
    coverImageId: v.optional(v.id("_storage")),
    rating: v.number(),
    reviewCount: v.number(),
    isVerified: v.boolean(),
    isActive: v.boolean(),
    farmSubscriptionActive: v.boolean(),
    farmSubscriptionExpiry: v.optional(v.number()),
    stripeCustomerId: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_city", ["city"]),

  surpriseBoxes: defineTable({
    partnerId: v.id("partnerProfiles"),
    city,
    title: v.string(),
    titleKaz: v.string(),
    description: v.string(),
    originalPrice: v.number(),
    discountedPrice: v.number(),
    quantity: v.number(),
    estimatedWeightKg: v.optional(v.number()),
    availableFrom: v.number(),
    availableUntil: v.number(),
    status: v.union(
      v.literal("active"),
      v.literal("sold_out"),
      v.literal("expired"),
      v.literal("draft"),
    ),
    allergens: v.array(v.string()),
    isDietaryVeg: v.boolean(),
    isDietaryHalal: v.boolean(),
    imageIds: v.array(v.id("_storage")),
    pickupInstructions: v.string(),
  })
    .index("by_partner", ["partnerId"])
    .index("by_status", ["status"])
    .index("by_city_status", ["city", "status"]),

  boxOrders: defineTable({
    consumerId: v.id("users"),
    boxId: v.id("surpriseBoxes"),
    partnerId: v.id("partnerProfiles"),
    quantity: v.number(),
    totalPaid: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("paid"),
      v.literal("picked_up"),
      v.literal("cancelled"),
    ),
    pickupCode: v.string(),
    paidAt: v.optional(v.number()),
    pickedUpAt: v.optional(v.number()),
    kaspiOrderId: v.optional(v.string()),
    stripePaymentIntentId: v.optional(v.string()),
  })
    .index("by_consumer", ["consumerId"])
    .index("by_partner_status", ["partnerId", "status"])
    .index("by_pickup_code", ["pickupCode"]),

  reviews: defineTable({
    consumerId: v.id("users"),
    partnerId: v.id("partnerProfiles"),
    orderId: v.id("boxOrders"),
    rating: v.number(),
    comment: v.optional(v.string()),
    language,
    createdAt: v.number(),
  })
    .index("by_partner", ["partnerId"])
    .index("by_consumer", ["consumerId"]),

  farmListings: defineTable({
    partnerId: v.id("partnerProfiles"),
    wasteType: v.array(
      v.union(
        v.literal("bread"),
        v.literal("dairy"),
        v.literal("meat"),
        v.literal("produce"),
        v.literal("mixed"),
      ),
    ),
    estimatedWeightKg: v.number(),
    availableDays: v.array(
      v.union(
        v.literal("mon"),
        v.literal("tue"),
        v.literal("wed"),
        v.literal("thu"),
        v.literal("fri"),
        v.literal("sat"),
        v.literal("sun"),
      ),
    ),
    pickupAddress: v.string(),
    city,
    coords: v.object({ lat: v.number(), lng: v.number() }),
    temperatureTreated: v.boolean(),
    status: v.union(v.literal("active"), v.literal("paused")),
  })
    .index("by_partner", ["partnerId"])
    .index("by_city", ["city"]),

  farmSubscriptions: defineTable({
    farmerId: v.id("users"),
    partnerId: v.id("partnerProfiles"),
    listingId: v.id("farmListings"),
    plan: v.union(v.literal("monthly"), v.literal("quarterly")),
    pricePerMonth: v.number(),
    status: v.union(
      v.literal("active"),
      v.literal("cancelled"),
      v.literal("paused"),
    ),
    startedAt: v.number(),
    nextBillingAt: v.number(),
    stripeSubscriptionId: v.optional(v.string()),
  })
    .index("by_farmer", ["farmerId"])
    .index("by_partner", ["partnerId"]),

  farmProfiles: defineTable({
    userId: v.id("users"),
    farmName: v.string(),
    farmNameKaz: v.string(),
    address: v.string(),
    city,
    coords: v.object({ lat: v.number(), lng: v.number() }),
    animalTypes: v.array(
      v.union(
        v.literal("cattle"),
        v.literal("poultry"),
        v.literal("swine"),
        v.literal("sheep"),
      ),
    ),
    capacityKgPerDay: v.number(),
    certifications: v.array(v.id("_storage")),
    isVerified: v.boolean(),
  }).index("by_user", ["userId"]),

  farmDeliveries: defineTable({
    subscriptionId: v.id("farmSubscriptions"),
    scheduledAt: v.number(),
    actualAt: v.optional(v.number()),
    weightKg: v.number(),
    status: v.union(
      v.literal("scheduled"),
      v.literal("in_transit"),
      v.literal("delivered"),
      v.literal("issue"),
    ),
    driverNote: v.optional(v.string()),
  }).index("by_subscription", ["subscriptionId"]),

  bioProducts: defineTable({
    name: v.string(),
    nameKaz: v.string(),
    description: v.string(),
    descriptionKaz: v.string(),
    category: v.union(
      v.literal("compact"),
      v.literal("industrial"),
      v.literal("accessory"),
    ),
    dailyCapacityKg: v.object({ min: v.number(), max: v.number() }),
    priceKzt: v.number(),
    imageIds: v.array(v.id("_storage")),
    specs: v.any(),
    inStock: v.boolean(),
  }).index("by_category", ["category"]),

  bioOrders: defineTable({
    clientId: v.id("users"),
    productId: v.id("bioProducts"),
    quantity: v.number(),
    installAddress: v.string(),
    status: v.union(
      v.literal("inquiry"),
      v.literal("quoted"),
      v.literal("confirmed"),
      v.literal("installed"),
      v.literal("serviced"),
    ),
    totalQuoteKzt: v.optional(v.number()),
    installedAt: v.optional(v.number()),
    nextServiceAt: v.optional(v.number()),
  })
    .index("by_client", ["clientId"])
    .index("by_status", ["status"]),

  bioServiceLogs: defineTable({
    orderId: v.id("bioOrders"),
    technicianNote: v.string(),
    visitedAt: v.number(),
    outputM3: v.number(),
    fertiliserKg: v.number(),
    issuesFound: v.optional(v.string()),
  }).index("by_order", ["orderId"]),

  impactStats: defineTable({
    totalWasteSavedKg: v.number(),
    totalCo2SavedKg: v.number(),
    totalBoxesSold: v.number(),
    totalPartners: v.number(),
    totalFarmers: v.number(),
    updatedAt: v.number(),
  }),

  notifications: defineTable({
    userId: v.id("users"),
    type: v.string(),
    title: v.string(),
    titleKaz: v.string(),
    body: v.string(),
    bodyKaz: v.string(),
    isRead: v.boolean(),
    createdAt: v.number(),
    relatedId: v.optional(v.string()),
  }).index("by_user_unread", ["userId", "isRead"]),

  ecoHeroPoints: defineTable({
    userId: v.id("users"),
    totalPoints: v.number(),
    level: v.number(),
    weeklyPoints: v.number(),
    weeklyResetAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_points", ["weeklyPoints"]),

  adminLogs: defineTable({
    adminId: v.id("users"),
    action: v.string(),
    targetId: v.string(),
    targetType: v.string(),
    note: v.optional(v.string()),
    createdAt: v.number(),
  }),
});
