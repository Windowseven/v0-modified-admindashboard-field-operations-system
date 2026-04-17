// ============================================================
// FieldSync – CSRF Protection
// Manages CSRF tokens for requests that use cookies
// ============================================================

import { STORAGE_KEYS } from "@/types/auth.types";

// ─── CSRF Token Manager ──────────────────────────────────────
// When using HTTP-only cookies for auth, CSRF protection is critical.
// The backend sets a CSRF token in a readable cookie or response header.
// Frontend reads it and sends it as a request header on every mutation.

export const csrfManager = {
  // Get CSRF token from cookie or storage
  getToken(): string | null {
    if (typeof window === "undefined") return null;

    // 1. Try reading from the backend-set CSRF cookie (readable, not HTTP-only)
    const cookieToken = this.getCookieToken("XSRF-TOKEN");
    if (cookieToken) return cookieToken;

    // 2. Fallback: in-memory session storage
    try {
      return sessionStorage.getItem(STORAGE_KEYS.CSRF_TOKEN);
    } catch {
      return null;
    }
  },

  // Store CSRF token (when received from API response header)
  setToken(token: string): void {
    if (typeof window === "undefined") return;
    try {
      sessionStorage.setItem(STORAGE_KEYS.CSRF_TOKEN, token);
    } catch {}
  },

  // Clear CSRF token on logout
  clearToken(): void {
    if (typeof window === "undefined") return;
    try {
      sessionStorage.removeItem(STORAGE_KEYS.CSRF_TOKEN);
    } catch {}
  },

  // Read a specific cookie by name
  getCookieToken(name: string): string | null {
    if (typeof document === "undefined") return null;

    const match = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`));

    return match ? decodeURIComponent(match.split("=")[1]) : null;
  },

  // Generate a random CSRF token (for SPA without backend-provided one)
  generateToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
  },
};

// ─── Fetch CSRF token from backend on mount ───────────────────
// Call this once in your app root (e.g. in AuthProvider or layout)
export async function initializeCsrf(): Promise<void> {
  try {
    const res = await fetch("/api/auth/csrf", {
      method: "GET",
      credentials: "include",
    });

    if (res.ok) {
      // Backend may return token in response header or body
      const token =
        res.headers.get("X-CSRF-Token") ??
        (await res.json().then((d) => d.csrfToken).catch(() => null));

      if (token) csrfManager.setToken(token);
    }
  } catch {
    // Non-fatal: CSRF init failure shouldn't break the app
    // Mutations will just not have CSRF token (backend should handle gracefully)
  }
}
