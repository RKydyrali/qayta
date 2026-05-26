import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

type Step = {
  id: number;
  num: string;
  labelKey: string;
};

const STEPS: Step[] = [
  { id: 1, num: "01", labelKey: "onboarding.stepRole" },
  { id: 2, num: "02", labelKey: "onboarding.stepInfo" },
  { id: 3, num: "03", labelKey: "onboarding.stepConfirm" },
  { id: 4, num: "04", labelKey: "onboarding.stepReady" },
];

type OnboardingStepIndicatorProps = {
  currentStep: number;
};

export function OnboardingStepIndicator({
  currentStep,
}: OnboardingStepIndicatorProps) {
  const { t } = useTranslation();

  return (
    <nav
      aria-label={t("onboarding.progressLabel")}
      className="onboarding-steps"
    >
      {STEPS.map((step, index) => {
        const isActive = currentStep === step.id;
        const isComplete = currentStep > step.id;
        const connectorFill =
          index === 0
            ? 0
            : currentStep >= step.id
              ? 1
              : currentStep === STEPS[index - 1].id
                ? 0.45
                : 0;

        return (
          <div key={step.id} className="onboarding-steps__item">
            {index > 0 ? (
              <div className="onboarding-steps__sep" aria-hidden>
                <motion.div
                  className="onboarding-steps__sep-fill"
                  initial={false}
                  animate={{ scaleX: connectorFill }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            ) : null}
            <div
              className={`onboarding-steps__step ${
                isActive ? "onboarding-steps__step--active" : ""
              } ${isComplete ? "onboarding-steps__step--complete" : ""}`}
            >
              <span className="onboarding-steps__num">{step.num}</span>
              <span className="onboarding-steps__label">{t(step.labelKey)}</span>
            </div>
          </div>
        );
      })}
    </nav>
  );
}
