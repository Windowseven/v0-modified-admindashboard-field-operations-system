"use client";

// ============================================================
// FieldSync – AuthContext
// Global authentication & authorization state provider
// ============================================================

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { useRouter } from "next/navigation";
import type {
  AuthAction,
  AuthState,
  AuthUser,
  LoginCredentials,
  UserRole,
  Permission,
} from "@/types/auth.types";
import { ROLE_DASHBOARDS, STORAGE_KEYS } from "@/types/auth.types";
import { tokenManager, activityTracker } from "./tokenManager";
import { sessionManager } from "./sessionManager";
import { hasPermission, hasAnyPermission, hasAllPermissions } from "./permissions";

// ─── Initial State ────────────────────────────────────────────
const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,    // true on boot while we hydrate from storage
  isRefreshing: false,
  error: null,
  sessionExpiry: null,
};

// ─── Reducer ──────────────────────────────────────────────────
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "AUTH_LOADING":
      return { ...state, isLoading: true, error: null };

    case "AUTH_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        sessionExpiry: action.payload.sessionExpiry,
        isAuthenticated: true,
        isLoading: false,
        isRefreshing: false,
        error: null,
      };

    case "AUTH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isRefreshing: false,
        error: action.payload,
      };

    case "AUTH_LOGOUT":
      return {
        ...initialState,
        isLoading: false,
      };

    case "TOKEN_REFRESHING":
      return { ...state, isRefreshing: true };

    case "TOKEN_REFRESHED":
      return {
        ...state,
        token: action.payload.token,
        sessionExpiry: action.payload.sessionExpiry,
        isRefreshing: false,
      };

    case "CLEAR_ERROR":
      return { ...state, error: null };

    case "UPDATE_USER":
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };

    default:
      return state;
  }
}

// ─── Context Shape ────────────────────────────────────────────
interface AuthContextValue extends AuthState {
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: (reason?: string) => void;
  refreshSession: () => Promise<void>;
  clearError: () => void;
  updateUser: (updates: Partial<AuthUser>) => void;

  // Permission helpers (convenience — avoid calling permissions.ts directly)
  can: (permission: Permission) => boolean;
  canAny: (permissions: Permission[]) => boolean;
  canAll: (permissions: Permission[]) => boolean;
  isRole: (role: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const router = useRouter();

  // ─── Logout ─────────────────────────────────────────────────
  const logout = useCallback(
    (reason = "manual") => {
      sessionManager.stop();
      sessionManager.broadcastLogout();
      tokenManager.clearAll();

      dispatch({ type: "AUTH_LOGOUT" });

      // Always send to login on logout
      router.push(`/login?reason=${reason}`);
    },
    [router]
  );

  // ─── Refresh session token ───────────────────────────────────
  const refreshSession = useCallback(async () => {
    const refreshToken = tokenManager.getRefreshToken();
    if (!refreshToken) {
      logout("no_refresh_token");
      return;
    }

    dispatch({ type: "TOKEN_REFRESHING" });

    try {
      const res = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!res.ok) throw new Error("Refresh failed");

      const data = await res.json();
      const newExpiry = Date.now() + data.expiresIn * 1000;

      tokenManager.setToken(data.token, sessionManager.isRememberMeEnabled());
      tokenManager.setExpiry(newExpiry);

      dispatch({
        type: "TOKEN_REFRESHED",
        payload: { token: data.token, sessionExpiry: newExpiry },
      });

      // Reschedule next refresh
      sessionManager.scheduleTokenRefresh(refreshSession);
    } catch {
      logout("token_expired");
    }
  }, [logout]);

