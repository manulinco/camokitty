import type { Metadata } from "next";
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
  title: "Camo Kitty - The Ultimate Camouflage Challenge",
  description: "Hide your kitty in stunning 4K anime and gaming environments. Share links and dare your friends to find it! A next-gen hide and seek web game.",
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: "Camo Kitty - Hide and Seek",
    description: "Hide your kitty in stunning 4K environments. Share links and dare your friends to find it!",
    url: "https://camokitty.vercel.app",
    siteName: "Camo Kitty",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 800,
        alt: "Camo Kitty Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Camo Kitty - Hide and Seek",
    description: "Hide your kitty in stunning 4K environments. Share links and dare your friends to find it!",
    images: ["/logo.png"],
  },
};

import FloatingNav from "@/components/FloatingNav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0a0a]">
        <FloatingNav />
        {children}
      </body>
    </html>
  );
}
