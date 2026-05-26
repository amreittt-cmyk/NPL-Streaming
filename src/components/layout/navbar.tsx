import Link from "next/link";
import { Search, ShoppingBag, User2, Video } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";

const navLinks = [
  { href: "/streams", label: "Streams" },
  { href: "/tournaments", label: "Tournaments" },
  { href: "/store", label: "Store" },
  { href: "/search", label: "Search" },
  { href: "/about", label: "About" },
];

export async function Navbar() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-400/60 bg-cyan-400/15 text-cyan-300 shadow-[0_0_30px_rgba(34,211,238,0.35)]">
            <Video className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-black uppercase tracking-[0.28em] text-white">NPL Live</p>
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-300/80">Nepal Premier Cricket League</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-semibold text-slate-300 transition hover:text-cyan-300">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/search" className="rounded-full border border-white/10 bg-white/5 p-3 text-slate-200 transition hover:border-cyan-400/40 hover:text-cyan-300">
            <Search className="h-4 w-4" />
          </Link>
          <Link href="/cart" className="rounded-full border border-white/10 bg-white/5 p-3 text-slate-200 transition hover:border-cyan-400/40 hover:text-cyan-300">
            <ShoppingBag className="h-4 w-4" />
          </Link>
          <Link
            href={user ? (user.role === "ADMIN" ? "/admin" : user.role === "STREAMER" ? "/streamer" : "/profile") : "/auth/login"}
            className="rounded-full border border-white/10 bg-white/5 p-3 text-slate-200 transition hover:border-cyan-400/40 hover:text-cyan-300"
          >
            <User2 className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
