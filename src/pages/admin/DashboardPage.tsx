import { Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Factory, Heartbeat, Leaf, ShieldCheck, Storefront, UsersThree } from "@phosphor-icons/react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  FlowTimeline,
  ImpactMetricCard,
  PageHeader,
  ResponsivePageContainer,
  SkeletonCard,
} from "@/components/citrus/CitrusUI";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const growthData = [
  { month: "1", partners: 4 },
  { month: "2", partners: 8 },
  { month: "3", partners: 13 },
  { month: "4", partners: 21 },
  { month: "5", partners: 34 },
];

export function AdminDashboardPage() {
  const { t } = useTranslation();
  const stats = useQuery(api.admin.queries.getSystemStats);

  if (stats === undefined) {
    return (
      <ResponsivePageContainer>
        <SkeletonCard className="h-20" />
        <div className="grid gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => <SkeletonCard key={index} className="h-[132px]" />)}
        </div>
      </ResponsivePageContainer>
    );
  }

  return (
    <ResponsivePageContainer>
      <PageHeader
        eyebrow={t("admin.dashboard.eyebrow")}
        title={t("admin.dashboard.title")}
        subtitle={t("admin.dashboard.subtitle")}
        action={<Button asChild className="rounded-full bg-citrus-coral text-white"><Link to="/admin/partners">{t("nav.partners")}</Link></Button>}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <ImpactMetricCard title={t("admin.dashboard.metrics.partners")} value={stats.totalPartners} Icon={Storefront} variant="orders" />
        <ImpactMetricCard title={t("admin.dashboard.metrics.farmers")} value={stats.totalFarmers} Icon={Leaf} variant="co2" />
        <ImpactMetricCard title={t("admin.dashboard.metrics.bio")} value={stats.totalBioClients} Icon={Factory} variant="score" />
        <ImpactMetricCard title={t("admin.dashboard.metrics.pending")} value={stats.pendingVerifications} Icon={ShieldCheck} variant="urgent" />
        <ImpactMetricCard title={t("admin.dashboard.metrics.rescued")} value={Math.round(stats.impact?.totalWasteSavedKg ?? 0)} unit={t("units.kg")} Icon={UsersThree} variant="rescued" />
      </div>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="rounded-[28px] border bg-card shadow-[var(--shadow-soft)]">
          <CardHeader>
            <CardTitle className="text-lg">{t("admin.dashboard.growthChart")}</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="adminGrowth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--coral)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--coral)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16 }} />
                <Area type="monotone" dataKey="partners" stroke="var(--coral)" strokeWidth={3} fill="url(#adminGrowth)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border bg-citrus-soft shadow-[var(--shadow-soft)]">
          <CardHeader>
            <CardTitle className="text-lg">{t("admin.dashboard.circularFlow")}</CardTitle>
          </CardHeader>
          <CardContent>
            <FlowTimeline
              labels={{
                rescue: t("flow.rescue"),
                farm: t("flow.farm"),
                bio: t("flow.bio"),
                impact: t("flow.impact"),
              }}
            />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { to: "/admin/partners", title: t("admin.dashboard.queue.partners"), description: t("admin.dashboard.queue.partnersHint"), Icon: Storefront },
          { to: "/admin/bio-orders", title: t("admin.dashboard.queue.bio"), description: t("admin.dashboard.queue.bioHint"), Icon: Factory },
          { to: "/admin/impact", title: t("admin.dashboard.queue.health"), description: t("admin.dashboard.queue.healthHint"), Icon: Heartbeat },
        ].map(({ to, title, description, Icon }, index) => (
          <motion.div key={to} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05, duration: 0.22 }}>
            <Link to={to}>
              <Card className="h-full rounded-[28px] border bg-card shadow-[var(--shadow-soft)] transition hover:-translate-y-1">
                <CardContent className="p-5">
                  <div className="mb-5 grid size-12 place-items-center rounded-2xl bg-citrus-coralSoft text-citrus-forest">
                    <Icon className="size-5" weight="fill" />
                  </div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </section>
    </ResponsivePageContainer>
  );
}
