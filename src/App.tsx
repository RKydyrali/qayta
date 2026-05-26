import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { RoleGuard, PublicOnly, SignedInGuard } from "@/lib/roleGuards";
import { ConsumerLayout } from "@/layouts/ConsumerLayout";
import { PartnerLayout } from "@/layouts/PartnerLayout";
import { FarmerLayout } from "@/layouts/FarmerLayout";
import { BioLayout } from "@/layouts/BioLayout";
import { AdminLayout } from "@/layouts/AdminLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { HomePage } from "@/pages/consumer/HomePage";
import { RescuePage } from "@/pages/consumer/RescuePage";
import { BoxDetailPage } from "@/pages/consumer/BoxDetailPage";
import { OrdersPage } from "@/pages/consumer/OrdersPage";
import { ProfilePage } from "@/pages/consumer/ProfilePage";
import { LeaderboardPage } from "@/pages/consumer/LeaderboardPage";
import { SignInPage } from "@/pages/auth/SignInPage";
import { SignUpPage } from "@/pages/auth/SignUpPage";
import { OnboardingPage } from "@/pages/auth/OnboardingPage";
import { PartnerDashboardPage } from "@/pages/partner/DashboardPage";
import { PartnerBoxesPage } from "@/pages/partner/BoxesPage";
import { NewBoxPage } from "@/pages/partner/NewBoxPage";
import { PartnerOrdersPage } from "@/pages/partner/OrdersPage";
import { PartnerFarmPage } from "@/pages/partner/FarmPage";
import { PartnerAnalyticsPage } from "@/pages/partner/AnalyticsPage";
import { FarmerDashboardPage } from "@/pages/farmer/DashboardPage";
import { FarmerExplorePage } from "@/pages/farmer/ExplorePage";
import { FarmerSubscriptionsPage } from "@/pages/farmer/SubscriptionsPage";
import { FarmerDeliveriesPage } from "@/pages/farmer/DeliveriesPage";
import { BioCatalogPage } from "@/pages/bio/CatalogPage";
import { BioProductPage } from "@/pages/bio/ProductPage";
import { BioMyUnitsPage } from "@/pages/bio/MyUnitsPage";
import { AdminDashboardPage } from "@/pages/admin/DashboardPage";
import { AdminPartnersPage } from "@/pages/admin/PartnersPage";
import { AdminBioOrdersPage } from "@/pages/admin/BioOrdersPage";
import { AdminImpactPage } from "@/pages/admin/ImpactPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

export function App() {
  return (
    <>
      <Routes>
        {/* Public auth */}
        <Route element={<AuthLayout />}>
          <Route
            path="/auth/sign-in/*"
            element={
              <PublicOnly>
                <SignInPage />
              </PublicOnly>
            }
          />
          <Route
            path="/auth/sign-up/*"
            element={
              <PublicOnly>
                <SignUpPage />
              </PublicOnly>
            }
          />
          <Route
            path="/auth/onboarding"
            element={
              <SignedInGuard />
            }
          >
            <Route index element={<OnboardingPage />} />
          </Route>
        </Route>

        {/* Consumer */}
        <Route element={<RoleGuard allowedRoles={["consumer", "admin"]} />}>
          <Route element={<ConsumerLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/rescue" element={<RescuePage />} />
            <Route path="/rescue/:boxId" element={<BoxDetailPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
          </Route>
        </Route>

        {/* Partner */}
        <Route element={<RoleGuard allowedRoles={["partner", "admin"]} />}>
          <Route element={<PartnerLayout />}>
            <Route path="/partner/dashboard" element={<PartnerDashboardPage />} />
            <Route path="/partner/boxes" element={<PartnerBoxesPage />} />
            <Route path="/partner/boxes/new" element={<NewBoxPage />} />
            <Route path="/partner/orders" element={<PartnerOrdersPage />} />
            <Route path="/partner/farm" element={<PartnerFarmPage />} />
            <Route path="/partner/analytics" element={<PartnerAnalyticsPage />} />
          </Route>
        </Route>

        {/* Farmer */}
        <Route element={<RoleGuard allowedRoles={["farmer", "admin"]} />}>
          <Route element={<FarmerLayout />}>
            <Route path="/farmer/dashboard" element={<FarmerDashboardPage />} />
            <Route path="/farmer/explore" element={<FarmerExplorePage />} />
            <Route path="/farmer/subscriptions" element={<FarmerSubscriptionsPage />} />
            <Route path="/farmer/deliveries" element={<FarmerDeliveriesPage />} />
          </Route>
        </Route>

        {/* Bio client */}
        <Route element={<RoleGuard allowedRoles={["bio_client", "admin"]} />}>
          <Route element={<BioLayout />}>
            <Route path="/bio" element={<BioCatalogPage />} />
            <Route path="/bio/:productId" element={<BioProductPage />} />
            <Route path="/bio/my-units" element={<BioMyUnitsPage />} />
          </Route>
        </Route>

        {/* Admin */}
        <Route element={<RoleGuard allowedRoles={["admin"]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/partners" element={<AdminPartnersPage />} />
            <Route path="/admin/bio-orders" element={<AdminBioOrdersPage />} />
            <Route path="/admin/impact" element={<AdminImpactPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster position="top-right" />
    </>
  );
}
