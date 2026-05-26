import { motion } from "framer-motion";

type AuthOnboardingShellProps = {
  children: React.ReactNode;
};

export function AuthOnboardingShell({ children }: AuthOnboardingShellProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="onboarding-shell relative w-full max-w-[540px]"
    >
      <div className="onboarding-glass-panel">
        <div className="onboarding-glass-panel__highlight" aria-hidden />
        <div className="onboarding-glass-panel__noise auth-grain" aria-hidden />
        <div className="onboarding-glass-panel__content">{children}</div>
      </div>
    </motion.section>
  );
}
