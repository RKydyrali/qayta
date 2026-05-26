import { Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthAmbientBackground } from "@/components/auth/AuthAmbientBackground";
import { AuthCardShell } from "@/components/auth/AuthCardShell";
import { AuthEcoFeatures } from "@/components/auth/AuthEcoFeatures";
import { AuthLanguageToggle } from "@/components/auth/AuthLanguageToggle";
import { AuthOnboardingShell } from "@/components/auth/AuthOnboardingShell";
import { AuthThemeToggle } from "@/components/auth/AuthThemeToggle";

export function AuthLayout() {
  const location = useLocation();
  const isOnboarding = location.pathname.startsWith("/auth/onboarding");

  return (
    <div className="auth-page relative min-h-[100dvh] overflow-x-hidden bg-auth-base text-auth-mist">
      <AuthAmbientBackground isOnboarding={isOnboarding} />

      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45 }}
        className="relative z-20 flex items-center justify-between px-4 py-4 sm:px-8 lg:px-14"
      >
        <p className="font-auth-display text-[13px] font-semibold tracking-[0.22em] text-auth-wash">
          QAYTA
        </p>
        <div className="flex items-center gap-2">
          <AuthLanguageToggle />
          <AuthThemeToggle />
        </div>
      </motion.header>

      <main className="relative z-10 mx-auto min-h-[calc(100dvh-4.75rem)] max-w-[1560px] px-4 pb-10 pt-4 sm:px-8 lg:px-14">
        {isOnboarding ? (
          <div className="flex min-h-[calc(100dvh-7.5rem)] w-full items-center justify-center pb-8 pt-2 sm:pb-10 sm:pt-4">
            <AuthOnboardingShell>
              <Outlet />
            </AuthOnboardingShell>
          </div>
        ) : (
          <div className="grid min-h-[calc(100dvh-7.5rem)] items-start gap-10 pt-16 sm:pt-20 lg:grid-cols-[minmax(0,1fr)_minmax(390px,416px)] lg:items-center lg:gap-16 lg:pt-0 xl:gap-24">
            <AuthEcoFeatures />
            <div className="flex w-full justify-center lg:justify-end">
              <AuthCardShell>
                <Outlet />
              </AuthCardShell>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
