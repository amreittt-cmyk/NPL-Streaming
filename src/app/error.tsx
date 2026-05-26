"use client";

export default function Error() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-4xl font-black uppercase tracking-[0.16em] text-white">Something Broke</h1>
      <p className="mt-4 text-slate-400">The page hit an error. Refresh the app or check the backend configuration.</p>
    </div>
  );
}
