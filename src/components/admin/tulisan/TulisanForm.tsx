"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { simpanTulisan } from "@/app/admin/actions";
import ImageUpload from "@/components/admin/ImageUpload";
import RichEditor from "@/components/admin/editor/RichEditor";
import type { Post } from "@/lib/types";

export default function TulisanForm({ post }: { post?: Post }) {
  const [state, formAction, pending] = useActionState(simpanTulisan, {});
  const router = useRouter();

  useEffect(() => {
    if (state.ok && state.id && !post) {
      router.push(`/admin/tulisan/${state.id}`);
    }
  }, [state.ok, state.id, post, router]);

  return (
    <form action={formAction} className="space-y-5 max-w-3xl">
      <input type="hidden" name="id" value={post?.id ?? ""} />

      <div className="space-y-1.5">
        <label className="text-xs text-gray-500 font-medium">Gambar sampul</label>
        <ImageUpload fieldName="cover_media_id" defaultPath={post?.cover_path} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs text-gray-500 font-medium">Judul</label>
          <input
            name="title"
            defaultValue={post?.title}
            required
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-[var(--border)] text-white text-sm focus:outline-none focus:border-[#6366f1]/50"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs text-gray-500 font-medium">Slug (kosongkan untuk otomatis)</label>
          <input
            name="slug"
            defaultValue={post?.slug}
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-[var(--border)] text-white text-sm font-mono focus:outline-none focus:border-[#6366f1]/50"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs text-gray-500 font-medium">Ringkasan (excerpt)</label>
        <textarea
          name="excerpt"
          defaultValue={post?.excerpt ?? ""}
          rows={2}
          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-[var(--border)] text-white text-sm resize-none focus:outline-none focus:border-[#6366f1]/50"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs text-gray-500 font-medium">Isi tulisan</label>
        <RichEditor name="body_html" defaultValue={post?.body_html ?? ""} />
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs text-gray-500 font-medium">Tag (pisahkan koma)</label>
          <input
            name="tags"
            defaultValue={post?.tags.join(", ")}
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-[var(--border)] text-white text-sm focus:outline-none focus:border-[#6366f1]/50"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs text-gray-500 font-medium">Status</label>
          <select
            name="status"
            defaultValue={post?.status ?? "draft"}
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-[var(--border)] text-white text-sm focus:outline-none focus:border-[#6366f1]/50"
          >
            <option value="draft">Draft</option>
            <option value="published">Terbitkan</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs text-gray-500 font-medium">Menit baca (kosongkan untuk otomatis)</label>
          <input
            name="reading_minutes"
            type="number"
            defaultValue={post?.reading_minutes}
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-[var(--border)] text-white text-sm focus:outline-none focus:border-[#6366f1]/50"
          />
        </div>
      </div>

      {state.error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn-primary px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60"
      >
        {pending ? "Menyimpan..." : "Simpan"}
      </button>
    </form>
  );
}
