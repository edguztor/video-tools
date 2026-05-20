import { useRef, useState, useCallback } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

export function useFFmpeg() {
  const ffmpegRef = useRef<FFmpeg | null>(null);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [log, setLog] = useState("");

  const load = useCallback(async () => {
    if (ready) return;
    setLoading(true);
    setLog("Cargando motor de video...");
    const ffmpeg = new FFmpeg();
    ffmpeg.on("progress", ({ progress: p }) => setProgress(Math.round(p * 100)));
    ffmpeg.on("log", ({ message }) => setLog(message));
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
    });
    ffmpegRef.current = ffmpeg;
    setReady(true);
    setLoading(false);
    setLog("");
  }, [ready]);

  const run = useCallback(async (
    inputFile: File,
    inputName: string,
    args: string[],
    outputName: string
  ): Promise<Blob> => {
    await load();
    const ffmpeg = ffmpegRef.current!;
    setProgress(0);
    await ffmpeg.writeFile(inputName, await fetchFile(inputFile));
    await ffmpeg.exec(args);
    const data = await ffmpeg.readFile(outputName);
    await ffmpeg.deleteFile(inputName);
    try { await ffmpeg.deleteFile(outputName); } catch { /* ok */ }
    const blobData = typeof data === "string" ? data : (data as Uint8Array<ArrayBuffer>);
    return new Blob([blobData], { type: getType(outputName) });
  }, [load]);

  return { ready, loading, progress, log, load, run };
}

function getType(name: string): string {
  if (name.endsWith(".mp4")) return "video/mp4";
  if (name.endsWith(".webm")) return "video/webm";
  if (name.endsWith(".gif")) return "image/gif";
  if (name.endsWith(".mp3")) return "audio/mpeg";
  if (name.endsWith(".wav")) return "audio/wav";
  return "application/octet-stream";
}
