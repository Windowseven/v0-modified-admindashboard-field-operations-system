import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  href?: string;
  subtitle?: string;
  className?: string;
  compact?: boolean;
};

export function BrandLogo({
  href = "/",
  subtitle,
  className,
  compact = false,
}: BrandLogoProps) {
  return (
    <Link href={href} className={cn("flex items-center gap-3", className)}>
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md shadow-primary/20">
        <ShieldCheck className="h-4 w-4" />
      </div>
      {!compact && (
        <div className="grid leading-tight">
          <span className="font-semibold text-sm">FieldSync</span>
          {subtitle ? (
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
              {subtitle}
            </span>
          ) : null}
        </div>
      )}
    </Link>
  );
}
