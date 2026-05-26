import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { currency } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";

export default async function OrdersPage() {
  const user = await getCurrentUser();
  const orders = user
    ? await prisma.order.findMany({
        where: { userId: user.id },
        include: { items: true },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Order History</p>
        <h1 className="mt-3 text-4xl font-black uppercase tracking-[0.14em] text-white">Your purchases</h1>
      </div>
      {!orders.length ? (
        <EmptyState title="No orders yet" description="Complete a checkout to start building your order history." />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="glass-panel rounded-[2rem] p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-cyan-300">{order.status}</p>
                  <h2 className="text-2xl font-bold text-white">{order.id}</h2>
                </div>
                <p className="text-2xl font-black text-white">{currency(order.total)}</p>
              </div>
              <div className="mt-4 space-y-2 text-slate-400">
                {order.items.map((item) => (
                  <p key={item.id}>{item.name} x {item.quantity}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
