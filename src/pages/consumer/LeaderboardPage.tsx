import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ChartBar, Medal, Sparkle, Trophy } from "@phosphor-icons/react";
import {
  EmptyStateCard,
  ImpactMetricCard,
  LeaderboardPodium,
  PageHeader,
  ResponsivePageContainer,
  SkeletonCard,
} from "@/components/citrus/CitrusUI";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Period = "week" | "month" | "all";

export function LeaderboardPage() {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<Period>("week");
  const leaderboard = useQuery(api.consumers.queries.getLeaderboard);
  const profile = useQuery(api.consumers.queries.getProfile);

  if (leaderboard === undefined || profile === undefined) {
    return (
      <ResponsivePageContainer>
        <SkeletonCard className="h-20" />
        <SkeletonCard className="h-60" />
      </ResponsivePageContainer>
    );
  }

  const podiumEntries = leaderboard.slice(0, 3).map((entry) => ({
    name: entry.nickname,
    points: entry.weeklyPoints,
    level: entry.levelName,
  }));
  const totalPoints = leaderboard.reduce((sum, entry) => sum + entry.weeklyPoints, 0);
  const userRank = leaderboard.findIndex((entry) => entry.userId === profile.user._id) + 1;

  return (
    <ResponsivePageContainer>
      <PageHeader
        eyebrow={t("consumer.leaderboard.eyebrow")}
        title={t("consumer.leaderboard.title")}
        subtitle={t("consumer.leaderboard.subtitle")}
      />

      <div className="flex w-fit rounded-full bg-citrus-soft p-1">
        {(["week", "month", "all"] as const).map((item) => (
          <Button
            key={item}
            type="button"
            variant="ghost"
            className={cn("rounded-full px-5", period === item && "bg-citrus-forest text-primary-foreground hover:bg-citrus-forest/90 hover:text-primary-foreground")}
            onClick={() => setPeriod(item)}
          >
            {t(`consumer.leaderboard.tabs.${item}`)}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <ImpactMetricCard title={t("consumer.leaderboard.stats.participants")} value={leaderboard.length} Icon={Trophy} variant="score" />
        <ImpactMetricCard title={t("consumer.leaderboard.stats.average")} value={leaderboard.length ? Math.round(totalPoints / leaderboard.length) : 0} Icon={ChartBar} variant="orders" />
        <ImpactMetricCard title={t("consumer.leaderboard.stats.total")} value={totalPoints} Icon={Sparkle} variant="rescued" />
        <ImpactMetricCard title={t("consumer.leaderboard.stats.rank")} value={userRank > 0 ? `#${userRank}` : t("consumer.leaderboard.unranked")} Icon={Medal} variant="co2" />
      </div>

      {leaderboard.length === 0 ? (
        <EmptyStateCard
          title={t("consumer.leaderboard.emptyTitle")}
          description={t("consumer.leaderboard.emptyDescription")}
          primaryAction={<Button className="rounded-full bg-citrus-forest text-primary-foreground">{t("consumer.leaderboard.start")}</Button>}
        />
      ) : (
        <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <Card className="rounded-[32px] border bg-card p-2 shadow-[var(--shadow-soft)]">
            <CardContent className="space-y-5 p-4">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">{t("consumer.leaderboard.podium")}</h2>
                <p className="text-sm text-muted-foreground">{t("consumer.leaderboard.podiumHint")}</p>
              </div>
              <LeaderboardPodium entries={podiumEntries} />
            </CardContent>
          </Card>

          <Card className="rounded-[32px] border bg-card shadow-[var(--shadow-soft)]">
            <CardContent className="grid gap-3 p-4">
              {leaderboard.slice(0, 12).map((entry, index) => {
                const current = entry.userId === profile.user._id;
                return (
                  <motion.div
                    key={entry.userId}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03, duration: 0.22 }}
                    className={cn(
                      "grid grid-cols-[44px_1fr_auto] items-center gap-3 rounded-2xl border p-3",
                      current ? "border-citrus-lime bg-citrus-limeSoft" : "bg-citrus-soft/60",
                    )}
                  >
                    <div className={cn("grid size-11 place-items-center rounded-2xl font-bold", index < 3 ? "bg-citrus-lemon text-citrus-forest" : "bg-card text-muted-foreground")}>
                      {index + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{entry.nickname}</p>
                      <p className="text-xs text-muted-foreground">{entry.levelName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-citrus-forest dark:text-citrus-lime">{entry.weeklyPoints}</p>
                      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">{t("consumer.home.xp")}</p>
                    </div>
                  </motion.div>
                );
              })}
            </CardContent>
          </Card>
        </section>
      )}

      <Card className="rounded-[28px] border bg-citrus-yellowSoft shadow-[var(--shadow-soft)]">
        <CardContent className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold text-citrus-forest">{t("consumer.leaderboard.explainTitle")}</h3>
            <p className="text-sm text-citrus-forest/72">{t("consumer.leaderboard.explainDescription")}</p>
          </div>
          <Trophy className="size-10 text-citrus-orange" weight="fill" />
        </CardContent>
      </Card>
    </ResponsivePageContainer>
  );
}
