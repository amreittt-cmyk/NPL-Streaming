"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function StreamForm() {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      game: "Cricket",
      category: "Live Match",
      status: "SCHEDULED",
      viewerCount: 0,
      thumbnailUrl: "",
      streamUrl: "https://www.youtube.com/embed/aqz-KE-bpKQ",
      tags: "npl,cricket,live",
      scheduledFor: "",
    },
  });

  async function onSubmit(values: Record<string, string | number>) {
    const response = await fetch("/api/streams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        viewerCount: Number(values.viewerCount),
        tags: String(values.tags).split(",").map((entry) => entry.trim()),
      }),
    });
    const payload = await response.json();
    if (!response.ok) {
      toast.error(payload.error || "Could not save stream");
      return;
    }
    toast.success("Stream saved");
    form.reset();
    router.refresh();
  }

  return (
    <form className="grid gap-3" onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register("title")} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="Stream title" />
      <textarea {...form.register("description")} className="min-h-28 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="Description" />
      <div className="grid gap-3 sm:grid-cols-2">
        <input {...form.register("game")} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="Game" />
        <input {...form.register("category")} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="Category" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <input {...form.register("thumbnailUrl")} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="Thumbnail URL" />
        <input {...form.register("streamUrl")} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="Stream URL" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <input {...form.register("tags")} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="tag1,tag2" />
        <input {...form.register("scheduledFor")} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" type="datetime-local" />
      </div>
      <button className="rounded-2xl bg-cyan-400 px-4 py-3 font-bold uppercase tracking-[0.2em] text-slate-950">Save stream</button>
    </form>
  );
}
