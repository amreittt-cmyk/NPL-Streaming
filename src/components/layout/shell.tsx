import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export async function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
