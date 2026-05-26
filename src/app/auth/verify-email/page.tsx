import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <div className="glass-panel rounded-[2rem] p-10">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Email Verification</p>
        <h1 className="mt-3 text-4xl font-black uppercase tracking-[0.14em] text-white">Use the API verification route</h1>
        <p className="mt-4 text-slate-400">
          This demo uses token-based verification via the signup response. Open the link returned from the API or visit the login page after verification.
        </p>
        <Link href="/auth/login" className="mt-8 inline-flex rounded-2xl bg-cyan-400 px-6 py-4 font-bold uppercase tracking-[0.22em] text-slate-950">
          Go to login
        </Link>
      </div>
    </div>
  );
}
