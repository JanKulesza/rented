"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps, useSonner } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      toastOptions={{
        classNames: {
          error: "!bg-red-600 !text-white !border-red-600",
          success: "!bg-green-600 !text-white !border-green-600",
          warning: "!bg-yellow-500 !text-white !border-yellow-500",
          info: "!bg-primary !text-white !border-primary",
        },
      }}
      theme={theme as ToasterProps["theme"]}
      {...props}
    />
  );
};

export { Toaster };
