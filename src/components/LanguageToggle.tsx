import { useTranslation } from "react-i18next";
import { useMutation } from "convex/react";
import { useAuth } from "@clerk/clerk-react";
import { api } from "@convex/_generated/api";

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const { isSignedIn } = useAuth();
  const updateLanguage = useMutation(api.users.updateLanguage);

  const setLang = async (l: "ru" | "kk") => {
    localStorage.setItem("qayta-lang", l);
    await i18n.changeLanguage(l);
    if (isSignedIn) await updateLanguage({ language: l });
  };

  return (
    <div className="lang-toggle">
      <button
        type="button"
        className={i18n.language === "ru" ? "active" : ""}
        onClick={() => setLang("ru")}
      >
        RU
      </button>
      <button
        type="button"
        className={i18n.language === "kk" ? "active" : ""}
        onClick={() => setLang("kk")}
      >
        KK
      </button>
    </div>
  );
}
