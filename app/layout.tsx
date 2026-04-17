import type { Metadata, Viewport } from "next";
import { Courier_Prime, Playfair_Display } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap"
});

const mono = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Retro-Tech Academy",
  description:
    "A local-first learning app that teaches essential technology skills with a friendly mid-century TV interface.",
  applicationName: "Retro-Tech Academy"
};

export const viewport: Viewport = {
  themeColor: "#F5F5DC",
  colorScheme: "light"
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${mono.variable}`}>{children}</body>
    </html>
  );
}
