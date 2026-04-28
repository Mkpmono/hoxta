// Persistent dismiss helper — survives clearing only one storage layer
// Stores timestamp in cookie + localStorage + sessionStorage simultaneously.

function setCookie(name: string, value: string, maxAgeSeconds: number) {
  try {
    const secure = location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAgeSeconds}; Path=/; SameSite=Lax${secure}`;
  } catch {
    /* ignore */
  }
}

function getCookie(name: string): string | null {
  try {
    const match = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/[.$?*|{}()[\]\\/+^]/g, "\\$&") + "=([^;]*)"));
    return match ? decodeURIComponent(match[1]) : null;
  } catch {
    return null;
  }
}

export function isDismissed(key: string, durationMs: number): boolean {
  const now = Date.now();
  const candidates: (string | null)[] = [];
  try { candidates.push(localStorage.getItem(key)); } catch { /* ignore */ }
  try { candidates.push(sessionStorage.getItem(key)); } catch { /* ignore */ }
  candidates.push(getCookie(key));

  for (const raw of candidates) {
    if (!raw) continue;
    const ts = Number(raw);
    if (Number.isFinite(ts) && now - ts < durationMs) return true;
  }
  return false;
}

export function markDismissed(key: string, durationMs: number) {
  const ts = String(Date.now());
  try { localStorage.setItem(key, ts); } catch { /* ignore */ }
  try { sessionStorage.setItem(key, ts); } catch { /* ignore */ }
  setCookie(key, ts, Math.ceil(durationMs / 1000));
}
