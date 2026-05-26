import { EmptyState } from "@/components/ui/empty-state";

export default function WishlistPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Wishlist</p>
        <h1 className="mt-3 text-4xl font-black uppercase tracking-[0.14em] text-white">Saved products</h1>
      </div>
      <EmptyState title="Wishlist is managed on the storefront" description="Tap the heart icon on products to keep your favorites saved in this device session." />
    </div>
  );
}
