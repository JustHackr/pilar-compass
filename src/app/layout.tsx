import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { ClientApp } from "@/components/ClientApp";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Pilar Compass · Sekolah Pilar Indonesia",
  description:
    "Academic competition finder and university match calculator for Sekolah Pilar Indonesia students.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${roboto.variable} h-full`}>
      <body className="min-h-full antialiased">
        <ClientApp>{children}</ClientApp>
      </body>
    </html>
  );
}
