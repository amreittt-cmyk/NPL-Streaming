"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function LogoutButton() {
  const router = useRouter();

  async function logout() {
    const response = await fetch("/api/auth/logout", { method: "POST" });
    const payload = await response.json();
    if (!response.ok) {
      toast.error(payload.error || "Logout failed");
      return;
    }

    toast.success("Signed out");
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={logout}
      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:border-rose-400/40 hover:text-rose-200"
    >
      Logout
    </button>
  );
}
