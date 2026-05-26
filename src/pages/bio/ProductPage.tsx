import { useState, type FormEvent } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Factory, Gauge, PaperPlaneTilt } from "@phosphor-icons/react";
import { toast } from "sonner";
import { PageHeader, ResponsivePageContainer, SkeletonCard, StatusBadge } from "@/components/citrus/CitrusUI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function BioProductPage() {
  const { productId } = useParams<{ productId: string }>();
  const { t, i18n } = useTranslation();
  const product = useQuery(
    api.bio.queries.getProductById,
    productId ? { productId: productId as Id<"bioProducts"> } : "skip",
  );
  const createInquiry = useMutation(api.bio.mutations.createInquiry);
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState("");

  if (product === undefined) {
    return (
      <ResponsivePageContainer className="max-w-[1100px]">
        <SkeletonCard className="h-20" />
        <SkeletonCard className="h-96" />
      </ResponsivePageContainer>
    );
  }
  if (!product) {
    return (
      <ResponsivePageContainer>
        <p className="text-sm text-muted-foreground">{t("common.noData")}</p>
      </ResponsivePageContainer>
    );
  }

  const isKk = i18n.language === "kk";

  const handleInquiry = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await createInquiry({
        productId: product._id,
        quantity,
        installAddress: address,
      });
      toast.success(t("bio.product.submitted"));
      setQuantity(1);
      setAddress("");
    } catch {
      toast.error(t("common.actionFailed"));
    }
  };

  return (
    <ResponsivePageContainer className="max-w-[1100px]">
      <PageHeader
        eyebrow={t("bio.product.eyebrow")}
        title={isKk ? product.nameKaz : product.name}
        subtitle={isKk ? product.descriptionKaz : product.description}
      />

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24 }}
        className="grid gap-6 lg:grid-cols-[1fr_0.82fr]"
      >
        <Card className="overflow-hidden rounded-[32px] border bg-card shadow-[var(--shadow-soft)]">
          <div className="bg-citrus-limeSoft p-8">
            <img src="/images/citrus-market/bio-unit.svg" alt="" className="mx-auto h-64 max-w-full object-contain" />
          </div>
          <CardContent className="grid gap-4 p-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="rounded-full bg-citrus-soft text-citrus-forest hover:bg-citrus-soft">{t(`bio.categories.${product.category}`)}</Badge>
              <StatusBadge status={product.inStock ? "live" : "pending"} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-[24px] bg-citrus-soft p-4">
                <Gauge className="mb-2 size-5 text-citrus-teal" weight="fill" />
                <p className="text-xs text-muted-foreground">{t("bio.catalog.capacity")}</p>
                <p className="text-lg font-bold">{product.dailyCapacityKg.min}-{product.dailyCapacityKg.max} {t("units.kg")}</p>
              </div>
              <div className="rounded-[24px] bg-citrus-yellowSoft p-4 text-citrus-forest">
                <Factory className="mb-2 size-5" weight="fill" />
                <p className="text-xs text-citrus-forest/70">{t("bio.catalog.estimate")}</p>
                <p className="text-lg font-bold">{product.priceKzt.toLocaleString()} {t("common.kzt")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[32px] border bg-card shadow-[var(--shadow-soft)]">
          <CardHeader>
            <CardTitle>{t("bio.product.quoteTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleInquiry} className="grid gap-4">
              <label className="grid gap-2 text-sm font-semibold">
                {t("bio.product.quantity")}
                <Input
                  className="h-11 rounded-2xl"
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(event) => setQuantity(Number(event.target.value))}
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                {t("bio.product.address")}
                <Textarea
                  className="min-h-28 rounded-2xl"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  required
                />
              </label>
              <Button type="submit" className="h-11 rounded-full bg-citrus-forest text-primary-foreground">
                <PaperPlaneTilt className="mr-2 size-4" weight="fill" />
                {t("bio.product.submit")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.section>
    </ResponsivePageContainer>
  );
}
