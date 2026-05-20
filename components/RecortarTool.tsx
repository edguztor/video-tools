"use client";
import { useState, useRef } from "react";
import { useFFmpeg } from "./useFFmpeg";
import FFmpegProgress from "./FFmpegProgress";

export default function RecortarTool() {
  const { loading, progress, log, run } = useFFmpeg();
  const [file, setFile] = useState<File | null>(null);
  const [start, setStart] = useState("00:00:00");
  const [end, setEnd] = useState("00:00:30");
  const [result, setResult] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const trim = async () => {
    if (!file) return;
    setResult(null);
    const duration = timeToSec(end) - timeToSec(start);
    const blob = await run(file, "input.mp4",
      ["-i", "input.mp4", "-ss", start, "-t", String(duration), "-c", "copy", "output.mp4"],
      "output.mp4"
    );
    setResult(URL.createObjectURL(blob));
  };

  const timeToSec = (t: string) => {
    const [h, m, s] = t.split(":").map(Number);
    return h * 3600 + m * 60 + s;
  };

  return (
    <div className="space-y-4">
      {!file ? (
        <div className="drop-zone rounded-2xl p-10 text-center cursor-pointer"
          onClick={() => inputRef.current?.click()}>
          <div className="text-5xl mb-3">✂️</div>
          <p className="text-lg font-semibold text-gray-700 mb-1">Arrastra tu video aquí</p>
          <p className="text-gray-400 text-sm mb-4">Recorta el segmento que necesitas</p>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Inicio (HH:MM:SS)</label>
              <input type="text" value={start} onChange={e => setStart(e.target.value)} placeholder="00:00:00"
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Fin (HH:MM:SS)</label>
              <input type="text" value={end} onChange={e => setEnd(e.target.value)} placeholder="00:00:30"
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono" />
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {[["30s", "00:00:00", "00:00:30"], ["1min", "00:00:00", "00:01:00"], ["5min", "00:00:00", "00:05:00"]].map(([l, s, e]) => (
              <button key={l} onClick={() => { setStart(s); setEnd(e); }}
                className="text-xs px-3 py-1 rounded-full border border-gray-300 hover:border-red-400 text-gray-600">{l}</button>
            ))}
          </div>

          <FFmpegProgress loading={loading} progress={progress} log={log} label="Recortando video" />
          {!loading && (
            <button onClick={trim} className="btn-primary w-full py-3 rounded-xl font-bold">✂️ Recortar video</button>
          )}
          {result && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="font-medium text-green-800 mb-2">✅ Video recortado</p>
              <video src={result} controls className="w-full rounded-lg mb-3" />
              <a href={result} download={`recortado_${file.name}`}
                className="btn-primary inline-block px-6 py-2 rounded-xl font-medium text-sm">⬇️ Descargar</a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
