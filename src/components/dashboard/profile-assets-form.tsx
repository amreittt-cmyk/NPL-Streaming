"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function ProfileAssetsForm({ defaultAvatar, defaultBanner }: { defaultAvatar?: string | null; defaultBanner?: string | null }) {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      avatarUrl: defaultAvatar || "",
      bannerUrl: defaultBanner || "",
      bio: "",
    },
  });

  async function onSubmit(values: Record<string, string>) {
    const response = await fetch("/api/auth/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const payload = await response.json();
    if (!response.ok) {
      toast.error(payload.error || "Profile update failed");
      return;
    }

    toast.success("Profile updated");
    router.refresh();
  }

  return (
    <form className="grid gap-3" onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register("avatarUrl")} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="Avatar image URL" />
      <input {...form.register("bannerUrl")} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="Banner image URL" />
      <textarea {...form.register("bio")} className="min-h-28 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="Short bio" />
      <button className="rounded-2xl bg-cyan-400 px-4 py-3 font-bold uppercase tracking-[0.2em] text-slate-950">Update profile</button>
    </form>
  );
}
