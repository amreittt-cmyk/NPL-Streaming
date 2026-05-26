export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="glass-panel rounded-[2rem] p-8">
        <h1 className="text-4xl font-black uppercase tracking-[0.14em] text-white">Privacy Policy</h1>
        <p className="mt-5 text-lg text-slate-300">
          This demo stores account, order, and stream engagement data in the configured database and uses cookie-based authentication for secure sessions.
        </p>
      </div>
    </div>
  );
}
