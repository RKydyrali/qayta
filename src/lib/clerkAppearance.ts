import type { ComponentProps } from "react";
import { SignIn } from "@clerk/clerk-react";

type ClerkAppearance = NonNullable<ComponentProps<typeof SignIn>["appearance"]>;

export const clerkAuthAppearance: ClerkAppearance = {
  variables: {
    colorPrimary: "rgb(var(--auth-green-mid))",
    colorText: "rgb(var(--auth-wash))",
    colorTextSecondary: "rgb(var(--auth-stone))",
    colorBackground: "transparent",
    colorInputBackground: "rgb(var(--auth-elevated) / 0.82)",
    colorInputText: "rgb(var(--auth-wash))",
    colorNeutral: "rgb(var(--auth-green-soft))",
    borderRadius: "0.75rem",
    fontFamily: '"Plus Jakarta Sans", "IBM Plex Sans", sans-serif',
    fontFamilyButtons: '"Plus Jakarta Sans", "IBM Plex Sans", sans-serif',
    spacingUnit: "0.95rem",
  },
  elements: {
    rootBox: "w-full",
    cardBox: "w-full shadow-none",
    card: "bg-transparent shadow-none p-0 gap-5 w-full",
    header: "hidden",
    headerTitle: "hidden",
    headerSubtitle: "hidden",
    socialButtonsBlockButton:
      "h-11 rounded-xl border border-auth-line/10 bg-auth-elevated/70 text-auth-mist font-medium transition-colors hover:border-auth-line/18 hover:bg-auth-elevated active:translate-y-px",
    socialButtonsBlockButtonText: "font-medium text-auth-mist",
    dividerLine: "bg-auth-line/10",
    dividerText: "text-auth-stone text-[11px] uppercase tracking-[0.18em]",
    formFieldLabel: "block pl-2 text-[13px] font-semibold leading-5 text-auth-stone mb-1.5",
    formFieldInput:
      "h-11 rounded-xl border border-auth-line/10 bg-auth-elevated/80 px-3.5 text-auth-wash transition-colors placeholder:text-auth-stone/70 focus:border-auth-greenMid/60 focus:ring-1 focus:ring-auth-greenMid/30",
    formButtonPrimary:
      "h-11 rounded-xl border border-auth-green/30 bg-auth-green text-[#f8f2e8] font-medium transition-all hover:bg-auth-greenMid active:translate-y-px",
    footerAction: "hidden",
    footerActionLink: "hidden",
    identityPreview: "rounded-xl border border-auth-line/10 bg-auth-elevated/70",
    formFieldInputShowPasswordButton: "text-auth-stone hover:text-auth-mist",
    alertText: "text-sm",
    formFieldErrorText: "text-sm text-red-400/90",
    otpCodeFieldInput: "rounded-xl border border-auth-line/10 bg-auth-elevated/80",
  },
};
