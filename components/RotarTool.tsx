"use client";
import { useState, useRef } from "react";
import { useFFmpeg } from "./useFFmpeg";
import FFmpegProgress from "./FFmpegProgress";

export default function RotarTool() {
  const { loading, progress, log, run } = useFFmpeg();
  const [file, setFile] = useState<File | null>(null);
  const [rotation, setRotation] = useState("1");
  const [result, setResult] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const OPTIONS = [
    { label: "↻ 90° derecha", value: "1" },
    { label: "↺ 90° izquierda", value: "2" },
    { label: "↕ 180°", value: "3" },
    { label: "↔ Voltear horizontal", value: "hflip" },
    { label: "↕ Voltear vertical", value: "vflip" },
  ];

  const rotate = async () => {
    if (!file) return;
    setResult(null);
    let vf = "";
    if (rotation === "1") vf = "transpose=1";
    else if (rotation === "2") vf = "transpose=2";
    else if (rotation === "3") vf = "transpose=1,transpose=1";
    else vf = rotation;
    const blob = await run(file, "input.mp4", ["-i", "input.mp4", "-vf", vf, "-c:a", "copy", "output.mp4"], "output.mp4");
    setResult(URL.createObjectURL(blob));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {OPTIONS.map(o => (
          <button key={o.value} onClick={() => setRotation(o.value)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border-2 transition-colors ${rotation === o.value ? "border-purple-500 bg-purple-50 text-purple-700" : "border-gray-200 text-gray-500"}`}>
            {o.label}
          </button>
        ))}
      </div>

      {!file ? (
        <div className="drop-zone rounded-2xl p-10 text-center cursor-pointer"
          onClick={() => inputRef.current?.click()}>
          <div className="text-5xl mb-3">🔄</div>
          <p className="text-lg font-semibold text-gray-700 mb-1">Arrastra tu video aquí</p>
          <p className="text-gray-400 text-sm mb-4">Rota o voltea tu video</p>
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
          <FFmpegProgress loading={loading} progress={progress} log={log} label="Rotando video" />
          {!loading && (
            <button onClick={rotate} className="btn-primary w-full py-3 rounded-xl font-bold">🔄 Rotar video</button>
          )}
          {result && (
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <p className="font-medium text-purple-800 mb-2">✅ Video rotado</p>
              <a href={result} download={`rotado_${file.name}`}
                className="btn-primary inline-block px-6 py-2 rounded-xl font-medium text-sm">⬇️ Descargar</a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
