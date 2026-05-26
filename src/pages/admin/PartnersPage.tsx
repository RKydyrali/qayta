import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { CheckCircle, City, ShieldCheck, Storefront, XCircle } from "@phosphor-icons/react";
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
import { useState } from "react";

type Filter = "all" | "verified" | "pending" | "active" | "paused";

export function AdminPartnersPage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<Filter>("all");
  const partners = useQuery(api.admin.queries.getAllPartners);
  const verifyPartner = useMutation(api.admin.mutations.verifyPartner);
  const suspendPartner = useMutation(api.admin.mutations.suspendPartner);

  if (partners === undefined) {
    return (
      <ResponsivePageContainer>
        <SkeletonCard className="h-20" />
        <div className="grid gap-4 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => <SkeletonCard key={index} className="h-52" />)}
        </div>
      </ResponsivePageContainer>
    );
  }

  const filtered = partners.filter(({ partner }) => {
    if (filter === "verified") return partner.isVerified;
    if (filter === "pending") return !partner.isVerified;
    if (filter === "active") return partner.isActive;
    if (filter === "paused") return !partner.isActive;
    return true;
  });

  return (
    <ResponsivePageContainer>
      <PageHeader
        eyebrow={t("admin.partners.eyebrow")}
        title={t("admin.partners.title")}
        subtitle={t("admin.partners.subtitle")}
      />

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {(["all", "verified", "pending", "active", "paused"] as const).map((item) => (
          <FilterChip key={item} selected={filter === item} Icon={item === "verified" ? ShieldCheck : Storefront} onClick={() => setFilter(item)}>
            {t(`admin.partners.filters.${item}`)}
          </FilterChip>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyStateCard
          icon="/images/citrus-market/market-box.svg"
          title={t("admin.partners.emptyTitle")}
          description={t("admin.partners.emptyDescription")}
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {filtered.map(({ partner, user }, index) => (
            <motion.div key={partner._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.035, duration: 0.22 }}>
              <Card className="h-full rounded-[28px] border bg-card shadow-[var(--shadow-soft)]">
                <CardContent className="grid gap-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-lg font-bold">{partner.businessName}</p>
                      <p className="mt-1 truncate text-sm text-muted-foreground">{user?.email ?? t("common.noData")}</p>
                    </div>
                    <div className="grid size-12 place-items-center rounded-2xl bg-citrus-orangeSoft text-citrus-forest">
                      <Storefront className="size-5" weight="fill" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-2xl bg-citrus-soft p-3">
                      <City className="mb-2 size-4 text-citrus-orange" weight="fill" />
                      <p className="text-xs text-muted-foreground">{t("common.city")}</p>
                      <p className="font-bold">{t(`common.${partner.city}`)}</p>
                    </div>
                    <div className="rounded-2xl bg-citrus-soft p-3">
                      <p className="text-xs text-muted-foreground">{t("admin.partners.rating")}</p>
                      <p className="font-bold">{partner.rating.toFixed(1)} · {partner.reviewCount}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge className={`rounded-full ${partner.isVerified ? "bg-citrus-lime text-citrus-forest" : "bg-citrus-yellowSoft text-citrus-forest"}`}>
                      {partner.isVerified ? t("admin.partners.verified") : t("admin.partners.pending")}
                    </Badge>
                    <Badge className={`rounded-full ${partner.isActive ? "bg-citrus-mintSoft text-citrus-forest" : "bg-citrus-coralSoft text-citrus-forest"}`}>
                      {partner.isActive ? t("admin.partners.active") : t("admin.partners.paused")}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {!partner.isVerified && (
                      <Button
                        size="sm"
                        className="rounded-full bg-citrus-forest text-primary-foreground"
                        onClick={() =>
                          verifyPartner({ partnerId: partner._id })
                            .then(() => toast.success(t("admin.partners.verifiedToast")))
                            .catch(() => toast.error(t("common.actionFailed")))
                        }
                      >
                        <CheckCircle className="mr-2 size-4" weight="fill" />
                        {t("admin.partners.verify")}
                      </Button>
                    )}
                    {partner.isActive && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full border-citrus-coral text-citrus-coral"
                        onClick={() =>
                          suspendPartner({ partnerId: partner._id })
                            .then(() => toast.success(t("admin.partners.suspendedToast")))
                            .catch(() => toast.error(t("common.actionFailed")))
                        }
                      >
                        <XCircle className="mr-2 size-4" weight="fill" />
                        {t("admin.partners.suspend")}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </ResponsivePageContainer>
  );
}
