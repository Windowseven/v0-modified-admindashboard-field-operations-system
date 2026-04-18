// ============================================================
// FieldSync – Next.js Middleware (UPDATED)
// FILE: middleware.ts
//
// Changes from original:
//   + Added /api/auth/register, /api/auth/verify-otp,
//     /api/auth/resend-otp, /api/auth/forgot-password,
//     /api/auth/reset-password to PUBLIC_ROUTES
//   + Added /verify-otp route to GUEST_ONLY list (was missing)
// ============================================================

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ─── Route configuration ──────────────────────────────────────
const GUEST_ONLY = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-otp",         // ← ensure this is present
];

const PUBLIC_ROUTES = [
  "/",
  "/unauthorized",
  // Auth API endpoints — no token needed for these
  "/api/auth/login",
  "/api/auth/refresh",
  "/api/auth/csrf",
  "/api/auth/register",         // NEW
  "/api/auth/verify-otp",       // NEW
  "/api/auth/resend-otp",       // NEW
  "/api/auth/forgot-password",  // NEW
  "/api/auth/reset-password",   // NEW
];

// Role → allowed path prefixes
const ROLE_ROUTES: Record<string, string[]> = {
  admin: ["/dashboard", "/supervisor", "/teamleader", "/user"],
  supervisor: ["/supervisor", "/teamleader", "/user"],
  team_leader: ["/teamleader", "/user"],
  field_worker: ["/user"],
};

// Role → home dashboard
const ROLE_HOME: Record<string, string> = {
  admin: "/dashboard",
  supervisor: "/supervisor",
  team_leader: "/teamleader",
  field_worker: "/user",
};

// ─── Edge-safe JWT decode ─────────────────────────────────────
function decodeJwtEdge(token: string): { role?: string; exp?: number } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch {
    return null;
  }
}

function isTokenExpired(payload: { exp?: number }): boolean {
  if (!payload.exp) return true;
  return payload.exp < Math.floor(Date.now() / 1000) + 30;
}

// ─── Security headers ─────────────────────────────────────────
function addSecurityHeaders(response: NextResponse): void {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(self), interest-cohort=()"
  );

  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload"
    );
  }

  const isDev = process.env.NODE_ENV === "development";

  const csp = isDev 
    ? [
        "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:",
        "script-src * 'unsafe-inline' 'unsafe-eval' data: blob:",
        "connect-src * 'unsafe-inline' 'unsafe-eval' ws: wss:",
        "img-src * data: blob: https:",
        "style-src * 'unsafe-inline'",
        "font-src * data:",
        "frame-ancestors 'none'",
      ]
    : [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline'",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com",
        "font-src 'self' https://fonts.gstatic.com data:",
        "connect-src 'self' https: ws: wss:",
        "img-src 'self' data: https: blob:",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ];

  response.headers.set("Content-Security-Policy", csp.join("; "));
}

// ─── Main middleware ──────────────────────────────────────────
export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // HTTPS enforcement (production)
  if (
    process.env.NODE_ENV === "production" &&
    request.headers.get("x-forwarded-proto") === "http"
  ) {
    return NextResponse.redirect(
      `https://${request.headers.get("host")}${request.nextUrl.pathname}${
        request.nextUrl.search
      }`,
      301
    );
  }

  // Public routes — always allow
  if (PUBLIC_ROUTES.some((r) => pathname.startsWith(r))) {
    const response = NextResponse.next();
    addSecurityHeaders(response);
    return response;
  }

  // Get token from cookie or Authorization header
  const cookieToken = request.cookies.get("fs_access_token")?.value;
  const headerToken = request.headers.get("Authorization")?.replace("Bearer ", "");
  const token = cookieToken ?? headerToken ?? null;

  // Guest-only routes (redirect logged-in users to their dashboard)
  if (GUEST_ONLY.some((r) => pathname.startsWith(r))) {
    if (token) {
      const payload = decodeJwtEdge(token);
      if (payload && !isTokenExpired(payload) && payload.role) {
        const dashboard = ROLE_HOME[payload.role] ?? "/";
        const response = NextResponse.redirect(new URL(dashboard, request.url));
        addSecurityHeaders(response);
        return response;
      }
    }
    const response = NextResponse.next();
    addSecurityHeaders(response);
    return response;
  }

  // Protected routes: require auth
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("reason", "unauthenticated");
    loginUrl.searchParams.set("callbackUrl", pathname);
    const response = NextResponse.redirect(loginUrl);
    addSecurityHeaders(response);
    return response;
  }

  // Validate token
  const payload = decodeJwtEdge(token);
  if (!payload || isTokenExpired(payload)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("reason", "token_expired");
    loginUrl.searchParams.set("callbackUrl", pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("fs_access_token");
    addSecurityHeaders(response);
    return response;
  }

  const role = payload.role;
  if (!role || !ROLE_ROUTES[role]) {
    const response = NextResponse.redirect(new URL("/unauthorized", request.url));
    addSecurityHeaders(response);
    return response;
  }

  // Role-based route access
  const allowedPrefixes = ROLE_ROUTES[role];
  const canAccess = allowedPrefixes.some((prefix) => pathname.startsWith(prefix));
  if (!canAccess) {
    const response = NextResponse.redirect(new URL("/unauthorized", request.url));
    addSecurityHeaders(response);
    return response;
  }

  // All checks passed
  const response = NextResponse.next();
  addSecurityHeaders(response);
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icons|images|fonts|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};
