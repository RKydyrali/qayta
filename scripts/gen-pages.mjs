import { mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";

const root = process.cwd();
const pages = [
  ["src/app/(consumer)/page.tsx", "HomePage", "consumer/HomePage"],
  ["src/app/(consumer)/rescue/page.tsx", "RescuePage", "consumer/RescuePage"],
  ["src/app/(consumer)/rescue/[boxId]/page.tsx", "BoxDetailPage", "consumer/BoxDetailPage"],
  ["src/app/(consumer)/orders/page.tsx", "OrdersPage", "consumer/OrdersPage"],
  ["src/app/(consumer)/profile/page.tsx", "ProfilePage", "consumer/ProfilePage"],
  ["src/app/(consumer)/leaderboard/page.tsx", "LeaderboardPage", "consumer/LeaderboardPage"],
  ["src/app/(partner)/partner/dashboard/page.tsx", "PartnerDashboardPage", "partner/DashboardPage"],
  ["src/app/(partner)/partner/boxes/page.tsx", "PartnerBoxesPage", "partner/BoxesPage"],
  ["src/app/(partner)/partner/boxes/new/page.tsx", "NewBoxPage", "partner/NewBoxPage"],
  ["src/app/(partner)/partner/orders/page.tsx", "PartnerOrdersPage", "partner/OrdersPage"],
  ["src/app/(partner)/partner/farm/page.tsx", "PartnerFarmPage", "partner/FarmPage"],
  ["src/app/(partner)/partner/analytics/page.tsx", "PartnerAnalyticsPage", "partner/AnalyticsPage"],
  ["src/app/(farmer)/farmer/dashboard/page.tsx", "FarmerDashboardPage", "farmer/DashboardPage"],
  ["src/app/(farmer)/farmer/explore/page.tsx", "FarmerExplorePage", "farmer/ExplorePage"],
  ["src/app/(farmer)/farmer/subscriptions/page.tsx", "FarmerSubscriptionsPage", "farmer/SubscriptionsPage"],
  ["src/app/(farmer)/farmer/deliveries/page.tsx", "FarmerDeliveriesPage", "farmer/DeliveriesPage"],
  ["src/app/(bio)/bio/page.tsx", "BioCatalogPage", "bio/CatalogPage"],
  ["src/app/(bio)/bio/[productId]/page.tsx", "BioProductPage", "bio/ProductPage"],
  ["src/app/(bio)/bio/my-units/page.tsx", "BioMyUnitsPage", "bio/MyUnitsPage"],
  ["src/app/(admin)/admin/page.tsx", "AdminDashboardPage", "admin/DashboardPage"],
  ["src/app/(admin)/admin/partners/page.tsx", "AdminPartnersPage", "admin/PartnersPage"],
  ["src/app/(admin)/admin/bio-orders/page.tsx", "AdminBioOrdersPage", "admin/BioOrdersPage"],
  ["src/app/(admin)/admin/impact/page.tsx", "AdminImpactPage", "admin/ImpactPage"],
];

for (const [rel, exp, from] of pages) {
  const file = join(root, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(
    file,
    `"use client";\nimport { ${exp} } from "@/pages/${from}";\nexport default ${exp};\n`,
  );
}

console.log(`Generated ${pages.length} pages`);
