import type { Metadata } from "next";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: "Masuk | Rizal Ammar",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center hero-bg px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-white mb-1">Panel Admin</h1>
        <p className="text-sm text-gray-500 mb-8">Masuk untuk mengelola konten amarizzal.dev</p>
        <div className="glass rounded-2xl p-6 border border-[var(--border)]">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
