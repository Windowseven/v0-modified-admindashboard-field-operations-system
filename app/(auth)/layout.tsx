import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { GuestRoute } from "@/components/auth/ProtectedRoute";

export const metadata: Metadata = {
  title: "FieldSync | Access",
  description: "Sign in to FieldSync — real-time field operations management.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GuestRoute>
      <div className="min-h-screen flex bg-background">
        <div className="flex-1 flex flex-col items-center justify-center p-5 sm:p-8 overflow-y-auto">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 mb-8"
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/20">
              <ShieldCheck className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-xl tracking-tight">FieldSync</span>
          </Link>

          {/* Form card */}
          <div className="w-full max-w-[440px]">
            <div className="rounded-xl border border-border bg-card shadow-lg shadow-black/5 overflow-hidden">
              {children}
            </div>

            {/* Security note */}
            <p className="mt-8 text-center text-xs text-muted-foreground/60 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Secured with end-to-end encryption
            </p>
          </div>
        </div>
      </div>
    </GuestRoute>
  );
}
