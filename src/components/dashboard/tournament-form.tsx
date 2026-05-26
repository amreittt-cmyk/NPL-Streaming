"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const defaultBracket = JSON.stringify(
  {
    rounds: [{ name: "Quarterfinal", home: "Team A", away: "Team B", winner: null }],
  },
  null,
  2,
);

const defaultSchedule = JSON.stringify(
  {
    matches: [{ date: "2026-06-01", fixture: "Team A vs Team B", time: "7:00 PM", status: "Upcoming" }],
  },
  null,
  2,
);

export function TournamentForm() {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      game: "Cricket",
      status: "UPCOMING",
      coverImageUrl: "",
      prizePool: "$25,000",
      location: "Kathmandu",
      startDate: "",
      endDate: "",
      bracket: defaultBracket,
      schedule: defaultSchedule,
    },
  });

  async function onSubmit(values: Record<string, string>) {
    const response = await fetch("/api/tournaments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        bracket: JSON.parse(values.bracket),
        schedule: JSON.parse(values.schedule),
      }),
    });
    const payload = await response.json();
    if (!response.ok) {
      toast.error(payload.error || "Could not save tournament");
      return;
    }
    toast.success("Tournament created");
    form.reset();
    router.refresh();
  }

  return (
    <form className="grid gap-3" onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register("title")} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="Tournament title" />
      <textarea {...form.register("description")} className="min-h-28 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="Description" />
      <input {...form.register("coverImageUrl")} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="Cover image URL" />
      <div className="grid gap-3 sm:grid-cols-2">
        <input {...form.register("prizePool")} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="Prize pool" />
        <input {...form.register("location")} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="Location" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <input {...form.register("startDate")} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" type="date" />
        <input {...form.register("endDate")} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" type="date" />
      </div>
      <textarea {...form.register("bracket")} className="min-h-28 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 font-mono text-sm" />
      <textarea {...form.register("schedule")} className="min-h-28 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 font-mono text-sm" />
      <button className="rounded-2xl bg-cyan-400 px-4 py-3 font-bold uppercase tracking-[0.2em] text-slate-950">Add tournament</button>
    </form>
  );
}
