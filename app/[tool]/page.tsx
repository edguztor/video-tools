"use client";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import Link from "next/link";

const ComprimirTool = dynamic(() => import("../../components/ComprimirTool"), { ssr: false });
const ConvertirTool = dynamic(() => import("../../components/ConvertirTool"), { ssr: false });
const RecortarTool = dynamic(() => import("../../components/RecortarTool"), { ssr: false });
const AudioTool = dynamic(() => import("../../components/AudioTool"), { ssr: false });
const GifTool = dynamic(() => import("../../components/GifTool"), { ssr: false });
const SilenciarTool = dynamic(() => import("../../components/SilenciarTool"), { ssr: false });
const ResolucionTool = dynamic(() => import("../../components/ResolucionTool"), { ssr: false });
const RotarTool = dynamic(() => import("../../components/RotarTool"), { ssr: false });

const TOOLS: Record<string, { label: string; emoji: string; desc: string; color: string; bg: string; border: string; component: React.ComponentType }> = {
  comprimir: {
    label: "Comprimir Video",
    emoji: "🗜️",
    desc: "Reduce el tamaño de tu video sin perder calidad visible, usando el codec H.264.",
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
    component: ComprimirTool,
  },
  convertir: {
    label: "Convertir Formato de Video",
    emoji: "🔄",
    desc: "Convierte tu video entre MP4, WebM y MOV de forma gratuita y sin subir archivos.",
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    component: ConvertirTool,
  },
  recortar: {
    label: "Recortar Video",
    emoji: "✂️",
    desc: "Extrae un fragmento de video indicando el tiempo de inicio y fin exactos.",
    color: "text-green-700",
    bg: "bg-green-50",
    border: "border-green-200",
    component: RecortarTool,
  },
  audio: {
    label: "Extraer Audio de Video",
    emoji: "🎵",
    desc: "Extrae la pista de audio de cualquier video en formato MP3 o WAV.",
    color: "text-yellow-700",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    component: AudioTool,
  },
  gif: {
    label: "Convertir Video a GIF",
    emoji: "🎞️",
    desc: "Convierte un fragmento de tu video en un GIF animado con control de FPS y tamaño.",
    color: "text-pink-700",
    bg: "bg-pink-50",
    border: "border-pink-200",
    component: GifTool,
  },
  silenciar: {
    label: "Silenciar Video",
    emoji: "🔇",
    desc: "Elimina completamente el audio de tu video manteniendo la calidad visual intacta.",
    color: "text-gray-700",
    bg: "bg-gray-50",
    border: "border-gray-200",
    component: SilenciarTool,
  },
  resolucion: {
    label: "Cambiar Resolución de Video",
    emoji: "📺",
    desc: "Ajusta la resolución de tu video a 4K, 1080p, 720p, 480p o 360p.",
    color: "text-cyan-700",
    bg: "bg-cyan-50",
    border: "border-cyan-200",
    component: ResolucionTool,
  },
  rotar: {
    label: "Rotar o Voltear Video",
    emoji: "🔃",
    desc: "Rota tu video 90° o 180°, o voltéalo horizontal o verticalmente.",
    color: "text-violet-700",
    bg: "bg-violet-50",
    border: "border-violet-200",
    component: RotarTool,
  },
};

export default function ToolPage({ params }: { params: { tool: string } }) {
  const tool = TOOLS[params.tool];
  if (!tool) notFound();

  const ToolComponent = tool.component;

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      {/* Back link */}
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 mb-6 transition-colors">
        ← Todas las herramientas
      </Link>

      {/* Header */}
      <div className={`rounded-2xl border-2 ${tool.border} ${tool.bg} p-6 mb-6`}>
        <div className="flex items-center gap-3 mb-1">
          <span className="text-4xl">{tool.emoji}</span>
          <h1 className={`text-2xl font-extrabold ${tool.color}`}>{tool.label}</h1>
        </div>
        <p className="text-gray-600 text-sm mt-2">{tool.desc}</p>
      </div>

      {/* Tool */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <ToolComponent />
      </div>

      {/* Privacy note */}
      <p className="text-center text-xs text-gray-400 mt-6">
        🔒 Tu archivo se procesa en tu navegador. Nunca se sube a ningún servidor.
      </p>
    </main>
  );
}
