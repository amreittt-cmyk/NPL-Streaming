import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/ui/status-badge";
import { SectionHeading } from "@/components/ui/section-heading";

export default async function StreamsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const streams = await prisma.stream.findMany({
    where: {
      title: params.q ? { contains: params.q, mode: "insensitive" } : undefined,
      status: params.status && params.status !== "ALL" ? (params.status as "LIVE" | "SCHEDULED" | "ENDED") : undefined,
    },
    include: { streamer: { select: { name: true } }, _count: { select: { follows: true, likes: true } } },
    orderBy: params.sort === "popular" ? { viewerCount: "desc" } : { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Streaming Hub" title="Browse live, scheduled, and replay-ready streams" description="Filter by popularity and status to jump into the action faster." />
      <form className="grid gap-3 rounded-[2rem] border border-white/10 bg-slate-900/70 p-5 md:grid-cols-[1fr_auto_auto_auto]">
        <input name="q" defaultValue={params.q} placeholder="Search by stream or game" className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" />
        <select name="status" defaultValue={params.status || "ALL"} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3">
          <option value="ALL">All statuses</option>
          <option value="LIVE">Live</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="ENDED">Ended</option>
        </select>
        <select name="sort" defaultValue={params.sort || "latest"} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3">
          <option value="latest">Latest</option>
          <option value="popular">Popularity</option>
        </select>
        <button className="rounded-2xl bg-cyan-400 px-4 py-3 font-bold uppercase tracking-[0.2em] text-slate-950">Filter</button>
      </form>

      <div className="grid gap-6 lg:grid-cols-3">
        {streams.map((stream) => (
          <Link key={stream.id} href={`/streams/${stream.slug}`} className="glass-panel overflow-hidden rounded-[2rem]">
            <div className="relative h-56">
              <Image src={stream.thumbnailUrl} alt={stream.title} fill className="object-cover" />
            </div>
            <div className="space-y-3 p-5">
              <div className="flex items-center justify-between">
                <StatusBadge label={stream.status} tone={stream.status === "LIVE" ? "rose" : stream.status === "SCHEDULED" ? "amber" : "green"} />
                <span className="text-sm text-slate-400">{stream.viewerCount.toLocaleString()} viewers</span>
              </div>
              <h2 className="text-2xl font-bold text-white">{stream.title}</h2>
              <p className="text-slate-400">{stream.description}</p>
              <div className="flex items-center justify-between text-sm uppercase tracking-[0.18em] text-cyan-300">
                <span>{stream.streamer.name}</span>
                <span>{stream._count.follows} follows</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
