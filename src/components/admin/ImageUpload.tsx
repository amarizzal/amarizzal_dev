"use client";

import { useRef, useState } from "react";
import { Upload, Loader2 } from "lucide-react";

/**
 * Upload gambar tunggal (cover project/post). Mengunggah lewat
 * /api/admin/upload, lalu mengisi <input type="hidden" name={fieldName}>
 * dengan id media yang dikembalikan — supaya ikut jalur FormData +
 * useActionState yang sama seperti field lain, tanpa API JSON terpisah.
 */
export default function ImageUpload({
  fieldName,
  defaultPath,
}: {
  fieldName: string;
  defaultPath?: string | null;
}) {
  const [preview, setPreview] = useState<string | null>(defaultPath ?? null);
  const [mediaId, setMediaId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setLoading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Gagal mengunggah.");
      setMediaId(data.media.id);
      setPreview(data.media.path);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal mengunggah.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <input type="hidden" name={fieldName} value={mediaId} />
      <div className="flex items-center gap-3">
        {preview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className="w-16 h-16 rounded-lg object-cover border border-[var(--border)]" />
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold glass border border-[var(--border)] text-gray-300 hover:text-white disabled:opacity-60"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          {preview ? "Ganti gambar" : "Unggah gambar"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      <p className="text-xs text-gray-600">JPG/PNG/WebP/AVIF, maksimal 2 MB.</p>
    </div>
  );
}
