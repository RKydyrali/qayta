import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { PickupCodeBadge } from "@/components/PickupCodeBadge";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { CheckCircle, Clock, Package, Receipt } from "@phosphor-icons/react";
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

export function PartnerOrdersPage() {
  const { t } = useTranslation();
  const profile = useQuery(api.partners.queries.getPartnerProfile);
  const orders = useQuery(
    api.rescue.orders.queries.getIncomingOrders,
    profile ? { partnerId: profile._id } : "skip",
  );
  const submitPickup = useMutation(api.rescue.mutations.submitPickup);

  if (profile === undefined || orders === undefined) {
    return (
      <ResponsivePageContainer>
        <SkeletonCard className="h-20" />
        {Array.from({ length: 3 }, (_, index) => <SkeletonCard key={index} className="h-36" />)}
      </ResponsivePageContainer>
    );
  }

  const waiting = orders.filter(({ order }) => order.status === "paid").length;
  const completed = orders.filter(({ order }) => order.status === "picked_up").length;

  return (
    <ResponsivePageContainer>
      <PageHeader
        eyebrow={t("partner.orders.eyebrow")}
        title={t("partner.orders.title")}
        subtitle={t("partner.orders.subtitle")}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <ImpactMetricCard title={t("partner.orders.waiting")} value={waiting} Icon={Clock} variant="urgent" />
        <ImpactMetricCard title={t("partner.orders.completed")} value={completed} Icon={CheckCircle} variant="co2" />
        <ImpactMetricCard title={t("partner.orders.total")} value={orders.length} Icon={Receipt} variant="orders" />
      </div>

      {orders.length === 0 ? (
        <EmptyStateCard
          icon="/images/citrus-market/market-box.svg"
          title={t("partner.orders.emptyTitle")}
          description={t("partner.orders.emptyDescription")}
        />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {orders.map(({ order, box }, index) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.035, duration: 0.22 }}
            >
              <Card className="rounded-[28px] border bg-card shadow-[var(--shadow-soft)]">
                <CardContent className="grid gap-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <PickupCodeBadge code={order.pickupCode} />
                      <p className="mt-2 line-clamp-1 text-sm font-semibold">{box?.title ?? t("common.noData")}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{order.totalPaid.toLocaleString()} {t("common.kzt")} · {t("partner.orders.qty", { count: order.quantity })}</p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {["paid", "ready", "picked_up"].map((step) => {
                      const done = step === "paid" || order.status === "picked_up";
                      return (
                        <div key={step} className="rounded-2xl bg-citrus-soft p-3 text-center">
                          <div className={`mx-auto mb-2 grid size-8 place-items-center rounded-full ${done ? "bg-citrus-lime text-citrus-forest" : "bg-card text-muted-foreground"}`}>
                            <Package className="size-4" weight={done ? "fill" : "regular"} />
                          </div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">{t(`partner.orders.steps.${step}`)}</p>
                        </div>
                      );
                    })}
                  </div>

                  {order.status === "paid" && (
                    <Button
                      className="w-fit rounded-full bg-citrus-forest text-primary-foreground"
                      onClick={() =>
                        submitPickup({
                          orderId: order._id,
                          pickupCode: order.pickupCode,
                        })
                          .then(() => toast.success(t("partner.orders.marked")))
                          .catch(() => toast.error(t("common.actionFailed")))
                      }
                    >
                      <CheckCircle className="mr-2 size-4" weight="fill" />
                      {t("partner.orders.markPickedUp")}
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
