import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Factory, Wrench } from "@phosphor-icons/react";
import { toast } from "sonner";
import {
  EmptyStateCard,
  PageHeader,
  ResponsivePageContainer,
  SkeletonCard,
  StatusBadge,
} from "@/components/citrus/CitrusUI";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

const STATUSES = ["inquiry", "quoted", "confirmed", "installed", "serviced"] as const;

export function AdminBioOrdersPage() {
  const { t } = useTranslation();
  const orders = useQuery(api.bio.queries.getAllOrdersByStatus);
  const updateStatus = useMutation(api.admin.mutations.updateBioOrderStatus);
  const [changingId, setChangingId] = useState<string | null>(null);

  if (orders === undefined) {
    return (
      <ResponsivePageContainer>
        <SkeletonCard className="h-20" />
        <div className="grid gap-4 xl:grid-cols-5">
          {STATUSES.map((status) => (
            <SkeletonCard key={status} className="h-96" />
          ))}
        </div>
      </ResponsivePageContainer>
    );
  }

  const total = STATUSES.reduce((sum, status) => sum + (orders[status]?.length ?? 0), 0);

  return (
    <ResponsivePageContainer>
      <PageHeader
        eyebrow={t("admin.bioOrders.eyebrow")}
        title={t("admin.bioOrders.title")}
        subtitle={t("admin.bioOrders.subtitle", { count: total })}
      />

      {total === 0 ? (
        <EmptyStateCard
          icon="/images/citrus-market/bio-unit.svg"
          title={t("admin.bioOrders.emptyTitle")}
          description={t("admin.bioOrders.emptyDescription")}
        />
      ) : (
        <div className="grid gap-4 xl:grid-cols-5">
          {STATUSES.map((status) => (
            <section key={status} className="rounded-[28px] border bg-citrus-soft p-3 shadow-[var(--shadow-soft)]">
              <div className="mb-3 flex items-center justify-between px-1">
                <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-muted-foreground">{t(`status.${status}`)}</h2>
                <span className="grid size-8 place-items-center rounded-full bg-card text-xs font-bold">{orders[status]?.length ?? 0}</span>
              </div>
              <div className="grid gap-3">
                {(orders[status] ?? []).map(({ order, product }, index) => (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03, duration: 0.2 }}
                  >
                    <Card className="rounded-[22px] border bg-card">
                      <CardContent className="grid gap-3 p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="line-clamp-2 text-sm font-semibold">{product?.name ?? t("common.noData")}</p>
                            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{order.installAddress}</p>
                          </div>
                          <Factory className="size-5 shrink-0 text-citrus-teal" weight="fill" />
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{t("bio.units.qty", { count: order.quantity })}</span>
                          {order.totalQuoteKzt && <span>{order.totalQuoteKzt.toLocaleString()} {t("common.kzt")}</span>}
                        </div>
                        <StatusBadge status={order.status} />
                        <Select
                          value={order.status}
                          onValueChange={(value) => {
                            const statusValue = value as (typeof STATUSES)[number];
                            setChangingId(order._id);
                            updateStatus({ orderId: order._id, status: statusValue })
                              .then(() => toast.success(t("admin.bioOrders.statusUpdated")))
                              .catch(() => toast.error(t("common.actionFailed")))
                              .finally(() => setChangingId(null));
                          }}
                          disabled={changingId === order._id}
                        >
                          <SelectTrigger className="h-9 rounded-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUSES.map((item) => (
                              <SelectItem key={item} value={item}>
                                {t(`status.${item}`)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
                {(orders[status] ?? []).length === 0 && (
                  <div className="rounded-[22px] border border-dashed bg-card/60 p-4 text-center text-xs text-muted-foreground">
                    <Wrench className="mx-auto mb-2 size-5" />
                    {t("admin.bioOrders.noItems")}
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>
      )}
    </ResponsivePageContainer>
  );
}
