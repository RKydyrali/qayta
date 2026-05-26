import { Moon, Sun } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export function ThemeToggle() {
  const { t } = useTranslation();
  const [theme, setTheme] = useState<"light" | "dark">(
    () => (localStorage.getItem("theme") as "light" | "dark") || "light"
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="p-2 rounded-md hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center"
      aria-label={theme === "light" ? t("auth.switchToDark") : t("auth.switchToLight")}
    >
      {theme === "light" ? (
        <Moon weight="bold" className="w-4 h-4" />
      ) : (
        <Sun weight="bold" className="w-4 h-4" />
      )}
    </button>
  );
}
