"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "./data";

export type CartItem = {
  slug: string;
  name: string;
  now: number;
  img: string;
  fabric: string;
  qty: number;
};

type ShopState = {
  search: string;
  setSearch: (v: string) => void;
  wishlist: string[];
  toggleWish: (slug: string) => void;
  cart: CartItem[];
  addToCart: (p: Product, qty: number, fabric: string) => void;
  updateQty: (idx: number, d: number) => void;
  removeItem: (idx: number) => void;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  cartCount: number;
  chromeHidden: boolean;
  setChromeHidden: (v: boolean) => void;
};

const Ctx = createContext<ShopState | null>(null);

function read<T>(k: string, fb: T): T {
  try {
    const v = localStorage.getItem(k);
    return v ? (JSON.parse(v) as T) : fb;
  } catch {
    return fb;
  }
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState("");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [chromeHidden, setChromeHidden] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWishlist(read("cholti_wish", []));
    setCart(read("cholti_cart", []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      try {
        localStorage.setItem("cholti_wish", JSON.stringify(wishlist));
        localStorage.setItem("cholti_cart", JSON.stringify(cart));
      } catch {}
    }
  }, [wishlist, cart, hydrated]);

  const val = useMemo<ShopState>(
    () => ({
      search,
      setSearch,
      wishlist,
      toggleWish: (slug) =>
        setWishlist((w) => (w.includes(slug) ? w.filter((x) => x !== slug) : [...w, slug])),
      cart,
      addToCart: (p, qty, fabric) =>
        setCart((c) => {
          const i = c.findIndex((x) => x.slug === p.slug && x.fabric === fabric);
          if (i >= 0) {
            const n = [...c];
            n[i] = { ...n[i], qty: Math.min(99, n[i].qty + qty) };
            return n;
          }
          return [...c, { slug: p.slug, name: p.name, now: p.now, img: p.img, fabric, qty }];
        }),
      updateQty: (idx, d) =>
        setCart((c) =>
          c.map((it, i) => (i === idx ? { ...it, qty: Math.min(99, Math.max(1, it.qty + d)) } : it))
        ),
      removeItem: (idx) => setCart((c) => c.filter((_, i) => i !== idx)),
      cartOpen,
      setCartOpen,
      cartCount: cart.reduce((a, c) => a + c.qty, 0),
      chromeHidden,
      setChromeHidden,
    }),
    [search, wishlist, cart, cartOpen, chromeHidden]
  );

  return <Ctx.Provider value={val}>{children}</Ctx.Provider>;
}

export const useShop = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useShop must be used inside ShopProvider");
  return v;
};
