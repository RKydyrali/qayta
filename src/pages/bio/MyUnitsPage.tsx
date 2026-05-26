import { Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Drop, Factory, Gauge, Plus, Wrench } from "@phosphor-icons/react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  EmptyStateCard,
  ImpactMetricCard,
  PageHeader,
  ResponsivePageContainer,
  SkeletonCard,
  StatusBadge,
} from "@/components/citrus/CitrusUI";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const outputData = [
  { month: "1", compost: 450, biogas: 120 },
  { month: "2", compost: 520, biogas: 140 },
  { month: "3", compost: 610, biogas: 165 },
  { month: "4", compost: 580, biogas: 155 },
  { month: "5", compost: 700, biogas: 190 },
];

export function BioMyUnitsPage() {
  const { t, i18n } = useTranslation();
  const orders = useQuery(api.bio.queries.getMyOrders);

  if (orders === undefined) {
    return (
      <ResponsivePageContainer>
        <SkeletonCard className="h-20" />
        <div className="grid gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => <SkeletonCard key={index} className="h-[132px]" />)}
        </div>
      </ResponsivePageContainer>
    );
  }

  const activeUnits = orders.filter((item) => item.order.status === "installed" || item.order.status === "serviced").length;
  const totalCapacity = orders.reduce((sum, item) => sum + item.order.quantity * (item.product?.dailyCapacityKg.max ?? 0), 0);
  const pendingService = orders.filter((item) => item.order.status === "inquiry" || item.order.status === "quoted").length;

  return (
    <ResponsivePageContainer>
      <PageHeader
        eyebrow={t("bio.units.eyebrow")}
        title={t("bio.units.title")}
        subtitle={t("bio.units.subtitle")}
        action={<Button asChild className="rounded-full bg-citrus-lime text-citrus-forest"><Link to="/bio"><Plus className="mr-2 size-4" weight="bold" />{t("bio.units.request")}</Link></Button>}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <ImpactMetricCard title={t("bio.units.metrics.active")} value={activeUnits} Icon={Gauge} variant="score" />
        <ImpactMetricCard title={t("bio.units.metrics.capacity")} value={totalCapacity.toLocaleString()} unit={t("units.kg")} Icon={Factory} variant="rescued" />
        <ImpactMetricCard title={t("bio.units.metrics.service")} value={pendingService} Icon={Wrench} variant="urgent" />
        <ImpactMetricCard title={t("bio.units.metrics.quality")} value={t("bio.units.grade")} Icon={Drop} variant="co2" />
      </div>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="rounded-[28px] border bg-card shadow-[var(--shadow-soft)]">
          <CardHeader>
            <CardTitle className="text-lg">{t("bio.units.outputChart")}</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={outputData} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16 }} />
                <Bar dataKey="compost" name={t("bio.units.compost")} fill="var(--mint)" radius={[12, 12, 0, 0]} maxBarSize={42} />
                <Bar dataKey="biogas" name={t("bio.units.biogas")} fill="var(--lime)" radius={[12, 12, 0, 0]} maxBarSize={42} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border bg-card shadow-[var(--shadow-soft)]">
          <CardHeader>
            <CardTitle className="text-lg">{t("bio.units.queue")}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {orders.length === 0 ? (
              <EmptyStateCard
                icon="/images/citrus-market/bio-unit.svg"
                title={t("bio.units.emptyTitle")}
                description={t("bio.units.emptyDescription")}
                primaryAction={<Button asChild className="rounded-full bg-citrus-forest text-primary-foreground"><Link to="/bio">{t("bio.units.request")}</Link></Button>}
              />
            ) : (
              orders.map((item, index) => (
                <motion.div
                  key={item.order._id}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04, duration: 0.22 }}
                  className="rounded-[22px] bg-citrus-soft p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{i18n.language === "kk" ? item.product?.nameKaz : item.product?.name}</p>
                      <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{item.order.installAddress}</p>
                    </div>
                    <StatusBadge status={item.order.status} />
                  </div>
                  <div className="mt-3 flex justify-between border-t pt-3 text-xs text-muted-foreground">
                    <span>{t("bio.units.qty", { count: item.order.quantity })}</span>
                    {item.order.nextServiceAt && <span>{t("bio.units.serviceDate", { date: new Date(item.order.nextServiceAt).toLocaleDateString() })}</span>}
                  </div>
                </motion.div>
              ))
            )}
          </CardContent>
        </Card>
      </section>
    </ResponsivePageContainer>
  );
}
