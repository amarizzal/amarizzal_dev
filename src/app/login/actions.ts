"use server";

import { redirect } from "next/navigation";
import { buatSesi, hapusSesi, verifikasiKredensial } from "@/lib/auth";

export type MasukState = { error?: string };

export async function masuk(_prev: MasukState, formData: FormData): Promise<MasukState> {
  const email = String(formData.get("email") ?? "").trim();
  const sandi = String(formData.get("password") ?? "");

  if (!email || !sandi) {
    return { error: "Email dan kata sandi wajib diisi." };
  }

  const user = await verifikasiKredensial(email, sandi);
  if (!user) {
    return { error: "Email atau kata sandi tidak cocok." };
  }

  await buatSesi(user.id);
  redirect("/admin");
}

export async function keluar() {
  await hapusSesi();
  redirect("/login");
}
