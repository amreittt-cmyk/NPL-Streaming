import { cn } from "@/lib/utils";

export function StatusBadge({ label, tone = "cyan" }: { label: string; tone?: "cyan" | "green" | "amber" | "rose" }) {
  const tones: Record<string, string> = {
    cyan: "border-cyan-400/30 bg-cyan-400/10 text-cyan-200",
    green: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
    amber: "border-amber-400/30 bg-amber-400/10 text-amber-200",
    rose: "border-rose-400/30 bg-rose-400/10 text-rose-200",
  };

  return (
    <span className={cn("inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]", tones[tone])}>
      {label}
    </span>
  );
}
