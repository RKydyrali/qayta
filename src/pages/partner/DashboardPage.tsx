import { Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { PickupCodeBadge } from "@/components/PickupCodeBadge";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Brain,
  Coins,
  Leaf,
  Package,
  Plus,
  Receipt,
  Storefront,
} from "@phosphor-icons/react";
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

const revenueData = [
  { day: "1", revenue: 12000 },
  { day: "2", revenue: 18000 },
  { day: "3", revenue: 15000 },
  { day: "4", revenue: 24000 },
  { day: "5", revenue: 32000 },
  { day: "6", revenue: 45000 },
  { day: "7", revenue: 38000 },
];

export function PartnerDashboardPage() {
  const { t } = useTranslation();
  const profile = useQuery(api.partners.queries.getPartnerProfile);
  const dashboard = useQuery(
    api.partners.queries.getPartnerDashboard,
    profile ? { partnerId: profile._id } : "skip",
  );
  const impact = useQuery(
    api.impact.queries.getPartnerImpact,
    profile ? { partnerId: profile._id } : "skip",
  );

  if (profile === undefined || dashboard === undefined || impact === undefined) {
    return (
      <ResponsivePageContainer>
        <SkeletonCard className="h-20" />
        <div className="grid gap-4 lg:grid-cols-5">
          {Array.from({ length: 5 }, (_, index) => <SkeletonCard key={index} className="h-[132px]" />)}
        </div>
        <SkeletonCard className="h-80" />
      </ResponsivePageContainer>
    );
  }

  if (!profile) {
    return (
      <ResponsivePageContainer>
        <EmptyStateCard
          icon="/images/citrus-market/market-box.svg"
          title={t("partner.dashboard.noProfileTitle")}
          description={t("partner.dashboard.noProfileDescription")}
          primaryAction={<Button className="rounded-full bg-citrus-forest text-primary-foreground">{t("partner.dashboard.completeProfile")}</Button>}
        />
      </ResponsivePageContainer>
    );
  }

  return (
    <ResponsivePageContainer>
      <PageHeader
        eyebrow={t("partner.dashboard.eyebrow")}
        title={t("partner.dashboard.title", { name: profile.businessName })}
        subtitle={t("partner.dashboard.subtitle")}
        action={
          <Button asChild className="h-11 rounded-full bg-citrus-orange text-citrus-forest hover:bg-citrus-orange/90">
            <Link to="/partner/boxes/new">
              <Plus weight="bold" className="mr-2 size-4" />
              {t("partner.dashboard.addBox")}
            </Link>
          </Button>
        }
      />

      <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="relative overflow-hidden rounded-[32px] border-0 bg-citrus-forest text-primary-foreground shadow-[var(--shadow-warm)]">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('/images/citrus-market/pattern.svg')" }} />
          <CardContent className="relative grid gap-6 p-6 md:grid-cols-[1fr_auto]">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-foreground/12 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em]">
                <span className="size-2 rounded-full bg-citrus-lime" />
                {profile.isActive ? t("partner.dashboard.live") : t("partner.dashboard.paused")}
              </div>
              <h2 className="max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">{t("partner.dashboard.heroTitle")}</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-primary-foreground/72">{t("partner.dashboard.heroDescription")}</p>
            </div>
            <img src="/images/citrus-market/market-box.svg" alt="" className="hidden h-44 w-44 md:block" />
          </CardContent>
        </Card>

        <Card className="rounded-[32px] border bg-citrus-yellowSoft shadow-[var(--shadow-soft)]">
          <CardContent className="flex h-full flex-col justify-between gap-5 p-6 text-citrus-forest">
            <div className="flex items-center gap-3">
              <div className="grid size-12 place-items-center rounded-2xl bg-citrus-forest text-primary-foreground">
                <Brain className="size-6" weight="fill" />
              </div>
              <div>
                <h3 className="font-bold">{t("partner.dashboard.forecastTitle")}</h3>
                <p className="text-sm text-citrus-forest/70">{t("partner.dashboard.forecastHint")}</p>
              </div>
            </div>
            <div className="rounded-[24px] bg-card/70 p-4">
              <p className="text-2xl font-bold">{t("partner.dashboard.forecastValue")}</p>
              <p className="mt-1 text-sm text-citrus-forest/70">{t("partner.dashboard.forecastDescription")}</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <ImpactMetricCard title={t("partner.dashboard.metrics.revenue")} value={dashboard.revenueToday.toLocaleString()} unit={t("common.kzt")} Icon={Coins} variant="revenue" />
        <ImpactMetricCard title={t("partner.dashboard.metrics.sold")} value={dashboard.ordersToday} unit={t("units.items")} Icon={Receipt} variant="orders" />
        <ImpactMetricCard title={t("partner.dashboard.metrics.active")} value={dashboard.activeBoxes} unit={t("units.items")} Icon={Package} variant="rescued" />
        <ImpactMetricCard title={t("partner.dashboard.metrics.food")} value={dashboard.wasteDivertedToday.toFixed(1)} unit={t("units.kg")} Icon={Storefront} variant="score" />
        <ImpactMetricCard title={t("partner.dashboard.metrics.co2")} value={impact.co2Kg.toFixed(1)} unit={t("units.kg")} Icon={Leaf} variant="co2" />
      </div>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="rounded-[28px] border bg-card shadow-[var(--shadow-soft)]">
          <CardHeader>
            <CardTitle className="text-lg">{t("partner.dashboard.revenueChart")}</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} tickFormatter={(value) => `${Number(value) / 1000}k`} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16 }} />
                <Bar dataKey="revenue" fill="var(--orange)" radius={[12, 12, 0, 0]} maxBarSize={54} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border bg-card shadow-[var(--shadow-soft)]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">{t("partner.dashboard.pickupQueue")}</CardTitle>
            <Button asChild variant="ghost" className="rounded-full">
              <Link to="/partner/orders">
                {t("common.viewAll")}
                <ArrowRight className="ml-2 size-4" weight="bold" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="grid gap-3">
            {!dashboard.recentOrders.length ? (
              <EmptyStateCard
                title={t("partner.dashboard.emptyOrdersTitle")}
                description={t("partner.dashboard.emptyOrdersDescription")}
                primaryAction={<Button asChild className="rounded-full bg-citrus-forest text-primary-foreground"><Link to="/partner/boxes/new">{t("partner.dashboard.addBox")}</Link></Button>}
              />
            ) : (
              dashboard.recentOrders.map((order, index) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04, duration: 0.22 }}
                  className="flex items-center justify-between gap-3 rounded-[22px] bg-citrus-soft p-3"
                >
                  <div className="min-w-0">
                    <PickupCodeBadge code={order.pickupCode} />
                    <p className="mt-2 text-xs text-muted-foreground">{t("partner.dashboard.orderCode", { code: order._id.slice(-4) })}</p>
                  </div>
                  <StatusBadge status={order.status} />
                </motion.div>
              ))
            )}
          </CardContent>
        </Card>
      </section>
    </ResponsivePageContainer>
  );
}
