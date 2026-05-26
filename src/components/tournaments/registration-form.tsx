"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function TournamentRegistrationForm({ tournamentId }: { tournamentId: string }) {
  const form = useForm({
    defaultValues: {
      teamName: "",
      contactEmail: "",
      managerName: "",
      notes: "",
    },
  });

  async function onSubmit(values: Record<string, string>) {
    const response = await fetch("/api/tournaments/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, tournamentId }),
    });

    const payload = await response.json();
    if (!response.ok) {
      toast.error(payload.error || "Registration failed");
      return;
    }

    toast.success("Team registration submitted");
    form.reset();
  }

  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register("teamName")} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="Team name" />
      <input {...form.register("managerName")} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="Manager name" />
      <input {...form.register("contactEmail")} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="Contact email" type="email" />
      <textarea {...form.register("notes")} className="min-h-28 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="Notes" />
      <button className="rounded-2xl bg-cyan-400 px-4 py-3 font-bold uppercase tracking-[0.2em] text-slate-950">Register team</button>
    </form>
  );
}
