import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ru from "./locales/ru.json";
import kk from "./locales/kk.json";

const storedLanguage = localStorage.getItem("qayta-lang");
const initialLanguage = storedLanguage === "kk" || storedLanguage === "ru" ? storedLanguage : "ru";

i18n.use(initReactI18next).init({
  resources: {
    ru: { translation: ru },
    kk: { translation: kk },
  },
  lng: initialLanguage,
  fallbackLng: "ru",
  interpolation: { escapeValue: false },
});

function updateDocumentLocale(language: string) {
  document.documentElement.lang = language;
  document.title = `QAYTA - ${i18n.t("tagline")}`;
}

updateDocumentLocale(i18n.language);
i18n.on("languageChanged", (language) => {
  updateDocumentLocale(language);
});

export default i18n;
