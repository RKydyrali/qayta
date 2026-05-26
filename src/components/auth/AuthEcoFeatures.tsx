import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export function AuthEcoFeatures() {
  const { t } = useTranslation();

  return (
    <motion.aside
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="hidden max-w-3xl flex-col justify-center lg:flex lg:pl-[8vw] xl:pl-[9.5vw]"
    >
      <div className="lg:-translate-y-16 xl:-translate-y-20">
        <h2 className="font-auth-display max-w-[34rem] text-[3rem] font-semibold leading-[1.06] tracking-tight text-auth-wash xl:text-[3.45rem]">
          {t("auth.sideTitle")}
        </h2>

        <p className="mt-6 max-w-[24rem] text-[15px] font-medium leading-7 text-auth-stone">
          {t("auth.sideTagline")}
        </p>
      </div>
    </motion.aside>
  );
}
