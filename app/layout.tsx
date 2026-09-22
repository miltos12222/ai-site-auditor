import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin", "greek"] });

export const metadata: Metadata = {
  title: "AI Site Audit & Outreach Engine",
  description: "AI-powered website analysis and outreach tool",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="el">
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
