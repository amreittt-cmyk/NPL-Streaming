"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function ProductForm() {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      name: "",
      category: "jerseys",
      description: "",
      price: 0,
      stock: 0,
      featured: false,
      imageUrl: "",
    },
  });

  async function onSubmit(values: Record<string, string | number | boolean>) {
    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        imageUrls: [values.imageUrl],
      }),
    });
    const payload = await response.json();
    if (!response.ok) {
      toast.error(payload.error || "Could not save product");
      return;
    }
    toast.success("Product created");
    form.reset();
    router.refresh();
  }

  return (
    <form className="grid gap-3" onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register("name")} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="Product name" />
      <input {...form.register("category")} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="Category" />
      <textarea {...form.register("description")} className="min-h-28 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="Description" />
      <input {...form.register("price", { valueAsNumber: true })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="Price" type="number" />
      <input {...form.register("stock", { valueAsNumber: true })} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="Stock" type="number" />
      <input {...form.register("imageUrl")} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3" placeholder="Image URL" />
      <label className="flex items-center gap-3 text-sm text-slate-300">
        <input type="checkbox" {...form.register("featured")} />
        Featured product
      </label>
      <button className="rounded-2xl bg-cyan-400 px-4 py-3 font-bold uppercase tracking-[0.2em] text-slate-950">Add product</button>
    </form>
  );
}
