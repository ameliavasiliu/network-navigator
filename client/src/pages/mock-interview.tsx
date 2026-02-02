import * as React from "react";
import { PageHeader } from "@/components/page-header";

export default function MockInterview() {
  return (
    <div className="space-y-6" data-testid="screen-mock-interview">
      <PageHeader
        title="Mock Interview Tool"
        subtitle="UI placeholder for MVP navigation."
        testId="header-mock-interview"
      />

      <div
        className="rounded-xl border border-border bg-card p-6 shadow-card"
        data-testid="card-mock-interview-placeholder"
      >
        <div className="text-sm text-text-secondary" data-testid="text-mock-interview-placeholder">
          This screen is intentionally minimal for the MVP skeleton.
        </div>
      </div>
    </div>
  );
}
