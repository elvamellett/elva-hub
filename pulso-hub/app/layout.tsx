import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";

const spaceGrotesk = localFont({
  src: "./fonts/SpaceGrotesk.ttf",
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = localFont({
  src: "./fonts/Inter.ttf",
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PULSO Hub",
  description: "Operations & marketing hub for PULSO — padel gear.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-paper text-ink">
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex min-h-screen flex-1 flex-col">
            <Topbar />
            <main className="flex-1 px-6 py-6 lg:px-10">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
