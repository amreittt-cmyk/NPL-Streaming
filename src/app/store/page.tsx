import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { SectionHeading } from "@/components/ui/section-heading";
import { AddToCartButton } from "@/components/store/add-to-cart-button";
import { WishlistToggle } from "@/components/store/wishlist-toggle";
import { currency } from "@/lib/utils";

export default async function StorePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const params = await searchParams;
  const products = await prisma.product.findMany({
    where: {
      category: params.category && params.category !== "all" ? params.category : undefined,
      OR: params.q
        ? [
            { name: { contains: params.q, mode: "insensitive" } },
            { description: { contains: params.q, mode: "insensitive" } },
          ]
        : undefined,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Merch Store" title="Official apparel and creator-ready gear" description="Filter by category to build your matchday fit or level up your streaming station." />
      <form className="grid gap-3 rounded-[2rem] border border-white/10 bg-slate-900/70 p-5 md:grid-cols-[1fr_auto_auto]">
        <input name="q" defaultValue={params.q} placeholder="Search products" className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" />
        <select name="category" defaultValue={params.category || "all"} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3">
          <option value="all">All categories</option>
          <option value="jerseys">Jerseys</option>
          <option value="hoodies">Hoodies</option>
          <option value="keyboards">Keyboards</option>
          <option value="mouse">Mouse</option>
          <option value="headsets">Headsets</option>
          <option value="accessories">Accessories</option>
        </select>
        <button className="rounded-2xl bg-cyan-400 px-4 py-3 font-bold uppercase tracking-[0.2em] text-slate-950">Filter</button>
      </form>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <div key={product.id} className="glass-panel overflow-hidden rounded-[2rem]">
            <Link href={`/store/${product.slug}`} className="relative block h-72">
              <Image src={product.imageUrls[0]} alt={product.name} fill className="object-cover" />
            </Link>
            <div className="space-y-4 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">{product.name}</h2>
                  <p className="text-sm uppercase tracking-[0.18em] text-cyan-300">{product.category}</p>
                </div>
                <WishlistToggle productId={product.id} />
              </div>
              <p className="text-slate-400">{product.description}</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-black text-white">{currency(product.price)}</p>
                  <p className="text-sm text-slate-400">{product.stock} in stock</p>
                </div>
                <AddToCartButton product={{ id: product.id, name: product.name, slug: product.slug, imageUrl: product.imageUrls[0], price: product.price }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
