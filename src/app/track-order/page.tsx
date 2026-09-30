import type { Metadata } from "next";
import Header from "@/components/Header";
import { CTA, Footer, FloatingWA } from "@/components/Closing";
import CartDrawer from "@/components/CartDrawer";
import TrackView from "./TrackView";

export const metadata: Metadata = {
  title: "Track Order - Cholti Home Decor",
  description: "Track your order on WhatsApp. Delivery in 2-4 days, cash on delivery.",
};

export default function TrackPage() {
  return (
    <>
      <Header />
      <TrackView />
      <CTA />
      <Footer />
      <FloatingWA />
      <CartDrawer />
    </>
  );
}
