import type { Metadata } from "next";
import Header from "@/components/Header";
import { CTA, Footer, FloatingWA } from "@/components/Closing";
import CartDrawer from "@/components/CartDrawer";
import { getCategories } from "@/lib/catalog-db";
import AccountView from "./AccountView";

export const metadata: Metadata = {
  title: "My Account - Cholti Home Decor",
  description: "Profile, orders and reviews.",
};

export default async function AccountPage() {
  return (
    <>
      <Header categories={await getCategories()} />
      <AccountView />
      <CTA />
      <Footer />
      <FloatingWA />
      <CartDrawer />
    </>
  );
}
