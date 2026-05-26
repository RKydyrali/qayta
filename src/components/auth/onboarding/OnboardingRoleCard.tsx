import { motion } from "framer-motion";
import type { Icon } from "@phosphor-icons/react";

type OnboardingRoleCardProps = {
  Icon: Icon;
  label: string;
  description: string;
  isActive: boolean;
  onClick: () => void;
};

export function OnboardingRoleCard({
  Icon,
  label,
  description,
  isActive,
  onClick,
}: OnboardingRoleCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -1.5 }}
      whileTap={{ scale: 0.992 }}
      transition={{ type: "spring", stiffness: 460, damping: 32 }}
      className={`onboarding-role-card ${
        isActive ? "onboarding-role-card--active" : ""
      }`}
      aria-pressed={isActive}
    >
      <span className="onboarding-role-card__icon-wrap" aria-hidden>
        <Icon
          size={30}
          weight={isActive ? "fill" : "regular"}
          className="onboarding-role-card__icon"
        />
      </span>
      <span className="onboarding-role-card__copy">
        <span className="onboarding-role-card__title">{label}</span>
        <span className="onboarding-role-card__desc">{description}</span>
      </span>
      {isActive ? (
        <motion.span
          layoutId="onboarding-role-ring"
          className="onboarding-role-card__ring"
          transition={{ type: "spring", stiffness: 400, damping: 34 }}
        />
      ) : null}
    </motion.button>
  );
}
