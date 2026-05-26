import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { LogoutButton } from "@/components/auth/logout-button";
import { ProfileAssetsForm } from "@/components/dashboard/profile-assets-form";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-[2.5rem]">
        <div className="relative h-64">
          <Image src={user.bannerUrl || user.avatarUrl || "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80"} alt={user.name} fill className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/55 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-8">
          <div className="flex items-center gap-5">
            <div className="relative h-28 w-28 overflow-hidden rounded-[2rem] border border-white/15">
              <Image src={user.avatarUrl || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80"} alt={user.name} fill className="object-cover" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">{user.role}</p>
              <h1 className="text-4xl font-black uppercase tracking-[0.14em] text-white">{user.name}</h1>
              <p className="text-slate-300">{user.email}</p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="glass-panel rounded-[2rem] p-6">
          <h2 className="text-2xl font-black uppercase tracking-[0.16em] text-white">Quick Links</h2>
          <div className="mt-5 space-y-3">
            <Link href="/orders" className="block rounded-2xl border border-white/10 bg-white/5 p-4">Order history</Link>
            <Link href="/wishlist" className="block rounded-2xl border border-white/10 bg-white/5 p-4">Wishlist</Link>
            {user.role === "STREAMER" && <Link href="/streamer" className="block rounded-2xl border border-white/10 bg-white/5 p-4">Streamer dashboard</Link>}
            {user.role === "ADMIN" && <Link href="/admin" className="block rounded-2xl border border-white/10 bg-white/5 p-4">Admin dashboard</Link>}
          </div>
        </div>
        <div className="glass-panel rounded-[2rem] p-6">
          <h2 className="text-2xl font-black uppercase tracking-[0.16em] text-white">Profile Settings</h2>
          <div className="mt-5">
            <ProfileAssetsForm defaultAvatar={user.avatarUrl} defaultBanner={user.bannerUrl} />
          </div>
        </div>
      </div>
    </div>
  );
}
