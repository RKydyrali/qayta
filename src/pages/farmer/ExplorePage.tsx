import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Leaf, MapPin, ShieldCheck, Thermometer, Truck } from "@phosphor-icons/react";
import { toast } from "sonner";
import {
  EmptyStateCard,
  FilterChip,
  PageHeader,
  ResponsivePageContainer,
  SkeletonCard,
} from "@/components/citrus/CitrusUI";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type City = "almaty" | "astana" | "shymkent";
type Filter = "all" | "certified" | "produce" | "bread" | "mixed";

export function FarmerExplorePage() {
  const { t, i18n } = useTranslation();
  const [city, setCity] = useState<City>("almaty");
  const [filter, setFilter] = useState<Filter>("all");
  const listings = useQuery(api.farm.queries.getListingsByCity, { city });
  const subscribe = useMutation(api.farm.mutations.subscribeFarmer);

  const filtered = listings?.filter(({ listing }) => {
    if (filter === "certified") return listing.temperatureTreated;
    if (filter === "all") return true;
    return listing.wasteType.includes(filter);
  });

  return (
    <ResponsivePageContainer>
      <PageHeader
        eyebrow={t("farmer.explore.eyebrow")}
        title={t("farmer.explore.title")}
        subtitle={t("farmer.explore.subtitle")}
        action={
          <Select value={city} onValueChange={(value) => setCity(value as City)}>
            <SelectTrigger className="h-10 w-[148px] rounded-full bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="almaty">{t("common.almaty")}</SelectItem>
              <SelectItem value="astana">{t("common.astana")}</SelectItem>
              <SelectItem value="shymkent">{t("common.shymkent")}</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {(["all", "certified", "produce", "bread", "mixed"] as const).map((item) => (
          <FilterChip key={item} selected={filter === item} Icon={item === "certified" ? ShieldCheck : Leaf} onClick={() => setFilter(item)}>
            {t(`farmer.filters.${item}`)}
          </FilterChip>
        ))}
      </div>

      {filtered === undefined ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => <SkeletonCard key={index} className="h-64" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyStateCard
          icon="/images/citrus-market/farm-truck.svg"
          title={t("farmer.explore.emptyTitle")}
          description={t("farmer.explore.emptyDescription")}
          chips={[t("farmer.filters.produce"), t("farmer.filters.bread"), t("farmer.filters.certified")]}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map(({ listing, partner }, index) => (
            <motion.div
              key={listing._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, duration: 0.22 }}
            >
              <Card className="h-full overflow-hidden rounded-[28px] border bg-card shadow-[var(--shadow-soft)]">
                <div className="h-36 bg-citrus-mintSoft p-5">
                  <img src="/images/citrus-market/farm-truck.svg" alt="" className="ml-auto h-full w-40 object-contain" />
                </div>
                <CardContent className="grid gap-4 p-5">
                  <div>
                    <p className="text-lg font-bold">{partner ? (i18n.language === "kk" ? partner.businessNameKaz : partner.businessName) : t("common.unknownPartner")}</p>
                    <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="size-4" />
                      {listing.pickupAddress}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {listing.wasteType.map((item) => (
                      <Badge key={item} className="rounded-full bg-citrus-soft text-citrus-forest hover:bg-citrus-soft">
                        {t(`farmer.waste.${item}`)}
                      </Badge>
                    ))}
                    {listing.temperatureTreated && (
                      <Badge className="rounded-full bg-citrus-lime text-citrus-forest hover:bg-citrus-lime">
                        <Thermometer className="mr-1 size-3" weight="fill" />
                        {t("farmer.explore.certified")}
                      </Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-2xl bg-citrus-soft p-3">
                      <p className="text-xs text-muted-foreground">{t("farmer.explore.quantity")}</p>
                      <p className="font-bold">{listing.estimatedWeightKg} {t("units.kg")}</p>
                    </div>
                    <div className="rounded-2xl bg-citrus-soft p-3">
                      <p className="text-xs text-muted-foreground">{t("farmer.explore.days")}</p>
                      <p className="font-bold">{listing.availableDays.map((day) => t(`days.${day}`)).join(", ")}</p>
                    </div>
                  </div>
                  <Button
                    className="rounded-full bg-citrus-forest text-primary-foreground"
                    onClick={() =>
                      subscribe({ listingId: listing._id, plan: "monthly" })
                        .then(() => toast.success(t("farmer.explore.subscribed")))
                        .catch(() => toast.error(t("common.actionFailed")))
                    }
                  >
                    <Truck className="mr-2 size-4" weight="fill" />
                    {t("farmer.explore.request")}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </ResponsivePageContainer>
  );
}
