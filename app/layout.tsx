import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

const siteUrl = "https://video-tools-five.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "VideoGratis — Herramientas de Video Online 100% Gratuitas",
    template: "%s | VideoGratis",
  },
  description:
    "Comprime, convierte, recorta y edita videos gratis online. Extrae audio MP3, convierte a GIF, cambia resolución. Sin registro, todo en tu navegador.",
  keywords: [
    "comprimir video gratis", "convertir video online", "recortar video gratis",
    "extraer audio mp3", "video a gif gratis", "convertir a mp4 gratis",
    "silenciar video online", "cambiar resolucion video", "herramientas video online",
  ],
  authors: [{ name: "VideoGratis" }],
  robots: { index: true, follow: true },
  openGraph: {
    title: "VideoGratis — Herramientas de Video Online Gratuitas",
    description: "Comprime, convierte y edita videos gratis. Sin registro. 100% en tu navegador.",
    type: "website",
    url: siteUrl,
    siteName: "VideoGratis",
    locale: "es_MX",
  },
  alternates: { canonical: siteUrl },
  verification: { google: "zel00yVDEZH37EwPriiDFQGBojDNpYQa5n5oz7KcpDc" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8285676413297966"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <span className="text-2xl">🎬</span>
              <span style={{ color: "var(--primary)" }}>Video</span>
              <span className="text-gray-800">Gratis</span>
            </Link>
            <nav className="hidden md:flex items-center gap-3 text-sm font-medium text-gray-600">
              <Link href="/comprimir"   className="hover:text-red-600 transition-colors">Comprimir</Link>
              <Link href="/convertir"   className="hover:text-red-600 transition-colors">Convertir</Link>
              <Link href="/recortar"    className="hover:text-red-600 transition-colors">Recortar</Link>
              <Link href="/audio"       className="hover:text-red-600 transition-colors">Extraer audio</Link>
              <Link href="/gif"         className="hover:text-red-600 transition-colors">→ GIF</Link>
              <Link href="/silenciar"   className="hover:text-red-600 transition-colors">Silenciar</Link>
              <Link href="/resolucion"  className="hover:text-red-600 transition-colors">Resolución</Link>
              <Link href="/rotar"       className="hover:text-red-600 transition-colors">Rotar</Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="bg-gray-800 text-gray-300 py-8 mt-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <p className="font-semibold text-white">VideoGratis</p>
                <p className="text-sm text-gray-400">Herramientas de video 100% gratuitas. Tu privacidad protegida.</p>
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                <Link href="/comprimir"  className="hover:text-white">Comprimir</Link>
                <Link href="/convertir"  className="hover:text-white">Convertir</Link>
                <Link href="/recortar"   className="hover:text-white">Recortar</Link>
                <Link href="/audio"      className="hover:text-white">Extraer audio</Link>
                <Link href="/gif"        className="hover:text-white">Video a GIF</Link>
                <Link href="/silenciar"  className="hover:text-white">Silenciar</Link>
                <Link href="/resolucion" className="hover:text-white">Resolución</Link>
                <Link href="/rotar"      className="hover:text-white">Rotar</Link>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-6 pt-6 text-center text-sm text-gray-500">
              © {new Date().getFullYear()} VideoGratis. Todos los derechos reservados.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
