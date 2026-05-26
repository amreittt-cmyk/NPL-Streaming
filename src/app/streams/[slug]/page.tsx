import Image from "next/image";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { prisma } from "@/lib/prisma";
import { StreamEngagementButtons } from "@/components/streams/engagement-buttons";
import { ChatPanel } from "@/components/streams/chat-panel";
import { StatusBadge } from "@/components/ui/status-badge";

export default async function StreamDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const stream = await prisma.stream.findUnique({
    where: { slug },
    include: {
      streamer: true,
      chatMessages: {
        orderBy: { createdAt: "asc" },
        include: { user: { select: { name: true } } },
      },
      vods: true,
      _count: { select: { follows: true, likes: true } },
    },
  });

  if (!stream) {
    notFound();
  }

  const related = await prisma.stream.findMany({
    where: {
      streamerId: stream.streamerId,
      NOT: { id: stream.id },
    },
    take: 3,
  });

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-6">
          <div className="glass-panel overflow-hidden rounded-[2rem] p-4">
            <div className="aspect-video overflow-hidden rounded-[1.5rem]">
              <iframe src={stream.streamUrl} title={stream.title} className="h-full w-full" allowFullScreen />
            </div>
          </div>
          <div className="glass-panel rounded-[2rem] p-6">
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge label={stream.status} tone={stream.status === "LIVE" ? "rose" : stream.status === "SCHEDULED" ? "amber" : "green"} />
              <StatusBadge label={`${stream.viewerCount.toLocaleString()} viewers`} tone="cyan" />
            </div>
            <h1 className="mt-5 text-4xl font-black uppercase tracking-[0.12em] text-white">{stream.title}</h1>
            <p className="mt-4 text-lg text-slate-300">{stream.description}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {stream.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-300">
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-6 text-sm uppercase tracking-[0.2em] text-slate-400">
              <span>{stream.category}</span>
              <span>{stream.game}</span>
              <span>{stream._count.likes} likes</span>
              <span>{stream._count.follows} followers</span>
            </div>
            <div className="mt-6">
              <StreamEngagementButtons streamId={stream.id} />
            </div>
          </div>

          <div className="glass-panel rounded-[2rem] p-6">
            <h2 className="text-2xl font-black uppercase tracking-[0.16em] text-white">Past Broadcasts</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {stream.vods.map((vod) => (
                <div key={vod.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="relative h-44 overflow-hidden rounded-2xl">
                    <Image src={vod.thumbnail} alt={vod.title} fill className="object-cover" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-white">{vod.title}</h3>
                  <p className="text-sm uppercase tracking-[0.18em] text-cyan-300">{vod.duration} • {vod.views.toLocaleString()} views</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel rounded-[2rem] p-6">
            <h2 className="text-2xl font-black uppercase tracking-[0.16em] text-white">Streamer</h2>
            <div className="mt-5 flex items-center gap-4">
              <div className="relative h-20 w-20 overflow-hidden rounded-2xl">
                <Image src={stream.streamer.avatarUrl || stream.thumbnailUrl} alt={stream.streamer.name} fill className="object-cover" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{stream.streamer.name}</h3>
                <p className="text-slate-400">{stream.streamer.bio}</p>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-[2rem] p-6">
            <h2 className="text-2xl font-black uppercase tracking-[0.16em] text-white">Stream Schedule</h2>
            <p className="mt-4 text-slate-300">
              {stream.scheduledFor ? format(stream.scheduledFor, "PPP p") : "Currently live or on-demand"}
            </p>
          </div>

          <ChatPanel streamId={stream.id} initialMessages={stream.chatMessages} />

          <div className="glass-panel rounded-[2rem] p-6">
            <h2 className="text-2xl font-black uppercase tracking-[0.16em] text-white">More From This Channel</h2>
            <div className="mt-4 space-y-3">
              {related.map((entry) => (
                <a key={entry.id} href={`/streams/${entry.slug}`} className="block rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="font-semibold text-white">{entry.title}</p>
                  <p className="text-sm text-slate-400">{entry.category}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
