import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useQuery } from "convex/react";
import { useAuth } from "@clerk/clerk-react";
import { api } from "@convex/_generated/api";
import { roleDashboard, roleFromPath, type UserRole } from "./convex";
import i18n from "@/i18n";

interface RoleGuardProps {
  allowedRoles: UserRole[];
}

function LoadingState() {
  return <div className="page-loading">{i18n.t("common.loading")}</div>;
}

export function RoleGuard({ allowedRoles }: RoleGuardProps) {
  const { isSignedIn, isLoaded } = useAuth();
  const location = useLocation();
  const user = useQuery(api.users.getMe);

  if (!isLoaded) {
    return <LoadingState />;
  }

  if (!isSignedIn) {
    return <Navigate to="/auth/sign-in" state={{ from: location }} replace />;
  }

  if (user === undefined) {
    return <LoadingState />;
  }

  if (user === null) {
    return <Navigate to="/auth/onboarding" replace />;
  }

  const pathRole = roleFromPath(location.pathname);
  if (pathRole && !allowedRoles.includes(pathRole)) {
    return <Navigate to={roleDashboard(user.role as UserRole)} replace />;
  }

  if (pathRole && user.role !== pathRole && user.role !== "admin") {
    return <Navigate to={roleDashboard(user.role as UserRole)} replace />;
  }

  return <Outlet />;
}

export function SignedInGuard() {
  const { isSignedIn, isLoaded } = useAuth();
  const location = useLocation();

  if (!isLoaded) return <LoadingState />;
  if (!isSignedIn) {
    return <Navigate to="/auth/sign-in" state={{ from: location }} replace />;
  }
  return <Outlet />;
}

export function PublicOnly({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();
  const user = useQuery(api.users.getMe);

  if (!isLoaded) return <LoadingState />;
  if (isSignedIn && user) {
    return <Navigate to={roleDashboard(user.role as UserRole)} replace />;
  }
  return <>{children}</>;
}
