import { Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { CheckCircle, Clock, MapPin, Truck } from "@phosphor-icons/react";
import {
  EmptyStateCard,
  PageHeader,
  ResponsivePageContainer,
  SkeletonCard,
  StatusBadge,
} from "@/components/citrus/CitrusUI";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const routeSteps = ["pending", "confirmed", "collected", "delivered", "certified"] as const;

export function FarmerDeliveriesPage() {
  const { t } = useTranslation();
  const user = useQuery(api.users.getMe);
  const subs = useQuery(
    api.farm.queries.getFarmerSubscriptions,
    user ? { farmerId: user._id } : "skip",
  );

  if (user === undefined || subs === undefined) {
    return (
      <ResponsivePageContainer>
        <SkeletonCard className="h-20" />
        {Array.from({ length: 3 }, (_, index) => <SkeletonCard key={index} className="h-44" />)}
      </ResponsivePageContainer>
    );
  }

  return (
    <ResponsivePageContainer>
      <PageHeader
        eyebrow={t("farmer.deliveries.eyebrow")}
        title={t("farmer.deliveries.title")}
        subtitle={t("farmer.deliveries.subtitle")}
      />

      {subs.length === 0 ? (
        <EmptyStateCard
          icon="/images/citrus-market/farm-truck.svg"
          title={t("farmer.deliveries.emptyTitle")}
          description={t("farmer.deliveries.emptyDescription")}
          primaryAction={<Button asChild className="rounded-full bg-citrus-forest text-primary-foreground"><Link to="/farmer/explore">{t("farmer.dashboard.findFeed")}</Link></Button>}
        />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {subs.map((item, index) => (
            <motion.div
              key={item.subscription._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, duration: 0.22 }}
            >
              <Card className="rounded-[28px] border bg-card shadow-[var(--shadow-soft)]">
                <CardContent className="grid gap-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-bold">{item.partner?.businessName ?? t("common.unknownPartner")}</p>
                      <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="size-4" />
                        {item.listing?.pickupAddress ?? t("common.noData")}
                      </p>
                    </div>
                    <StatusBadge status={item.subscription.status} />
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {routeSteps.map((step, stepIndex) => {
                      const done = item.subscription.status === "active" && stepIndex < 2;
                      return (
                        <div key={step} className="flex flex-col items-center gap-2 text-center">
                          <div className={`grid size-9 place-items-center rounded-full ${done ? "bg-citrus-lime text-citrus-forest" : "bg-citrus-soft text-muted-foreground"}`}>
                            {done ? <CheckCircle className="size-4" weight="fill" /> : <Clock className="size-4" />}
                          </div>
                          <span className="text-[10px] font-semibold leading-tight text-muted-foreground">{t(`farmer.deliveries.steps.${step}`)}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="rounded-2xl bg-citrus-mintSoft p-4 text-citrus-forest">
                    <Truck className="mb-2 size-5" weight="fill" />
                    <p className="text-sm font-semibold">{t("farmer.deliveries.nextPickup", { date: new Date(item.subscription.nextBillingAt).toLocaleDateString() })}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </ResponsivePageContainer>
  );
}
