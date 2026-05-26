import { Outlet } from "react-router-dom";
import { AppShell, NavItem } from "./AppShell";
import { House, MapTrifold, ListChecks, User, Trophy } from "@phosphor-icons/react";

const navItems: NavItem[] = [
  { to: "/", labelKey: "nav.home", exact: true, icon: House },
  { to: "/rescue", labelKey: "nav.rescue", icon: MapTrifold, primary: true },
  { to: "/orders", labelKey: "nav.orders", icon: ListChecks },
  { to: "/leaderboard", labelKey: "nav.leaderboard", icon: Trophy },
  { to: "/profile", labelKey: "nav.profile", icon: User },
];

export function ConsumerLayout() {
  return (
    <AppShell navItems={navItems} role="consumer">
      <Outlet />
    </AppShell>
  );
}
