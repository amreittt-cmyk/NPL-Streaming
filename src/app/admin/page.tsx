import { prisma } from "@/lib/prisma";
import { getAdminOverview } from "@/lib/data";
import { currency } from "@/lib/utils";
import { ProductForm } from "@/components/dashboard/product-form";
import { StreamForm } from "@/components/dashboard/stream-form";
import { TournamentForm } from "@/components/dashboard/tournament-form";

export default async function AdminPage() {
  const { stats, recentOrders, users } = await getAdminOverview();
  const [products, streams, tournaments] = await Promise.all([
    prisma.product.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.stream.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.tournament.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
  ]);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Admin Dashboard</p>
        <h1 className="mt-3 text-4xl font-black uppercase tracking-[0.14em] text-white">Platform control center</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Users", stats.userCount],
          ["Orders", stats.orderCount],
          ["Sales", currency(stats.sales)],
          ["Live Viewers", stats.viewers],
        ].map(([label, value]) => (
          <div key={label} className="glass-panel rounded-[2rem] p-5">
            <p className="text-sm uppercase tracking-[0.18em] text-slate-400">{label}</p>
            <p className="mt-3 text-3xl font-black text-white">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-8 xl:grid-cols-3">
        <div className="glass-panel rounded-[2rem] p-6">
          <h2 className="text-2xl font-black uppercase tracking-[0.16em] text-white">Add Product</h2>
          <div className="mt-5"><ProductForm /></div>
        </div>
        <div className="glass-panel rounded-[2rem] p-6">
          <h2 className="text-2xl font-black uppercase tracking-[0.16em] text-white">Add Stream</h2>
          <div className="mt-5"><StreamForm /></div>
        </div>
        <div className="glass-panel rounded-[2rem] p-6">
          <h2 className="text-2xl font-black uppercase tracking-[0.16em] text-white">Add Tournament</h2>
          <div className="mt-5"><TournamentForm /></div>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-2">
        <div className="glass-panel rounded-[2rem] p-6">
          <h2 className="text-2xl font-black uppercase tracking-[0.16em] text-white">Recent Orders</h2>
          <div className="mt-4 space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="font-semibold text-white">{order.user?.name || order.guestEmail || "Guest checkout"}</p>
                <p className="text-sm text-slate-400">{order.items.length} items • {currency(order.total)}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-panel rounded-[2rem] p-6">
          <h2 className="text-2xl font-black uppercase tracking-[0.16em] text-white">Manage Users</h2>
          <div className="mt-4 space-y-3">
            {users.map((user) => (
              <div key={user.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="font-semibold text-white">{user.name}</p>
                <p className="text-sm text-slate-400">{user.email}</p>
                <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">{user.role} • {user.emailVerified ? "Verified" : "Pending"}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-3">
        {[["Products", products.map((item) => item.name)], ["Streams", streams.map((item) => item.title)], ["Tournaments", tournaments.map((item) => item.title)]].map(([title, names]) => (
          <div key={String(title)} className="glass-panel rounded-[2rem] p-6">
            <h2 className="text-2xl font-black uppercase tracking-[0.16em] text-white">{title}</h2>
            <div className="mt-4 space-y-3">
              {(names as string[]).map((name) => (
                <div key={name} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white">{name}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
