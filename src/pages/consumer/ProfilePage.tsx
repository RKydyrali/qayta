import { SignOutButton } from "@clerk/clerk-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useTranslation } from "react-i18next";
import {
  Bell,
  CreditCard,
  Headset,
  Heart,
  Leaf,
  Medal,
  ShareNetwork,
  SignOut,
  Sparkle,
  Storefront,
  Trophy,
  UserCircle,
} from "@phosphor-icons/react";
import {
  EcoPassportCard,
  EmptyStateCard,
  ImpactMetricCard,
  PageHeader,
  ResponsivePageContainer,
  SkeletonCard,
} from "@/components/citrus/CitrusUI";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const LEVEL_THRESHOLDS = [0, 100, 300, 700, 1500, 3000];

export function ProfilePage() {
  const { t } = useTranslation();
  const profile = useQuery(api.consumers.queries.getProfile);

  if (profile === undefined) {
    return (
      <ResponsivePageContainer>
        <SkeletonCard className="h-20" />
        <SkeletonCard className="h-[270px]" />
        <div className="grid gap-3 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => <SkeletonCard key={index} className="h-44" />)}
        </div>
      </ResponsivePageContainer>
    );
  }

  const nextLevel = LEVEL_THRESHOLDS[profile.eco.level] ?? 3000;
  const previousLevel = LEVEL_THRESHOLDS[Math.max(profile.eco.level - 1, 0)] ?? 0;
  const progress = ((profile.eco.totalPoints - previousLevel) / Math.max(nextLevel - previousLevel, 1)) * 100;
  const badges = [
    { key: "firstRescue", Icon: Sparkle, earned: profile.stats.boxesBought > 0, color: "bg-citrus-yellowSoft" },
    { key: "tenKg", Icon: Leaf, earned: profile.stats.wasteSavedKg >= 10, color: "bg-citrus-mintSoft" },
    { key: "co2Saver", Icon: Medal, earned: profile.stats.co2SavedKg >= 25, color: "bg-citrus-limeSoft" },
    { key: "cityChampion", Icon: Trophy, earned: profile.eco.weeklyPoints >= 100, color: "bg-citrus-orangeSoft" },
  ];

  return (
    <ResponsivePageContainer className="max-w-[1200px]">
      <PageHeader
        eyebrow={t("consumer.profile.eyebrow")}
        title={t("consumer.profile.title")}
        subtitle={t("consumer.profile.subtitle")}
      />

      <section className="grid gap-6 xl:grid-cols-[1fr_0.38fr]">
        <EcoPassportCard
          name={profile.user.displayName ?? profile.user.email.split("@")[0] ?? "QAYTA"}
          level={profile.levelName}
          points={profile.eco.totalPoints}
          rank={t("consumer.home.topRank")}
          city={t("common.almaty")}
          progress={progress}
          nextReward={t("consumer.home.nextReward", { points: Math.max(nextLevel - profile.eco.totalPoints, 0) })}
          progressLabel={t("consumer.home.next")}
          pointsLabel={t("consumer.home.xp")}
        />

        <Card className="rounded-[32px] border bg-card shadow-[var(--shadow-soft)]">
          <CardContent className="flex h-full flex-col justify-between gap-5 p-5">
            <div className="flex items-center gap-3">
              <div className="grid size-14 place-items-center rounded-3xl bg-citrus-forest text-primary-foreground">
                <UserCircle className="size-8" weight="fill" />
              </div>
              <div className="min-w-0">
                <p className="truncate font-bold">{profile.user.displayName ?? t("nav.profile")}</p>
                <p className="truncate text-sm text-muted-foreground">{profile.user.email}</p>
              </div>
            </div>
            <div className="grid gap-2">
              <Button variant="outline" className="justify-start rounded-2xl">
                <ShareNetwork className="mr-2 size-4" weight="fill" />
                {t("consumer.profile.invite")}
              </Button>
              <SignOutButton>
                <Button variant="outline" className="justify-start rounded-2xl border-citrus-coral text-citrus-coral">
                  <SignOut className="mr-2 size-4" weight="bold" />
                  {t("consumer.profile.logout")}
                </Button>
              </SignOutButton>
            </div>
          </CardContent>
        </Card>
      </section>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <ImpactMetricCard title={t("consumer.profile.stats.rescues")} value={profile.stats.boxesBought} Icon={Storefront} variant="orders" />
        <ImpactMetricCard title={t("consumer.profile.stats.food")} value={profile.stats.wasteSavedKg.toFixed(1)} unit={t("units.kg")} Icon={Leaf} variant="rescued" />
        <ImpactMetricCard title={t("consumer.profile.stats.co2")} value={profile.stats.co2SavedKg.toFixed(1)} unit={t("units.kg")} Icon={Leaf} variant="co2" />
        <ImpactMetricCard title={t("consumer.profile.stats.week")} value={profile.eco.weeklyPoints} unit={t("consumer.home.xp")} Icon={Trophy} variant="score" />
      </div>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card className="rounded-[32px] border bg-card shadow-[var(--shadow-soft)]">
          <CardHeader>
            <CardTitle className="text-xl">{t("consumer.profile.badges")}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {badges.map(({ key, Icon, earned, color }) => (
              <div key={key} className={`${color} rounded-[24px] border p-4 text-citrus-forest ${earned ? "" : "opacity-55 grayscale"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="grid size-11 place-items-center rounded-2xl bg-citrus-forest text-primary-foreground">
                    <Icon className="size-5" weight="fill" />
                  </div>
                  <Badge className="rounded-full bg-card text-citrus-forest hover:bg-card">
                    {earned ? t("consumer.profile.earned") : t("consumer.profile.locked")}
                  </Badge>
                </div>
                <h3 className="mt-4 font-bold">{t(`consumer.profile.badge.${key}.title`)}</h3>
                <p className="mt-1 text-sm text-citrus-forest/70">{t(`consumer.profile.badge.${key}.description`)}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <EmptyStateCard
          icon="/images/citrus-market/empty-box.svg"
          title={t("consumer.profile.favoritesTitle")}
          description={t("consumer.profile.favoritesDescription")}
          primaryAction={<Button asChild className="rounded-full bg-citrus-forest text-primary-foreground"><Link to="/rescue"><Heart className="mr-2 size-4" weight="fill" />{t("consumer.profile.findFavorites")}</Link></Button>}
          chips={[t("filters.bakery"), t("filters.cafe"), t("filters.near")]}
        />
      </section>

      <Card className="rounded-[32px] border bg-card shadow-[var(--shadow-soft)]">
        <CardHeader>
          <CardTitle className="text-xl">{t("consumer.profile.settings")}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <SettingTile icon={<Bell className="size-5" weight="fill" />} title={t("consumer.profile.notifications")} description={t("consumer.profile.notificationsHint")} />
          <SettingTile icon={<CreditCard className="size-5" weight="fill" />} title={t("consumer.profile.payment")} description={t("consumer.profile.paymentHint")} />
          <SettingTile icon={<Headset className="size-5" weight="fill" />} title={t("consumer.profile.support")} description={t("consumer.profile.supportHint")} />
          <div className="rounded-[24px] bg-citrus-soft p-4">
            <p className="mb-3 text-sm font-semibold">{t("consumer.profile.appearance")}</p>
            <div className="flex items-center justify-between rounded-full border bg-card p-1.5">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </div>
        </CardContent>
      </Card>
    </ResponsivePageContainer>
  );
}

function SettingTile({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[24px] bg-citrus-soft p-4">
      <div className="mb-4 grid size-10 place-items-center rounded-2xl bg-citrus-forest text-primary-foreground">{icon}</div>
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm leading-5 text-muted-foreground">{description}</p>
    </div>
  );
}
