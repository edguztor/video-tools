"use client";
import { useState, useRef } from "react";
import { useFFmpeg } from "./useFFmpeg";
import FFmpegProgress from "./FFmpegProgress";

type Fmt = "mp4" | "webm" | "mov";

export default function ConvertirTool() {
  const { loading, progress, log, run } = useFFmpeg();
  const [file, setFile] = useState<File | null>(null);
  const [target, setTarget] = useState<Fmt>("mp4");
  const [result, setResult] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const convert = async () => {
    if (!file) return;
    setResult(null);
    const args: Record<Fmt, string[]> = {
      mp4:  ["-i", "input.vid", "-c:v", "libx264", "-c:a", "aac", `output.mp4`],
      webm: ["-i", "input.vid", "-c:v", "libvpx-vp9", "-crf", "30", "-b:v", "0", "-c:a", "libopus", `output.webm`],
      mov:  ["-i", "input.vid", "-c:v", "libx264", "-c:a", "aac", `output.mov`],
    };
    const ext = file.name.split(".").pop() || "mp4";
    const blob = await run(file, `input.vid`, args[target].map(a => a.replace("input.vid", `input.${ext}`)), `output.${target}`);
    setResult(URL.createObjectURL(blob));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <span className="text-sm font-medium text-gray-700 self-center">Convertir a:</span>
        {(["mp4", "webm", "mov"] as Fmt[]).map(f => (
          <button key={f} onClick={() => setTarget(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border-2 transition-colors ${target === f ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-500"}`}>
            .{f.toUpperCase()}
          </button>
        ))}
      </div>

      {!file ? (
        <div className="drop-zone rounded-2xl p-10 text-center cursor-pointer"
          onClick={() => inputRef.current?.click()}>
          <div className="text-5xl mb-3">🔄</div>
          <p className="text-lg font-semibold text-gray-700 mb-1">Arrastra tu video aquí</p>
          <p className="text-gray-400 text-sm mb-4">MP4, MOV, AVI, WebM, MKV</p>
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
          <FFmpegProgress loading={loading} progress={progress} log={log} label={`Convirtiendo a ${target.toUpperCase()}`} />
          {!loading && (
            <button onClick={convert} className="btn-primary w-full py-3 rounded-xl font-bold">🔄 Convertir a {target.toUpperCase()}</button>
          )}
          {result && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="font-medium text-blue-800 mb-2">✅ Conversión completada</p>
              <a href={result} download={`${file.name.replace(/\.[^.]+$/, "")}.${target}`}
                className="btn-primary inline-block px-6 py-2 rounded-xl font-medium text-sm">⬇️ Descargar .{target.toUpperCase()}</a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
