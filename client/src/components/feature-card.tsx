import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Large gradient feature cards ("Get Started")
// Visual rules from style reference:
// - Dark teal/blue gradient surface
// - Rounded corners
// - Soft inner glow
// - Mint pill CTA
export function FeatureCard({
  icon,
  title,
  description,
  onStart,
  testId,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onStart?: () => void;
  testId: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-white/10",
        "bg-[radial-gradient(1200px_420px_at_-10%_20%,rgba(101,214,168,0.20),transparent_60%),linear-gradient(90deg,#0E2B2D_0%,#0E3A57_55%,#0C2E4B_100%)]",
        "shadow-card",
        className,
      )}
      data-testid={testId}
    >
      <div className="flex h-full flex-col gap-2 p-6">
        <div className="mb-1 text-white/85" data-testid={`${testId}-icon`}>
          {icon}
        </div>
        <div className="text-lg font-semibold text-white" data-testid={`${testId}-title`}>
          {title}
        </div>
        <div
          className="max-w-[46ch] text-sm leading-5 text-white/70"
          data-testid={`${testId}-description`}
        >
          {description}
        </div>

        <div className="mt-auto pt-3">
          <Button
            onClick={onStart}
            className={cn(
              "h-8 rounded-full px-4 text-xs",
              "bg-primary text-text-primary border border-transparent",
              "hover:bg-primary hover:opacity-95",
            )}
            data-testid={`${testId}-button-start`}
          >
            Start
          </Button>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-0 rounded-xl"
        style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)" }}
        aria-hidden
      />
    </div>
  );
}
