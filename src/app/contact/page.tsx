import type { Metadata } from "next";
import Header from "@/components/Header";
import { CTA, Footer, FloatingWA } from "@/components/Closing";
import CartDrawer from "@/components/CartDrawer";
import ContactView from "./ContactView";

export const metadata: Metadata = {
  title: "Contact Us - Cholti Home Decor",
  description: "Hotline, WhatsApp and email for orders and questions.",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <ContactView />
      <CTA />
      <Footer />
      <FloatingWA />
      <CartDrawer />
    </>
  );
}
