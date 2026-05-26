import { internalMutation } from "../_generated/server";
import type { Id } from "../_generated/dataModel";

export const seed = internalMutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("impactStats").first();
    if (existing && existing.totalBoxesSold > 0) {
      return { status: "already_seeded" };
    }

    const now = Date.now();

    const adminId = await ctx.db.insert("users", {
      clerkId: "seed_admin",
      email: "admin@qayta.eco",
      role: "admin",
      language: "ru",
      displayName: "Admin Qayta",
      createdAt: now,
    });

    const consumerId = await ctx.db.insert("users", {
      clerkId: "seed_consumer",
      email: "consumer@test.kz",
      role: "consumer",
      language: "ru",
      displayName: "Айгуль К.",
      createdAt: now,
    });

    const partnerUserIds: Id<"users">[] = [];
    const partnerProfiles: Id<"partnerProfiles">[] = [];
    const partnerData = [
      { name: "Dastarkhan", nameKaz: "Дастархан", cuisine: ["kazakh", "european"], lat: 43.24, lng: 76.91 },
      { name: "Navat Cafe", nameKaz: "Нават", cuisine: ["uzbek", "desserts"], lat: 43.25, lng: 76.95 },
      { name: "Green Bowl", nameKaz: "Жасыл Тостаған", cuisine: ["vegan", "healthy"], lat: 43.23, lng: 76.88 },
    ];

    for (const p of partnerData) {
      const userId = await ctx.db.insert("users", {
        clerkId: `seed_partner_${p.name}`,
        email: `${p.name.toLowerCase().replace(/\s/g, "")}@test.kz`,
        role: "partner",
        language: "ru",
        createdAt: now,
      });
      partnerUserIds.push(userId);
      const profileId = await ctx.db.insert("partnerProfiles", {
        userId,
        businessName: p.name,
        businessNameKaz: p.nameKaz,
        address: "ул. Абая, Алматы",
        city: "almaty",
        coords: { lat: p.lat, lng: p.lng },
        cuisine: p.cuisine,
        rating: 4.2 + Math.random() * 0.6,
        reviewCount: Math.floor(Math.random() * 50) + 10,
        isVerified: true,
        isActive: true,
        farmSubscriptionActive: true,
      });
      partnerProfiles.push(profileId);
    }

    const farmerId = await ctx.db.insert("users", {
      clerkId: "seed_farmer_1",
      email: "farmer1@test.kz",
      role: "farmer",
      language: "kk",
      createdAt: now,
    });
    await ctx.db.insert("farmProfiles", {
      userId: farmerId,
      farmName: "Алатау Farm",
      farmNameKaz: "Алатау Фермасы",
      address: "с. Бесагаш",
      city: "almaty",
      coords: { lat: 43.15, lng: 77.05 },
      animalTypes: ["cattle", "poultry"],
      capacityKgPerDay: 500,
      certifications: [],
      isVerified: true,
    });

    await ctx.db.insert("users", {
      clerkId: "seed_farmer_2",
      email: "farmer2@test.kz",
      role: "farmer",
      language: "ru",
      createdAt: now,
    });

    await ctx.db.insert("users", {
      clerkId: "seed_bio_client",
      email: "bio@test.kz",
      role: "bio_client",
      language: "ru",
      createdAt: now,
    });

    const boxStatuses = ["active", "active", "active", "sold_out", "expired", "active"] as const;
    const boxIds: Id<"surpriseBoxes">[] = [];
    for (let i = 0; i < 6; i++) {
      const partnerId = partnerProfiles[i % partnerProfiles.length]!;
      const boxId = await ctx.db.insert("surpriseBoxes", {
        partnerId,
        city: "almaty",
        title: `Surprise Box ${i + 1}`,
        titleKaz: `Тосын Quti ${i + 1}`,
        description: "Смешанные блюда дня. Содержимое сюрприз.",
        originalPrice: 5000 + i * 500,
        discountedPrice: 2000 + i * 200,
        quantity: boxStatuses[i] === "active" ? 3 + i : 0,
        estimatedWeightKg: 1.5,
        availableFrom: now - 3600000,
        availableUntil: now + (boxStatuses[i] === "expired" ? -3600000 : 7200000),
        status: boxStatuses[i]!,
        allergens: ["gluten"],
        isDietaryVeg: i % 2 === 0,
        isDietaryHalal: true,
        imageIds: [],
        pickupInstructions: "Попросите код у персонала",
      });
      boxIds.push(boxId);
    }

    for (const partnerId of partnerProfiles) {
      await ctx.db.insert("farmListings", {
        partnerId,
        wasteType: ["bread", "produce"],
        estimatedWeightKg: 25,
        availableDays: ["mon", "wed", "fri"],
        pickupAddress: "ул. Абая, Алматы",
        city: "almaty",
        coords: { lat: 43.24, lng: 76.91 },
        temperatureTreated: true,
        status: "active",
      });
    }

    await ctx.db.insert("bioProducts", {
      name: "Qayta Bio Compact",
      nameKaz: "Qayta Bio Компакт",
      description: "Компактная биогазовая установка для кафе",
      descriptionKaz: "Кафелерге арналған компакт биогаз орнатқышы",
      category: "compact",
      dailyCapacityKg: { min: 5, max: 20 },
      priceKzt: 2500000,
      imageIds: [],
      specs: { volume: "2m³", power: "1.5kW" },
      inStock: true,
    });

    await ctx.db.insert("bioProducts", {
      name: "Qayta Bio Industrial",
      nameKaz: "Qayta Bio Өнеркәсіп",
      description: "Промышленная установка для ресторанных сетей",
      descriptionKaz: "Рестoran желілері үшін өнеркәсіптік орнатқыш",
      category: "industrial",
      dailyCapacityKg: { min: 50, max: 200 },
      priceKzt: 15000000,
      imageIds: [],
      specs: { volume: "20m³", power: "15kW" },
      inStock: true,
    });

    for (let i = 0; i < 10; i++) {
      await ctx.db.insert("boxOrders", {
        consumerId,
        boxId: boxIds[i % boxIds.length]!,
        partnerId: partnerProfiles[i % partnerProfiles.length]!,
        quantity: 1,
        totalPaid: 2000 + i * 200,
        status: "picked_up",
        pickupCode: `ABC${i}${i}${i}`,
        paidAt: now - i * 86400000,
        pickedUpAt: now - i * 86400000 + 3600000,
      });
    }

    await ctx.db.insert("impactStats", {
      totalWasteSavedKg: 2400,
      totalCo2SavedKg: 3600,
      totalBoxesSold: 156,
      totalPartners: 3,
      totalFarmers: 2,
      updatedAt: now,
    });

    await ctx.db.insert("ecoHeroPoints", {
      userId: consumerId,
      totalPoints: 450,
      level: 3,
      weeklyPoints: 85,
      weeklyResetAt: now + 7 * 86400000,
    });

    return { status: "seeded", adminId };
  },
});
