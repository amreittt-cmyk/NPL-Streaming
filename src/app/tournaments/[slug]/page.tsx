import Image from "next/image";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { prisma } from "@/lib/prisma";
import { TournamentRegistrationForm } from "@/components/tournaments/registration-form";
import { StatusBadge } from "@/components/ui/status-badge";

export default async function TournamentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tournament = await prisma.tournament.findUnique({
    where: { slug },
    include: { teams: true, registrations: true },
  });

  if (!tournament) {
    notFound();
  }

  const bracket = tournament.bracket as { rounds?: Array<{ name: string; home: string; away: string; winner?: string | null }> };
  const schedule = tournament.schedule as { matches?: Array<{ date: string; fixture: string; time: string; status: string }> };

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-[2.5rem]">
        <div className="relative h-[420px]">
          <Image src={tournament.coverImageUrl} alt={tournament.title} fill className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-8">
          <StatusBadge label={tournament.status} tone={tournament.status === "LIVE" ? "rose" : tournament.status === "UPCOMING" ? "amber" : "green"} />
          <h1 className="mt-4 text-5xl font-black uppercase tracking-[0.12em] text-white">{tournament.title}</h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-200">{tournament.description}</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
        <div className="space-y-6">
          <div className="glass-panel rounded-[2rem] p-6">
            <h2 className="text-2xl font-black uppercase tracking-[0.16em] text-white">Tournament Bracket</h2>
            <div className="mt-5 grid gap-4">
              {bracket.rounds?.map((round) => (
                <div key={round.name} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm uppercase tracking-[0.18em] text-cyan-300">{round.name}</p>
                  <p className="mt-2 text-lg font-bold text-white">{round.home} vs {round.away}</p>
                  <p className="text-slate-400">Winner: {round.winner || "TBD"}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-[2rem] p-6">
            <h2 className="text-2xl font-black uppercase tracking-[0.16em] text-white">Match Schedule</h2>
            <div className="mt-5 space-y-3">
              {schedule.matches?.map((match) => (
                <div key={`${match.date}-${match.fixture}`} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm uppercase tracking-[0.18em] text-cyan-300">{match.date} • {match.time}</p>
                  <p className="mt-2 text-lg font-bold text-white">{match.fixture}</p>
                  <p className="text-slate-400">{match.status}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel rounded-[2rem] p-6">
            <h2 className="text-2xl font-black uppercase tracking-[0.16em] text-white">Teams</h2>
            <div className="mt-5 space-y-3">
              {tournament.teams.map((team) => (
                <div key={team.id} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-2xl">
                    <Image src={team.logoUrl} alt={team.name} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white">{team.name}</p>
                    <p className="text-sm text-slate-400">Captain {team.captain} • {team.region}</p>
                    <p className="text-sm uppercase tracking-[0.18em] text-cyan-300">{team.wins}-{team.losses}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-[2rem] p-6">
            <h2 className="text-2xl font-black uppercase tracking-[0.16em] text-white">Register Team</h2>
            <p className="mt-3 text-slate-400">
              Event window: {format(tournament.startDate, "PPP")} - {format(tournament.endDate, "PPP")}
            </p>
            <div className="mt-5">
              <TournamentRegistrationForm tournamentId={tournament.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
