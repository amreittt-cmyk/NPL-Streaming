export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">{eyebrow}</p>
      <h2 className="text-3xl font-black uppercase tracking-[0.12em] text-white md:text-4xl">{title}</h2>
      <p className="max-w-2xl text-base text-slate-400 md:text-lg">{description}</p>
    </div>
  );
}
