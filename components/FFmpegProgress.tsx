"use client";

interface Props {
  loading: boolean;
  progress: number;
  log: string;
  label?: string;
}

export default function FFmpegProgress({ loading, progress, log, label = "Procesando video" }: Props) {
  if (!loading) return null;
  return (
    <div className="text-center py-8 space-y-3">
      <div className="text-4xl animate-pulse">🎬</div>
      <p className="text-gray-700 font-medium">{label}... {progress > 0 ? `${progress}%` : ""}</p>
      {progress > 0 && (
        <div className="w-64 mx-auto bg-gray-200 rounded-full h-3">
          <div className="h-3 rounded-full bg-red-500 transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}
      {log && <p className="text-xs text-gray-400 max-w-xs mx-auto truncate">{log}</p>}
      <p className="text-xs text-gray-400">La primera vez tarda ~10 segundos en cargar el motor</p>
    </div>
  );
}
