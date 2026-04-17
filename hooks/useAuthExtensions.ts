"use client";

// ============================================================
// FieldSync – useAuth Extensions
// Specialized hooks built on top of the core AuthContext
// ============================================================

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { tokenManager, activityTracker } from "@/lib/auth/tokenManager";
import type { LoginCredentials } from "@/types/auth.types";
import { SESSION_CONFIG } from "@/types/auth.types";

// ─── useLogin – with rate limiting and loading states ────────
interface UseLoginReturn {
  login: (credentials: LoginCredentials) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  attemptsRemaining: number;
  isLockedOut: boolean;
  lockoutSecondsRemaining: number;
}

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes

export function useLogin(): UseLoginReturn {
  const { login, isLoading, error, clearError } = useAuth();
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  // Lockout countdown
  useEffect(() => {
    if (!lockedUntil) return;

    const interval = setInterval(() => {
      const remaining = Math.ceil((lockedUntil - Date.now()) / 1000);
      if (remaining <= 0) {
        setLockedUntil(null);
        setAttempts(0);
        setLockoutRemaining(0);
      } else {
        setLockoutRemaining(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lockedUntil]);

  const handleLogin = useCallback(
    async (credentials: LoginCredentials) => {
      if (lockedUntil && Date.now() < lockedUntil) return;

      try {
        await login(credentials);
        setAttempts(0); // Reset on success
      } catch {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        if (newAttempts >= MAX_ATTEMPTS) {
          setLockedUntil(Date.now() + LOCKOUT_DURATION_MS);
        }
      }
    },
    [login, attempts, lockedUntil]
  );

  return {
    login: handleLogin,
    isLoading,
    error,
    clearError,
    attemptsRemaining: Math.max(0, MAX_ATTEMPTS - attempts),
    isLockedOut: !!lockedUntil && Date.now() < lockedUntil,
    lockoutSecondsRemaining: lockoutRemaining,
  };
}

// ─── useLogout – logout with optional confirmation ───────────
interface UseLogoutReturn {
  logout: () => void;
  confirmLogout: () => void;
  cancelLogout: () => void;
  isPendingConfirmation: boolean;
}

export function useLogout(requireConfirmation = false): UseLogoutReturn {
  const { logout } = useAuth();
  const [isPending, setIsPending] = useState(false);

  const handleLogout = useCallback(() => {
    if (requireConfirmation) {
      setIsPending(true);
    } else {
      logout("manual");
    }
  }, [logout, requireConfirmation]);

  const confirmLogout = useCallback(() => {
    setIsPending(false);
    logout("manual");
  }, [logout]);

  const cancelLogout = useCallback(() => {
    setIsPending(false);
  }, []);

  return {
    logout: handleLogout,
    confirmLogout,
    cancelLogout,
    isPendingConfirmation: isPending,
  };
}

// ─── useCurrentUser – typed user access ──────────────────────
export function useCurrentUser() {
  const { user, isAuthenticated, isLoading } = useAuth();
  return { user, isAuthenticated, isLoading };
}

// ─── useTokenExpiry – tracks token expiry in real-time ───────
export function useTokenExpiry() {
  const { token, sessionExpiry } = useAuth();
  const [msRemaining, setMsRemaining] = useState<number>(0);

  useEffect(() => {
    if (!token) {
      setMsRemaining(0);
      return;
    }

    const update = () => {
      const remaining = tokenManager.getTimeToExpiry(token);
      setMsRemaining(remaining);
    };

    update();
    const interval = setInterval(update, 5000); // update every 5s
    return () => clearInterval(interval);
  }, [token]);

  const isNearExpiry = msRemaining < SESSION_CONFIG.REFRESH_THRESHOLD_MS && msRemaining > 0;
  const isExpired = msRemaining === 0 && !!token;

  return { msRemaining, isNearExpiry, isExpired, sessionExpiry };
}

// ─── useActivityTracker – updates last-activity timestamp ────
// Mount this once in a high-level layout to track user activity
export function useActivityTracker(enabled = true) {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!enabled || !isAuthenticated) return;

    const update = () => activityTracker.updateLastActivity();

    SESSION_CONFIG.ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, update, { passive: true });
    });

    return () => {
      SESSION_CONFIG.ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, update);
      });
    };
  }, [enabled, isAuthenticated]);
}

// ─── useAuthRedirect – listen for auth-related redirects ─────
// Extracts "reason" from URL query param and returns human-readable message
export function useAuthRedirect(): string | null {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const reason = params.get("reason");

    const messages: Record<string, string> = {
      unauthenticated: "Please log in to continue.",
      token_expired: "Your session has expired. Please log in again.",
      inactivity: "You were logged out due to inactivity.",
      no_refresh_token: "Your session is invalid. Please log in again.",
      manual: "",
      cross_tab: "You were logged out from another tab.",
      session_expired: "Your session has expired. Please log in again.",
    };

    if (reason && messages[reason] !== undefined) {
      setMessage(messages[reason] || null);
    }
  }, []);

  return message;
}
