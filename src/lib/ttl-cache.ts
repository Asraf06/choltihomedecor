type Entry = { at: number; val: Promise<unknown> };

const store = new Map<string, Entry>();

export function ttlCache<T>(key: string, ttlMs: number, fn: () => Promise<T>): Promise<T> {
  const hit = store.get(key);
  if (hit && Date.now() - hit.at < ttlMs) return hit.val as Promise<T>;
  const p = fn();
  store.set(key, { at: Date.now(), val: p });
  p.catch(() => {
    if (store.get(key)?.val === p) store.delete(key);
  });
  return p;
}
