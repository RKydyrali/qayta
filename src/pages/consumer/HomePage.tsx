import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  ChartLineUp,
  HandHeart,
  Leaf,
  Package,
  Scan,
  Trophy,
} from "@phosphor-icons/react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  EcoPassportCard,
  EmptyStateCard,
  FlowTimeline,
  ImpactMetricCard,
  PageHeader,
  ResponsivePageContainer,
  SkeletonCard,
} from "@/components/citrus/CitrusUI";
import { SurpriseBoxCard } from "@/components/SurpriseBoxCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type City = "almaty" | "astana" | "shymkent";

const LEVEL_THRESHOLDS = [0, 100, 300, 700, 1500, 3000];

function getWeekData(
  orders: Array<{ order: { paidAt?: number; pickedUpAt?: number; quantity: number }; box: { estimatedWeightKg?: number } | null }> | undefined,
  language: string,
) {
  const now = new Date();
  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(now);
    day.setDate(now.getDate() - (6 - index));
    day.setHours(0, 0, 0, 0);
    const end = day.getTime() + 86400000;
    const kg =
      orders
        ?.filter(({ order }) => {
          const timestamp = order.pickedUpAt ?? order.paidAt ?? 0;
          return timestamp >= day.getTime() && timestamp < end;
        })
        .reduce((sum, { order, box }) => sum + (box?.estimatedWeightKg ?? 1.5) * order.quantity, 0) ?? 0;
    return {
      day: new Intl.DateTimeFormat(language, { weekday: "short" }).format(day),
      kg: Number(kg.toFixed(1)),
    };
  });
}

