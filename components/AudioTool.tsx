"use client";
import { useState, useRef } from "react";
import { useFFmpeg } from "./useFFmpeg";
import FFmpegProgress from "./FFmpegProgress";

export default function AudioTool() {
  const { loading, progress, log, run } = useFFmpeg();
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<"mp3" | "wav">("mp3");
  const [result, setResult] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const extract = async () => {
    if (!file) return;
    setResult(null);
    const outName = `audio.${format}`;
    const args = format === "mp3"
      ? ["-i", "input.mp4", "-q:a", "2", "-map", "a", outName]
      : ["-i", "input.mp4", "-map", "a", "-c:a", "pcm_s16le", outName];
    const blob = await run(file, "input.mp4", args, outName);
    setResult(URL.createObjectURL(blob));
  };

  const fmt = (b: number) => `${(b / 1024 / 1024).toFixed(1)} MB`;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(["mp3", "wav"] as const).map(f => (
          <button key={f} onClick={() => setFormat(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border-2 transition-colors ${format === f ? "border-yellow-500 bg-yellow-50 text-yellow-700" : "border-gray-200 text-gray-500"}`}>
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {!file ? (
        <div className="drop-zone rounded-2xl p-10 text-center cursor-pointer"
          onClick={() => inputRef.current?.click()}>
          <div className="text-5xl mb-3">🎵</div>
          <p className="text-lg font-semibold text-gray-700 mb-1">Arrastra tu video aquí</p>
          <p className="text-gray-400 text-sm mb-4">Extrae el audio como {format.toUpperCase()}</p>
          <button className="btn-primary px-6 py-2 rounded-full font-medium text-sm" type="button">Seleccionar video</button>
          <input ref={inputRef} type="file" accept="video/*" className="hidden"
            onChange={e => { if (e.target.files?.[0]) setFile(e.target.files[0]); }} />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
            <span className="text-2xl">🎥</span>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 text-sm truncate">{file.name}</p>
              <p className="text-xs text-gray-500">{fmt(file.size)}</p>
            </div>
            <button onClick={() => { setFile(null); setResult(null); }} className="text-gray-400 hover:text-red-500">✕</button>
          </div>

          <FFmpegProgress loading={loading} progress={progress} log={log} label={`Extrayendo audio ${format.toUpperCase()}`} />
          {!loading && (
            <button onClick={extract} className="btn-primary w-full py-3 rounded-xl font-bold">🎵 Extraer audio {format.toUpperCase()}</button>
          )}
          {result && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="font-medium text-yellow-800 mb-2">✅ Audio extraído</p>
              <audio src={result} controls className="w-full mb-3" />
              <a href={result} download={`${file.name.replace(/\.[^.]+$/, "")}.${format}`}
                className="btn-primary inline-block px-6 py-2 rounded-xl font-medium text-sm">⬇️ Descargar {format.toUpperCase()}</a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
