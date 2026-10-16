import { useCallback, useSyncExternalStore } from "react";

/**
 * Saved vehicle ids kept in this browser's localStorage (no account sync).
 * Used for favourites and the comparison list.
 */
const EVT = "cm-ids-change";

function read(key: string): number[] {
  try {
    const v = JSON.parse(localStorage.getItem(key) ?? "[]");
    return Array.isArray(v) ? v.filter((n) => Number.isInteger(n)) : [];
  } catch {
    return [];
  }
}

function write(key: string, ids: number[]) {
  try {
    localStorage.setItem(key, JSON.stringify(ids));
  } catch {
    /* storage unavailable (private mode) — keep working without persistence */
  }
  window.dispatchEvent(new Event(EVT));
}

const snapshots = new Map<string, { raw: string | null; ids: number[] }>();
const EMPTY: number[] = [];

function snapshot(key: string) {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(key);
  } catch {
    /* ignore */
  }
  const prev = snapshots.get(key);
  if (prev && prev.raw === raw) return prev.ids;
  const ids = read(key);
  snapshots.set(key, { raw, ids });
  return ids;
}

const subscribe = (cb: () => void) => {
  window.addEventListener(EVT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVT, cb);
    window.removeEventListener("storage", cb);
  };
};

function useStoredIds(key: string, max = Infinity) {
  const ids = useSyncExternalStore(
    subscribe,
    () => snapshot(key),
    () => EMPTY,
  );
  const toggle = useCallback(
    (id: number) => {
      const cur = read(key);
      if (cur.includes(id))
        write(
          key,
          cur.filter((x) => x !== id),
        );
      else if (cur.length < max) write(key, [...cur, id]);
      else return false;
      return true;
    },
    [key, max],
  );
  const clear = useCallback(() => write(key, []), [key]);
  return {
    ids,
    toggle,
    clear,
    has: (id: number) => ids.includes(id),
    full: ids.length >= max,
    max,
  };
}

export const useFavourites = () => useStoredIds("cm-favourites");

export const COMPARE_MAX = 4;
export const useCompare = () => useStoredIds("cm-compare", COMPARE_MAX);
