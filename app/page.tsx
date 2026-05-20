"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import AdBanner from "../components/AdBanner";

// 👉 Reemplaza este valor con tu Slot ID real de AdSense
//    AdSense → Anuncios → Por unidad de anuncio → Anuncios display → copia el data-ad-slot
const AD_SLOT = "7687220224";

const ComprimirTool = dynamic(() => import("../components/ComprimirTool"), { ssr: false });
const ConvertirTool = dynamic(() => import("../components/ConvertirTool"), { ssr: false });
const RecortarTool = dynamic(() => import("../components/RecortarTool"), { ssr: false });
const AudioTool = dynamic(() => import("../components/AudioTool"), { ssr: false });
const GifTool = dynamic(() => import("../components/GifTool"), { ssr: false });
const SilenciarTool = dynamic(() => import("../components/SilenciarTool"), { ssr: false });
const ResolucionTool = dynamic(() => import("../components/ResolucionTool"), { ssr: false });
const RotarTool = dynamic(() => import("../components/RotarTool"), { ssr: false });

const TOOLS = [
  {
    id: "comprimir",
    label: "Comprimir Video",
    emoji: "🗜️",
    desc: "Reduce el peso del video sin perder calidad visible",
    color: "red",
    accent: "#dc2626",
    bg: "bg-red-50",
    border: "border-red-200",
    badge: "text-red-700 bg-red-100",
    component: ComprimirTool,
  },
  {
    id: "convertir",
    label: "Convertir Formato",
    emoji: "🔄",
    desc: "Convierte entre MP4, WebM y MOV fácilmente",
    color: "blue",
    accent: "#2563eb",
    bg: "bg-blue-50",
    border: "border-blue-200",
    badge: "text-blue-700 bg-blue-100",
    component: ConvertirTool,
  },
  {
    id: "recortar",
    label: "Recortar Video",
    emoji: "✂️",
    desc: "Extrae un fragmento por tiempo de inicio y fin",
    color: "green",
    accent: "#16a34a",
    bg: "bg-green-50",
    border: "border-green-200",
    badge: "text-green-700 bg-green-100",
    component: RecortarTool,
  },
  {
    id: "audio",
    label: "Extraer Audio",
    emoji: "🎵",
    desc: "Extrae el audio como MP3 o WAV desde un video",
    color: "yellow",
    accent: "#ca8a04",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    badge: "text-yellow-700 bg-yellow-100",
    component: AudioTool,
  },
  {
    id: "gif",
    label: "Video a GIF",
    emoji: "🎞️",
    desc: "Convierte un fragmento de video a GIF animado",
    color: "pink",
    accent: "#db2777",
    bg: "bg-pink-50",
    border: "border-pink-200",
    badge: "text-pink-700 bg-pink-100",
    component: GifTool,
  },
  {
    id: "silenciar",
    label: "Silenciar Video",
    emoji: "🔇",
    desc: "Elimina el audio manteniendo el video intacto",
    color: "gray",
    accent: "#6b7280",
    bg: "bg-gray-50",
    border: "border-gray-200",
    badge: "text-gray-700 bg-gray-100",
    component: SilenciarTool,
  },
  {
    id: "resolucion",
    label: "Cambiar Resolución",
    emoji: "📺",
    desc: "Ajusta a 4K, 1080p, 720p, 480p o 360p",
    color: "cyan",
    accent: "#0891b2",
    bg: "bg-cyan-50",
    border: "border-cyan-200",
    badge: "text-cyan-700 bg-cyan-100",
    component: ResolucionTool,
  },
  {
    id: "rotar",
    label: "Rotar / Voltear",
    emoji: "🔃",
    desc: "Rota 90°, 180° o voltea horizontal/vertical",
    color: "violet",
    accent: "#7c3aed",
    bg: "bg-violet-50",
    border: "border-violet-200",
    badge: "text-violet-700 bg-violet-100",
    component: RotarTool,
  },
];

