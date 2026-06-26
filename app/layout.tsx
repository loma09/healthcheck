import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HealthCheck — Pantau Kesehatan Tubuhmu",
  description:
    "Aplikasi pemantau kesehatan pribadi. Catat pemeriksaan rutin, olahraga, nutrisi, dan tidur — dapatkan insight AI setiap hari.",
  keywords: ["kesehatan", "health tracker", "pemeriksaan", "olahraga", "nutrisi", "tidur"],
  authors: [{ name: "HealthCheck" }],
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#1A1A2E",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
