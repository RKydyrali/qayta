import { Outlet } from "react-router-dom";
import { AppShell, NavItem } from "./AppShell";
import { Layout, MapTrifold, CalendarCheck, Truck } from "@phosphor-icons/react";

const navItems: NavItem[] = [
  { to: "/farmer/dashboard", labelKey: "nav.dashboard", icon: Layout },
  { to: "/farmer/explore", labelKey: "nav.explore", icon: MapTrifold },
  { to: "/farmer/subscriptions", labelKey: "nav.subscriptions", icon: CalendarCheck },
  { to: "/farmer/deliveries", labelKey: "nav.deliveries", icon: Truck },
];

export function FarmerLayout() {
  return (
    <AppShell navItems={navItems} role="farmer">
      <Outlet />
    </AppShell>
  );
}
