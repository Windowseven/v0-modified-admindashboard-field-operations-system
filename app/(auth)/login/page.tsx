"use client";

// ============================================================
// FieldSync – Login Page
// FILE: app/(auth)/login/page.tsx
//
// Features:
//   - Form validation with real-time feedback
//   - Rate limiting (client-side lockout)
//   - Remember Me
//   - Auth redirect messages (inactivity, expired, etc.)
//   - Password visibility toggle
//   - Loading/disabled states on submit
//   - Security: generic error messages
// ============================================================

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2, ShieldCheck, AlertCircle, Clock } from "lucide-react";
import { useLogin, useAuthRedirect } from "@/hooks/useAuthExtensions";
import { validateLoginForm } from "@/lib/security/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const {
    login,
    isLoading,
    error,
    clearError,
    attemptsRemaining,
    isLockedOut,
    lockoutSecondsRemaining,
  } = useLogin();

  const redirectMessage = useAuthRedirect();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});
  const [touched, setTouched] = useState({ email: false, password: false });

  const emailRef = useRef<HTMLInputElement>(null);

  // Auto-focus email on mount
  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  // Clear API error when user types
  useEffect(() => {
    if (error) clearError();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, password]);

  // Real-time validation for touched fields
  useEffect(() => {
    const errors = validateLoginForm(email, password);
    const visibleErrors: typeof formErrors = {};
    if (touched.email && errors.email) visibleErrors.email = errors.email;
    if (touched.password && errors.password) visibleErrors.password = errors.password;
    setFormErrors(visibleErrors);
  }, [email, password, touched]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLockedOut) return;

    // Mark all fields touched on submit
    setTouched({ email: true, password: true });

    const errors = validateLoginForm(email, password);
    if (errors.email || errors.password) {
      setFormErrors(errors);
      return;
    }

    await login({ email: email.trim(), password, rememberMe });
  };

  const attemptWarning =
    !isLockedOut && attemptsRemaining < MAX_ATTEMPTS_DISPLAY && attemptsRemaining > 0;

  return (
    <>

      <CardHeader className="text-center space-y-2 border-b">
        <div className="mx-auto inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-primary-foreground">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
        <CardDescription>Sign in to your FieldSync account</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Redirect message (inactivity, expired session, etc.) */}
        {redirectMessage && (
          <Alert variant="default" className="border-amber-200 bg-amber-50 dark:bg-amber-950/30">
            <Clock className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-700 dark:text-amber-400 text-sm">
              {redirectMessage}
            </AlertDescription>
          </Alert>
        )}

        {/* Lockout warning */}
        {isLockedOut && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Too many failed attempts. Please wait{" "}
              <span className="font-semibold tabular-nums">{lockoutSecondsRemaining}s</span>{" "}
              before trying again.
            </AlertDescription>
          </Alert>
        )}

        {/* API error (generic message — no email/password specifics) */}
        {error && !isLockedOut && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Attempt warning */}
        {attemptWarning && (
          <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-950/30">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-700 dark:text-orange-400 text-sm">
              {attemptsRemaining} attempt{attemptsRemaining === 1 ? "" : "s"} remaining before
              temporary lockout.
            </AlertDescription>
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-medium">
              Email address
            </Label>
            <Input
              id="email"
              ref={emailRef}
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              placeholder="you@fieldsync.com"
              className={cn(
                formErrors.email && "border-destructive focus-visible:ring-destructive"
              )}
              disabled={isLoading || isLockedOut}
              aria-describedby={formErrors.email ? "email-error" : undefined}
              aria-invalid={!!formErrors.email}
            />
            {formErrors.email && (
              <p id="email-error" className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                {formErrors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Link
                href="/forgot-password"
                className="text-xs text-primary hover:underline"
                tabIndex={-1}
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                placeholder="Enter your password"
                className={cn(
                  "pr-10",
                  formErrors.password && "border-destructive focus-visible:ring-destructive"
                )}
                disabled={isLoading || isLockedOut}
                aria-describedby={formErrors.password ? "password-error" : undefined}
                aria-invalid={!!formErrors.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {formErrors.password && (
              <p id="password-error" className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                {formErrors.password}
              </p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="rememberMe"
              checked={rememberMe}
              onCheckedChange={(v) => setRememberMe(v === true)}
              disabled={isLoading}
            />
            <Label
              htmlFor="rememberMe"
              className="text-sm text-muted-foreground cursor-pointer select-none"
            >
              Keep me signed in
            </Label>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || isLockedOut}
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Signing in…
              </>
            ) : isLockedOut ? (
              <>
                <Clock className="w-4 h-4 mr-2" />
                Locked ({lockoutSecondsRemaining}s)
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 border-t">
        <p className="text-center text-xs text-muted-foreground w-full">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary hover:underline font-medium">
            Request access
          </Link>
        </p>

        <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground/60 w-full">
          <ShieldCheck className="w-3 h-3" />
          <span>Protected by FieldSync Security</span>
        </div>
      </CardFooter>
    </>
  );
}

const MAX_ATTEMPTS_DISPLAY = 3;
