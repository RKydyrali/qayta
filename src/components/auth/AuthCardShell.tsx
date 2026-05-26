import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

type AuthCardShellProps = {
  children: React.ReactNode;
};

export function AuthCardShell({ children }: AuthCardShellProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const isSignUp = location.pathname.startsWith("/auth/sign-up");

  const tabs = [
    { to: "/auth/sign-in", label: t("nav.signIn"), active: !isSignUp },
    { to: "/auth/sign-up", label: t("nav.signUp"), active: isSignUp },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full max-w-[416px]"
    >
      <div className="rounded-[18px] border border-auth-line/16 bg-auth-surface/76 p-5 shadow-[0_28px_72px_rgb(38_31_21_/_0.15)] backdrop-blur-lg sm:px-9 sm:py-10">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="font-auth-display text-[15px] font-semibold tracking-[0.24em] text-auth-wash">
              QAYTA
            </p>
          </div>
        </div>

        <div className="mb-7">
          <h1 className="font-auth-display text-[1.65rem] font-semibold leading-tight text-auth-wash sm:text-[1.8rem]">
            {isSignUp ? t("auth.welcomeSignUp") : t("auth.welcomeSignIn")}
          </h1>
        </div>

        <div className="mb-8 flex gap-7 border-b border-auth-line/12">
          {tabs.map((tab) => (
            <Link
              key={tab.to}
              to={tab.to}
              className={`relative pb-3 text-sm font-medium transition-colors ${
                tab.active
                  ? "text-auth-wash"
                  : "text-auth-stone hover:text-auth-mist"
              }`}
            >
              {tab.label}
              {tab.active ? (
                <motion.span
                  layoutId="auth-tab-underline"
                  className="absolute inset-x-0 bottom-0 h-px bg-auth-greenMid"
                  transition={{ type: "spring", stiffness: 380, damping: 34 }}
                />
              ) : null}
            </Link>
          ))}
        </div>

        <div className="auth-clerk-root">{children}</div>
      </div>
    </motion.section>
  );
}
