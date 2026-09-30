import { PRODUCTS } from "@/lib/data";

export default function sitemap() {
  const base = "https://cholti-home-decor.netlify.app";
  return [
    { url: `${base}/`, lastModified: new Date() },
    ...PRODUCTS.map((p) => ({ url: `${base}/product/${p.slug}`, lastModified: new Date() })),
  ];
}
