"use client";

import { useActionState } from "react";
import { masuk, type MasukState } from "./actions";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState<MasukState, FormData>(masuk, {});

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs text-gray-500 font-medium">Email</label>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-[var(--border)] text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#6366f1]/50 transition-colors"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-xs text-gray-500 font-medium">Kata Sandi</label>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-[var(--border)] text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#6366f1]/50 transition-colors"
        />
      </div>

      {state.error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full btn-primary py-3 rounded-xl font-semibold text-sm disabled:opacity-60"
      >
        {pending ? "Memeriksa..." : "Masuk"}
      </button>
    </form>
  );
}