  // ─── Login ──────────────────────────────────────────────────
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      dispatch({ type: "AUTH_LOADING" });

      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({ message: "Invalid credentials" }));
          // SECURITY: never expose whether email or password was wrong
          throw new Error("Invalid credentials. Please try again.");
        }

        const data = await res.json();
        const expiryMs = Date.now() + data.expiresIn * 1000;

        // Persist tokens
        tokenManager.setToken(data.token, credentials.rememberMe);
        tokenManager.setRefreshToken(data.refreshToken);
        tokenManager.setExpiry(expiryMs);
        sessionManager.setRememberMe(credentials.rememberMe ?? false);

        // Store user (non-sensitive fields only)
        try {
          const storage = credentials.rememberMe ? localStorage : sessionStorage;
          storage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
        } catch {}

        activityTracker.updateLastActivity();

        dispatch({
          type: "AUTH_SUCCESS",
          payload: {
            user: data.user,
            token: data.token,
            refreshToken: data.refreshToken,
            sessionExpiry: expiryMs,
          },
        });

        // Role-based redirect
        const dashboard = ROLE_DASHBOARDS[data.user.role as UserRole] ?? "/";
        router.push(dashboard);
      } catch (err) {
        dispatch({
          type: "AUTH_FAILURE",
          payload: err instanceof Error ? err.message : "Authentication failed",
        });
      }
    },
    [router]
  );

  // ─── Hydrate from storage on mount ───────────────────────────
  useEffect(() => {
    const hydrate = () => {
      const token = tokenManager.getToken();
      const refreshToken = tokenManager.getRefreshToken();
      const expiry = tokenManager.getExpiry();

      if (!token) {
        dispatch({ type: "AUTH_LOGOUT" });
        return;
      }

      if (tokenManager.isTokenExpired(token)) {
        // Try refresh before giving up
        if (refreshToken) {
          refreshSession();
        } else {
          tokenManager.clearAll();
          dispatch({ type: "AUTH_LOGOUT" });
        }
        return;
      }

      // Decode user from token for immediate hydration
      // (Full user object fetched from storage as backup)
      let user: AuthUser | null = null;
      try {
        const stored =
          localStorage.getItem(STORAGE_KEYS.USER) ??
          sessionStorage.getItem(STORAGE_KEYS.USER);
        if (stored) user = JSON.parse(stored);
      } catch {}

      if (!user) {
        // No user data — force re-login
        tokenManager.clearAll();
        dispatch({ type: "AUTH_LOGOUT" });
        return;
      }

      dispatch({
        type: "AUTH_SUCCESS",
        payload: {
          user,
          token,
          refreshToken: refreshToken ?? "",
          sessionExpiry: expiry ?? Date.now() + 3600 * 1000,
        },
      });
    };

    hydrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Start session monitoring after auth ─────────────────────
  useEffect(() => {
    if (!state.isAuthenticated) {
      sessionManager.stop();
      return;
    }

    sessionManager.start({
      onLogout: (reason) => logout(reason),
      onWarning: (msRemaining) => {
        // Optional: fire a toast/modal warning
        // You can dispatch a custom event here that InactivityWatcher listens to
        window.dispatchEvent(
          new CustomEvent("fs:session-warning", { detail: { msRemaining } })
        );
      },
      onRefreshNeeded: refreshSession,
    });

    return () => sessionManager.stop();
  }, [state.isAuthenticated, logout, refreshSession]);

  // ─── Permission helpers ───────────────────────────────────────
  const can = useCallback(
    (permission: Permission): boolean => {
      if (!state.user) return false;
      return hasPermission(state.user.role, permission);
    },
    [state.user]
  );

  const canAny = useCallback(
    (permissions: Permission[]): boolean => {
      if (!state.user) return false;
      return hasAnyPermission(state.user.role, permissions);
    },
    [state.user]
  );

  const canAll = useCallback(
    (permissions: Permission[]): boolean => {
      if (!state.user) return false;
      return hasAllPermissions(state.user.role, permissions);
    },
    [state.user]
  );

  const isRole = useCallback(
    (role: UserRole | UserRole[]): boolean => {
      if (!state.user) return false;
      const roles = Array.isArray(role) ? role : [role];
      return roles.includes(state.user.role);
    },
    [state.user]
  );

  const clearError = useCallback(() => dispatch({ type: "CLEAR_ERROR" }), []);
  const updateUser = useCallback(
    (updates: Partial<AuthUser>) => dispatch({ type: "UPDATE_USER", payload: updates }),
    []
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      login,
      logout,
      refreshSession,
      clearError,
      updateUser,
      can,
      canAny,
      canAll,
      isRole,
    }),
    [state, login, logout, refreshSession, clearError, updateUser, can, canAny, canAll, isRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within <AuthProvider>");
  }
  return ctx;
}

export { AuthContext };
