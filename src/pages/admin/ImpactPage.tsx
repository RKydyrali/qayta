import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useTranslation } from "react-i18next";
import { Buildings, Factory, Leaf, MapPin, ShieldCheck } from "@phosphor-icons/react";
import {
  FlowTimeline,
  ImpactMetricCard,
  PageHeader,
  ResponsivePageContainer,
  SkeletonCard,
} from "@/components/citrus/CitrusUI";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AdminImpactPage() {
  const { t } = useTranslation();
  const cityImpact = useQuery(api.impact.queries.getCityImpact, {
    city: "almaty",
  });
  const globalImpact = useQuery(api.impact.queries.getGlobalImpact);

  if (cityImpact === undefined || globalImpact === undefined) {
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
        eyebrow={t("admin.impact.eyebrow")}
        title={t("admin.impact.title")}
        subtitle={t("admin.impact.subtitle")}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <ImpactMetricCard title={t("admin.impact.totalRescued")} value={Math.round(globalImpact.totalWasteSavedKg)} unit={t("units.kg")} Icon={Leaf} variant="rescued" />
        <ImpactMetricCard title={t("admin.impact.co2")} value={Math.round(globalImpact.totalCo2SavedKg)} unit={t("units.kg")} Icon={ShieldCheck} variant="co2" />
        <ImpactMetricCard title={t("admin.impact.partners")} value={globalImpact.totalPartners} Icon={Buildings} variant="orders" />
        <ImpactMetricCard title={t("admin.impact.farmers")} value={globalImpact.totalFarmers} Icon={Factory} variant="score" />
      </div>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="overflow-hidden rounded-[32px] border bg-card shadow-[var(--shadow-soft)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="size-5 text-citrus-orange" weight="fill" />
              {t("admin.impact.cityMap")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative min-h-[360px] overflow-hidden rounded-[28px] bg-citrus-soft p-6">
              <div className="absolute inset-0 opacity-50" style={{ backgroundImage: "url('/images/citrus-market/pattern.svg')" }} />
              <div className="relative grid h-full min-h-[320px] place-items-center rounded-[24px] border border-citrus-orange/30 bg-card/70">
                <div className="text-center">
                  <div className="mx-auto mb-4 grid size-16 place-items-center rounded-full bg-citrus-orange text-citrus-forest">
                    <MapPin className="size-8" weight="fill" />
                  </div>
                  <p className="text-2xl font-bold">{t("common.almaty")}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t("admin.impact.cityHint")}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[32px] border bg-citrus-soft shadow-[var(--shadow-soft)]">
          <CardHeader>
            <CardTitle className="text-lg">{t("admin.impact.flowTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <FlowTimeline
              labels={{
                rescue: t("flow.rescue"),
                farm: t("flow.farm"),
                bio: t("flow.bio"),
                impact: t("flow.impact"),
              }}
            />
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-[24px] bg-card p-4">
                <p className="text-2xl font-bold text-citrus-forest dark:text-citrus-lime">{Math.round(cityImpact.wasteKg)}</p>
                <p className="text-xs text-muted-foreground">{t("admin.impact.totalRescued")}</p>
              </div>
              <div className="rounded-[24px] bg-card p-4">
                <p className="text-2xl font-bold text-citrus-forest dark:text-citrus-lime">{Math.round(cityImpact.co2Kg)}</p>
                <p className="text-xs text-muted-foreground">{t("admin.impact.co2")}</p>
              </div>
              <div className="rounded-[24px] bg-card p-4">
                <p className="text-2xl font-bold text-citrus-forest dark:text-citrus-lime">{cityImpact.partnerCount}</p>
                <p className="text-xs text-muted-foreground">{t("admin.impact.partners")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </ResponsivePageContainer>
  );
}
