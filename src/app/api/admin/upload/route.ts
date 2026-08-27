import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { requireApiSession, jsonError } from "@/lib/api-auth";
import { queryOne } from "@/lib/db";
import type { Media } from "@/lib/types";

const IZIN: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
};
const MAKS_BYTES = 2 * 1024 * 1024; // 2 MB

export async function POST(req: Request) {
  const ctx = await requireApiSession(); // wajib — layout admin tidak melindungi route handler
  if ("error" in ctx) return ctx.error;

  const fd = await req.formData();
  const file = fd.get("file");
  if (!(file instanceof File)) return jsonError(400, "Tidak ada berkas.");
  if (file.size === 0) return jsonError(400, "Berkas kosong.");
  if (file.size > MAKS_BYTES) return jsonError(413, "Maksimal 2 MB.");

  const ext = IZIN[file.type];
  if (!ext) return jsonError(415, "Format tidak didukung. Gunakan JPG, PNG, WebP, atau AVIF.");

  // Nama berkas dari UUID + ekstensi turunan MIME — TIDAK PERNAH dari
  // file.name (dikendalikan klien, bisa berisi ../ atau karakter aneh).
  const nama = `${randomUUID()}${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, nama), Buffer.from(await file.arrayBuffer()));

  const alt = typeof fd.get("alt") === "string" ? String(fd.get("alt")) : null;
  const row = await queryOne<Media>(
    `insert into media (path, alt, mime, bytes) values ($1,$2,$3,$4) returning id, path, alt, mime, bytes`,
    [`/uploads/${nama}`, alt, file.type, file.size],
  );

  return NextResponse.json({ media: row });
}
