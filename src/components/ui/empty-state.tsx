export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="glass-panel rounded-3xl border border-dashed p-10 text-center">
      <h3 className="text-2xl font-black uppercase tracking-[0.18em] text-white">{title}</h3>
      <p className="mt-3 text-slate-400">{description}</p>
    </div>
  );
}
