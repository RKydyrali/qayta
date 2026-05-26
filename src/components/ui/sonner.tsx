import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
  CheckCircle,
  Info,
  WarningCircle,
  XCircle,
  SpinnerGap,
} from "@phosphor-icons/react";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      icons={{
        success: <CheckCircle className="size-4" weight="fill" />,
        info: <Info className="size-4" weight="fill" />,
        warning: <WarningCircle className="size-4" weight="fill" />,
        error: <XCircle className="size-4" weight="fill" />,
        loading: <SpinnerGap className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
