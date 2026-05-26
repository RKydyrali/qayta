import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export function EcoHeroCard({
  levelName,
  totalPoints,
  weeklyPoints,
  nextLevelPoints,
  stats,
}: {
  levelName: string;
  totalPoints: number;
  weeklyPoints: number;
  nextLevelPoints: number;
  stats: { boxesBought: number; wasteSavedKg: number; co2SavedKg: number };
}) {
  const progress = Math.min((totalPoints / nextLevelPoints) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border-qayta-sand bg-qayta-white">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="font-display text-qayta-earth text-xl">
              Eco Hero
            </CardTitle>
            <Badge
              variant="outline"
              className="border-qayta-leaf text-qayta-leaf"
            >
              {levelName}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-end gap-2">
            <span className="font-mono text-3xl text-qayta-leaf">
              {totalPoints}
            </span>
            <span className="text-xs text-qayta-muted mb-1">
              / {nextLevelPoints} pts
            </span>
          </div>
          <div className="progress-bar">
            <motion.div
              className="progress-bar-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <div className="flex gap-6 flex-wrap">
            <div>
              <div className="font-mono text-lg text-qayta-earth">
                {stats.boxesBought}
              </div>
              <div className="text-xs text-qayta-muted">Boxes</div>
            </div>
            <div>
              <div className="font-mono text-lg text-qayta-earth">
                {stats.wasteSavedKg.toFixed(1)} kg
              </div>
              <div className="text-xs text-qayta-muted">Waste saved</div>
            </div>
            <div>
              <div className="font-mono text-lg text-qayta-earth">
                {stats.co2SavedKg.toFixed(1)} kg
              </div>
              <div className="text-xs text-qayta-muted">CO₂ saved</div>
            </div>
            <div>
              <div className="font-mono text-lg text-qayta-clay">
                {weeklyPoints}
              </div>
              <div className="text-xs text-qayta-muted">Weekly pts</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
