"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";

export function CheckoutForm({ userEmail }: { userEmail?: string }) {
  const router = useRouter();
  const { items, couponCode, clearCart } = useCartStore();
  const form = useForm({
    defaultValues: {
      fullName: "",
      email: userEmail || "",
      address1: "",
      address2: "",
      city: "",
      country: "Nepal",
      postalCode: "",
    },
  });

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = couponCode === "SAVE10" ? subtotal * 0.1 : 0;
    const taxedBase = subtotal - discount;
    const tax = taxedBase * 0.08;
    const shipping = subtotal > 0 ? 9.99 : 0;
    return { subtotal, tax, shipping, total: taxedBase + tax + shipping };
  }, [couponCode, items]);

  async function onSubmit(values: Record<string, string>) {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          imageUrl: item.imageUrl,
          price: item.price,
          quantity: item.quantity,
        })),
        subtotal: totals.subtotal,
        tax: totals.tax,
        shipping: totals.shipping,
        total: totals.total,
        couponCode,
        shippingAddress: values,
      }),
    });

    const payload = await response.json();
    if (!response.ok) {
      toast.error(payload.error || "Checkout failed");
      return;
    }

    clearCart();
    toast.success("Order created");
    router.push(`/order-confirmation/${payload.order.id}`);
    router.refresh();
  }

  if (!items.length) {
    return <p className="text-slate-400">Your cart is empty.</p>;
  }

  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
      {fields.map((field) => (
        <input
          key={field}
          {...form.register(field)}
          placeholder={field.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase())}
          className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3"
        />
      ))}
      <button className="rounded-2xl bg-cyan-400 px-4 py-3 font-bold uppercase tracking-[0.2em] text-slate-950">
        Place order
      </button>
    </form>
  );
}
  const fields = ["fullName", "email", "address1", "address2", "city", "country", "postalCode"] as const;
