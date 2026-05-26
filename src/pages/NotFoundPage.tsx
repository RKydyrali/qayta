import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <motion.div
      className="page flex flex-col items-center justify-center min-h-[60vh] text-center"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="font-display text-qayta-earth text-4xl mb-2">404</h1>
      <p className="text-sm text-qayta-muted mb-6">
        {t("notFound.description")}
      </p>
      <Button
        asChild
        className="bg-qayta-earth text-qayta-white hover:bg-qayta-leaf"
      >
        <Link to="/">{t("notFound.home")}</Link>
      </Button>
    </motion.div>
  );
}
