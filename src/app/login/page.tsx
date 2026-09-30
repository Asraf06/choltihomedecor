import type { Metadata } from "next";
import Header from "@/components/Header";
import { Footer, FloatingWA } from "@/components/Closing";
import CartDrawer from "@/components/CartDrawer";
import AuthForm from "@/components/AuthForm";
import { getCategories } from "@/lib/catalog-db";

export const metadata: Metadata = {
  title: "Sign In - Cholti Home Decor",
  description: "Sign in with Google or email for faster checkout.",
};

export default async function LoginPage() {
  return (
    <>
      <Header categories={await getCategories()} />
      <main className="max-w-[1180px] mx-auto px-5 py-12 grid place-items-center">
        <AuthForm />
      </main>
      <Footer />
      <FloatingWA />
      <CartDrawer />
    </>
  );
}
