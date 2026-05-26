import Link from "next/link";
import { runGlobalSearch } from "@/lib/data";
import { SectionHeading } from "@/components/ui/section-heading";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams;
  const q = params.q || "";
  const results = await runGlobalSearch(q);

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Global Search" title="Find products, streams, tournaments, and creators" description="One search bar across the whole platform." />
      <form className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-5">
        <input name="q" defaultValue={q} placeholder="Search NPL Live" className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" />
      </form>

      {[
        { title: "Products", items: results.products.map((item) => ({ label: item.name, href: `/store/${item.slug}`, meta: item.category })) },
        { title: "Streams", items: results.streams.map((item) => ({ label: item.title, href: `/streams/${item.slug}`, meta: item.streamer.name })) },
        { title: "Tournaments", items: results.tournaments.map((item) => ({ label: item.title, href: `/tournaments/${item.slug}`, meta: item.game })) },
        { title: "Streamers", items: results.streamers.map((item) => ({ label: item.name, href: "/streams", meta: item.bio || "NPL streamer" })) },
      ].map((section) => (
        <div key={section.title} className="glass-panel rounded-[2rem] p-6">
          <h2 className="text-2xl font-black uppercase tracking-[0.16em] text-white">{section.title}</h2>
          <div className="mt-4 space-y-3">
            {section.items.length ? section.items.map((item) => (
              <Link key={item.label + item.meta} href={item.href} className="block rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="font-semibold text-white">{item.label}</p>
                <p className="text-sm text-slate-400">{item.meta}</p>
              </Link>
            )) : <p className="text-slate-400">No matches yet.</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
