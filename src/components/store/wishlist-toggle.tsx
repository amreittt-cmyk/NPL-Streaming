"use client";

import { Heart } from "lucide-react";
import { useWishlistStore } from "@/store/wishlist-store";
import { cn } from "@/lib/utils";

export function WishlistToggle({ productId }: { productId: string }) {
  const productIds = useWishlistStore((state) => state.productIds);
  const toggle = useWishlistStore((state) => state.toggle);
  const active = productIds.includes(productId);

  return (
    <button
      onClick={() => toggle(productId)}
      className={cn(
        "rounded-full border p-3 transition",
        active
          ? "border-rose-400/40 bg-rose-400/10 text-rose-200"
          : "border-white/10 bg-white/5 text-slate-300 hover:border-rose-400/40 hover:text-rose-200",
      )}
      aria-label="Toggle wishlist"
    >
      <Heart className={cn("h-4 w-4", active && "fill-current")} />
    </button>
  );
}
