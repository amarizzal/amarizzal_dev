import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    // Optimizer Next butuh sharp di runtime; sharp memakan puluhan MB per
    // proses resize. Di droplet 512MB berisi beberapa container, itu jalur
    // tercepat menuju OOM. Gambar unggahan sudah dibatasi 2MB di route
    // /api/admin/upload dan dipakai apa adanya. remotePatterns/localPatterns
    // tidak diperlukan — semua gambar same-origin (/uploads/...), tanpa
    // query string pada src gambar lokal.
    unoptimized: true,
  },
};

export default nextConfig;
