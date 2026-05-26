import { useState, type FormEvent, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useTranslation } from "react-i18next";
import { Package, PaperPlaneTilt, Percent } from "@phosphor-icons/react";
import { toast } from "sonner";
import { PageHeader, ResponsivePageContainer, SkeletonCard, StatusBadge } from "@/components/citrus/CitrusUI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function NewBoxPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const profile = useQuery(api.partners.queries.getPartnerProfile);
  const createBox = useMutation(api.rescue.mutations.createBox);
  const publishBox = useMutation(api.rescue.mutations.publishBox);

  const [title, setTitle] = useState("");
  const [titleKaz, setTitleKaz] = useState("");
  const [description, setDescription] = useState("");
  const [originalPrice, setOriginalPrice] = useState(5000);
  const [discountedPrice, setDiscountedPrice] = useState(2000);
  const [quantity, setQuantity] = useState(3);
  const [pickupInstructions, setPickupInstructions] = useState("");

  const discountPct = originalPrice > 0 ? Math.round((1 - discountedPrice / originalPrice) * 100) : 0;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!profile) return;
    try {
      const now = Date.now();
      const boxId = await createBox({
        partnerId: profile._id,
        title,
        titleKaz: titleKaz || title,
        description,
        originalPrice,
        discountedPrice,
        quantity,
        estimatedWeightKg: 1.5,
        availableFrom: now,
        availableUntil: now + 4 * 3600000,
        allergens: [],
        isDietaryVeg: false,
        isDietaryHalal: true,
        imageIds: [],
        pickupInstructions,
      });
      await publishBox({ boxId });
      toast.success(t("partner.newBox.published"));
      navigate("/partner/boxes");
    } catch {
      toast.error(t("common.actionFailed"));
    }
  };

  if (profile === undefined || !profile) {
    return (
      <ResponsivePageContainer>
        <SkeletonCard className="h-96" />
      </ResponsivePageContainer>
    );
  }

  return (
    <ResponsivePageContainer className="max-w-[1180px]">
      <PageHeader
        eyebrow={t("partner.newBox.eyebrow")}
        title={t("partner.newBox.title")}
        subtitle={t("partner.newBox.subtitle")}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_0.72fr]">
        <Card className="rounded-[32px] border bg-card shadow-[var(--shadow-soft)]">
          <CardContent className="p-5">
            <form onSubmit={handleSubmit} className="grid gap-4">
              <Field label={t("partner.newBox.titleRu")}>
                <Input className="h-11 rounded-2xl" value={title} onChange={(event) => setTitle(event.target.value)} required />
              </Field>
              <Field label={t("partner.newBox.titleKk")}>
                <Input className="h-11 rounded-2xl" value={titleKaz} onChange={(event) => setTitleKaz(event.target.value)} />
              </Field>
              <Field label={t("partner.newBox.description")}>
                <Textarea className="min-h-24 rounded-2xl" value={description} onChange={(event) => setDescription(event.target.value)} />
              </Field>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label={t("partner.newBox.originalPrice")}>
                  <Input className="h-11 rounded-2xl" type="number" min={1} value={originalPrice} onChange={(event) => setOriginalPrice(Number(event.target.value))} />
                </Field>
                <Field label={t("partner.newBox.discountPrice")}>
                  <Input className="h-11 rounded-2xl" type="number" min={1} value={discountedPrice} onChange={(event) => setDiscountedPrice(Number(event.target.value))} />
                </Field>
                <Field label={t("partner.newBox.quantity")}>
                  <Input className="h-11 rounded-2xl" type="number" min={1} value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} />
                </Field>
              </div>
              <Field label={t("partner.newBox.pickup")}>
                <Textarea className="min-h-24 rounded-2xl" value={pickupInstructions} onChange={(event) => setPickupInstructions(event.target.value)} />
              </Field>
              <Button type="submit" className="h-11 w-fit rounded-full bg-citrus-orange text-citrus-forest hover:bg-citrus-orange/90">
                <PaperPlaneTilt className="mr-2 size-4" weight="fill" />
                {t("partner.newBox.publish")}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="h-fit overflow-hidden rounded-[32px] border bg-card shadow-[var(--shadow-soft)]">
          <div className="h-44 bg-citrus-orangeSoft p-6">
            <img src="/images/citrus-market/market-box.svg" alt="" className="ml-auto h-full w-48 object-contain" />
          </div>
          <CardHeader>
            <CardTitle>{t("partner.newBox.preview")}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div>
              <p className="text-lg font-bold">{title || t("partner.newBox.previewTitle")}</p>
              <p className="mt-1 text-sm text-muted-foreground">{description || t("partner.newBox.previewDescription")}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge className="rounded-full bg-citrus-lemon text-citrus-forest hover:bg-citrus-lemon">
                <Percent className="mr-1 size-3" weight="bold" />
                {discountPct}%
              </Badge>
              <Badge className="rounded-full bg-citrus-soft text-citrus-forest hover:bg-citrus-soft">
                <Package className="mr-1 size-3" weight="fill" />
                {quantity} {t("partner.boxes.quantity")}
              </Badge>
              <StatusBadge status="draft" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground line-through">{originalPrice.toLocaleString()} {t("common.kzt")}</p>
              <p className="text-3xl font-bold text-citrus-forest dark:text-citrus-lime">{discountedPrice.toLocaleString()} {t("common.kzt")}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </ResponsivePageContainer>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-semibold">
      {label}
      {children}
    </label>
  );
}
