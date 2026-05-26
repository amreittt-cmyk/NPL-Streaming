import { CartClient } from "@/components/store/cart-client";

export default function CartPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Shopping Cart</p>
        <h1 className="mt-3 text-4xl font-black uppercase tracking-[0.14em] text-white">Review your order</h1>
      </div>
      <CartClient />
    </div>
  );
}
