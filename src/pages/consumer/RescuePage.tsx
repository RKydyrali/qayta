import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { SurpriseBoxCard } from "@/components/SurpriseBoxCard";
import { PartnerMap } from "@/components/PartnerMap";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import {
  BowlFood,
  Bread,
  Coffee,
  Faders,
  Leaf,
  List,
  MagnifyingGlass,
  MapTrifold,
  Package,
  Sparkle,
  Storefront,
} from "@phosphor-icons/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  EmptyStateCard,
  FilterChip,
  PageHeader,
  ResponsivePageContainer,
  SkeletonCard,
} from "@/components/citrus/CitrusUI";
import { Card, CardContent } from "@/components/ui/card";

type City = "almaty" | "astana" | "shymkent";
type ViewMode = "list" | "map";
type FilterKey = "all" | "boxes" | "bakery" | "meals" | "cafe" | "veg" | "halal" | "under1500" | "today" | "near";

const filters: Array<{ key: FilterKey; icon: typeof Sparkle }> = [
  { key: "all", icon: Sparkle },
  { key: "boxes", icon: Package },
  { key: "bakery", icon: Bread },
  { key: "meals", icon: BowlFood },
  { key: "cafe", icon: Coffee },
  { key: "veg", icon: Leaf },
  { key: "halal", icon: Storefront },
  { key: "under1500", icon: Sparkle },
  { key: "today", icon: MapTrifold },
  { key: "near", icon: Faders },
];

