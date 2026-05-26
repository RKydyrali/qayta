import { Link } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { CalendarCheck, Leaf, MapPin, Truck, XCircle } from "@phosphor-icons/react";
import { toast } from "sonner";
import {
  EmptyStateCard,
  PageHeader,
  ResponsivePageContainer,
  SkeletonCard,
  StatusBadge,
} from "@/components/citrus/CitrusUI";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function FarmerSubscriptionsPage() {
  const { t } = useTranslation();
  const user = useQuery(api.users.getMe);
  const subs = useQuery(
    api.farm.queries.getFarmerSubscriptions,
    user ? { farmerId: user._id } : "skip",
  );
  const cancel = useMutation(api.farm.mutations.cancelSubscription);

  if (user === undefined || subs === undefined) {
    return (
      <ResponsivePageContainer>
        <SkeletonCard className="h-20" />
        {Array.from({ length: 3 }, (_, index) => <SkeletonCard key={index} className="h-40" />)}
      </ResponsivePageContainer>
    );
  }

  return (
    <ResponsivePageContainer>
      <PageHeader
        eyebrow={t("farmer.subscriptions.eyebrow")}
        title={t("farmer.subscriptions.title")}
        subtitle={t("farmer.subscriptions.subtitle")}
        action={<Button asChild className="rounded-full bg-citrus-forest text-primary-foreground"><Link to="/farmer/explore">{t("farmer.dashboard.findFeed")}</Link></Button>}
      />

      {subs.length === 0 ? (
        <EmptyStateCard
          icon="/images/citrus-market/farm-truck.svg"
          title={t("farmer.subscriptions.emptyTitle")}
          description={t("farmer.subscriptions.emptyDescription")}
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
                    <div className="min-w-0">
                      <p className="truncate text-lg font-bold">{item.partner?.businessName ?? t("common.unknownPartner")}</p>
                      <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="size-4" />
                        {item.listing?.pickupAddress ?? t("common.noData")}
                      </p>
                    </div>
                    <StatusBadge status={item.subscription.status} />
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="rounded-2xl bg-citrus-soft p-3">
                      <Leaf className="mb-2 size-4 text-citrus-teal" weight="fill" />
                      <p className="text-xs text-muted-foreground">{t("farmer.subscriptions.feed")}</p>
                      <p className="font-bold">{item.listing?.estimatedWeightKg ?? 0} {t("units.kg")}</p>
                    </div>
                    <div className="rounded-2xl bg-citrus-soft p-3">
                      <CalendarCheck className="mb-2 size-4 text-citrus-orange" weight="fill" />
                      <p className="text-xs text-muted-foreground">{t("farmer.subscriptions.billing")}</p>
                      <p className="font-bold">{new Date(item.subscription.nextBillingAt).toLocaleDateString()}</p>
                    </div>
                    <div className="rounded-2xl bg-citrus-soft p-3">
                      <Truck className="mb-2 size-4 text-citrus-mint" weight="fill" />
                      <p className="text-xs text-muted-foreground">{t("farmer.subscriptions.plan")}</p>
                      <p className="font-bold">{t(`farmer.plans.${item.subscription.plan}`)}</p>
                    </div>
                  </div>

                  {item.subscription.status === "active" && (
                    <Button
                      variant="outline"
                      className="w-fit rounded-full border-citrus-coral text-citrus-coral"
                      onClick={() =>
                        cancel({ subscriptionId: item.subscription._id })
                          .then(() => toast.success(t("farmer.subscriptions.cancelled")))
                          .catch(() => toast.error(t("common.actionFailed")))
                      }
                    >
                      <XCircle className="mr-2 size-4" weight="fill" />
                      {t("farmer.subscriptions.cancel")}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </ResponsivePageContainer>
  );
}
