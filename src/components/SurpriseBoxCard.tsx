import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { Doc } from "@convex/_generated/dataModel";
import { motion } from "framer-motion";
import {
  Heart,
  Leaf,
  ShoppingBagOpen,
  WarningCircle,
} from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MarketplaceMeta } from "@/components/citrus/CitrusUI";
import { cn } from "@/lib/utils";

const categoryImages = [
  "/images/citrus-market/bakery-box.svg",
  "/images/citrus-market/market-box.svg",
];

function formatTime(timestamp: number, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

export function SurpriseBoxCard({
  box,
  partner,
  distanceKm,
  viewMode = "grid",
}: {
  box: Doc<"surpriseBoxes">;
  partner: Doc<"partnerProfiles"> | null;
  distanceKm?: number;
  viewMode?: "grid" | "list";
}) {
  const { t, i18n } = useTranslation();
  const isKk = i18n.language === "kk";
  const title = isKk ? box.titleKaz : box.title;
  const partnerName = partner
    ? isKk
      ? partner.businessNameKaz
      : partner.businessName
    : t("common.unknownPartner");

  const diff = box.availableUntil - Date.now();
  const isExpiringSoon = diff > 0 && diff < 2 * 60 * 60 * 1000;
  const isExpired = diff <= 0;
  const hours = Math.max(0, Math.floor(diff / 3600000));
  const minutes = Math.max(0, Math.floor((diff % 3600000) / 60000));
  const pickup = isExpired
    ? t("box.expired")
    : isExpiringSoon
      ? t("box.hoursLeft", { hours, minutes })
      : t("box.todayAt", { time: formatTime(box.availableUntil, i18n.language) });
  const co2Saved = (box.estimatedWeightKg ?? 1.5) * 1.5;
  const discount = Math.round((1 - box.discountedPrice / box.originalPrice) * 100);
  const isList = viewMode === "list";
  const image = categoryImages[partner?.cuisine.length ? 0 : 1];
  const distance = distanceKm === undefined ? undefined : t("box.distanceKm", { distance: distanceKm.toFixed(1) });

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 360, damping: 28 }}
      className="h-full"
    >
      <Card
        className={cn(
          "group h-full overflow-hidden rounded-[28px] border bg-card shadow-[var(--shadow-soft)] transition hover:border-citrus-orange/70",
          isList ? "grid grid-cols-[132px_1fr] sm:grid-cols-[188px_1fr]" : "flex flex-col",
        )}
      >
        <Link
          to={`/rescue/${box._id}`}
          className={cn(
            "relative flex min-h-[168px] overflow-hidden bg-citrus-orangeSoft",
            isList ? "min-h-full" : "h-[178px]",
          )}
        >
          <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-citrus-forest/36 to-transparent" />
          <div className="absolute left-3 top-3 flex flex-col items-start gap-2">
            <Badge className="rounded-full bg-citrus-lemon text-citrus-forest hover:bg-citrus-lemon">
              {t("box.discount", { discount })}
            </Badge>
            {box.quantity <= 2 && (
              <Badge className="rounded-full bg-citrus-coral text-white hover:bg-citrus-coral">
                <WarningCircle className="mr-1 size-3" weight="fill" />
                {t("box.left", { count: box.quantity })}
              </Badge>
            )}
          </div>
          <div className="absolute bottom-3 right-3">
            <Badge className="rounded-full bg-citrus-forest/92 text-primary-foreground backdrop-blur hover:bg-citrus-forest/92">
              <Leaf weight="fill" className="mr-1 size-3 text-citrus-lime" />
              {t("box.co2", { value: co2Saved.toFixed(1) })}
            </Badge>
          </div>
        </Link>

        <CardContent className="flex min-w-0 flex-1 flex-col gap-4 p-4">
          <div className="flex items-start justify-between gap-3">
            <Link to={`/rescue/${box._id}`} className="min-w-0">
              <p className="truncate text-base font-bold tracking-tight text-foreground">{partnerName}</p>
              <p className="mt-1 line-clamp-2 text-sm leading-5 text-muted-foreground">{title}</p>
            </Link>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-10 shrink-0 rounded-full bg-citrus-soft text-citrus-forest hover:bg-citrus-yellowSoft"
              aria-label={t("box.favorite")}
            >
              <Heart className="size-5" />
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {partner?.cuisine.slice(0, 2).map((item) => (
              <Badge key={item} variant="secondary" className="rounded-full bg-citrus-soft text-citrus-forest">
                {item}
              </Badge>
            ))}
            {box.isDietaryVeg && (
              <Badge variant="outline" className="rounded-full border-citrus-teal text-citrus-teal">
                {t("box.veg")}
              </Badge>
            )}
            {box.isDietaryHalal && (
              <Badge variant="outline" className="rounded-full border-citrus-forest text-citrus-forest dark:text-citrus-lime">
                {t("box.halal")}
              </Badge>
            )}
          </div>

          <MarketplaceMeta
            pickup={pickup}
            distance={distance}
            rating={partner ? `${partner.rating.toFixed(1)} (${partner.reviewCount})` : undefined}
          />

          <div className="mt-auto flex items-end justify-between gap-3 border-t pt-3">
            <div>
              <div className="text-xs text-muted-foreground line-through">{box.originalPrice.toLocaleString()} {t("common.kzt")}</div>
              <div className="text-2xl font-bold tracking-tight text-citrus-forest dark:text-citrus-lime">
                {box.discountedPrice.toLocaleString()} {t("common.kzt")}
              </div>
            </div>
            {isExpired || box.quantity < 1 ? (
              <Button disabled className="h-10 rounded-full px-4">
                <ShoppingBagOpen className="mr-2 size-4" weight="fill" />
                {t("box.reserve")}
              </Button>
            ) : (
              <Button asChild className="h-10 rounded-full bg-citrus-forest px-4 text-primary-foreground hover:bg-citrus-forest/90">
                <Link to={`/rescue/${box._id}`}>
                  <ShoppingBagOpen className="mr-2 size-4" weight="fill" />
                  {t("box.reserve")}
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.article>
  );
}
