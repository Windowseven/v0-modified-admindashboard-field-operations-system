// ============================================================
// FieldSync – Next.js Middleware
// FILE: middleware.ts  (place at project ROOT, alongside /app)
//
// Edge-based route protection:
//   ✅ Redirects unauthenticated users to /auth/login
//   ✅ Redirects unauthorized roles to /unauthorized
//   ✅ Redirects logged-in users away from auth pages
//   ✅ HTTPS enforcement in production
//   ✅ Security headers on every response
// ============================================================

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ─── Route configuration ──────────────────────────────────────
const GUEST_ONLY = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-otp",
];

const PUBLIC_ROUTES = ["/", "/unauthorized", "/api/auth/login", "/api/auth/refresh", "/api/auth/csrf"];

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

// ─── Edge-safe JWT decode ────────────────────────────────────
// Edge runtime doesn't have full Node.js — parse JWT manually
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
  // Add 30s buffer
  return payload.exp < Math.floor(Date.now() / 1000) + 30;
}

// ─── Security headers ─────────────────────────────────────────
function addSecurityHeaders(response: NextResponse): void {
  // Prevent MIME sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");

  // Prevent clickjacking
  response.headers.set("X-Frame-Options", "DENY");

  // XSS Protection (legacy browsers)
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // Referrer policy
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Permissions policy
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(self), interest-cohort=()"
  );

  // HSTS (HTTPS only)
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload"
    );
  }

  // Content Security Policy (adjust for your CDN/fonts/APIs)
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'", // Remove unsafe-inline once you can use nonces
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    `connect-src 'self' ${process.env.NEXT_PUBLIC_API_URL ?? ""} ${process.env.NEXT_PUBLIC_WS_URL ?? ""}`,
    "img-src 'self' data: https:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ]
    .filter(Boolean)
    .join("; ");

  response.headers.set("Content-Security-Policy", csp);
}

// ─── Main middleware ─────────────────────────────────────────
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ─── HTTPS enforcement (production) ───────────────────────
  if (
    process.env.NODE_ENV === "production" &&
    request.headers.get("x-forwarded-proto") === "http"
  ) {
    return NextResponse.redirect(
      `https://${request.headers.get("host")}${request.nextUrl.pathname}${request.nextUrl.search}`,
      301
    );
  }

  // ─── Public routes — always allow ─────────────────────────
  if (PUBLIC_ROUTES.some((r) => pathname.startsWith(r))) {
    const response = NextResponse.next();
    addSecurityHeaders(response);
    return response;
  }

  // ─── Get token from cookie (HTTP-only) or Authorization header ─
  const cookieToken = request.cookies.get("fs_access_token")?.value;
  const headerToken = request.headers.get("Authorization")?.replace("Bearer ", "");
  const token = cookieToken ?? headerToken ?? null;

  // ─── Guest-only routes ────────────────────────────────────
  if (GUEST_ONLY.some((r) => pathname.startsWith(r))) {
    if (token) {
      const payload = decodeJwtEdge(token);
      if (payload && !isTokenExpired(payload) && payload.role) {
        // Logged-in user shouldn't be on auth pages — redirect to dashboard
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

  // ─── Protected routes: require auth ──────────────────────
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("reason", "unauthenticated");
    loginUrl.searchParams.set("callbackUrl", pathname);

    const response = NextResponse.redirect(loginUrl);
    addSecurityHeaders(response);
    return response;
  }

  // ─── Validate token ───────────────────────────────────────
  const payload = decodeJwtEdge(token);

  if (!payload || isTokenExpired(payload)) {
    // Token expired — send to login
    // Client will handle refresh; middleware just blocks access
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("reason", "token_expired");
    loginUrl.searchParams.set("callbackUrl", pathname);

    const response = NextResponse.redirect(loginUrl);
    // Clear stale token cookie
    response.cookies.delete("fs_access_token");
    addSecurityHeaders(response);
    return response;
  }

  const role = payload.role;

  if (!role || !ROLE_ROUTES[role]) {
    // Unknown role — send to unauthorized
    const response = NextResponse.redirect(new URL("/unauthorized", request.url));
    addSecurityHeaders(response);
    return response;
  }

  // ─── Role-based route access ──────────────────────────────
  const allowedPrefixes = ROLE_ROUTES[role];
  const canAccess = allowedPrefixes.some((prefix) => pathname.startsWith(prefix));

  if (!canAccess) {
    const response = NextResponse.redirect(new URL("/unauthorized", request.url));
    addSecurityHeaders(response);
    return response;
  }

  // ─── All checks passed — allow ────────────────────────────
  const response = NextResponse.next();
  addSecurityHeaders(response);
  return response;
}

// ─── Matcher: which paths middleware runs on ─────────────────
export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder files
     * - API routes that don't need auth
     */
    "/((?!_next/static|_next/image|favicon.ico|icons|images|fonts|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};
