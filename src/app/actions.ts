"use server";

import { headers } from "next/headers";
import { query, queryOne } from "@/lib/db";

export type KirimPesanState = { ok?: boolean; error?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Server Action publik untuk form kontak — TIDAK butuh sesi (siapa saja
 * boleh mengirim). Menggantikan simulasi setTimeout(1200) yang lama di
 * Contact.tsx, yang sebenarnya tidak pernah mengirim apa pun ke mana pun.
 */
export async function kirimPesan(
  _prev: KirimPesanState,
  formData: FormData,
): Promise<KirimPesanState> {
  const nama = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const subjek = String(formData.get("subject") ?? "").trim() || null;
  const pesan = String(formData.get("message") ?? "").trim();
  // Honeypot: field tersembunyi yang manusia tidak pernah mengisi, tapi bot
  // pengisi-form-otomatis biasanya mengisi semua field yang ada.
  const jebakan = String(formData.get("website") ?? "").trim();

  if (jebakan) return { ok: true }; // pura-pura sukses, diam-diam dibuang

  if (!nama || !email || !pesan) {
    return { error: "Nama, email, dan pesan wajib diisi." };
  }
  if (!EMAIL_RE.test(email)) {
    return { error: "Format email tidak valid." };
  }
  if (pesan.length > 5000) {
    return { error: "Pesan terlalu panjang (maksimal 5000 karakter)." };
  }

  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || null;
  const userAgent = h.get("user-agent");

  if (ip) {
    const cek = await queryOne<{ n: number }>(
      `select count(*)::int as n from contact_messages
        where ip = $1 and created_at > now() - interval '1 hour'`,
      [ip],
    );
    if (cek && cek.n >= 5) {
      return { error: "Terlalu banyak pesan dari alamat ini. Coba lagi nanti." };
    }
  }

  try {
    await query(
      `insert into contact_messages (nama, email, subjek, pesan, ip, user_agent)
       values ($1,$2,$3,$4,$5,$6)`,
      [nama, email, subjek, pesan, ip, userAgent],
    );
  } catch (e) {
    console.error("[actions] kirimPesan gagal:", e);
    return { error: "Gagal mengirim pesan. Coba lagi sebentar lagi." };
  }

  return { ok: true };
}
