import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { PickupCodeBadge } from "@/components/PickupCodeBadge";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { CalendarCheck, CheckCircle, Clock, Leaf, Package, ShoppingBagOpen } from "@phosphor-icons/react";
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
import { cn } from "@/lib/utils";

type Tab = "active" | "history";

const activeStatuses = new Set(["pending", "paid"]);
const timeline = ["paid", "preparing", "ready", "picked_up", "impact_counted"] as const;

export function OrdersPage() {
  const { t, i18n } = useTranslation();
  const orders = useQuery(api.rescue.orders.queries.getMyOrders);
  const [tab, setTab] = useState<Tab>("active");

  const activeOrders = orders?.filter(({ order }) => activeStatuses.has(order.status)) ?? [];
  const historyOrders = orders?.filter(({ order }) => !activeStatuses.has(order.status)) ?? [];
  const selectedOrders = tab === "active" ? activeOrders : historyOrders;
  const impact = useMemo(() => {
    return (orders ?? []).reduce(
      (acc, { order, box }) => {
        if (order.status !== "picked_up") return acc;
        const kg = (box?.estimatedWeightKg ?? 1.5) * order.quantity;
        return { kg: acc.kg + kg, co2: acc.co2 + kg * 1.5 };
      },
      { kg: 0, co2: 0 },
    );
  }, [orders]);

  if (orders === undefined) {
    return (
      <ResponsivePageContainer>
        <SkeletonCard className="h-20" />
        <div className="grid gap-3 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => <SkeletonCard key={index} className="h-44" />)}
        </div>
      </ResponsivePageContainer>
    );
  }

  return (
    <ResponsivePageContainer>
      <PageHeader
        eyebrow={t("consumer.orders.eyebrow")}
        title={t("consumer.orders.title")}
        subtitle={t("consumer.orders.subtitle")}
        action={
          <Button asChild className="rounded-full bg-citrus-forest text-primary-foreground">
            <Link to="/rescue">
              <ShoppingBagOpen className="mr-2 size-4" weight="fill" />
              {t("consumer.orders.findBoxes")}
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <ImpactMetricCard title={t("consumer.orders.active")} value={activeOrders.length} unit={t("units.items")} Icon={Clock} variant="urgent" />
        <ImpactMetricCard title={t("consumer.orders.rescued")} value={impact.kg.toFixed(1)} unit={t("units.kg")} Icon={Package} variant="rescued" />
        <ImpactMetricCard title={t("consumer.orders.co2")} value={impact.co2.toFixed(1)} unit={t("units.kg")} Icon={Leaf} variant="co2" />
      </div>

      <div className="flex w-fit rounded-full bg-citrus-soft p-1">
        {(["active", "history"] as const).map((item) => (
          <Button
            key={item}
            type="button"
            variant="ghost"
            className={cn("rounded-full px-5", tab === item && "bg-citrus-forest text-primary-foreground hover:bg-citrus-forest/90 hover:text-primary-foreground")}
            onClick={() => setTab(item)}
          >
            {t(`consumer.orders.tabs.${item}`)}
          </Button>
        ))}
      </div>

      {selectedOrders.length === 0 ? (
        <EmptyStateCard
          title={tab === "active" ? t("consumer.orders.emptyActiveTitle") : t("consumer.orders.emptyHistoryTitle")}
          description={tab === "active" ? t("consumer.orders.emptyActiveDescription") : t("consumer.orders.emptyHistoryDescription")}
          primaryAction={<Button asChild className="rounded-full bg-citrus-forest text-primary-foreground"><Link to="/rescue">{t("consumer.orders.findBoxes")}</Link></Button>}
          secondaryAction={<Button asChild variant="outline" className="rounded-full"><Link to="/profile">{t("nav.profile")}</Link></Button>}
        />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {selectedOrders.map(({ order, box, partner }, index) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, duration: 0.24 }}
            >
              <Card className="overflow-hidden rounded-[28px] border bg-card shadow-[var(--shadow-soft)]">
                <CardContent className="grid gap-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-lg font-bold tracking-tight">
                        {partner ? (i18n.language === "kk" ? partner.businessNameKaz : partner.businessName) : t("common.unknownPartner")}
                      </p>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {box ? (i18n.language === "kk" ? box.titleKaz : box.title) : t("common.noData")}
                      </p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>

                  {(order.status === "paid" || order.status === "picked_up") && (
                    <div className="rounded-[22px] bg-citrus-yellowSoft p-4">
                      <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-citrus-forest/70">{t("consumer.orders.pickupCode")}</p>
                      <PickupCodeBadge code={order.pickupCode} />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-2xl bg-citrus-soft p-3">
                      <p className="text-xs text-muted-foreground">{t("consumer.orders.total")}</p>
                      <p className="font-bold">{order.totalPaid.toLocaleString()} {t("common.kzt")}</p>
                    </div>
                    <div className="rounded-2xl bg-citrus-soft p-3">
                      <p className="text-xs text-muted-foreground">{t("consumer.orders.quantity")}</p>
                      <p className="font-bold">{order.quantity}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-2">
                    {timeline.map((item) => {
                      const done =
                        item === "paid"
                          ? ["paid", "picked_up"].includes(order.status)
                          : item === "picked_up" || item === "impact_counted"
                            ? order.status === "picked_up"
                            : order.status === "paid" || order.status === "picked_up";
                      return (
                        <div key={item} className="flex flex-col items-center gap-2 text-center">
                          <div className={cn("grid size-9 place-items-center rounded-full", done ? "bg-citrus-lime text-citrus-forest" : "bg-citrus-soft text-muted-foreground")}>
                            {done ? <CheckCircle className="size-4" weight="fill" /> : <CalendarCheck className="size-4" />}
                          </div>
                          <span className="text-[10px] font-semibold leading-tight text-muted-foreground">{t(`consumer.orders.timeline.${item}`)}</span>
                        </div>
                      );
                    })}
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
