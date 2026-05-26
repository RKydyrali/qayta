import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { Icon } from "@phosphor-icons/react";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Confetti,
  Leaf,
  MapPin,
  Package,
  Star,
  TrendUp,
} from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export type MetricVariant =
  | "rescued"
  | "co2"
  | "orders"
  | "score"
  | "revenue"
  | "urgent";

const metricVariantClass: Record<MetricVariant, string> = {
  rescued: "bg-citrus-orangeSoft text-citrus-forest",
  co2: "bg-citrus-mintSoft text-citrus-forest",
  orders: "bg-citrus-yellowSoft text-citrus-forest",
  score: "bg-citrus-limeSoft text-citrus-forest",
  revenue: "bg-citrus-soft text-citrus-forest",
  urgent: "bg-citrus-coralSoft text-citrus-forest",
};

export function ResponsivePageContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 py-4 sm:px-6 lg:px-8 lg:py-7", className)}>
      {children}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
            {eyebrow}
          </p>
        )}
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
          {title}
        </h1>
        {subtitle && <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{subtitle}</p>}
      </div>
      {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
    </div>
  );
}

export function ImpactMetricCard({
  title,
  value,
  unit,
  delta,
  Icon = Leaf,
  variant,
}: {
  title: string;
  value: string | number;
  unit?: string;
  delta?: string;
  Icon?: Icon;
  variant: MetricVariant;
}) {
  return (
    <motion.div whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 360, damping: 28 }}>
      <Card className="overflow-hidden rounded-[24px] border bg-card shadow-[var(--shadow-soft)]">
        <CardContent className="flex min-h-[132px] flex-col justify-between p-4">
          <div className="flex items-start justify-between gap-3">
            <div className={cn("flex size-11 items-center justify-center rounded-2xl", metricVariantClass[variant])}>
              <Icon className="size-5" weight="fill" />
            </div>
            {delta && (
              <Badge className="rounded-full bg-citrus-limeSoft text-citrus-forest hover:bg-citrus-limeSoft">
                <TrendUp className="mr-1 size-3" weight="bold" />
                {delta}
              </Badge>
            )}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">{title}</p>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-3xl font-bold tracking-tight text-foreground">{value}</span>
              {unit && <span className="text-sm font-semibold text-muted-foreground">{unit}</span>}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function CircularImpactProgress({
  value,
  label,
  color = "var(--lime)",
  size = 104,
}: {
  value: number;
  label: string;
  color?: string;
  size?: number;
}) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(value, 100) / 100) * circumference;

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 104 104" className="size-full -rotate-90">
        <circle cx="52" cy="52" r={radius} stroke="color-mix(in srgb, var(--border) 70%, transparent)" strokeWidth="10" fill="none" />
        <motion.circle
          cx="52"
          cy="52"
          r={radius}
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.75, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-xl font-bold">{Math.round(value)}%</div>
        <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

export function EcoPassportCard({
  name,
  level,
  points,
  rank,
  city,
  progress,
  nextReward,
  progressLabel,
  pointsLabel = "XP",
}: {
  name: string;
  level: string;
  points: number;
  rank: string;
  city: string;
  progress: number;
  nextReward: string;
  progressLabel: string;
  pointsLabel?: string;
}) {
  return (
    <Card className="relative overflow-hidden rounded-[32px] border-0 bg-citrus-forest text-primary-foreground shadow-[var(--shadow-warm)]">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('/images/citrus-market/pattern.svg')" }} />
      <CardContent className="relative grid gap-6 p-5 sm:grid-cols-[1fr_auto] sm:p-7">
        <div className="flex flex-col justify-between gap-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-citrus-lime">{level}</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">{name}</h2>
            <p className="mt-2 max-w-lg text-sm text-primary-foreground/72">{nextReward}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Badge className="rounded-full bg-citrus-lemon text-citrus-forest hover:bg-citrus-lemon">
              {points.toLocaleString()} {pointsLabel}
            </Badge>
            <Badge className="rounded-full bg-primary-foreground/12 text-primary-foreground hover:bg-primary-foreground/12">
              {rank}
            </Badge>
            <Badge className="rounded-full bg-primary-foreground/12 text-primary-foreground hover:bg-primary-foreground/12">
              <MapPin className="mr-1 size-3" weight="fill" />
              {city}
            </Badge>
          </div>
        </div>
        <CircularImpactProgress value={progress} label={progressLabel} color="var(--lemon)" size={128} />
      </CardContent>
    </Card>
  );
}

export function FilterChip({
  selected,
  children,
  Icon,
  onClick,
}: {
  selected?: boolean;
  children: ReactNode;
  Icon?: Icon;
  onClick?: () => void;
}) {
  return (
    <motion.button
      type="button"
      layout
      onClick={onClick}
      className={cn(
        "inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition active:scale-[0.98]",
        selected
          ? "border-citrus-forest bg-citrus-forest text-primary-foreground shadow-[var(--shadow-soft)]"
          : "border-border bg-card text-muted-foreground hover:text-foreground",
      )}
    >
      {Icon && <Icon className="size-4" weight={selected ? "fill" : "regular"} />}
      {children}
    </motion.button>
  );
}

