import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { useTranslation } from "react-i18next";
import { roleDashboard, type UserRole } from "@/lib/convex";
import { motion, AnimatePresence, type Transition } from "framer-motion";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Factory,
  ForkKnife,
  Plant,
  ShoppingBagOpen,
  type Icon,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { OnboardingStepIndicator } from "@/components/auth/onboarding/OnboardingStepIndicator";
import { OnboardingRoleCard } from "@/components/auth/onboarding/OnboardingRoleCard";
import { OnboardingContinueButton } from "@/components/auth/onboarding/OnboardingContinueButton";

type OnboardingRole = "consumer" | "partner" | "farmer" | "bio_client";

type RoleConfig = {
  id: OnboardingRole;
  Icon: Icon;
  labelKey: string;
  descKey: string;
  gridClass: string;
};

const stepTransition: Transition = { duration: 0.32, ease: [0.22, 1, 0.36, 1] };

const stepMotion = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: stepTransition,
};

export function OnboardingPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const complete = useMutation(api.users.completeOnboarding);
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<OnboardingRole>("consumer");
  const [language, setLanguage] = useState<"ru" | "kk">(
    i18n.language === "kk" ? "kk" : "ru"
  );
  const [displayName, setDisplayName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [farmName, setFarmName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState<"almaty" | "astana" | "shymkent" | "other">(
    "almaty"
  );

  const roles: RoleConfig[] = [
    {
      id: "consumer",
      Icon: ShoppingBagOpen,
      labelKey: "onboarding.consumer",
      descKey: "onboarding.consumerDesc",
      gridClass: "onboarding-role-grid__consumer",
    },
    {
      id: "partner",
      Icon: ForkKnife,
      labelKey: "onboarding.partner",
      descKey: "onboarding.partnerDesc",
      gridClass: "onboarding-role-grid__partner",
    },
    {
      id: "farmer",
      Icon: Plant,
      labelKey: "onboarding.farmer",
      descKey: "onboarding.farmerDesc",
      gridClass: "onboarding-role-grid__farmer",
    },
    {
      id: "bio_client",
      Icon: Factory,
      labelKey: "onboarding.bio",
      descKey: "onboarding.bioDesc",
      gridClass: "onboarding-role-grid__bio",
    },
  ];

  const updateLanguage = async (nextLanguage: "ru" | "kk") => {
    setLanguage(nextLanguage);
    localStorage.setItem("qayta-lang", nextLanguage);
    await i18n.changeLanguage(nextLanguage);
  };

  const finish = async () => {
    try {
      await complete({
        role,
        language,
        displayName: displayName || undefined,
        businessName: role === "partner" ? businessName : undefined,
        businessNameKaz: role === "partner" ? businessName : undefined,
        farmName: role === "farmer" ? farmName : undefined,
        farmNameKaz: role === "farmer" ? farmName : undefined,
        address: address || undefined,
        city: role === "partner" || role === "farmer" ? city : undefined,
      });
      navigate(roleDashboard(role as UserRole));
    } catch {
      toast.error(t("onboarding.completeError"));
    }
  };

  const step2Valid =
    role === "partner"
      ? Boolean(businessName.trim())
      : role === "farmer"
        ? Boolean(farmName.trim())
        : true;

  return (
    <div>
      <header className="onboarding-header">
        <h1 className="onboarding-title">{t("onboarding.title")}</h1>
        <p className="onboarding-subtitle">{t("onboarding.subtitle")}</p>
      </header>

      <OnboardingStepIndicator currentStep={step} />

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" {...stepMotion}>
            <h2 className="onboarding-step-heading">{t("onboarding.step1")}</h2>
            <p className="onboarding-step-sub">{t("onboarding.step1Hint")}</p>

            <div className="onboarding-role-grid">
              {roles.map((r) => (
                <div key={r.id} className={r.gridClass}>
                  <OnboardingRoleCard
                    Icon={r.Icon}
                    label={t(r.labelKey)}
                    description={t(r.descKey)}
                    isActive={role === r.id}
                    onClick={() => setRole(r.id)}
                  />
                </div>
              ))}
            </div>

            <OnboardingContinueButton onClick={() => setStep(2)}>
              {t("onboarding.continue")}
            </OnboardingContinueButton>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            {...stepMotion}
            className="flex flex-col gap-4"
          >
            <h2 className="onboarding-step-heading">{t("onboarding.step2")}</h2>
            <p className="onboarding-step-sub">{t("onboarding.step2Hint")}</p>

            <div className="onboarding-field">
              <label className="onboarding-field__label">
                {t("onboarding.language")}
              </label>
              <Select
                value={language}
                onValueChange={(v) => updateLanguage(v as "ru" | "kk")}
              >
                <SelectTrigger className="onboarding-field__input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ru">{t("onboarding.russian")}</SelectItem>
                  <SelectItem value="kk">{t("onboarding.kazakh")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="onboarding-field">
              <label className="onboarding-field__label">
                {t("onboarding.displayName")}
              </label>
              <Input
                className="onboarding-field__input"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={t("onboarding.displayNamePlaceholder")}
              />
            </div>

            {role === "partner" && (
              <>
                <div className="onboarding-field">
                  <label className="onboarding-field__label">
                    {t("onboarding.businessName")}
                  </label>
                  <Input
                    className="onboarding-field__input"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    required
                  />
                </div>
                <div className="onboarding-field">
                  <label className="onboarding-field__label">
                    {t("onboarding.address")}
                  </label>
                  <Input
                    className="onboarding-field__input"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </>
            )}

            {role === "farmer" && (
              <>
                <div className="onboarding-field">
                  <label className="onboarding-field__label">
                    {t("onboarding.farmName")}
                  </label>
                  <Input
                    className="onboarding-field__input"
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                    required
                  />
                </div>
                <div className="onboarding-field">
                  <label className="onboarding-field__label">
                    {t("onboarding.address")}
                  </label>
                  <Input
                    className="onboarding-field__input"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </>
            )}

            {(role === "partner" || role === "farmer") && (
              <div className="onboarding-field">
                <label className="onboarding-field__label">
                  {t("onboarding.city")}
                </label>
                <Select
                  value={city}
                  onValueChange={(v) =>
                    setCity(v as "almaty" | "astana" | "shymkent" | "other")
                  }
                >
                  <SelectTrigger className="onboarding-field__input h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="almaty">{t("common.almaty")}</SelectItem>
                    <SelectItem value="astana">{t("common.astana")}</SelectItem>
                    <SelectItem value="shymkent">
                      {t("common.shymkent")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <OnboardingContinueButton
              onClick={() => setStep(3)}
              disabled={!step2Valid}
            >
              {t("onboarding.continue")}
            </OnboardingContinueButton>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" {...stepMotion}>
            <h2 className="onboarding-step-heading">{t("onboarding.step3")}</h2>
            <p className="onboarding-step-sub">{t("onboarding.documentNotice")}</p>
            <OnboardingContinueButton onClick={() => setStep(4)}>
              {t("onboarding.continue")}
            </OnboardingContinueButton>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="step4" {...stepMotion}>
            <h2 className="onboarding-step-heading">{t("onboarding.step4")}</h2>
            <p className="onboarding-step-sub">{t("onboarding.readyNotice")}</p>
            <OnboardingContinueButton onClick={finish}>
              {t("onboarding.finish")}
            </OnboardingContinueButton>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
