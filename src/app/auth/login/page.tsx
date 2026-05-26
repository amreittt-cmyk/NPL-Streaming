import { AuthForm } from "@/components/auth/auth-form";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <AuthForm mode="login" />
    </div>
  );
}
