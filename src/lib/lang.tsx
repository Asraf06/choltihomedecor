"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "bn" | "en";

const STRINGS = {
  en: {
    welcome: "Welcome to Cholti Home Decor, Better Home, Better Life",
    welcomeShort: "Cholti Home Decor",
    searchPh: "Search sofa cover, bedsheet, curtain...",
    searchPhM: "Search...",
    waOrder: "WhatsApp Order",
    browse: "Browse Categories",
    home: "Home",
    sofa: "Sofa Cover",
    bedsheet: "Bedsheet",
    cushion: "Cushion",
    curtain: "Curtain",
    offers: "Offers",
    hotline: "Hotline: 01711-387707",
    heroEyebrow: "PREMIUM HOME DECOR SOLUTIONS",
    heroTitle1: "Premium Sofa Cover",
    heroTitle2: "o Home Decor",
    heroDesc: "Premium sofa cover, China Magic Print, Korean Velvet, Fujian Jacquard, bedsheet, cushion cover and curtain across Bangladesh, beautiful design, premium quality and home delivery.",
    orderNow: "Order Now",
    viewProducts: "View Products",
    happy: "2,500+ happy homes",
    catEyebrow: "Curated for your home",
    catTitleA: "Shop by",
    catTitleB: "Categories",
    viewAll: "View All →",
    prodEyebrow: "Weekly spotlight",
    prodTitleA: "Top",
    prodTitleB: "Trending",
    prodSub: "Handpicked sofa, bedsheet & curtain, most loved across Bangladesh.",
    tabs: ["New Arrivals", "Best Sellers", "Sofa", "Bedsheet", "Cushion", "Curtain"] as string[],
    waBtn: "WhatsApp Order",
    details: "Details",
    shop: "Shop",
    topTrending: "Top Trending",
    wishlist: "Wishlist",
    about: "About Us",
    contact: "Contact Us",
    trackOrder: "Track Order",
    signIn: "Sign In",
    signUp: "Sign Up",
    signOut: "Sign Out",
    account: "Account",
    emailAddress: "Email",
    passwordLabel: "Password",
    yourName: "Your name",
    googleContinue: "Continue with Google",
    loginTitle: "Welcome back",
    loginSub: "Sign in for faster checkout.",
    needAccount: "New here? Create account",
    haveAccount: "Have an account? Sign in",
    errAuth: "Could not sign in. Check email and password.",
    errInUse: "This email is already registered. Sign in instead.",
    errWeak: "Password needs at least 6 characters.",
    errPopup: "Google popup closed before finishing.",
    errLinkNeeded: "This email uses password login. Sign in with your password, Google links automatically.",
    emailRequired: "Email is required.",
    passwordRequired: "Password is required.",
    emailPh: "Enter your email",
    passwordPh: "Enter your password",
    benWT: "Wishlist stays saved",
    benWS: "Liked products stay on your account.",
    benCT: "Cart on every device",
    benCS: "Your cart follows you.",
    benTT: "Order tracking",
    benTS: "Your order list with WhatsApp updates.",
    spotTitle: "One account, full Cholti comfort",
    spotSub: "Sign up once — wishlist, cart and order updates follow you.",
    wishlistEmpty: "No items in your wishlist yet.",
    addToCart: "Add to Cart",
    addedToCart: "Added to cart",
    viewShop: "View Full Shop",
    shopTitle: "Shop All Products",
    shopSub: "Browse the full catalog and add to cart.",
    all: "All Products",
    filters: "Filters",
    categories: "Categories",
    sortBy: "Sort by",
    sortOpts: ["Featured", "Price: Low to High", "Price: High to Low", "Biggest Discount"] as string[],
    items: "items",
    activeFilters: "Active Filters",
    clearAll: "Clear all",
    noFilters: "No filters applied",
    empty: "Nothing found, try another keyword.",
    storyCushionBtn: "View all cushions",
    revEyebrow: "Customer love",
    revTitleA: "Loved",
    revTitleB: "homes",
    ctaTitle: "Contact now to decorate your dream home!",
    ctaSub: "Cash on delivery • Home delivery all over Bangladesh • Easy exchange",
    callNow: "Call Now",
    checkout: "WhatsApp Checkout",
    cartEmpty: "Cart is empty, add your favourite product.",
    name: "Your name",
    phone: "Mobile number",
    address: "Address",
    delivery: "Delivery Area",
    dhakaIn: "Inside Dhaka, 80৳",
    dhakaOut: "Outside Dhaka, 130৳",
    subtotal: "Subtotal",
    total: "Total",
    confirm: "Confirm via WhatsApp →",
    codNote: "Pay cash on delivery. No advance needed.",
    back: "← Back to Shop",
    fabric: "Fabric",
    size: "Size",
    color: "Color",
    alsoLove: "You may also",
    love: "love",
  },
  bn: {
    welcome: "চলতি হোম ডেকোরে স্বাগতম, সুন্দর ঘর, সুন্দর জীবন",
    welcomeShort: "চলতি হোম ডেকোর",
    searchPh: "সোফা কভার, বেডশিট, পর্দা খুঁজুন...",
    searchPhM: "খুঁজুন...",
    waOrder: "হোয়াটসঅ্যাপে অর্ডার",
    browse: "ক্যাটাগরি দেখুন",
    home: "হোম",
    sofa: "সোফা কভার",
    bedsheet: "বেডশিট",
    cushion: "কুশন",
    curtain: "পর্দা",
    offers: "অফার",
    hotline: "হটলাইন: ০১৭১১-৩৮৭৭০৭",
    heroEyebrow: "প্রিমিয়াম হোম ডেকোর সলিউশন",
    heroTitle1: "প্রিমিয়াম সোফা কভার",
    heroTitle2: "ও হোম ডেকোর",
    heroDesc: "সারা বাংলাদেশে premium sofa cover, China Magic Print, Korean Velvet, Fujian Jacquard, bedsheet, cushion cover ও curtain, সুন্দর design, premium quality এবং home delivery।",
    orderNow: "এখনই অর্ডার করুন",
    viewProducts: "পণ্যগুলো দেখুন",
    happy: "২,৫০০+ খুশি পরিবার",
    catEyebrow: "আপনার ঘরের জন্য বাছাইকৃত",
    catTitleA: "ক্যাটাগরি থেকে",
    catTitleB: "কিনুন",
    viewAll: "সব দেখুন →",
    prodEyebrow: "সাপ্তাহিক হাইলাইট",
    prodTitleA: "সেরা",
    prodTitleB: "ট্রেন্ডিং",
    prodSub: "যত্নে বাছাই করা সোফা, বেডশিট ও পর্দা, সারা বাংলাদেশের পছন্দ।",
    tabs: ["নতুন কালেকশন", "বেস্ট সেলার", "সোফা", "বেডশিট", "কুশন", "পর্দা"] as string[],
    waBtn: "হোয়াটসঅ্যাপে অর্ডার",
    details: "বিস্তারিত",
    shop: "শপ",
    topTrending: "টপ ট্রেন্ডিং",
    wishlist: "উইশলিস্ট",
    about: "আমাদের সম্পর্কে",
    contact: "যোগাযোগ",
    trackOrder: "অর্ডার ট্র্যাক করুন",
    signIn: "সাইন ইন",
    signUp: "সাইন আপ",
    signOut: "সাইন আউট",
    account: "অ্যাকাউন্ট",
    emailAddress: "ইমেইল",
    passwordLabel: "পাসওয়ার্ড",
    yourName: "আপনার নাম",
    googleContinue: "Google দিয়ে চালিয়ে যান",
    loginTitle: "স্বাগতম",
    loginSub: "দ্রুত চেকআউটের জন্য সাইন ইন করুন।",
    needAccount: "নতুন? অ্যাকাউন্ট খুলুন",
    haveAccount: "অ্যাকাউন্ট আছে? সাইন ইন করুন",
    errAuth: "সাইন ইন হয়নি। ইমেইল-পাসওয়ার্ড চেক করুন।",
    errInUse: "এই ইমেইল দিয়ে অ্যাকাউন্ট আছে। সাইন ইন করুন।",
    errWeak: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।",
    errPopup: "Google popup শেষ হওয়ার আগেই বন্ধ হয়েছে।",
    errLinkNeeded: "এই ইমেইলে পাসওয়ার্ড লগইন আছে। পাসওয়ার্ড দিয়ে সাইন ইন করো, Google auto-link হয়ে যাবে।",
    emailRequired: "ইমেইল দিতে হবে।",
    passwordRequired: "পাসওয়ার্ড দিতে হবে।",
    emailPh: "আপনার ইমেইল লিখুন",
    passwordPh: "আপনার পাসওয়ার্ড লিখুন",
    benWT: "উইশলিস্ট সেভ থাকবে",
    benWS: "পছন্দের পণ্য অ্যাকাউন্টে জমা থাকবে।",
    benCT: "কার্ট সব ডিভাইসে",
    benCS: "যেকোনো ফোন থেকে কার্ট পাবেন।",
    benTT: "অর্ডার ট্র্যাকিং",
    benTS: "আপনার অর্ডার list WhatsApp আপডেট সহ।",
    spotTitle: "একটা অ্যাকাউন্ট, পুরো Cholti সুবিধা",
    spotSub: "একবার সাইন আপ করুন — উইশলিস্ট, কার্ট আর অর্ডার আপডেট সব সাথে থাকবে।",
    wishlistEmpty: "উইশলিস্টে এখনো কিছু নেই।",
    addToCart: "কার্টে যোগ করুন",
    addedToCart: "কার্টে যোগ হয়েছে",
    viewShop: "পুরো শপ দেখুন",
    shopTitle: "সব পণ্য",
    shopSub: "পুরো ক্যাটালগ দেখুন, পছন্দমতো কার্টে যোগ করুন।",
    all: "সব পণ্য",
    filters: "ফিল্টার",
    categories: "ক্যাটাগরি",
    sortBy: "সাজান",
    sortOpts: ["ফিচার্ড", "দাম: কম থেকে বেশি", "দাম: বেশি থেকে কম", "বেশি ছাড়"] as string[],
    items: "টি পণ্য",
    activeFilters: "সক্রিয় ফিল্টার",
    clearAll: "সব মুছুন",
    noFilters: "কোনো ফিল্টার নেই",
    empty: "কিছু পাওয়া যায়নি, অন্য keyword দিয়ে খুঁজুন।",
    storyCushionBtn: "সব কুশন দেখুন",
    revEyebrow: "কাস্টমার ভালোবাসা",
    revTitleA: "ভালোবাসার",
    revTitleB: "ঘরগুলো",
    ctaTitle: "আপনার স্বপ্নের ঘর সাজাতে এখনই যোগাযোগ করুন!",
    ctaSub: "ক্যাশ অন ডেলিভারি • সারা বাংলাদেশে হোম ডেলিভারি • সহজ এক্সচেঞ্জ",
    callNow: "কল করুন",
    checkout: "হোয়াটসঅ্যাপ চেকআউট",
    cartEmpty: "কার্ট খালি, পছন্দের পণ্য যোগ করুন।",
    name: "আপনার নাম",
    phone: "মোবাইল নম্বর",
    address: "ঠিকানা",
    delivery: "ডেলিভারি এলাকা",
    dhakaIn: "ঢাকার ভিতরে, ৮০৳",
    dhakaOut: "ঢাকার বাইরে, ১৩০৳",
    subtotal: "সাবটোটাল",
    total: "মোট",
    confirm: "হোয়াটসঅ্যাপে কনফার্ম করুন →",
    codNote: "ডেলিভারিতে ক্যাশ দিন। অগ্রিম লাগবে না।",
    back: "← শপে ফিরুন",
    fabric: "ফেব্রিক",
    size: "সাইজ",
    color: "কালার",
    alsoLove: "আপনার পছন্দ হতে পারে",
    love: "",
  },
};

