"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useCartStore } from "@/store/cart-store";
import { currency } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";

export function CartClient() {
  const { items, updateQuantity, removeItem, couponCode, setCouponCode } = useCartStore();
  const [draftCoupon, setDraftCoupon] = useState(couponCode);

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = couponCode === "SAVE10" ? subtotal * 0.1 : 0;
    const taxedBase = subtotal - discount;
    const tax = taxedBase * 0.08;
    const shipping = subtotal > 0 ? 9.99 : 0;
    return {
      subtotal,
      discount,
      tax,
      shipping,
      total: taxedBase + tax + shipping,
    };
  }, [couponCode, items]);

  if (!items.length) {
    return <EmptyState title="Cart is empty" description="Add official NPL merch to see your checkout summary here." />;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.productId} className="glass-panel grid gap-4 rounded-3xl p-4 sm:grid-cols-[120px_1fr_auto] sm:items-center">
            <div className="relative h-28 overflow-hidden rounded-2xl">
              <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">{item.name}</p>
              <p className="text-sm uppercase tracking-[0.18em] text-cyan-300">{currency(item.price)}</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(event) => updateQuantity(item.productId, Number(event.target.value))}
                className="w-20 rounded-2xl border border-white/10 bg-slate-950 px-3 py-2"
              />
              <button onClick={() => removeItem(item.productId)} className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-200">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-panel h-fit rounded-3xl p-6">
        <h2 className="text-2xl font-black uppercase tracking-[0.14em] text-white">Summary</h2>
        <div className="mt-6 space-y-3 text-slate-300">
          <div className="flex justify-between"><span>Subtotal</span><span>{currency(totals.subtotal)}</span></div>
          <div className="flex justify-between"><span>Discount</span><span>-{currency(totals.discount)}</span></div>
          <div className="flex justify-between"><span>Tax</span><span>{currency(totals.tax)}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>{currency(totals.shipping)}</span></div>
          <div className="border-t border-white/10 pt-3 text-lg font-bold text-white">
            <div className="flex justify-between"><span>Total</span><span>{currency(totals.total)}</span></div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <input
            value={draftCoupon}
            onChange={(event) => setDraftCoupon(event.target.value.toUpperCase())}
            placeholder="Coupon code"
            className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3"
          />
          <button onClick={() => setCouponCode(draftCoupon)} className="w-full rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 font-semibold uppercase tracking-[0.2em] text-cyan-200">
            Apply Coupon
          </button>
          <Link href="/checkout" className="block rounded-2xl bg-cyan-400 px-4 py-3 text-center font-bold uppercase tracking-[0.2em] text-slate-950">
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
