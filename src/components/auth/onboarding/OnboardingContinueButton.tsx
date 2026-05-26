import { motion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react";

type OnboardingContinueButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
};

export function OnboardingContinueButton({
  children,
  onClick,
  disabled,
}: OnboardingContinueButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { y: -0.5 }}
      whileTap={disabled ? undefined : { scale: 0.994 }}
      transition={{ type: "spring", stiffness: 480, damping: 30 }}
      className="onboarding-cta group"
    >
      <span className="onboarding-cta__label">{children}</span>
      <ArrowRight
        size={16}
        weight="regular"
        className="onboarding-cta__icon transition-transform duration-300 ease-out group-hover:translate-x-0.5"
      />
    </motion.button>
  );
}
