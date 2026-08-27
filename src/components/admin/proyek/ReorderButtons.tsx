"use client";

import { useActionState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { geserBagian } from "@/app/admin/actions";

export function ReorderButtons({ id }: { id: string }) {
  const [, naikAction] = useActionState(geserBagian, {});
  const [, turunAction] = useActionState(geserBagian, {});

  return (
    <div className="flex flex-col gap-0.5">
      <form action={naikAction}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="arah" value="naik" />
        <button type="submit" title="Naikkan" className="p-1 rounded text-gray-500 hover:text-white hover:bg-white/5">
          <ChevronUp size={14} />
        </button>
      </form>
      <form action={turunAction}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="arah" value="turun" />
        <button type="submit" title="Turunkan" className="p-1 rounded text-gray-500 hover:text-white hover:bg-white/5">
          <ChevronDown size={14} />
        </button>
      </form>
    </div>
  );
}
