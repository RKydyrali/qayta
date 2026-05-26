import { useEffect, useState } from "react";
import { Moon, Sun } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

const STORAGE_KEY = "qayta-theme";

function getInitialTheme(): "light" | "dark" {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "dark" || stored === "light") return stored;
  return "dark";
}

export function AuthThemeToggle() {
  const { t } = useTranslation();
  const [theme, setTheme] = useState<"light" | "dark">(() => getInitialTheme());

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  return (
    <button
      type="button"
      aria-label={theme === "dark" ? t("auth.switchToLight") : t("auth.switchToDark")}
      onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-auth-line/10 bg-auth-surface/72 text-auth-stone transition-colors hover:border-auth-line/18 hover:text-auth-mist active:translate-y-px"
    >
      {theme === "dark" ? <Sun size={16} weight="regular" /> : <Moon size={16} weight="regular" />}
    </button>
  );
}