export function RescuePage() {
  const { t } = useTranslation();
  const [city, setCity] = useState<City>("almaty");
  const [radiusKm, setRadiusKm] = useState<number | undefined>();
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedFilter, setSelectedFilter] = useState<FilterKey>("all");

  const boxes = useQuery(api.rescue.queries.getBoxesByCity, {
    city,
    radiusKm,
  });

  const markers =
    boxes?.map(({ box, partner }) => ({
      id: partner?._id ?? box._id,
      lat: partner?.coords.lat ?? 43.24,
      lng: partner?.coords.lng ?? 76.89,
      label: partner?.businessName ?? t("common.unknownPartner"),
      boxCount: 1,
    })) ?? [];

  const filteredBoxes = useMemo(() => {
    return boxes?.filter(({ box, partner }) => {
      const term = search.trim().toLowerCase();
      if (term) {
        const matchesTitle = box.title.toLowerCase().includes(term) || box.titleKaz.toLowerCase().includes(term);
        const matchesPartner = partner?.businessName.toLowerCase().includes(term) || partner?.businessNameKaz.toLowerCase().includes(term);
        if (!matchesTitle && !matchesPartner) return false;
      }

      if (selectedFilter === "veg" && !box.isDietaryVeg) return false;
      if (selectedFilter === "halal" && !box.isDietaryHalal) return false;
      if (selectedFilter === "under1500" && box.discountedPrice > 1500) return false;
      if (selectedFilter === "today") {
        const sameDay = new Date(box.availableUntil).toDateString() === new Date().toDateString();
        if (!sameDay) return false;
      }
      if (selectedFilter === "near" && radiusKm === undefined) return false;
      if (["bakery", "meals", "cafe"].includes(selectedFilter)) {
        const cuisine = partner?.cuisine.join(" ").toLowerCase() ?? "";
        const text = `${box.title} ${box.titleKaz} ${cuisine}`.toLowerCase();
        if (!text.includes(selectedFilter)) return false;
      }
      return true;
    });
  }, [boxes, search, selectedFilter, radiusKm]);

  return (
    <ResponsivePageContainer>
      <PageHeader
        eyebrow={t("consumer.rescue.eyebrow")}
        title={t("consumer.rescue.title")}
        subtitle={t("consumer.rescue.subtitle")}
      />

      <Card className="sticky top-[72px] z-10 rounded-[28px] border bg-card/92 shadow-[var(--shadow-soft)] backdrop-blur-xl md:top-[88px]">
        <CardContent className="space-y-4 p-4">
          <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">
            <div className="relative">
              <MagnifyingGlass className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("consumer.rescue.searchPlaceholder")}
                className="h-12 rounded-full border-border bg-background pl-12 text-base"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-2 sm:flex">
              <Select value={city} onValueChange={(value) => setCity(value as City)}>
                <SelectTrigger className="h-12 rounded-full bg-background sm:w-[148px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="almaty">{t("common.almaty")}</SelectItem>
                  <SelectItem value="astana">{t("common.astana")}</SelectItem>
                  <SelectItem value="shymkent">{t("common.shymkent")}</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={radiusKm?.toString() ?? "all"}
                onValueChange={(value) => setRadiusKm(value === "all" ? undefined : Number(value))}
              >
                <SelectTrigger className="h-12 rounded-full bg-background sm:w-[148px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("filters.allDistances")}</SelectItem>
                  <SelectItem value="3">{t("filters.withinKm", { count: 3 })}</SelectItem>
                  <SelectItem value="5">{t("filters.withinKm", { count: 5 })}</SelectItem>
                  <SelectItem value="10">{t("filters.withinKm", { count: 10 })}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2 rounded-full bg-citrus-soft p-1">
              <Button
                type="button"
                variant="ghost"
                className={viewMode === "list" ? "rounded-full bg-citrus-forest text-primary-foreground" : "rounded-full"}
                onClick={() => setViewMode("list")}
              >
                <List className="mr-2 size-4" weight="bold" />
                {t("consumer.rescue.list")}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className={viewMode === "map" ? "rounded-full bg-citrus-forest text-primary-foreground" : "rounded-full"}
                onClick={() => setViewMode("map")}
              >
                <MapTrifold className="mr-2 size-4" weight="fill" />
                {t("consumer.rescue.map")}
              </Button>
            </div>
          </div>

          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {filters.map(({ key, icon }) => (
              <FilterChip
                key={key}
                selected={selectedFilter === key}
                Icon={icon}
                onClick={() => setSelectedFilter(key)}
              >
                {t(`filters.${key}`)}
              </FilterChip>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.82fr)]">
        <AnimatePresence mode="wait">
          <motion.section
            key={viewMode}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className={viewMode === "map" ? "hidden lg:block" : "block"}
          >
            {filteredBoxes === undefined ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }, (_, index) => <SkeletonCard key={index} className="h-[360px]" />)}
              </div>
            ) : filteredBoxes.length === 0 ? (
              <EmptyStateCard
                title={t("consumer.rescue.emptyTitle")}
                description={t("consumer.rescue.emptyDescription")}
                primaryAction={<Button className="rounded-full bg-citrus-forest text-primary-foreground">{t("consumer.rescue.notify")}</Button>}
                secondaryAction={
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => {
                      setSearch("");
                      setSelectedFilter("all");
                      setRadiusKm(undefined);
                    }}
                  >
                    {t("consumer.rescue.reset")}
                  </Button>
                }
                chips={[t("consumer.rescue.tryEvening"), t("filters.bakery"), t("filters.under1500"), t("filters.near")]}
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredBoxes.map(({ box, partner, distanceKm }) => (
                  <SurpriseBoxCard key={box._id} box={box} partner={partner} distanceKm={distanceKm} />
                ))}
              </div>
            )}
          </motion.section>
        </AnimatePresence>

        <section className={viewMode === "map" ? "block" : "hidden lg:block"}>
          <div className="sticky top-[188px] h-[calc(100dvh-220px)] min-h-[520px] overflow-hidden rounded-[32px] border bg-citrus-soft shadow-[var(--shadow-soft)]">
            <PartnerMap markers={markers} />
          </div>
        </section>
      </div>

      <Button asChild className="fixed bottom-28 right-4 z-20 rounded-full bg-citrus-lemon text-citrus-forest shadow-[var(--shadow-warm)] md:hidden">
        <Link to="/orders">
          <ShoppingBagIcon />
          {t("consumer.rescue.orders")}
        </Link>
      </Button>
    </ResponsivePageContainer>
  );
}

function ShoppingBagIcon() {
  return <Package className="mr-2 size-4" weight="fill" />;
}
