"use client";

import { ThemeProvider } from "@/context/themeContext";
import PostHogProvider from "@/components/analytics/posthog-provider";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <PostHogProvider>{children}</PostHogProvider>
    </ThemeProvider>
  );
}
