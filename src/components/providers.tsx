"use client";

import { ThemeProvider } from "next-themes";

import { LocaleProvider } from "@/components/locale-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <LocaleProvider>{children}</LocaleProvider>
    </ThemeProvider>
  );
}

