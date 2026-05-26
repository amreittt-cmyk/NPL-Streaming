"use client";

import { Heart, UserPlus } from "lucide-react";
import { toast } from "sonner";

export function StreamEngagementButtons({ streamId }: { streamId: string }) {
  async function engage(kind: "like" | "follow") {
    const response = await fetch(`/api/streams/${streamId}/${kind}`, { method: "POST" });
    const payload = await response.json();
    if (!response.ok) {
      toast.error(payload.error || "Action failed");
      return;
    }
    toast.success(payload.message);
  }

  return (
    <div className="flex gap-3">
      <button onClick={() => engage("like")} className="inline-flex items-center gap-2 rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 font-semibold uppercase tracking-[0.2em] text-rose-100">
        <Heart className="h-4 w-4" />
        Like
      </button>
      <button onClick={() => engage("follow")} className="inline-flex items-center gap-2 rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 font-semibold uppercase tracking-[0.2em] text-cyan-100">
        <UserPlus className="h-4 w-4" />
        Follow
      </button>
    </div>
  );
}
