import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { currency } from "@/lib/utils";

export default async function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, user: true },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      <div className="glass-panel rounded-[2rem] p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Order confirmed</p>
        <h1 className="mt-3 text-4xl font-black uppercase tracking-[0.14em] text-white">Thanks for shopping with NPL Live</h1>
        <p className="mt-4 text-slate-400">Order ID: {order.id}</p>
        <div className="mt-8 space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
              <span className="text-white">{item.name} x {item.quantity}</span>
              <span className="text-cyan-300">{currency(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 text-right text-2xl font-black text-white">{currency(order.total)}</div>
      </div>
    </div>
  );
}
