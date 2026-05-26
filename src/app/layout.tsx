import type { Metadata } from "next";
import { Orbitron, Rajdhani } from "next/font/google";
import "./globals.css";
import { SiteShell } from "@/components/layout/shell";
import { Providers } from "@/components/providers";

const headingFont = Orbitron({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

const bodyFont = Rajdhani({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "NPL Live",
  description: "Live cricket streaming, tournaments, and official Nepal Premier Cricket League merchandise.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${headingFont.variable} ${bodyFont.variable} h-full scroll-smooth`}
    >
      <body className="min-h-full bg-slate-950 text-white">
        <Providers>
          <div className="relative flex min-h-full flex-col overflow-x-hidden">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.16),_transparent_25%)]" />
            <SiteShell>{children}</SiteShell>
          </div>
        </Providers>
      </body>
    </html>
  );
}
