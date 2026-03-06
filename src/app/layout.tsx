import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZG Pessoas - Dashboard",
  description: "Gestão inteligente de pessoas",
  colorScheme: "light",
};

export const viewport: Viewport = {
  themeColor: "#f9fafb",
};

import TopNav from "@/components/TopNav";
import { getSession } from "@/lib/session";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html lang="pt-BR" className="bg-gray-50 text-gray-900">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900 min-h-screen flex flex-col`}
      >
        <TopNav username={session?.userId as string | undefined} />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
