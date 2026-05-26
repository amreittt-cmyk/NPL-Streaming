"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import Link from "next/link";
import { loginSchema, signupSchema } from "@/lib/validations";

const forgotSchema = z.object({ email: z.string().email() });
const resetSchema = z.object({ password: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/) });

type Mode = "login" | "signup" | "forgot" | "reset";

const config = {
  login: {
    schema: loginSchema,
    endpoint: "/api/auth/login",
    title: "Welcome Back",
    subtitle: "Sign in to manage streams, follow creators, and shop official merch.",
  },
  signup: {
    schema: signupSchema,
    endpoint: "/api/auth/signup",
    title: "Create Your Account",
    subtitle: "Join NPL Live as a viewer, future streamer, or merch collector.",
  },
  forgot: {
    schema: forgotSchema,
    endpoint: "/api/auth/forgot-password",
    title: "Reset Access",
    subtitle: "We will generate a reset token for this demo project.",
  },
  reset: {
    schema: resetSchema,
    endpoint: "/api/auth/reset-password",
    title: "Set New Password",
    subtitle: "Choose a strong password with a capital letter and a number.",
  },
} as const;

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const selected = config[mode];

  const form = useForm({
    resolver: zodResolver(selected.schema),
    defaultValues:
      mode === "signup"
        ? { name: "", email: "", password: "" }
        : mode === "login"
          ? { email: "", password: "" }
          : mode === "forgot"
            ? { email: "" }
            : { password: "" },
  });

  async function onSubmit(values: Record<string, unknown>) {
    const response = await fetch(selected.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mode === "reset" ? { ...values, token } : values),
    });

    const payload = await response.json();
    if (!response.ok) {
      toast.error(payload.error || "Something went wrong");
      return;
    }

    toast.success(payload.message || "Success");

    if (mode === "login" || mode === "signup" || mode === "reset") {
      router.push(mode === "login" ? "/" : "/auth/login");
      router.refresh();
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl">
      <div className="mb-8 space-y-3 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Account Access</p>
        <h1 className="text-3xl font-black uppercase tracking-[0.16em] text-white">{selected.title}</h1>
        <p className="text-slate-400">{selected.subtitle}</p>
      </div>

      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        {mode === "signup" && (
          <input
            {...form.register("name")}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-cyan-400"
            placeholder="Full name"
          />
        )}

        {mode !== "reset" && (
          <input
            {...form.register("email")}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-cyan-400"
            placeholder="Email address"
            type="email"
          />
        )}

        {mode !== "forgot" && (
          <input
            {...form.register("password")}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-cyan-400"
            placeholder="Password"
            type="password"
          />
        )}

        <button className="w-full rounded-2xl bg-cyan-400 px-4 py-3 font-bold uppercase tracking-[0.2em] text-slate-950 transition hover:bg-cyan-300" type="submit">
          {mode === "login" ? "Login" : mode === "signup" ? "Sign Up" : mode === "forgot" ? "Send Reset Link" : "Reset Password"}
        </button>
      </form>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-slate-400">
        {mode !== "login" && <Link href="/auth/login" className="hover:text-white">Login</Link>}
        {mode !== "signup" && <Link href="/auth/signup" className="hover:text-white">Create account</Link>}
        {mode === "login" && <Link href="/auth/forgot-password" className="hover:text-white">Forgot password</Link>}
      </div>
    </div>
  );
}