export default function Home() {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const tool = TOOLS.find(t => t.id === activeTool);

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      {/* Hero */}
      <section className="text-center mb-10">
        <div className="text-6xl mb-4">🎬</div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
          Herramientas de Video <span className="text-red-600">Gratis</span>
        </h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          Edita, convierte y optimiza tus videos directamente en el navegador.
          Sin subir archivos a ningún servidor. 100% privado.
        </p>
      </section>

      {/* Active tool panel */}
      {activeTool && tool ? (
        <div className={`rounded-2xl border-2 ${tool.border} ${tool.bg} p-6 mb-8`}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{tool.emoji}</span>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{tool.label}</h2>
                <p className="text-sm text-gray-500">{tool.desc}</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTool(null)}
              className="text-gray-400 hover:text-gray-700 text-2xl font-light transition-colors"
              aria-label="Cerrar herramienta"
            >
              ✕
            </button>
          </div>
          <tool.component />
        </div>
      ) : null}

      {/* Anuncio superior */}
      <AdBanner slot={AD_SLOT} format="horizontal" className="mb-8 rounded-xl overflow-hidden min-h-[90px] bg-gray-50" />

      {/* Tools grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {TOOLS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTool(t.id === activeTool ? null : t.id)}
            className={`group rounded-2xl border-2 p-5 text-left transition-all hover:scale-[1.03] hover:shadow-lg ${
              activeTool === t.id
                ? `${t.border} ${t.bg} shadow-md`
                : "border-gray-100 bg-white hover:border-gray-200"
            }`}
          >
            <span className="text-3xl block mb-2">{t.emoji}</span>
            <p className="font-semibold text-gray-800 text-sm leading-tight mb-1">{t.label}</p>
            <p className="text-gray-400 text-xs leading-snug">{t.desc}</p>
          </button>
        ))}
      </div>

      {/* Anuncio entre grid e info */}
      <AdBanner slot={AD_SLOT} format="rectangle" className="mt-10 rounded-xl overflow-hidden min-h-[250px] bg-gray-50" />

      {/* Info section */}
      <section className="mt-12 grid sm:grid-cols-3 gap-6 text-center">
        {[
          { emoji: "🔒", title: "100% Privado", desc: "Tus archivos nunca salen del navegador. No hay servidores involucrados." },
          { emoji: "⚡", title: "Sin límites", desc: "Procesa videos de cualquier tamaño sin registrarte ni pagar." },
          { emoji: "🆓", title: "Completamente gratis", desc: "Todas las herramientas son gratuitas, siempre." },
        ].map(f => (
          <div key={f.title} className="bg-white border border-gray-100 rounded-2xl p-6">
            <div className="text-4xl mb-3">{f.emoji}</div>
            <h3 className="font-bold text-gray-800 mb-1">{f.title}</h3>
            <p className="text-gray-500 text-sm">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* FAQ / SEO text */}
      <section className="mt-12 prose prose-gray max-w-none">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">¿Cómo funcionan las herramientas de video?</h2>
        <p className="text-gray-600">
          Todas las herramientas funcionan directamente en tu navegador usando{" "}
          <strong>FFmpeg WebAssembly</strong>, la tecnología estándar para procesamiento de video.
          Tu archivo nunca sale de tu computadora — todo ocurre localmente, lo que garantiza
          máxima privacidad y seguridad.
        </p>
        <p className="text-gray-600 mt-3">
          Puedes <strong>comprimir videos</strong> para reducir su tamaño, <strong>convertir formatos</strong>{" "}
          entre MP4, WebM y MOV, <strong>recortar fragmentos</strong> por tiempo exacto,{" "}
          <strong>extraer el audio</strong> en MP3 o WAV, crear <strong>GIFs animados</strong>,
          silenciar videos, cambiar la resolución y rotar o voltear clips.
        </p>
      </section>
    </main>
  );
}
