import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "NutriCare Decision Support | SPK Rekomendasi Menu",
  description:
    "Sistem Pendukung Keputusan rekomendasi menu harian untuk penderita penyakit kronis menggunakan metode SAW dan TOPSIS.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full overflow-x-hidden">
      <body className="min-h-screen w-full overflow-x-hidden bg-mesh antialiased">
        <Navbar />
        <main className="mx-auto w-full min-w-0 max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
          {children}
        </main>
        <footer className="border-t border-teal-100 bg-white/60">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p>NutriCare Decision Support — Prototype SPK MADM (SAW & TOPSIS)</p>
            <p className="text-xs">
              Bukan alat diagnosis medis. Konsultasikan dengan tenaga kesehatan.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
