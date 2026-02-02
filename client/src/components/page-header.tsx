import * as React from "react";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  subtitle,
  right,
  testId,
  className,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  testId: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-6", className)} data-testid={testId}>
      <div>
        <h1 className="text-3xl font-semibold tracking-tight" data-testid={`${testId}-title`}>
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1 text-sm text-text-secondary" data-testid={`${testId}-subtitle`}>
            {subtitle}
          </p>
        ) : null}
      </div>
      {right ? <div data-testid={`${testId}-right`}>{right}</div> : null}
    </div>
  );
}
