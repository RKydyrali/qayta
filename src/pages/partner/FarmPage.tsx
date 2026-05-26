import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { CalendarCheck, Leaf, Truck } from "@phosphor-icons/react";
import { toast } from "sonner";
import {
  EmptyStateCard,
  ImpactMetricCard,
  PageHeader,
  ResponsivePageContainer,
  SkeletonCard,
  StatusBadge,
} from "@/components/citrus/CitrusUI";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const FARM_SUBSCRIPTION_PRICE_MONTHLY = 25000;

export function PartnerFarmPage() {
  const { t } = useTranslation();
  const profile = useQuery(api.partners.queries.getPartnerProfile);
  const activity = useQuery(
    api.farm.queries.getPartnerFarmActivity,
    profile ? { partnerId: profile._id } : "skip",
  );
  const toggleSub = useMutation(api.partners.mutations.toggleFarmSubscription);

  if (profile === undefined || activity === undefined) {
    return (
      <ResponsivePageContainer>
        <SkeletonCard className="h-20" />
        <SkeletonCard className="h-72" />
      </ResponsivePageContainer>
    );
  }
  if (!profile) return null;

  return (
    <ResponsivePageContainer>
      <PageHeader
        eyebrow={t("partner.farm.eyebrow")}
        title={t("partner.farm.title")}
        subtitle={t("partner.farm.subtitle")}
      />

      {!profile.farmSubscriptionActive ? (
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24 }}>
          <Card className="overflow-hidden rounded-[32px] border bg-card shadow-[var(--shadow-soft)]">
            <CardContent className="grid gap-6 p-6 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-citrus-teal">{t("partner.farm.offerEyebrow")}</p>
                <h2 className="mt-2 max-w-xl text-3xl font-bold tracking-tight">{t("partner.farm.offerTitle")}</h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">{t("partner.farm.offerDescription")}</p>
                <p className="mt-5 text-3xl font-bold text-citrus-forest dark:text-citrus-lime">
                  {FARM_SUBSCRIPTION_PRICE_MONTHLY.toLocaleString()} {t("common.kzt")}
                  <span className="ml-2 text-sm font-semibold text-muted-foreground">{t("partner.farm.perMonth")}</span>
                </p>
                <Button
                  className="mt-5 rounded-full bg-citrus-forest text-primary-foreground"
                  onClick={() =>
                    toggleSub({ partnerId: profile._id, active: true })
                      .then(() => toast.success(t("partner.farm.subscribed")))
                      .catch(() => toast.error(t("common.actionFailed")))
                  }
                >
                  <Leaf className="mr-2 size-4" weight="fill" />
                  {t("partner.farm.subscribe")}
                </Button>
              </div>
              <img src="/images/citrus-market/farm-truck.svg" alt="" className="hidden h-56 w-56 md:block" />
            </CardContent>
          </Card>
        </motion.section>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            <ImpactMetricCard title={t("partner.farm.metrics.status")} value={t("status.active")} Icon={Leaf} variant="co2" />
            <ImpactMetricCard title={t("partner.farm.metrics.farmers")} value={activity.subscriptions.length} Icon={Truck} variant="orders" />
            <ImpactMetricCard title={t("partner.farm.metrics.weight")} value={activity.listing?.estimatedWeightKg ?? 0} unit={t("units.kg")} Icon={CalendarCheck} variant="rescued" />
          </div>

          {activity.listing ? (
            <Card className="rounded-[28px] border bg-card shadow-[var(--shadow-soft)]">
              <CardContent className="grid gap-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold">{t("partner.farm.listingActive")}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {activity.listing.estimatedWeightKg} {t("units.kg")} · {activity.listing.wasteType.map((item) => t(`farmer.waste.${item}`)).join(", ")}
                    </p>
                  </div>
                  <StatusBadge status={activity.listing.status} />
                </div>
              </CardContent>
            </Card>
          ) : (
            <EmptyStateCard
              icon="/images/citrus-market/farm-truck.svg"
              title={t("partner.farm.emptyTitle")}
              description={t("partner.farm.emptyDescription")}
            />
          )}
        </>
      )}
    </ResponsivePageContainer>
  );
}
