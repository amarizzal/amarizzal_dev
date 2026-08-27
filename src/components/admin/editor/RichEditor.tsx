"use client";

import dynamic from "next/dynamic";

// ssr:false hanya sah di dalam Client Component (React 19 / Next 16). Tiptap
// menyentuh `document` saat init, jadi ini wajib, bukan optimasi. Ini juga
// yang menjaga @tiptap/* keluar dari bundle publik — hanya di-load lewat
// route /admin/** yang sudah force-dynamic dan tidak pernah diakses publik.
const EditorInti = dynamic(() => import("./EditorInti"), {
  ssr: false,
  loading: () => <div className="h-64 animate-pulse rounded-xl bg-[var(--muted)]" />,
});

export default function RichEditor(props: { name: string; defaultValue?: string }) {
  return <EditorInti {...props} />;
}
