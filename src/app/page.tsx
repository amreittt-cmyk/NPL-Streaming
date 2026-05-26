import Link from "next/link";
import Image from "next/image";
import { Flame, Radio, ShieldCheck, Trophy } from "lucide-react";
import { format } from "date-fns";
import { getHomeData } from "@/lib/data";
import { currency } from "@/lib/utils";
import { AnimatedReveal } from "@/components/animated-reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatusBadge } from "@/components/ui/status-badge";
import { AddToCartButton } from "@/components/store/add-to-cart-button";
import { WishlistToggle } from "@/components/store/wishlist-toggle";

export default async function Home() {
  const { featuredStreams, tournaments, products, streamers } = await getHomeData();
  const hero = featuredStreams[0];

  return (
    <div className="section-grid">
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-20">
        <AnimatedReveal>
          <div className="glass-panel overflow-hidden rounded-[2rem] p-8 shadow-2xl shadow-cyan-500/10">
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge label="Live Highlight" tone="rose" />
              <StatusBadge label={`${hero?.viewerCount.toLocaleString() || "0"} Watching`} tone="cyan" />
            </div>
            <h1 className="mt-6 max-w-3xl text-5xl font-black uppercase leading-tight tracking-[0.12em] text-white md:text-6xl">
              Nepal’s cricket nights, streamed with arena energy.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-slate-300">
              Watch live NPL match coverage, follow top streamers, register squads for tournaments, and shop official merch in one neon-lit platform.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/streams" className="rounded-2xl bg-cyan-400 px-6 py-4 font-bold uppercase tracking-[0.22em] text-slate-950">
                Watch Live
              </Link>
              <Link href="/store" className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 font-bold uppercase tracking-[0.22em] text-white">
                Shop Merch
              </Link>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                { icon: Radio, label: "Live Broadcasts", value: "24/7" },
                { icon: Trophy, label: "Tournament Entries", value: "18 Open" },
                { icon: ShieldCheck, label: "Verified Streamers", value: "12" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <stat.icon className="h-5 w-5 text-cyan-300" />
                  <p className="mt-3 text-sm uppercase tracking-[0.18em] text-slate-400">{stat.label}</p>
                  <p className="text-2xl font-black text-white">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedReveal>

        <AnimatedReveal delay={0.1}>
          <div className="glass-panel rounded-[2rem] p-5">
            {hero && (
              <>
                <div className="relative h-72 overflow-hidden rounded-[1.5rem]">
                  <Image src={hero.thumbnailUrl} alt={hero.title} fill className="object-cover" />
                </div>
                <div className="mt-5 space-y-3">
                  <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">{hero.category}</p>
                  <h2 className="text-2xl font-black uppercase tracking-[0.12em] text-white">{hero.title}</h2>
                  <p className="text-slate-400">{hero.description}</p>
                  <Link href={`/streams/${hero.slug}`} className="inline-flex rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-5 py-3 font-semibold uppercase tracking-[0.2em] text-cyan-100">
                    Enter Stream Arena
                  </Link>
                </div>
              </>
            )}
          </div>
        </AnimatedReveal>
      </section>

      <section className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <SectionHeading eyebrow="Featured Streams" title="Live now and queued next" description="Track live watch parties, studio breakdowns, and behind-the-scenes access from the NPL circuit." />
        <div className="grid gap-6 lg:grid-cols-4">
          {featuredStreams.map((stream, index) => (
            <AnimatedReveal key={stream.id} delay={index * 0.08}>
              <Link href={`/streams/${stream.slug}`} className="glass-panel block overflow-hidden rounded-[2rem]">
                <div className="relative h-56">
                  <Image src={stream.thumbnailUrl} alt={stream.title} fill className="object-cover" />
                </div>
                <div className="space-y-3 p-5">
                  <div className="flex items-center justify-between">
                    <StatusBadge label={stream.status} tone={stream.status === "LIVE" ? "rose" : stream.status === "SCHEDULED" ? "amber" : "green"} />
                    <span className="text-sm text-slate-400">{stream.viewerCount.toLocaleString()} viewers</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{stream.title}</h3>
                  <p className="text-sm uppercase tracking-[0.18em] text-cyan-300">{stream.streamer.name}</p>
                </div>
              </Link>
            </AnimatedReveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <SectionHeading eyebrow="Tournaments" title="Brackets, schedules, and squad registration" description="Follow live championship brackets or register your team for upcoming showcase events." />
        <div className="grid gap-6 lg:grid-cols-3">
          {tournaments.map((tournament, index) => (
            <AnimatedReveal key={tournament.id} delay={index * 0.08}>
              <Link href={`/tournaments/${tournament.slug}`} className="glass-panel block overflow-hidden rounded-[2rem]">
                <div className="relative h-52">
                  <Image src={tournament.coverImageUrl} alt={tournament.title} fill className="object-cover" />
                </div>
                <div className="space-y-3 p-5">
                  <div className="flex items-center justify-between">
                    <StatusBadge label={tournament.status} tone={tournament.status === "LIVE" ? "rose" : tournament.status === "UPCOMING" ? "amber" : "green"} />
                    <span className="text-sm text-slate-400">{tournament.teams.length} featured teams</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{tournament.title}</h3>
                  <p className="text-slate-400">{tournament.prizePool} prize pool</p>
                  <p className="text-sm uppercase tracking-[0.18em] text-cyan-300">{format(tournament.startDate, "MMM d")} - {format(tournament.endDate, "MMM d")}</p>
                </div>
              </Link>
            </AnimatedReveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <SectionHeading eyebrow="Top Streamers" title="Voices driving the matchday atmosphere" description="Follow analysts, commentators, and community hosts bringing league coverage to life." />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {streamers.map((streamer, index) => (
            <AnimatedReveal key={streamer.id} delay={index * 0.08}>
              <div className="glass-panel rounded-[2rem] p-5">
                <div className="relative h-56 overflow-hidden rounded-[1.5rem]">
                  <Image src={streamer.avatarUrl || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80"} alt={streamer.name} fill className="object-cover" />
                </div>
                <h3 className="mt-4 text-2xl font-bold text-white">{streamer.name}</h3>
                <p className="mt-2 text-slate-400">{streamer.bio}</p>
                <div className="mt-4 flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-cyan-300">
                  <Flame className="h-4 w-4" />
                  {streamer.streams.length} listings
                </div>
              </div>
            </AnimatedReveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-16">
        <SectionHeading eyebrow="Latest Products" title="Official merch and creator gear" description="Stock your setup or rep your team with official league apparel and streaming accessories." />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product, index) => (
            <AnimatedReveal key={product.id} delay={index * 0.08}>
              <div className="glass-panel overflow-hidden rounded-[2rem]">
                <div className="relative h-60">
                  <Image src={product.imageUrls[0]} alt={product.name} fill className="object-cover" />
                </div>
                <div className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">{product.name}</h3>
                      <p className="text-sm uppercase tracking-[0.18em] text-cyan-300">{product.category}</p>
                    </div>
                    <WishlistToggle productId={product.id} />
                  </div>
                  <p className="text-slate-400">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-white">{currency(product.price)}</span>
                    <AddToCartButton product={{ id: product.id, name: product.name, slug: product.slug, imageUrl: product.imageUrls[0], price: product.price }} />
                  </div>
                </div>
              </div>
            </AnimatedReveal>
          ))}
        </div>
      </section>
    </div>
  );
}
