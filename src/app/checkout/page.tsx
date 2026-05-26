import { getCurrentUser } from "@/lib/auth";
import { CheckoutForm } from "@/components/store/checkout-form";

export default async function CheckoutPage() {
  const user = await getCurrentUser();

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Checkout</p>
        <h1 className="mt-3 text-4xl font-black uppercase tracking-[0.14em] text-white">Shipping and payment</h1>
        <p className="mt-3 text-slate-400">Stripe-ready structure is included. If Stripe keys are not configured, checkout uses the placeholder order flow.</p>
      </div>
      <div className="glass-panel rounded-[2rem] p-6">
        <CheckoutForm userEmail={user?.email} />
      </div>
    </div>
  );
}
