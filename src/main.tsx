import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth } from "@clerk/clerk-react";
import { useTranslation } from "react-i18next";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import "./i18n";
import { App } from "./App";
import { clerkLocalizations } from "./lib/clerkLocalization";

const convexUrl = import.meta.env.VITE_CONVEX_URL;
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey || !convexUrl) {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <div className="page" style={{ maxWidth: 560, margin: "4rem auto", fontFamily: "var(--font-body)" }}>
        <h1 className="font-display text-qayta-earth text-2xl mb-4">QAYTA</h1>
        <div className="card-qayta">
          <h2 className="font-display text-qayta-clay text-lg mb-2">Не заданы переменные окружения</h2>
          <p className="text-sm text-qayta-muted mb-4">
            Создайте <code>.env.local</code> в корне проекта и добавьте:
          </p>
          <pre className="bg-qayta-stone/30 p-3 rounded text-xs font-mono overflow-auto">
{`VITE_CONVEX_URL=https://your-deployment.convex.cloud
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...`}
          </pre>
          <p className="text-xs text-qayta-muted mt-4">
            После сохранения перезапустите dev-сервер.
          </p>
        </div>
      </div>
    </React.StrictMode>
  );
} else {
  const convex = new ConvexReactClient(convexUrl);

  const LocalizedClerkProvider = ({ children }: { children: React.ReactNode }) => {
    const { i18n } = useTranslation();
    const language = i18n.resolvedLanguage === "kk" ? "kk" : "ru";

    return (
      <ClerkProvider
        publishableKey={clerkPubKey}
        afterSignOutUrl="/auth/sign-in"
        localization={clerkLocalizations[language]}
      >
        {children}
      </ClerkProvider>
    );
  };

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <LocalizedClerkProvider>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ConvexProviderWithClerk>
      </LocalizedClerkProvider>
    </React.StrictMode>
  );
}