export function HomePage() {
  const { t, i18n } = useTranslation();
  const [city, setCity] = useState<City>("almaty");
  const profile = useQuery(api.consumers.queries.getProfile);
  const orders = useQuery(api.rescue.orders.queries.getMyOrders);
  const boxes = useQuery(api.rescue.queries.getBoxesByCity, { city });
  const cityImpact = useQuery(api.impact.queries.getCityImpact, { city });

  const chartData = useMemo(() => getWeekData(orders, i18n.language), [orders, i18n.language]);
  const activeOrders = orders?.filter(({ order }) => order.status === "paid" || order.status === "pending").length ?? 0;
  const nextLevel = profile ? LEVEL_THRESHOLDS[profile.eco.level] ?? 3000 : 3000;
  const previousLevel = profile ? LEVEL_THRESHOLDS[Math.max(profile.eco.level - 1, 0)] ?? 0 : 0;
  const progress = profile
    ? ((profile.eco.totalPoints - previousLevel) / Math.max(nextLevel - previousLevel, 1)) * 100
    : 0;
  const nearby = boxes?.slice(0, 4) ?? [];

  return (
    <ResponsivePageContainer>
      <PageHeader
        eyebrow={t("consumer.home.eyebrow")}
        title={t("consumer.home.title")}
        subtitle={t("consumer.home.subtitle")}
        action={
          <div className="flex items-center gap-2">
            <Select value={city} onValueChange={(value) => setCity(value as City)}>
              <SelectTrigger className="h-10 w-[148px] rounded-full border-border bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="almaty">{t("common.almaty")}</SelectItem>
                <SelectItem value="astana">{t("common.astana")}</SelectItem>
                <SelectItem value="shymkent">{t("common.shymkent")}</SelectItem>
              </SelectContent>
            </Select>
            <Button asChild className="h-10 rounded-full bg-citrus-forest text-primary-foreground hover:bg-citrus-forest/90">
              <Link to="/rescue">
                <Scan className="mr-2 size-4" weight="bold" />
                {t("consumer.home.scan")}
              </Link>
            </Button>
          </div>
        }
      />

      {profile === undefined ? (
        <SkeletonCard className="h-[270px]" />
      ) : (
        <EcoPassportCard
          name={profile.user.displayName ?? profile.user.email.split("@")[0] ?? "QAYTA"}
          level={profile.levelName}
          points={profile.eco.totalPoints}
          rank={t("consumer.home.topRank")}
          city={t(`common.${city}`)}
          progress={progress}
          nextReward={t("consumer.home.nextReward", { points: Math.max(nextLevel - profile.eco.totalPoints, 0) })}
          progressLabel={t("consumer.home.next")}
          pointsLabel={t("consumer.home.xp")}
        />
      )}

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
        className="grid grid-cols-2 gap-3 lg:grid-cols-4"
      >
        {profile === undefined || orders === undefined || cityImpact === undefined ? (
          Array.from({ length: 4 }, (_, index) => <SkeletonCard key={index} className="h-[132px]" />)
        ) : (
          <>
            <ImpactMetricCard
              title={t("consumer.home.metrics.rescued")}
              value={profile.stats.wasteSavedKg.toFixed(1)}
              unit={t("units.kg")}
              delta={t("consumer.home.thisWeek")}
              Icon={HandHeart}
              variant="rescued"
            />
            <ImpactMetricCard
              title={t("consumer.home.metrics.co2")}
              value={profile.stats.co2SavedKg.toFixed(1)}
              unit={t("units.kg")}
              Icon={Leaf}
              variant="co2"
            />
            <ImpactMetricCard
              title={t("consumer.home.metrics.orders")}
              value={activeOrders}
              unit={t("units.items")}
              Icon={Package}
              variant="orders"
            />
            <ImpactMetricCard
              title={t("consumer.home.metrics.score")}
              value={Math.round(cityImpact.wasteKg)}
              unit={t("units.kg")}
              Icon={Trophy}
              variant="score"
            />
          </>
        )}
      </motion.div>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="rounded-[28px] border bg-card shadow-[var(--shadow-soft)]">
          <CardHeader className="flex flex-row items-center justify-between gap-3 pb-3">
            <div>
              <CardTitle className="text-lg font-semibold">{t("consumer.home.weeklyImpact")}</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">{t("consumer.home.weeklyImpactHint")}</p>
            </div>
            <ChartLineUp className="size-6 text-citrus-teal" weight="fill" />
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 12, right: 10, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="homeImpactFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--teal)" stopOpacity={0.32} />
                    <stop offset="95%" stopColor="var(--teal)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, color: "var(--foreground)" }}
                  formatter={(value) => [`${value} ${t("units.kg")}`, t("consumer.home.metrics.rescued")]}
                />
                <Area type="monotone" dataKey="kg" stroke="var(--teal)" strokeWidth={3} fill="url(#homeImpactFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="overflow-hidden rounded-[28px] border bg-citrus-soft shadow-[var(--shadow-soft)]">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">{t("consumer.home.journey")}</CardTitle>
            <p className="text-sm text-muted-foreground">{t("consumer.home.journeyHint")}</p>
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

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">{t("consumer.home.nearby")}</h2>
            <p className="text-sm text-muted-foreground">{t("consumer.home.nearbyHint")}</p>
          </div>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/rescue">{t("common.viewAll")}</Link>
          </Button>
        </div>
        {boxes === undefined ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => <SkeletonCard key={index} className="h-[340px]" />)}
          </div>
        ) : nearby.length === 0 ? (
          <EmptyStateCard
            title={t("consumer.rescue.emptyTitle")}
            description={t("consumer.rescue.emptyDescription")}
            primaryAction={<Button className="rounded-full bg-citrus-forest text-primary-foreground">{t("consumer.rescue.notify")}</Button>}
            secondaryAction={<Button asChild variant="outline" className="rounded-full"><Link to="/rescue">{t("consumer.rescue.reset")}</Link></Button>}
            chips={[t("consumer.rescue.tryEvening"), t("filters.bakery"), t("filters.under1500")]}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {nearby.map(({ box, partner, distanceKm }) => (
              <SurpriseBoxCard key={box._id} box={box} partner={partner} distanceKm={distanceKm} />
            ))}
          </div>
        )}
      </section>
    </ResponsivePageContainer>
  );
}
