import { Badge } from "@/components/ui/badge";

export function ImpactBadge({ co2Kg }: { co2Kg: number }) {
  return (
    <Badge className="bg-qayta-leaf/10 text-qayta-leaf border-qayta-leaf/20 hover:bg-qayta-leaf/20">
      CO₂ −{co2Kg.toFixed(1)} кг
    </Badge>
  );
}
