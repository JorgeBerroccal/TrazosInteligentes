import type { Metadata, Viewport } from "next";
import "./globals.css";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `${site.name} | Desarrollo de software, nube y ciberseguridad`,
  description:
    "Software a medida, desarrollo web y móvil, cloud, ciberseguridad y soporte técnico para empresas. Solicita una cotización sin compromiso.",
  openGraph: {
    title: site.name,
    description: site.tagline,
    type: "website",
    locale: "es_ES",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f1a33",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
