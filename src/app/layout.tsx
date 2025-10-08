// src/app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Providers } from './providers'; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AWS Portfolio",
  description: "AWSの自走力を示すポートフォリオサイト",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja"> 
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {/* 💡 修正点 5: Providers で子要素をラップ */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}