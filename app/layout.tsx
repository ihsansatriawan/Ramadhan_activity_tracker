import type { Metadata } from "next";
import "./globals.css";

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
      <body className="bg-green-50 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
