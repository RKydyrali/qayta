import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ChartLineUp, Coins, Leaf, Package, Percent } from "@phosphor-icons/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ImpactMetricCard,
  PageHeader,
  ResponsivePageContainer,
  SkeletonCard,
} from "@/components/citrus/CitrusUI";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const wasteData = [
  { day: "1", kg: 12 },
  { day: "2", kg: 19 },
  { day: "3", kg: 8 },
  { day: "4", kg: 15 },
  { day: "5", kg: 22 },
  { day: "6", kg: 10 },
  { day: "7", kg: 18 },
];

export function PartnerAnalyticsPage() {
  const { t } = useTranslation();
  const profile = useQuery(api.partners.queries.getPartnerProfile);
  const impact = useQuery(
    api.impact.queries.getPartnerImpact,
    profile ? { partnerId: profile._id } : "skip",
  );
  const dashboard = useQuery(
    api.partners.queries.getPartnerDashboard,
    profile ? { partnerId: profile._id } : "skip",
  );

  if (profile === undefined || impact === undefined || dashboard === undefined) {
    return (
      <ResponsivePageContainer>
        <SkeletonCard className="h-20" />
        <div className="grid gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => <SkeletonCard key={index} className="h-32" />)}
        </div>
        <SkeletonCard className="h-80" />
      </ResponsivePageContainer>
    );
  }

  const revenueData = [
    { week: t("partner.analytics.week", { count: 1 }), revenue: Math.max(0, dashboard.revenueToday * 0.72) },
    { week: t("partner.analytics.week", { count: 2 }), revenue: Math.max(0, dashboard.revenueToday * 0.84) },
    { week: t("partner.analytics.week", { count: 3 }), revenue: Math.max(0, dashboard.revenueToday * 0.68) },
    { week: t("partner.analytics.week", { count: 4 }), revenue: dashboard.revenueToday },
  ];

  return (
    <ResponsivePageContainer>
      <PageHeader
        eyebrow={t("partner.analytics.eyebrow")}
        title={t("partner.analytics.title")}
        subtitle={t("partner.analytics.subtitle")}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <ImpactMetricCard title={t("partner.analytics.metrics.revenue")} value={dashboard.revenueToday.toLocaleString()} unit={t("common.kzt")} Icon={Coins} variant="revenue" />
        <ImpactMetricCard title={t("partner.analytics.metrics.food")} value={impact.wasteKg.toFixed(1)} unit={t("units.kg")} Icon={Package} variant="rescued" />
        <ImpactMetricCard title={t("partner.analytics.metrics.discount")} value="38" unit="%" Icon={Percent} variant="orders" />
        <ImpactMetricCard title={t("partner.analytics.metrics.co2")} value={impact.co2Kg.toFixed(1)} unit={t("units.kg")} Icon={Leaf} variant="co2" />
      </div>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24 }}
        className="grid gap-6 xl:grid-cols-2"
      >
        <Card className="rounded-[28px] border bg-card shadow-[var(--shadow-soft)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ChartLineUp className="size-5 text-citrus-orange" weight="fill" />
              {t("partner.analytics.wasteChart")}
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wasteData} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16 }} />
                <Bar dataKey="kg" fill="var(--orange)" radius={[12, 12, 0, 0]} maxBarSize={46} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border bg-card shadow-[var(--shadow-soft)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Coins className="size-5 text-citrus-lemon" weight="fill" />
              {t("partner.analytics.revenueChart")}
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} tickFormatter={(value) => `${Number(value) / 1000}k`} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16 }} />
                <Line type="monotone" dataKey="revenue" stroke="var(--teal)" strokeWidth={3} dot={{ fill: "var(--teal)", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.section>
    </ResponsivePageContainer>
  );
}
