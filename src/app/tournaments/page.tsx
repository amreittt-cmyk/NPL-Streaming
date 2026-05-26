import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { prisma } from "@/lib/prisma";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatusBadge } from "@/components/ui/status-badge";

export default async function TournamentsPage() {
  const tournaments = await prisma.tournament.findMany({
    include: { teams: true, registrations: true },
    orderBy: [{ status: "asc" }, { startDate: "asc" }],
  });

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Tournament Control" title="League brackets and grassroots entry points" description="Keep up with live championships or sign your squad up for the next event." />
      <div className="grid gap-6 lg:grid-cols-3">
        {tournaments.map((tournament) => (
          <Link key={tournament.id} href={`/tournaments/${tournament.slug}`} className="glass-panel overflow-hidden rounded-[2rem]">
            <div className="relative h-64">
              <Image src={tournament.coverImageUrl} alt={tournament.title} fill className="object-cover" />
            </div>
            <div className="space-y-4 p-5">
              <div className="flex items-center justify-between">
                <StatusBadge label={tournament.status} tone={tournament.status === "LIVE" ? "rose" : tournament.status === "UPCOMING" ? "amber" : "green"} />
                <span className="text-sm text-slate-400">{tournament.registrations.length} registrations</span>
              </div>
              <h2 className="text-2xl font-bold text-white">{tournament.title}</h2>
              <p className="text-slate-400">{tournament.description}</p>
              <div className="flex items-center justify-between text-sm uppercase tracking-[0.18em] text-cyan-300">
                <span>{format(tournament.startDate, "MMM d")} - {format(tournament.endDate, "MMM d")}</span>
                <span>{tournament.location}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
