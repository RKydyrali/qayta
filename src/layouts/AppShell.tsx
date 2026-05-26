import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { UserButton } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { LanguageToggle } from "@/components/LanguageToggle";
import { NotificationBell } from "@/components/NotificationBell";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import type { Icon } from "@phosphor-icons/react";
import { BellRinging, Buildings, City, Leaf, MapPin, Scan, Sparkle } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/convex";

export type NavItem = {
  to: string;
  labelKey: string;
  exact?: boolean;
  icon: Icon;
  primary?: boolean;
};

const roleAccent: Record<UserRole, string> = {
  consumer: "bg-citrus-lemon",
  partner: "bg-citrus-orange",
  farmer: "bg-citrus-mint",
  bio_client: "bg-citrus-lime",
  admin: "bg-citrus-coral",
};

export function AppShell({
  navItems,
  role = "consumer",
  children,
}: {
  navItems: NavItem[];
  role?: UserRole;
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const user = useQuery(api.users.getMe);
  const impact = useQuery(api.impact.queries.getGlobalImpact);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const activeItem =
    navItems.find((item) => (item.exact ? pathname === item.to : pathname.startsWith(item.to))) ??
    navItems[0];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-40" style={{ backgroundImage: "url('/images/citrus-market/pattern.svg')" }} />

      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/88 px-4 py-3 backdrop-blur-xl md:hidden">
        <div className="flex items-center justify-between gap-3">
          <Link to="/" className="qayta-wordmark text-xl font-semibold tracking-wide text-citrus-forest dark:text-citrus-lime">
            QAYTA
          </Link>
          <div className="flex items-center gap-2">
            <NotificationBell />
            <UserButton afterSignOutUrl="/auth/sign-in" appearance={{ elements: { avatarBox: "size-8" } }} />
          </div>
        </div>
      </header>

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[292px] flex-col border-r border-border/70 bg-card/88 backdrop-blur-xl md:flex">
        <div className="p-6">
          <Link to="/" className="qayta-wordmark text-3xl font-semibold tracking-wide text-citrus-forest dark:text-citrus-lime">
            QAYTA
          </Link>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-border bg-citrus-soft px-3 py-1 text-xs font-bold text-citrus-forest">
            <span className={cn("size-2 rounded-full", roleAccent[role])} />
            {t(`roles.${role}`)}
          </div>
        </div>

        <div className="mx-4 mb-4 rounded-[28px] bg-citrus-forest p-4 text-primary-foreground shadow-[var(--shadow-soft)]">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-2xl bg-citrus-lime text-citrus-forest">
              <Leaf weight="fill" className="size-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-foreground/60">
                {t("shell.circularScore")}
              </p>
              <p className="text-lg font-bold">
                {impact ? `${Math.round(impact.totalWasteSavedKg).toLocaleString()} ${t("units.kg")}` : t("common.loading")}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-2">
          <div className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const isActive = item.exact ? pathname === item.to : pathname.startsWith(item.to);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "group relative flex min-h-12 items-center gap-3 overflow-hidden rounded-2xl px-3.5 text-sm font-semibold transition",
                    isActive
                      ? "bg-citrus-forest text-primary-foreground shadow-[var(--shadow-soft)]"
                      : "text-muted-foreground hover:bg-citrus-soft hover:text-foreground",
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId={`sidebar-active-${role}`}
                      className="absolute inset-y-2 left-2 w-1 rounded-full bg-citrus-lime"
                    />
                  )}
                  <Icon weight={isActive ? "fill" : "regular"} className="relative z-10 size-5" />
                  <span className="relative z-10">{t(item.labelKey)}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-border/70 p-4">
          <div className="mb-3 rounded-[24px] bg-citrus-soft p-4">
            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
              <Buildings className="size-4" weight="fill" />
              {t("shell.context")}
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <MapPin className="size-4 text-citrus-orange" weight="fill" />
              {t("common.almaty")}
            </div>
          </div>
          <div className="mb-3 flex items-center justify-between rounded-full border border-border bg-card p-1.5">
            <LanguageToggle />
            <ThemeToggle />
          </div>
          <div className="flex items-center gap-3 rounded-2xl p-2 hover:bg-muted/60">
            <UserButton afterSignOutUrl="/auth/sign-in" />
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-foreground">{user?.displayName ?? t("nav.profile")}</div>
              <div className="truncate text-xs text-muted-foreground">{user?.email}</div>
            </div>
          </div>
        </div>
      </aside>

      <div className="relative z-10 md:ml-[292px]">
        <header className="sticky top-0 z-20 hidden border-b border-border/70 bg-background/72 px-8 py-4 backdrop-blur-xl md:block">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className={cn("grid size-11 place-items-center rounded-2xl text-citrus-forest", roleAccent[role])}>
                {role === "consumer" ? <Scan weight="bold" className="size-5" /> : <Sparkle weight="fill" className="size-5" />}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">{t(`roles.${role}`)}</p>
                <h2 className="truncate text-lg font-semibold tracking-tight">{activeItem ? t(activeItem.labelKey) : "QAYTA"}</h2>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm font-semibold text-muted-foreground lg:flex">
                <City className="size-4 text-citrus-orange" weight="fill" />
                {t("common.almaty")}
              </div>
              <NotificationBell />
              <div className="grid size-10 place-items-center rounded-full border border-border bg-card text-muted-foreground">
                <BellRinging className="size-4" weight="fill" />
              </div>
              <UserButton afterSignOutUrl="/auth/sign-in" appearance={{ elements: { avatarBox: "size-9" } }} />
            </div>
          </div>
        </header>

        <main className="relative pb-28 md:pb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="min-h-[calc(100dvh-4rem)]"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-50 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:hidden">
        <ul className="mx-auto flex max-w-[430px] items-center justify-around gap-1 rounded-[28px] border border-border/80 bg-citrus-forest/96 p-2 shadow-[0_18px_42px_-20px_rgb(5_61_46_/_0.8)] backdrop-blur-xl">
          {navItems.map((item) => {
            const isActive = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            const Icon = item.icon;
            const isPrimary = item.primary || item.to.includes("rescue") || item.to.includes("boxes/new");
            return (
              <li key={item.to} className="relative flex-1">
                <Link
                  to={item.to}
                  className={cn(
                    "relative flex min-h-[54px] flex-col items-center justify-center gap-1 rounded-2xl text-[10px] font-bold transition",
                    isActive ? "text-citrus-forest" : "text-primary-foreground/62",
                    isPrimary && "scale-[1.04]",
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId={`mobile-active-${role}`}
                      className={cn("absolute inset-0 rounded-2xl", isPrimary ? "bg-citrus-lemon" : "bg-primary-foreground")}
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className={cn("relative z-10 grid place-items-center", isPrimary && !isActive && "rounded-2xl bg-citrus-lime p-2 text-citrus-forest")}>
                    <Icon weight={isActive || isPrimary ? "fill" : "regular"} className="size-5" />
                  </span>
                  <span className="relative z-10 max-w-[64px] truncate">{t(item.labelKey)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
