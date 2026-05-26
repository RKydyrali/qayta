import { useTranslation } from "react-i18next";
import { useMutation } from "convex/react";
import { useAuth } from "@clerk/clerk-react";
import { api } from "@convex/_generated/api";

export function AuthLanguageToggle() {
  const { i18n } = useTranslation();
  const { isSignedIn } = useAuth();
  const updateLanguage = useMutation(api.users.updateLanguage);

  const setLang = async (language: "ru" | "kk") => {
    localStorage.setItem("qayta-lang", language);
    await i18n.changeLanguage(language);
    if (isSignedIn) await updateLanguage({ language });
  };

  const languages: Array<{ code: "ru" | "kk"; label: string }> = [
    { code: "ru", label: "RU" },
    { code: "kk", label: "KK" },
  ];

  return (
    <div className="inline-flex rounded-lg border border-auth-line/10 bg-auth-surface/72 p-0.5">
      {languages.map(({ code, label }) => {
        const active = i18n.language === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLang(code)}
            className={`min-w-[42px] rounded-md px-3 py-1.5 text-[11px] font-medium tracking-[0.08em] transition-colors ${
              active
                ? "bg-auth-elevated text-auth-wash"
                : "text-auth-stone hover:text-auth-mist"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
