"use client";

import { useEffect, useState } from "react";
import { MapPin, Pencil, Trash2, Check } from "lucide-react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { clientDb } from "@/lib/firebase-client";
import { useAuth } from "@/lib/auth-context";
import { useLang } from "@/lib/lang";
import { useSettings, zoneLabel } from "@/lib/settings-context";

export type SavedAddress = {
  id: string;
  name: string;
  phone: string;
  address: string;
  area: string;
};

const EMPTY: SavedAddress = { id: "", name: "", phone: "", address: "", area: "inside-dhaka" };

export default function AddressBook() {
  const { t, lang } = useLang();
  const { user } = useAuth();
  const settings = useSettings();
  const zones = settings.zones?.length ? settings.zones : [];

  // Legacy addresses store "80"/"130" charges instead of zone ids.
  const zoneId = (area: string) =>
    zones.some((z) => z.id === area) ? area : zones.find((z) => String(z.charge) === area)?.id ?? zones[0]?.id ?? area;
  const zoneName = (area: string) => {
    const z = zones.find((x) => x.id === area);
    if (z) return zoneLabel(z, lang);
    if (area === "80") return t.dhakaInside;
    if (area === "130") return t.dhakaOutside;
    return area;
  };
  const [list, setList] = useState<SavedAddress[] | null>(null);
  const [def, setDef] = useState("");
  const [editing, setEditing] = useState<SavedAddress | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    getDoc(doc(clientDb, "users", user.uid))
      .then((s) => {
        const d = s.data();
        setList(Array.isArray(d?.addresses) ? (d.addresses as SavedAddress[]).slice(0, 3) : []);
        setDef(typeof d?.default_address === "string" ? d.default_address : "");
      })
      .catch(() => setList([]));
  }, [user]);

  if (!user || list === null) return null;

  const persist = async (next: SavedAddress[], nextDef: string) => {
    if (!user) return;
    await setDoc(
      doc(clientDb, "users", user.uid),
      { addresses: next.slice(0, 3), default_address: nextDef, updated_at: new Date().toISOString() },
      { merge: true }
    );
    setList(next.slice(0, 3));
    setDef(nextDef);
  };

  const save = async () => {
    if (!editing) return;
    setErr(null);
    const v = {
      name: editing.name.trim().slice(0, 60),
      phone: editing.phone.trim(),
      address: editing.address.trim().slice(0, 300),
      area: zoneId(editing.area),
    };
    if (v.name.length < 3 || !/^01[3-9]\d{8}$/.test(v.phone) || v.address.length < 10) {
      setErr(t.uploadFailed);
      return;
    }
    try {
      const id = editing.id || `a-${Date.now().toString(36)}`;
      const next = editing.id ? list.map((a) => (a.id === id ? { ...v, id } : a)) : [...list, { ...v, id }];
      await persist(next, next.length === 1 ? id : def);
      setEditing(null);
    } catch {
      setErr(t.uploadFailed);
    }
  };

  const remove = async (id: string) => {
    try {
      const next = list.filter((a) => a.id !== id);
      await persist(next, def === id ? next[0]?.id ?? "" : def);
    } catch {
      setErr(t.uploadFailed);
    }
  };

  const useAsDefault = async (id: string) => {
    try {
      await persist(list, id);
    } catch {
      setErr(t.uploadFailed);
    }
  };

  return (
    <section className="bg-paper border border-line rounded-[20px] p-5">
      <h2 className="font-serif text-2xl mb-1">{t.myAddresses}</h2>
      <p className="text-[15px] text-muted mb-3">{t.addressHint}</p>
      {err && <p className="text-[15px] font-bold text-clay mb-2">{err}</p>}
      {!list.length ? (
        <p className="text-lg text-muted">{t.noAddresses}</p>
      ) : (
        <div className="flex flex-col gap-3 mb-3">
          {list.map((a) => (
            <div key={a.id} className={`border rounded-[16px] p-4 ${def === a.id ? "border-gold bg-gold-soft/40" : "border-line bg-sand/60"}`}>
              <div className="flex items-center gap-2">
                <MapPin size={15} className="shrink-0 text-clay" />
                <b className="text-[16px]">{a.name}</b>
                <span className="text-[15px] text-muted">{a.phone}</span>
                {def === a.id && <span className="ml-auto text-[13px] font-extrabold bg-forest text-white rounded-full px-2 py-0.5">{t.defaultBadge}</span>}
              </div>
              <p className="text-[15px] text-muted mt-1">{a.address} • {zoneName(a.area)}</p>
              <div className="flex gap-3 mt-2">
                {def !== a.id && (
                  <button onClick={() => useAsDefault(a.id)} className="text-[14px] font-bold text-clay inline-flex items-center gap-1">
                    <Check size={13} />{t.setDefault}
                  </button>
                )}
                <button onClick={() => { setEditing({ ...a }); setErr(null); }} className="text-[14px] font-bold text-muted inline-flex items-center gap-1">
                  <Pencil size={13} />{t.editAddress}
                </button>
                <button onClick={() => remove(a.id)} className="text-[14px] font-bold text-clay inline-flex items-center gap-1">
                  <Trash2 size={13} />{t.deleteReview}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {list.length < 3 && !editing && (
        <button onClick={() => { setEditing({ ...EMPTY }); setErr(null); }} className="inline-flex bg-clay text-white rounded-[35px] px-6 py-2.5 text-[16px] font-bold hover:bg-clay-dark">
          + {t.addAddress}
        </button>
      )}
      {list.length >= 3 && <p className="text-[15px] text-muted">{t.maxAddresses}</p>}
      {editing && (
        <div className="mt-3 border border-line rounded-[16px] p-4 bg-sand/60 flex flex-col gap-2.5">
          <label className="text-base font-bold">{t.fullName}
            <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} maxLength={60} className="mt-1 w-full h-[42px] border border-line bg-paper rounded-xl px-3.5 text-lg font-normal outline-none" />
          </label>
          <label className="text-base font-bold">{t.mobileNumber}
            <input value={editing.phone} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} maxLength={11} inputMode="numeric" placeholder="01XXXXXXXXX" className="mt-1 w-full h-[42px] border border-line bg-paper rounded-xl px-3.5 text-lg font-normal outline-none" />
          </label>
          <label className="text-base font-bold">{t.fullAddress}
            <textarea value={editing.address} onChange={(e) => setEditing({ ...editing, address: e.target.value })} rows={2} maxLength={300} className="mt-1 w-full border border-line bg-paper rounded-xl p-2.5 text-lg font-normal outline-none" />
          </label>
          <label className="text-base font-bold">{t.deliveryArea}
            <select value={zoneId(editing.area)} onChange={(e) => setEditing({ ...editing, area: e.target.value })} className="mt-1 w-full h-[42px] border border-line bg-paper rounded-xl px-3.5 text-lg">
              {zones.map((z) => <option key={z.id} value={z.id}>{zoneLabel(z, lang)}</option>)}
            </select>
          </label>
          <div className="flex gap-2">
            <button onClick={save} className="inline-flex bg-clay text-white rounded-[35px] px-6 py-2 text-[16px] font-bold hover:bg-clay-dark">{t.saveChanges}</button>
            <button onClick={() => setEditing(null)} className="inline-flex border border-line rounded-[35px] px-6 py-2 text-[16px] font-bold">✕</button>
          </div>
        </div>
      )}
    </section>
  );
}
