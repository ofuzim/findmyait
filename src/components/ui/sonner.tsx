"use client";

import { useTheme } from "next-themes@0.4.6";
import { Toaster as Sonner, ToasterProps } from "sonner@2.0.3";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "#f8fafc",
          "--normal-text": "#1e293b",
          "--normal-border": "#e2e8f0",
          "--success-bg": "#f8fafc",
          "--success-text": "#1e293b",
          "--success-border": "#e2e8f0",
          "--error-bg": "#fef2f2",
          "--error-text": "#991b1b",
          "--error-border": "#fecaca",
          "--warning-bg": "#fffbeb",
          "--warning-text": "#92400e",
          "--warning-border": "#fed7aa",
          "--info-bg": "#eff6ff",
          "--info-text": "#1e40af",
          "--info-border": "#bfdbfe",
        } as React.CSSProperties
      }
      toastOptions={{
        style: {
          background: "var(--normal-bg)",
          color: "var(--normal-text)",
          border: "1px solid var(--normal-border)",
          fontSize: "14px",
          fontWeight: "600",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        },
        classNames: {
          success: "!bg-[#f8fafc] !text-[#1e293b] !border-[#e2e8f0] !font-semibold",
          error: "!bg-[#fef2f2] !text-[#991b1b] !border-[#fecaca] !font-semibold",
          warning: "!bg-[#fffbeb] !text-[#92400e] !border-[#fed7aa] !font-semibold",
          info: "!bg-[#eff6ff] !text-[#1e40af] !border-[#bfdbfe] !font-semibold",
          description: "!text-[#64748b] !font-medium !mt-1",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
