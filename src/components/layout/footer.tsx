import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.5fr_1fr_1fr] lg:px-8">
        <div className="space-y-4">
          <h3 className="text-2xl font-black uppercase tracking-[0.22em] text-white">NPL Live</h3>
          <p className="max-w-lg text-sm text-slate-400">
            Live streams, tournament coverage, and official merch for Nepal Premier Cricket League fans.
          </p>
        </div>
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">Explore</p>
          <div className="space-y-2 text-sm text-slate-400">
            <Link className="block hover:text-white" href="/about">About Us</Link>
            <Link className="block hover:text-white" href="/contact">Contact Us</Link>
            <Link className="block hover:text-white" href="/privacy">Privacy Policy</Link>
            <Link className="block hover:text-white" href="/terms">Terms</Link>
          </div>
        </div>
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">Social</p>
          <div className="space-y-2 text-sm text-slate-400">
            <a className="block hover:text-white" href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
            <a className="block hover:text-white" href="https://youtube.com" target="_blank" rel="noreferrer">YouTube</a>
            <a className="block hover:text-white" href="https://x.com" target="_blank" rel="noreferrer">X / Twitter</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
