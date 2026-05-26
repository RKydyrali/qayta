import { Link } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Copy, PauseCircle, PencilSimple, Plus } from "@phosphor-icons/react";
import { toast } from "sonner";
import {
  EmptyStateCard,
  PageHeader,
  ResponsivePageContainer,
  SkeletonCard,
  StatusBadge,
} from "@/components/citrus/CitrusUI";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function PartnerBoxesPage() {
  const { t, i18n } = useTranslation();
  const profile = useQuery(api.partners.queries.getPartnerProfile);
  const boxes = useQuery(
    api.rescue.queries.getPartnerBoxes,
    profile ? { partnerId: profile._id } : "skip",
  );
  const publishBox = useMutation(api.rescue.mutations.publishBox);
  const closeBox = useMutation(api.rescue.mutations.closeBox);

  if (profile === undefined || boxes === undefined) {
    return (
      <ResponsivePageContainer>
        <SkeletonCard className="h-20" />
        <div className="grid gap-4 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => <SkeletonCard key={index} className="h-56" />)}
        </div>
      </ResponsivePageContainer>
    );
  }

  return (
    <ResponsivePageContainer>
      <PageHeader
        eyebrow={t("partner.boxes.eyebrow")}
        title={t("partner.boxes.title")}
        subtitle={t("partner.boxes.subtitle")}
        action={
          <Button asChild className="rounded-full bg-citrus-orange text-citrus-forest hover:bg-citrus-orange/90">
            <Link to="/partner/boxes/new">
              <Plus className="mr-2 size-4" weight="bold" />
              {t("partner.dashboard.addBox")}
            </Link>
          </Button>
        }
      />

      {boxes.length === 0 ? (
        <EmptyStateCard
          icon="/images/citrus-market/market-box.svg"
          title={t("partner.boxes.emptyTitle")}
          description={t("partner.boxes.emptyDescription")}
          primaryAction={<Button asChild className="rounded-full bg-citrus-forest text-primary-foreground"><Link to="/partner/boxes/new">{t("partner.dashboard.addBox")}</Link></Button>}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {boxes.map((box, index) => (
            <motion.div
              key={box._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, duration: 0.22 }}
            >
              <Card className="h-full overflow-hidden rounded-[28px] border bg-card shadow-[var(--shadow-soft)]">
                <div className="h-36 bg-citrus-orangeSoft p-5">
                  <img src="/images/citrus-market/market-box.svg" alt="" className="ml-auto h-full w-36 object-contain" />
                </div>
                <CardContent className="grid gap-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-lg font-bold">{i18n.language === "kk" ? box.titleKaz : box.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{box.quantity} {t("partner.boxes.quantity")} · {box.discountedPrice.toLocaleString()} {t("common.kzt")}</p>
                    </div>
                    <StatusBadge status={box.status} />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="rounded-2xl bg-citrus-soft p-3">
                      <p className="text-xs text-muted-foreground">{t("partner.boxes.oldPrice")}</p>
                      <p className="font-bold line-through">{box.originalPrice.toLocaleString()} {t("common.kzt")}</p>
                    </div>
                    <div className="rounded-2xl bg-citrus-yellowSoft p-3 text-citrus-forest">
                      <p className="text-xs text-citrus-forest/70">{t("partner.boxes.discount")}</p>
                      <p className="font-bold">{Math.round((1 - box.discountedPrice / box.originalPrice) * 100)}%</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {box.status === "draft" && (
                      <Button
                        size="sm"
                        className="rounded-full bg-citrus-forest text-primary-foreground"
                        onClick={() =>
                          publishBox({ boxId: box._id })
                            .then(() => toast.success(t("partner.boxes.published")))
                            .catch(() => toast.error(t("common.actionFailed")))
                        }
                      >
                        {t("partner.boxes.publish")}
                      </Button>
                    )}
                    {box.status === "active" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full border-citrus-coral text-citrus-coral"
                        onClick={() =>
                          closeBox({ boxId: box._id })
                            .then(() => toast.success(t("partner.boxes.paused")))
                            .catch(() => toast.error(t("common.actionFailed")))
                        }
                      >
                        <PauseCircle className="mr-2 size-4" />
                        {t("partner.boxes.pause")}
                      </Button>
                    )}
                    <Button size="sm" variant="outline" className="rounded-full">
                      <PencilSimple className="mr-2 size-4" />
                      {t("partner.boxes.edit")}
                    </Button>
                    <Button size="sm" variant="outline" className="rounded-full">
                      <Copy className="mr-2 size-4" />
                      {t("partner.boxes.duplicate")}
                    </Button>
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
