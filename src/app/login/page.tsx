import type { Metadata } from "next";
import Header from "@/components/Header";
import { Footer, FloatingWA } from "@/components/Closing";
import CartDrawer from "@/components/CartDrawer";
import AuthForm from "@/components/AuthForm";
import LoginSpotlight from "@/components/LoginSpotlight";
import { getCategories } from "@/lib/catalog-db";

export const metadata: Metadata = {
  title: "Sign In - Cholti Home Decor",
  description: "Sign in with Google or email for faster checkout.",
};

export default async function LoginPage() {
  return (
    <>
      <Header categories={await getCategories()} />
      <main>
        <div className="grid md:grid-cols-2 md:h-[calc(100dvh-161px)] md:min-h-[480px]">
          <LoginSpotlight />
          <div className="bg-paper px-5 py-8 md:py-4 grid place-items-center overflow-y-auto">
            <div className="w-full max-w-[420px]">
              <AuthForm />
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingWA />
      <CartDrawer />
    </>
  );
}
