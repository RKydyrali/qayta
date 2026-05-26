import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Factory, Fire, Gauge, Leaf, Recycle, Wrench } from "@phosphor-icons/react";
import {
  EmptyStateCard,
  FilterChip,
  ImpactMetricCard,
  PageHeader,
  ResponsivePageContainer,
  SkeletonCard,
  StatusBadge,
} from "@/components/citrus/CitrusUI";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type Category = "all" | "compact" | "industrial" | "accessory";

export function BioCatalogPage() {
  const { t, i18n } = useTranslation();
  const [category, setCategory] = useState<Category>("all");
  const products = useQuery(api.bio.queries.getProducts, {
    category: category === "all" ? undefined : category,
  });
  const orders = useQuery(api.bio.queries.getMyOrders);

  const activeUnits = orders?.filter(({ order }) => order.status === "installed" || order.status === "serviced").length ?? 0;
  const capacity = products?.reduce((sum, product) => sum + product.dailyCapacityKg.max, 0) ?? 0;

  return (
    <ResponsivePageContainer>
      <PageHeader
        eyebrow={t("bio.catalog.eyebrow")}
        title={t("bio.catalog.title")}
        subtitle={t("bio.catalog.subtitle")}
        action={<Button asChild className="rounded-full bg-citrus-lime text-citrus-forest"><Link to="/bio/my-units">{t("nav.myUnits")}</Link></Button>}
      />

      <section className="relative overflow-hidden rounded-[32px] bg-citrus-forest p-6 text-primary-foreground shadow-[var(--shadow-warm)]">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('/images/citrus-market/pattern.svg')" }} />
        <div className="relative grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-citrus-lime">{t("bio.catalog.heroEyebrow")}</p>
            <h2 className="mt-2 max-w-2xl text-3xl font-bold tracking-tight">{t("bio.catalog.heroTitle")}</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-primary-foreground/72">{t("bio.catalog.heroDescription")}</p>
          </div>
          <img src="/images/citrus-market/bio-unit.svg" alt="" className="hidden h-44 w-44 md:block" />
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <ImpactMetricCard title={t("bio.catalog.metrics.volume")} value={capacity.toLocaleString()} unit={t("units.kg")} Icon={Factory} variant="rescued" />
        <ImpactMetricCard title={t("bio.catalog.metrics.biogas")} value={Math.round(capacity * 0.16)} unit={t("units.m3")} Icon={Fire} variant="urgent" />
        <ImpactMetricCard title={t("bio.catalog.metrics.compost")} value={Math.round(capacity * 0.42)} unit={t("units.kg")} Icon={Leaf} variant="co2" />
        <ImpactMetricCard title={t("bio.catalog.metrics.units")} value={activeUnits} Icon={Gauge} variant="score" />
      </div>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {(["all", "compact", "industrial", "accessory"] as const).map((item) => (
          <FilterChip key={item} selected={category === item} Icon={item === "accessory" ? Wrench : Recycle} onClick={() => setCategory(item)}>
            {t(`bio.categories.${item}`)}
          </FilterChip>
        ))}
      </div>

      {products === undefined ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => <SkeletonCard key={index} className="h-72" />)}
        </div>
      ) : products.length === 0 ? (
        <EmptyStateCard
          icon="/images/citrus-market/bio-unit.svg"
          title={t("bio.catalog.emptyTitle")}
          description={t("bio.catalog.emptyDescription")}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, duration: 0.22 }}
            >
              <Link to={`/bio/${product._id}`}>
                <Card className="h-full overflow-hidden rounded-[28px] border bg-card shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:border-citrus-lime">
                  <div className="h-40 bg-citrus-limeSoft p-5">
                    <img src="/images/citrus-market/bio-unit.svg" alt="" className="ml-auto h-full w-44 object-contain" />
                  </div>
                  <CardContent className="grid gap-4 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Badge className="mb-2 rounded-full bg-citrus-soft text-citrus-forest hover:bg-citrus-soft">{t(`bio.categories.${product.category}`)}</Badge>
                        <h3 className="truncate text-lg font-bold">{i18n.language === "kk" ? product.nameKaz : product.name}</h3>
                      </div>
                      <StatusBadge status={product.inStock ? "live" : "pending"} />
                    </div>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{i18n.language === "kk" ? product.descriptionKaz : product.description}</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-2xl bg-citrus-soft p-3">
                        <p className="text-xs text-muted-foreground">{t("bio.catalog.capacity")}</p>
                        <p className="font-bold">{product.dailyCapacityKg.min}-{product.dailyCapacityKg.max} {t("units.kg")}</p>
                      </div>
                      <div className="rounded-2xl bg-citrus-yellowSoft p-3 text-citrus-forest">
                        <p className="text-xs text-citrus-forest/70">{t("bio.catalog.estimate")}</p>
                        <p className="font-bold">{product.priceKzt.toLocaleString()} {t("common.kzt")}</p>
                      </div>
                    </div>
                    <Button className="rounded-full bg-citrus-forest text-primary-foreground">{t("bio.catalog.consult")}</Button>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </ResponsivePageContainer>
  );
}
