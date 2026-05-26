import { Outlet } from "react-router-dom";
import { AppShell } from "./AppShell";
import { ChartPieSlice, Factory, ShieldCheck, Storefront } from "@phosphor-icons/react";

const navItems = [
  { to: "/admin", labelKey: "nav.dashboard", exact: true, icon: ChartPieSlice },
  { to: "/admin/partners", labelKey: "nav.partners", icon: Storefront },
  { to: "/admin/bio-orders", labelKey: "nav.bioOrders", icon: Factory },
  { to: "/admin/impact", labelKey: "nav.impact", icon: ShieldCheck },
];

export function AdminLayout() {
  return (
    <AppShell navItems={navItems} role="admin">
      <Outlet />
    </AppShell>
  );
}
