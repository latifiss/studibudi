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

const siteUrl = "https://stidibudi.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Stidibudi — Turn Your Study Material Into Interactive Quizzes",
    template: "%s | Stidibudi",
  },
  description:
    "Stidibudi turns your study materials into engaging AI-powered quizzes. Upload your files, test your knowledge, and learn in a more interactive way.",
  applicationName: "Stidibudi",
  keywords: [
    "Stidibudi",
    "AI quiz generator",
    "study quiz",
    "quiz generator",
    "AI learning",
    "study tools",
    "interactive quizzes",
    "study material",
  ],
  authors: [{ name: "Stidibudi" }],
  creator: "Stidibudi",
  publisher: "Stidibudi",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Stidibudi",
    title: "Stidibudi — Turn Your Study Material Into Interactive Quizzes",
    description:
      "Turn your study materials into engaging AI-powered quizzes with Stidibudi.",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Stidibudi — Turn Your Study Material Into Interactive Quizzes",
    description:
      "Turn your study materials into engaging AI-powered quizzes with Stidibudi.",
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
