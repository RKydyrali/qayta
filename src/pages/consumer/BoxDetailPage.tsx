import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Clock, Leaf, MapPin, ShoppingBagOpen } from "@phosphor-icons/react";
import { toast } from "sonner";
import { PageHeader, ResponsivePageContainer, SkeletonCard, StatusBadge } from "@/components/citrus/CitrusUI";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function BoxDetailPage() {
  const { boxId } = useParams<{ boxId: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const data = useQuery(
    api.rescue.queries.getBoxById,
    boxId ? { boxId: boxId as Id<"surpriseBoxes"> } : "skip",
  );
  const createOrder = useMutation(api.rescue.orders.mutations.createOrder);
  const confirmPayment = useMutation(api.rescue.orders.mutations.confirmPayment);

  if (!boxId) return null;
  if (data === undefined) {
    return (
      <ResponsivePageContainer className="max-w-[1100px]">
        <SkeletonCard className="h-20" />
        <SkeletonCard className="h-96" />
      </ResponsivePageContainer>
    );
  }
  if (!data) {
    return (
      <ResponsivePageContainer>
        <p className="text-sm text-muted-foreground">{t("common.noData")}</p>
      </ResponsivePageContainer>
    );
  }

  const { box, partner } = data;
  const isKk = i18n.language === "kk";
  const co2 = (box.estimatedWeightKg ?? 1.5) * 1.5;
  const discount = Math.round((1 - box.discountedPrice / box.originalPrice) * 100);

  const handleBuy = async () => {
    try {
      const orderId = await createOrder({ boxId: box._id, quantity: 1 });
      await confirmPayment({ orderId });
      toast.success(t("consumer.boxDetail.ordered"));
      navigate("/orders");
    } catch {
      toast.error(t("common.actionFailed"));
    }
  };

  return (
    <ResponsivePageContainer className="max-w-[1100px]">
      <PageHeader
        eyebrow={t("consumer.boxDetail.eyebrow")}
        title={isKk ? box.titleKaz : box.title}
        subtitle={partner ? `${isKk ? partner.businessNameKaz : partner.businessName} · ${partner.address}` : t("common.unknownPartner")}
      />

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24 }}
        className="grid gap-6 lg:grid-cols-[1fr_0.72fr]"
      >
        <Card className="overflow-hidden rounded-[32px] border bg-card shadow-[var(--shadow-soft)]">
          <div className="relative min-h-[340px] bg-citrus-orangeSoft p-8">
            <img src="/images/citrus-market/market-box.svg" alt="" className="mx-auto h-72 max-w-full object-contain" />
            <div className="absolute left-5 top-5 flex flex-wrap gap-2">
              <Badge className="rounded-full bg-citrus-lemon text-citrus-forest hover:bg-citrus-lemon">{t("box.discount", { discount })}</Badge>
              <StatusBadge status={box.status} />
            </div>
          </div>
          <CardContent className="grid gap-4 p-6">
            <p className="text-sm leading-6 text-muted-foreground">{box.description}</p>
            <div className="flex flex-wrap gap-2">
              <Badge className="rounded-full bg-citrus-mintSoft text-citrus-forest hover:bg-citrus-mintSoft">
                <Leaf className="mr-1 size-3" weight="fill" />
                {t("box.co2", { value: co2.toFixed(1) })}
              </Badge>
              <Badge className="rounded-full bg-citrus-soft text-citrus-forest hover:bg-citrus-soft">
                <Clock className="mr-1 size-3" weight="fill" />
                {new Intl.DateTimeFormat(i18n.language, { hour: "2-digit", minute: "2-digit" }).format(new Date(box.availableUntil))}
              </Badge>
              {box.isDietaryVeg && <Badge variant="outline" className="rounded-full">{t("box.veg")}</Badge>}
              {box.isDietaryHalal && <Badge variant="outline" className="rounded-full">{t("box.halal")}</Badge>}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[32px] border bg-card shadow-[var(--shadow-soft)]">
          <CardContent className="grid gap-5 p-6">
            <div>
              <p className="text-sm text-muted-foreground line-through">{box.originalPrice.toLocaleString()} {t("common.kzt")}</p>
              <p className="text-4xl font-bold tracking-tight text-citrus-forest dark:text-citrus-lime">{box.discountedPrice.toLocaleString()} {t("common.kzt")}</p>
            </div>
            <div className="grid gap-3">
              <div className="rounded-[24px] bg-citrus-soft p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">{t("consumer.boxDetail.left")}</p>
                <p className="mt-1 text-2xl font-bold">{box.quantity}</p>
              </div>
              <div className="rounded-[24px] bg-citrus-soft p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">{t("consumer.boxDetail.pickup")}</p>
                <p className="mt-1 flex items-center gap-2 text-sm font-semibold"><MapPin className="size-4" />{box.pickupInstructions}</p>
              </div>
            </div>
            <Button
              onClick={handleBuy}
              disabled={box.status !== "active" || box.quantity < 1}
              className="h-12 rounded-full bg-citrus-forest text-primary-foreground"
            >
              <ShoppingBagOpen className="mr-2 size-5" weight="fill" />
              {t("common.buy", { price: box.discountedPrice.toLocaleString() })}
            </Button>
          </CardContent>
        </Card>
      </motion.section>
    </ResponsivePageContainer>
  );
}
