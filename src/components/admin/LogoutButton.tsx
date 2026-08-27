"use client";

import { keluar } from "@/app/login/actions";

export default function LogoutButton() {
  return (
    <button
      onClick={() => keluar()}
      className="text-xs text-gray-500 hover:text-white transition-colors"
    >
      Keluar
    </button>
  );
}