export function EmptyStateCard({
  icon = "/images/citrus-market/empty-box.svg",
  title,
  description,
  primaryAction,
  secondaryAction,
  chips,
}: {
  icon?: string;
  title: string;
  description: string;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
  chips?: string[];
}) {
  return (
    <Card className="rounded-[28px] border bg-card shadow-[var(--shadow-soft)]">
      <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
        <img src={icon} alt="" className="size-24" />
        <div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="mt-1 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        {(primaryAction || secondaryAction) && (
          <div className="flex flex-wrap justify-center gap-2">
            {primaryAction}
            {secondaryAction}
          </div>
        )}
        {chips && chips.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2">
            {chips.map((chip) => (
              <Badge key={chip} variant="secondary" className="rounded-full">
                {chip}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function LeaderboardPodium({
  entries,
}: {
  entries: Array<{ name: string; points: number; level: string }>;
}) {
  const podium = [entries[1], entries[0], entries[2]].filter(Boolean);
  const heights = ["min-h-[132px]", "min-h-[168px]", "min-h-[120px]"];
  const colors = ["bg-citrus-mintSoft", "bg-citrus-yellowSoft", "bg-citrus-orangeSoft"];

  return (
    <div className="grid grid-cols-3 items-end gap-3">
      {podium.map((entry, index) => (
        <motion.div
          key={entry!.name}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.07, type: "spring", stiffness: 260, damping: 24 }}
          className={cn("rounded-[24px] border p-4 text-center shadow-[var(--shadow-soft)]", colors[index], heights[index])}
        >
          <div className="mx-auto mb-2 grid size-10 place-items-center rounded-full bg-citrus-forest text-primary-foreground">
            {index === 1 ? "1" : index === 0 ? "2" : "3"}
          </div>
          <div className="truncate text-sm font-bold text-citrus-forest">{entry!.name}</div>
          <div className="text-xs text-citrus-forest/70">{entry!.level}</div>
          <div className="mt-2 text-xl font-bold text-citrus-forest">{entry!.points}</div>
        </motion.div>
      ))}
    </div>
  );
}

export function FlowTimeline({
  compact = false,
  labels,
}: {
  compact?: boolean;
  labels: {
    rescue: string;
    farm: string;
    bio: string;
    impact: string;
  };
}) {
  const steps = [
    { key: "rescue", color: "bg-citrus-orange", Icon: Package },
    { key: "farm", color: "bg-citrus-mint", Icon: Leaf },
    { key: "bio", color: "bg-citrus-lime", Icon: Confetti },
    { key: "impact", color: "bg-citrus-lemon", Icon: CheckCircle },
  ];

  return (
    <div className={cn("grid gap-3", compact ? "grid-cols-4" : "grid-cols-2 sm:grid-cols-4")}>
      {steps.map(({ key, color, Icon }, index) => (
        <div key={key} className="relative">
          {index < steps.length - 1 && <div className="absolute left-1/2 top-6 hidden h-1 w-full bg-border sm:block" />}
          <div className="relative z-10 flex flex-col items-center gap-2 rounded-3xl bg-card p-4 text-center shadow-[var(--shadow-soft)]">
            <div className={cn("grid size-12 place-items-center rounded-2xl text-citrus-forest", color)}>
              <Icon className="size-5" weight="fill" />
            </div>
            <span className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">{labels[key]}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const { t } = useTranslation();
  const normalized = status.replace("-", "_");
  const urgent = ["expired", "urgent", "cancelled"].includes(normalized);
  const success = ["ready", "picked_up", "installed", "serviced", "active", "certified", "live"].includes(normalized);
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em]",
        urgent && "border-citrus-coral bg-citrus-coralSoft text-citrus-forest",
        success && "border-citrus-teal bg-citrus-mintSoft text-citrus-forest",
        !urgent && !success && "border-citrus-orange bg-citrus-orangeSoft text-citrus-forest",
      )}
    >
      {t(`status.${normalized}`, { defaultValue: status })}
    </Badge>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return <Skeleton className={cn("h-40 rounded-[28px] bg-border/60", className)} />;
}

export function PartnerDashboardCard({
  title,
  description,
  to,
  Icon = ArrowRight,
}: {
  title: string;
  description: string;
  to: string;
  Icon?: Icon;
}) {
  return (
    <Link to={to}>
      <Card className="h-full rounded-[28px] border bg-card shadow-[var(--shadow-soft)] transition hover:-translate-y-1">
        <CardContent className="flex h-full flex-col justify-between gap-6 p-5">
          <div className="grid size-12 place-items-center rounded-2xl bg-citrus-orangeSoft text-citrus-forest">
            <Icon className="size-5" weight="fill" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function MarketplaceMeta({
  pickup,
  distance,
  rating,
}: {
  pickup: string;
  distance?: string;
  rating?: string;
}) {
  return (
    <div className="grid gap-2 text-xs font-semibold text-muted-foreground">
      <div className="flex items-center gap-1.5">
        <Clock className="size-4 text-citrus-orange" weight="fill" />
        {pickup}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {distance && (
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-4" />
            {distance}
          </span>
        )}
        {rating && (
          <span className="inline-flex items-center gap-1.5">
            <Star className="size-4 text-citrus-lemon" weight="fill" />
            {rating}
          </span>
        )}
      </div>
    </div>
  );
}

export function ActionLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Button asChild className="h-10 rounded-full bg-citrus-forest text-primary-foreground hover:bg-citrus-forest/90">
      <Link to={to}>
        {children}
        <ArrowRight className="ml-2 size-4" weight="bold" />
      </Link>
    </Button>
  );
}
