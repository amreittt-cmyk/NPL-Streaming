"use client";

import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/store/cart-store";

export function AddToCartButton({
  product,
}: {
  product: {
    id: string;
    name: string;
    slug: string;
    imageUrl: string;
    price: number;
  };
}) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <button
      onClick={() => {
        addItem({
          productId: product.id,
          name: product.name,
          slug: product.slug,
          imageUrl: product.imageUrl,
          price: product.price,
          quantity: 1,
        });
        toast.success(`${product.name} added to cart`);
      }}
      className="inline-flex items-center gap-2 rounded-2xl bg-cyan-400 px-4 py-3 font-bold uppercase tracking-[0.2em] text-slate-950 transition hover:bg-cyan-300"
    >
      <ShoppingCart className="h-4 w-4" />
      Add to cart
    </button>
  );
}
