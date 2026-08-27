import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Next.js 16: middleware.ts sudah tidak ada, diganti proxy.ts.
// Ini HANYA pemeriksaan UX cepat (tanda tangan JWT, tanpa query DB) — bukan
// otorisasi sesungguhnya. Docs Next 16 sendiri: "Proxy is not intended for
// ... full session management or authorization solution." Penjagaan
// sungguhan ada di dua tempat lain:
//   - src/app/admin/layout.tsx  -> requireSession() (query DB, cek aktif)
//   - setiap Server Action di src/app/admin/actions.ts -> requireSession()
//     di baris pertama, KARENA Server Action tidak melewati layout dan bisa
//     di-POST langsung.
const COOKIE = "amz_session";
const PUBLIC_PATHS = ["/login", "/api"];

async function sesiValid(token: string | undefined) {
  if (!token || !process.env.SESSION_SECRET) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(process.env.SESSION_SECRET));
    return true;
  } catch {
    return false;
  }
}

export default async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (!path.startsWith("/admin") && path !== "/login") {
    return NextResponse.next();
  }

  const isPublic = PUBLIC_PATHS.some((p) => path.startsWith(p));
  const masuk = await sesiValid(request.cookies.get(COOKIE)?.value);

  if (!masuk && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  if (masuk && path === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
