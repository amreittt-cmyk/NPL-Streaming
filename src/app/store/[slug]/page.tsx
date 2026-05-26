import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AddToCartButton } from "@/components/store/add-to-cart-button";
import { WishlistToggle } from "@/components/store/wishlist-toggle";
import { currency } from "@/lib/utils";

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });

  if (!product) {
    notFound();
  }

  const related = await prisma.product.findMany({
    where: {
      category: product.category,
      NOT: { id: product.id },
    },
    take: 3,
  });

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div className="relative min-h-[540px] overflow-hidden rounded-[2.5rem]">
          <Image src={product.imageUrls[0]} alt={product.name} fill className="object-cover" />
        </div>
        <div className="glass-panel rounded-[2.5rem] p-8">
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">{product.category}</p>
          <div className="mt-4 flex items-start justify-between gap-4">
            <h1 className="text-4xl font-black uppercase tracking-[0.12em] text-white">{product.name}</h1>
            <WishlistToggle productId={product.id} />
          </div>
          <p className="mt-5 text-lg text-slate-300">{product.description}</p>
          <div className="mt-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-4xl font-black text-white">{currency(product.price)}</p>
              <p className="text-sm uppercase tracking-[0.18em] text-slate-400">{product.stock} units ready to ship</p>
            </div>
            <AddToCartButton product={{ id: product.id, name: product.name, slug: product.slug, imageUrl: product.imageUrls[0], price: product.price }} />
          </div>
        </div>
      </div>

      <section className="space-y-5">
        <h2 className="text-3xl font-black uppercase tracking-[0.14em] text-white">Related Gear</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {related.map((item) => (
            <a key={item.id} href={`/store/${item.slug}`} className="glass-panel overflow-hidden rounded-[2rem]">
              <div className="relative h-56">
                <Image src={item.imageUrls[0]} alt={item.name} fill className="object-cover" />
              </div>
              <div className="p-5">
                <p className="text-xl font-bold text-white">{item.name}</p>
                <p className="text-cyan-300">{currency(item.price)}</p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
