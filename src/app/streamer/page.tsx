import { getCurrentUser } from "@/lib/auth";
import { getStreamerOverview } from "@/lib/data";
import { redirect } from "next/navigation";
import { StreamForm } from "@/components/dashboard/stream-form";
import { ProfileAssetsForm } from "@/components/dashboard/profile-assets-form";

export default async function StreamerPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/login");
  }

  const { streams, messages } = await getStreamerOverview(user.id);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Streamer Dashboard</p>
        <h1 className="mt-3 text-4xl font-black uppercase tracking-[0.14em] text-white">Manage your channel</h1>
      </div>

      <div className="grid gap-8 xl:grid-cols-2">
        <div className="glass-panel rounded-[2rem] p-6">
          <h2 className="text-2xl font-black uppercase tracking-[0.16em] text-white">Create Stream Listing</h2>
          <div className="mt-5"><StreamForm /></div>
        </div>
        <div className="glass-panel rounded-[2rem] p-6">
          <h2 className="text-2xl font-black uppercase tracking-[0.16em] text-white">Profile and Banner</h2>
          <div className="mt-5"><ProfileAssetsForm defaultAvatar={user.avatarUrl} defaultBanner={user.bannerUrl} /></div>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="glass-panel rounded-[2rem] p-6">
          <h2 className="text-2xl font-black uppercase tracking-[0.16em] text-white">Your Streams</h2>
          <div className="mt-4 space-y-3">
            {streams.map((stream) => (
              <div key={stream.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="font-semibold text-white">{stream.title}</p>
                <p className="text-sm text-slate-400">{stream.category} • {stream.status}</p>
                <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">
                  {stream._count.follows} followers • {stream._count.likes} likes • {stream._count.chatMessages} messages
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-panel rounded-[2rem] p-6">
          <h2 className="text-2xl font-black uppercase tracking-[0.16em] text-white">Recent Chat Messages</h2>
          <div className="mt-4 space-y-3">
            {messages.map((message) => (
              <div key={message.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="font-semibold text-white">{message.user.name}</p>
                <p className="text-sm text-slate-400">{message.stream.title}</p>
                <p className="mt-2 text-slate-300">{message.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
