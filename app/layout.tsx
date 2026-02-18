import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "700", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Jurnal Ramadhan Keluarga",
  description: "Tracker aktivitas Ramadhan untuk seluruh keluarga",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${outfit.variable} ${inter.variable} font-[family-name:var(--font-inter)] min-h-screen antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
