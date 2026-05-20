"use client";
import { useState, useRef } from "react";
import { useFFmpeg } from "./useFFmpeg";
import FFmpegProgress from "./FFmpegProgress";

export default function ComprimirTool() {
  const { loading, progress, log, run } = useFFmpeg();
  const [file, setFile] = useState<File | null>(null);
  const [crf, setCrf] = useState(28);
  const [result, setResult] = useState<{ url: string; size: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const compress = async () => {
    if (!file) return;
    setResult(null);
    const blob = await run(file, "input.mp4", ["-i", "input.mp4", "-c:v", "libx264", "-crf", String(crf), "-preset", "fast", "-c:a", "aac", "-b:a", "128k", "output.mp4"], "output.mp4");
    setResult({ url: URL.createObjectURL(blob), size: blob.size });
  };

  const fmt = (b: number) => b < 1024 * 1024 ? `${(b / 1024).toFixed(0)} KB` : `${(b / 1024 / 1024).toFixed(1)} MB`;
  const quality = crf <= 23 ? "Alta" : crf <= 28 ? "Media" : "Baja";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <label className="text-sm font-medium text-gray-700">Calidad: {quality} (CRF {crf})</label>
        <input type="range" min={18} max={40} value={crf} onChange={e => setCrf(Number(e.target.value))}
          className="flex-1 min-w-32 accent-red-600" />
        <span className="text-xs text-gray-400">← Mayor calidad · Más compresión →</span>
      </div>

      {!file ? (
        <div className={`drop-zone rounded-2xl p-10 text-center cursor-pointer ${dragging ? "active" : ""}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) setFile(f); }}>
          <div className="text-5xl mb-3">🗜️</div>
          <p className="text-lg font-semibold text-gray-700 mb-1">Arrastra tu video aquí</p>
          <p className="text-gray-400 text-sm mb-4">MP4, MOV, AVI, WebM</p>
          <button className="btn-primary px-6 py-2 rounded-full font-medium text-sm" type="button">Seleccionar video</button>
          <input ref={inputRef} type="file" accept="video/*" className="hidden"
            onChange={e => { if (e.target.files?.[0]) setFile(e.target.files[0]); }} />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
            <span className="text-2xl">🎥</span>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 text-sm truncate">{file.name}</p>
              <p className="text-xs text-gray-500">Tamaño original: {fmt(file.size)}</p>
            </div>
            <button onClick={() => { setFile(null); setResult(null); }} className="text-gray-400 hover:text-red-500 text-xl">✕</button>
          </div>

          <FFmpegProgress loading={loading} progress={progress} log={log} label="Comprimiendo video" />

          {!loading && (
            <button onClick={compress} className="btn-primary w-full py-3 rounded-xl font-bold text-base">
              🗜️ Comprimir video
            </button>
          )}

          {result && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-2">
              <p className="font-medium text-green-800">✅ Video comprimido</p>
              <p className="text-sm text-gray-600">
                {fmt(file.size)} → {fmt(result.size)}
                <span className="ml-2 text-green-600 font-bold">−{Math.round((1 - result.size / file.size) * 100)}%</span>
              </p>
              <a href={result.url} download={`comprimido_${file.name.replace(/\.[^.]+$/, "")}.mp4`}
                className="btn-primary inline-block px-6 py-2 rounded-xl font-medium text-sm">
                ⬇️ Descargar video comprimido
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
