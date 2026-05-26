import { Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { CalendarCheck, Certificate, Leaf, MagnifyingGlass, MapPin, Truck } from "@phosphor-icons/react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
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

const feedData = [
  { week: "1", kg: 120 },
  { week: "2", kg: 150 },
  { week: "3", kg: 180 },
  { week: "4", kg: 210 },
];

export function FarmerDashboardPage() {
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
        <div className="grid gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => <SkeletonCard key={index} className="h-[132px]" />)}
        </div>
      </ResponsivePageContainer>
    );
  }

  const activeCount = subs.filter((s) => s.subscription.status === "active").length;
  const totalFeedKg = subs.reduce((sum, s) => sum + (s.listing?.estimatedWeightKg ?? 0), 0);
  const savings = activeCount * 18000;

  return (
    <ResponsivePageContainer>
      <PageHeader
        eyebrow={t("farmer.dashboard.eyebrow")}
        title={t("farmer.dashboard.title")}
        subtitle={t("farmer.dashboard.subtitle")}
        action={
          <Button asChild className="rounded-full bg-citrus-mint text-citrus-forest hover:bg-citrus-mint/90">
            <Link to="/farmer/explore">
              <MagnifyingGlass className="mr-2 size-4" weight="bold" />
              {t("farmer.dashboard.findFeed")}
            </Link>
          </Button>
        }
      />

      <section className="relative overflow-hidden rounded-[32px] bg-citrus-forest p-6 text-primary-foreground shadow-[var(--shadow-warm)]">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('/images/citrus-market/pattern.svg')" }} />
        <div className="relative grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-citrus-mint">{t("farmer.dashboard.heroEyebrow")}</p>
            <h2 className="mt-2 max-w-2xl text-3xl font-bold tracking-tight">{t("farmer.dashboard.heroTitle")}</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-primary-foreground/72">{t("farmer.dashboard.heroDescription")}</p>
          </div>
          <img src="/images/citrus-market/farm-truck.svg" alt="" className="hidden h-44 w-44 md:block" />
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <ImpactMetricCard title={t("farmer.dashboard.metrics.feed")} value={totalFeedKg.toFixed(0)} unit={t("units.kg")} Icon={Leaf} variant="co2" />
        <ImpactMetricCard title={t("farmer.dashboard.metrics.pickups")} value={activeCount} Icon={Truck} variant="orders" />
        <ImpactMetricCard title={t("farmer.dashboard.metrics.savings")} value={savings.toLocaleString()} unit={t("common.kzt")} Icon={CalendarCheck} variant="revenue" />
        <ImpactMetricCard title={t("farmer.dashboard.metrics.certified")} value={subs.filter((s) => s.listing?.temperatureTreated).length} Icon={Certificate} variant="score" />
      </div>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="rounded-[28px] border bg-card shadow-[var(--shadow-soft)]">
          <CardHeader>
            <CardTitle className="text-lg">{t("farmer.dashboard.feedChart")}</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={feedData} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="feedFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--mint)" stopOpacity={0.34} />
                    <stop offset="95%" stopColor="var(--mint)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16 }} />
                <Area dataKey="kg" type="monotone" stroke="var(--mint)" strokeWidth={3} fill="url(#feedFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border bg-card shadow-[var(--shadow-soft)]">
          <CardHeader>
            <CardTitle className="text-lg">{t("farmer.dashboard.activeRoutes")}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {subs.length === 0 ? (
              <EmptyStateCard
                icon="/images/citrus-market/farm-truck.svg"
                title={t("farmer.dashboard.emptyTitle")}
                description={t("farmer.dashboard.emptyDescription")}
                primaryAction={<Button asChild className="rounded-full bg-citrus-forest text-primary-foreground"><Link to="/farmer/explore">{t("farmer.dashboard.findFeed")}</Link></Button>}
              />
            ) : (
              subs.slice(0, 4).map((subscription, index) => (
                <motion.div
                  key={subscription.subscription._id}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04, duration: 0.22 }}
                  className="rounded-[22px] bg-citrus-soft p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{subscription.partner?.businessName ?? t("common.unknownPartner")}</p>
                      <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="size-3" />
                        {subscription.listing?.estimatedWeightKg ?? 0} {t("units.kg")} · {subscription.listing?.wasteType.join(", ")}
                      </p>
                    </div>
                    <StatusBadge status={subscription.subscription.status} />
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
