"use client";
import { useState, useRef } from "react";
import { useFFmpeg } from "./useFFmpeg";
import FFmpegProgress from "./FFmpegProgress";

export default function GifTool() {
  const { loading, progress, log, run } = useFFmpeg();
  const [file, setFile] = useState<File | null>(null);
  const [start, setStart] = useState("00:00:00");
  const [duration, setDuration] = useState(5);
  const [fps, setFps] = useState(10);
  const [width, setWidth] = useState(480);
  const [result, setResult] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const convert = async () => {
    if (!file) return;
    setResult(null);
    const blob = await run(file, "input.mp4", [
      "-i", "input.mp4",
      "-ss", start,
      "-t", String(duration),
      "-vf", `fps=${fps},scale=${width}:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse`,
      "-loop", "0",
      "output.gif"
    ], "output.gif");
    setResult(URL.createObjectURL(blob));
  };

  return (
    <div className="space-y-4">
      {!file ? (
        <div className="drop-zone rounded-2xl p-10 text-center cursor-pointer"
          onClick={() => inputRef.current?.click()}>
          <div className="text-5xl mb-3">🎞️</div>
          <p className="text-lg font-semibold text-gray-700 mb-1">Arrastra tu video aquí</p>
          <p className="text-gray-400 text-sm mb-4">Convierte un fragmento a GIF animado</p>
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-600">Inicio (HH:MM:SS)</label>
              <input type="text" value={start} onChange={e => setStart(e.target.value)}
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono" />
            </div>
            <div>
              <label className="text-xs text-gray-600">Duración: {duration}s</label>
              <input type="range" min={1} max={15} value={duration} onChange={e => setDuration(Number(e.target.value))}
                className="w-full mt-3 accent-pink-500" />
            </div>
            <div>
              <label className="text-xs text-gray-600">FPS: {fps}</label>
              <input type="range" min={5} max={24} value={fps} onChange={e => setFps(Number(e.target.value))}
                className="w-full mt-3 accent-pink-500" />
            </div>
            <div>
              <label className="text-xs text-gray-600">Ancho: {width}px</label>
              <input type="range" min={240} max={800} step={80} value={width} onChange={e => setWidth(Number(e.target.value))}
                className="w-full mt-3 accent-pink-500" />
            </div>
          </div>

          <FFmpegProgress loading={loading} progress={progress} log={log} label="Generando GIF" />
          {!loading && (
            <button onClick={convert} className="btn-primary w-full py-3 rounded-xl font-bold">🎞️ Convertir a GIF</button>
          )}
          {result && (
            <div className="bg-pink-50 border border-pink-200 rounded-xl p-4">
              <p className="font-medium text-pink-800 mb-2">✅ GIF generado</p>
              <img src={result} alt="gif" className="w-full rounded-lg mb-3 max-h-48 object-contain" />
              <a href={result} download={`${file.name.replace(/\.[^.]+$/, "")}.gif`}
                className="btn-primary inline-block px-6 py-2 rounded-xl font-medium text-sm">⬇️ Descargar GIF</a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
