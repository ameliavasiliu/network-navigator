import * as React from "react";
import { cn } from "@/lib/utils";

// Small white KPI cards used on the Dashboard.
// Mirrors style reference: soft shadow, subtle border, compact label + value.
export function KpiCard({
  label,
  value,
  helper,
  testId,
  className,
}: {
  label: string;
  value: string;
  helper: string;
  testId: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-4 shadow-card",
        className,
      )}
      data-testid={testId}
    >
      <div className="text-xs font-medium text-text-secondary" data-testid={`${testId}-label`}>
        {label}
      </div>
      <div className="mt-1 text-2xl font-semibold" data-testid={`${testId}-value`}>
        {value}
      </div>
      <div className="mt-1 text-xs text-text-secondary" data-testid={`${testId}-helper`}>
        {helper}
      </div>
    </div>
  );
}
