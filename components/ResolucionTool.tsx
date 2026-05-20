"use client";
import { useState, useRef } from "react";
import { useFFmpeg } from "./useFFmpeg";
import FFmpegProgress from "./FFmpegProgress";

const PRESETS = [
  { label: "4K (2160p)", w: 3840, h: 2160 },
  { label: "1080p", w: 1920, h: 1080 },
  { label: "720p", w: 1280, h: 720 },
  { label: "480p", w: 854, h: 480 },
  { label: "360p", w: 640, h: 360 },
];

export default function ResolucionTool() {
  const { loading, progress, log, run } = useFFmpeg();
  const [file, setFile] = useState<File | null>(null);
  const [preset, setPreset] = useState("1280x720");
  const [result, setResult] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const resize = async () => {
    if (!file) return;
    setResult(null);
    const [w, h] = preset.split("x");
    const blob = await run(file, "input.mp4",
      ["-i", "input.mp4", "-vf", `scale=${w}:${h}:force_original_aspect_ratio=decrease,pad=${w}:${h}:(ow-iw)/2:(oh-ih)/2`, "-c:a", "copy", "output.mp4"],
      "output.mp4"
    );
    setResult(URL.createObjectURL(blob));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {PRESETS.map(p => (
          <button key={p.label} onClick={() => setPreset(`${p.w}x${p.h}`)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border-2 transition-colors ${preset === `${p.w}x${p.h}` ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 text-gray-500"}`}>
            {p.label}
          </button>
        ))}
      </div>

      {!file ? (
        <div className="drop-zone rounded-2xl p-10 text-center cursor-pointer"
          onClick={() => inputRef.current?.click()}>
          <div className="text-5xl mb-3">📺</div>
          <p className="text-lg font-semibold text-gray-700 mb-1">Arrastra tu video aquí</p>
          <p className="text-gray-400 text-sm mb-4">Cambia la resolución manteniendo proporciones</p>
          <button className="btn-primary px-6 py-2 rounded-full font-medium text-sm" type="button">Seleccionar video</button>
          <input ref={inputRef} type="file" accept="video/*" className="hidden"
            onChange={e => { if (e.target.files?.[0]) setFile(e.target.files[0]); }} />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
            <span className="text-2xl">🎥</span>
            <p className="font-medium text-gray-800 text-sm truncate flex-1">{file.name}</p>
            <button onClick={() => { setFile(null); setResult(null); }} className="text-gray-400 hover:text-red-500">✕</button>
          </div>
          <FFmpegProgress loading={loading} progress={progress} log={log} label={`Cambiando resolución a ${preset}`} />
          {!loading && (
            <button onClick={resize} className="btn-primary w-full py-3 rounded-xl font-bold">📺 Cambiar a {preset}</button>
          )}
          {result && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="font-medium text-green-800 mb-2">✅ Resolución cambiada a {preset}</p>
              <a href={result} download={`${file.name.replace(/\.[^.]+$/, "")}_${preset}.mp4`}
                className="btn-primary inline-block px-6 py-2 rounded-xl font-medium text-sm">⬇️ Descargar</a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
