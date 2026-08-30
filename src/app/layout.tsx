import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { ClientApp } from "@/components/ClientApp";
import { SCHOOL } from "@/config/school";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: `${SCHOOL.productName} · ${SCHOOL.name}`,
  description:
    "Academic competition finder, TKA/OSN practice, official textbooks, and a university match calculator for school students.",
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
