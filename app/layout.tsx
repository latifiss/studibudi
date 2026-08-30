import type { Metadata } from "next";
import { Inter, Young_Serif } from "next/font/google";
import "./globals.css";
import "@/styles/tokens.css";
import Providers from "./providers";
import LayoutWrapper from "@/components/layout/layoutWrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-text",
  display: "swap",
});

const youngSerif = Young_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const siteUrl = "https://studibudi.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Studibudi — Turn Your Study Material Into Interactive Quizzes",
    template: "%s | Studibudi",
  },
  description:
    "Studibudi turns your study materials into engaging AI-powered quizzes. Upload your files, test your knowledge, and learn in a more interactive way.",
  applicationName: "Studibudi",
  keywords: [
    "Studibudi",
    "AI quiz generator",
    "study quiz",
    "quiz generator",
    "AI learning",
    "study tools",
    "interactive quizzes",
    "study material",
  ],
  authors: [{ name: "Studibudi" }],
  creator: "Studibudi",
  publisher: "Studibudi",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Studibudi",
    title: "Studibudi — Turn Your Study Material Into Interactive Quizzes",
    description:
      "Turn your study materials into engaging AI-powered quizzes with Studibudi.",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Studibudi — Turn Your Study Material Into Interactive Quizzes",
    description:
      "Turn your study materials into engaging AI-powered quizzes with Studibudi.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased overflow-hidden ${inter.variable} ${youngSerif.variable}`}>
      <body className="h-full flex flex-col bg-background text-foreground font-text transition-colors overflow-hidden">
        <Providers>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}