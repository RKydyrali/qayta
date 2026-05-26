import { Outlet } from "react-router-dom";
import { AppShell, NavItem } from "./AppShell";
import { Layout, Package, ListChecks, Plant, ChartLineUp } from "@phosphor-icons/react";

const navItems: NavItem[] = [
  { to: "/partner/dashboard", labelKey: "nav.dashboard", icon: Layout },
  { to: "/partner/boxes", labelKey: "nav.boxes", icon: Package, primary: true },
  { to: "/partner/orders", labelKey: "nav.orders", icon: ListChecks },
  { to: "/partner/farm", labelKey: "nav.farm", icon: Plant },
  { to: "/partner/analytics", labelKey: "nav.analytics", icon: ChartLineUp },
];

export function PartnerLayout() {
  return (
    <AppShell navItems={navItems} role="partner">
      <Outlet />
    </AppShell>
  );
}
