import { Gem, Scissors, Ruler, Palette, HeartHandshake } from "lucide-react";

const ITEMS = [
  { icon: Gem, t: "Premium Quality", s: "bachai kora kapor" },
  { icon: Scissors, t: "Neat Finishing", s: "poripati stitching" },
  { icon: Ruler, t: "Custom Fit", s: "ghorer jonno manansoi" },
  { icon: Palette, t: "Stylish Design", s: "modern look" },
  { icon: HeartHandshake, t: "Customer Care", s: "sohoj jogajog" },
];

export default function TrustBar() {
  return (
    <div className="bg-paper border-y border-line mt-6">
      <div className="max-w-[1180px] mx-auto px-5 py-4 grid grid-cols-2 md:grid-cols-5 gap-3">
        {ITEMS.map((it) => (
          <div key={it.t} className="flex items-center gap-3">
            <span className="w-[42px] h-[42px] rounded-full bg-gold-soft text-forest grid place-items-center shrink-0"><it.icon size={18} strokeWidth={1.5} /></span>
            <div><b className="block text-[15px]">{it.t}</b><small className="text-[9px] text-muted">{it.s}</small></div>
          </div>
        ))}
      </div>
    </div>
  );
}
