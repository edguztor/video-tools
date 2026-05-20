"use client";
import { useState, useRef } from "react";
import { useFFmpeg } from "./useFFmpeg";
import FFmpegProgress from "./FFmpegProgress";

export default function SilenciarTool() {
  const { loading, progress, log, run } = useFFmpeg();
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const mute = async () => {
    if (!file) return;
    setResult(null);
    const blob = await run(file, "input.mp4", ["-i", "input.mp4", "-c:v", "copy", "-an", "output.mp4"], "output.mp4");
    setResult(URL.createObjectURL(blob));
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-600">
        🔇 Elimina completamente el audio del video manteniendo la calidad visual intacta.
      </div>
      {!file ? (
        <div className="drop-zone rounded-2xl p-10 text-center cursor-pointer"
          onClick={() => inputRef.current?.click()}>
          <div className="text-5xl mb-3">🔇</div>
          <p className="text-lg font-semibold text-gray-700 mb-1">Arrastra tu video aquí</p>
          <p className="text-gray-400 text-sm mb-4">Se eliminará el audio completamente</p>
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
          <FFmpegProgress loading={loading} progress={progress} log={log} label="Silenciando video" />
          {!loading && (
            <button onClick={mute} className="btn-primary w-full py-3 rounded-xl font-bold">🔇 Silenciar video</button>
          )}
          {result && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <p className="font-medium text-gray-800 mb-2">✅ Audio eliminado</p>
              <a href={result} download={`silenciado_${file.name}`}
                className="btn-primary inline-block px-6 py-2 rounded-xl font-medium text-sm">⬇️ Descargar video sin audio</a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
