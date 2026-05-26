import { Outlet } from "react-router-dom";
import { AppShell, NavItem } from "./AppShell";
import { BookOpen, Tree } from "@phosphor-icons/react";

const navItems: NavItem[] = [
  { to: "/bio", labelKey: "nav.catalog", exact: true, icon: BookOpen },
  { to: "/bio/my-units", labelKey: "nav.myUnits", icon: Tree },
];

export function BioLayout() {
  return (
    <AppShell navItems={navItems} role="bio_client">
      <Outlet />
    </AppShell>
  );
}
