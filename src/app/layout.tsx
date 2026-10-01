import type { Metadata } from "next";
import { Suspense } from "react";
import { Fraunces, Playfair_Display, Albert_Sans, Hind_Siliguri, Noto_Serif_Bengali, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import { ShopProvider } from "@/lib/store";
import { LangProvider } from "@/lib/lang";
import { AuthProvider } from "@/lib/auth-context";
import Analytics from "@/components/Analytics";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", weight: ["500", "600", "700"] });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", weight: ["600", "700"] });
const albert = Albert_Sans({ subsets: ["latin"], variable: "--font-albert", weight: ["400", "500", "600", "700", "800"] });
const hind = Hind_Siliguri({ subsets: ["bengali", "latin"], variable: "--font-hind", weight: ["400", "500", "600", "700"] });
const notoSerifBn = Noto_Serif_Bengali({ subsets: ["bengali", "latin"], variable: "--font-notoserif-bn", weight: ["600", "700"] });
const notoSansBn = Noto_Sans_Bengali({ subsets: ["bengali", "latin"], variable: "--font-notosans-bn", weight: ["400", "500", "700"] });

export const metadata: Metadata = {
  title: "Cholti Home Decor, Better Home, Better Life",
  description: "Premium sofa cover, bedsheet, cushion cover o curtain, sara Bangladesh e home delivery.",
  metadataBase: new URL("https://cholti-home-decor.netlify.app"),
  openGraph: { title: "Cholti Home Decor", description: "Warm & elegant home decor Bangladesh", type: "website" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" suppressHydrationWarning className={`${fraunces.variable} ${playfair.variable} ${albert.variable} ${hind.variable} ${notoSerifBn.variable} ${notoSansBn.variable}`}>
      <body suppressHydrationWarning className="min-h-screen">
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('cholti_theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()",
          }}
        />
        <AuthProvider>
          <ShopProvider>
            <LangProvider>{children}</LangProvider>
          </ShopProvider>
        </AuthProvider>
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
      </body>
    </html>
  );
}
