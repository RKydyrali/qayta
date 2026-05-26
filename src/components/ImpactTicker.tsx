import { useEffect, useRef, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

function useCountUp(target: number, duration = 800) {
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setValue(Math.round(target * progress));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);

  return value;
}

function Metric({
  label,
  value,
  unit,
}: {
  label: string;
  value: number;
  unit: string;
}) {
  const animated = useCountUp(value);
  return (
    <Card className="border-qayta-sand bg-qayta-white flex-1 min-w-[140px]">
      <CardContent className="pt-4">
        <motion.div
          className="font-mono text-xl text-qayta-leaf"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {animated.toLocaleString()} {unit}
        </motion.div>
        <div className="text-xs text-qayta-muted">{label}</div>
      </CardContent>
    </Card>
  );
}

export function ImpactTicker() {
  const { t } = useTranslation();
  const impact = useQuery(api.impact.queries.getGlobalImpact);

  if (!impact) return null;

  return (
    <motion.div
      className="flex gap-3 flex-wrap mb-4"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Metric
        label={t("impact.wasteSaved")}
        value={Math.round(impact.totalWasteSavedKg)}
        unit="кг"
      />
      <Metric
        label={t("impact.co2Saved")}
        value={Math.round(impact.totalCo2SavedKg)}
        unit="кг"
      />
      <Metric
        label={t("impact.boxesSold")}
        value={impact.totalBoxesSold}
        unit=""
      />
    </motion.div>
  );
}