export type Strings = typeof STRINGS.en;

type LangCtx = { lang: Lang; setLang: (l: Lang) => void; t: Strings };

const Ctx = createContext<LangCtx>({ lang: "bn", setLang: () => {}, t: STRINGS.bn as Strings });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("bn");

  useEffect(() => {
    try {
      // 1. A saved manual choice always wins.
      const saved = localStorage.getItem("cholti_lang");
      if (saved === "en" || saved === "bn") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLangState(saved);
        document.documentElement.lang = saved === "bn" ? "bn" : "en";
        return;
      }
      // 2. Auto-detect: Bangladesh visitors get Bangla, everyone else English.
      // Timezone Asia/Dhaka or a bn browser language counts as Bangladesh.
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      const browserLang = navigator.language || "";
      const isBD = tz === "Asia/Dhaka" || /^bn/i.test(browserLang);
      const auto: Lang = isBD ? "bn" : "en";
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLangState(auto);
      document.documentElement.lang = auto === "bn" ? "bn" : "en";
    } catch {}
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("cholti_lang", l);
      document.documentElement.lang = l === "bn" ? "bn" : "en";
    } catch {}
  };

  return <Ctx.Provider value={{ lang, setLang, t: STRINGS[lang] as Strings }}>{children}</Ctx.Provider>;
}

export const useLang = () => useContext(Ctx);
