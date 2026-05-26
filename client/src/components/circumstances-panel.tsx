// ============================================================
// circumstances-panel.tsx
// Drop this file in: client/src/components/circumstances-panel.tsx
//
// Replaces the existing RoadmapTab circumstances section.
// Keeps the existing visual style but adds:
//   - RAG-powered message and action items
//   - Urgency indicators
//   - Retrieved knowledge guidance
//   - Still calls updateCircumstances() to keep context in sync
//
// Usage in roadmap-view.tsx RoadmapTab:
//
//   import { CircumstancesPanel } from "@/components/circumstances-panel";
//
//   <CircumstancesPanel
//     roadmap={roadmap}
//     updateCircumstances={updateCircumstances}
//   />
// ============================================================

import * as React from "react";
import {
  RefreshCw,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Sparkles,
  Loader2,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCircumstances, type CircumstanceResult } from "@/hooks/use-rag";

const URGENCY_CONFIG = {
  high: {
    label: "High Priority",
    bgClass: "bg-red-50 border-red-200",
    labelClass: "text-red-600 bg-red-100",
    dotClass: "bg-red-500",
  },
  medium: {
    label: "Action Needed",
    bgClass: "bg-amber-50 border-amber-200",
    labelClass: "text-amber-700 bg-amber-100",
    dotClass: "bg-amber-500",
  },
  low: {
    label: "Acknowledged",
    bgClass: "bg-primary/5 border-primary/20",
    labelClass: "text-primary-dark bg-primary/10",
    dotClass: "bg-primary",
  },
};

interface CircumstancesPanelProps {
  roadmap: {
    id: string;
    goal: string;
    goalCategory: string;
    tasks: { status: string }[];
    contacts: { status: string }[];
    savedCompanies: { status: string }[];
  };
  updateCircumstances: (text: string) => void;
}

export function CircumstancesPanel({
  roadmap,
  updateCircumstances,
}: CircumstancesPanelProps) {
  const [text, setText] = React.useState("");
  const [lastResult, setLastResult] = React.useState<CircumstanceResult | null>(null);
  const [showGuidance, setShowGuidance] = React.useState(false);

  const { submit, loading, error } = useCircumstances();

  const completedTasks = roadmap.tasks.filter((t) => t.status === "completed").length;
  const totalTasks = roadmap.tasks.length;
  const contactCount = roadmap.contacts.length;
  const applicationCount = roadmap.savedCompanies.filter((c) =>
    ["applied", "interviewing", "offer"].includes(c.status)
  ).length;

  const handleSubmit = async () => {
    if (!text.trim() || loading) return;

    // Immediately update the roadmap context (existing behavior preserved)
    updateCircumstances(text.trim());

    // Also call the RAG endpoint for enriched guidance
    const result = await submit({
      circumstanceText: text.trim(),
      roadmapContext: {
        goal: roadmap.goal,
        goalCategory: roadmap.goalCategory,
        completedTasks,
        totalTasks,
        contactCount,
        applicationCount,
      },
    });

    if (result) {
      setLastResult(result);
      setShowGuidance(true);
    }

    setText("");
  };

  const urgency = lastResult ? URGENCY_CONFIG[lastResult.urgencyLevel] : null;

  return (
    <div
      className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4"
      data-testid="section-circumstances"
    >
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold">
          <RefreshCw className="h-4 w-4 text-primary" />
          Change in Circumstances
        </div>
        <div className="mt-1 text-xs text-text-secondary">
          Got an interview invite, a referral, a rejection, a visa update, or experiencing a delay?
          Describe what happened and your roadmap will adjust with personalized guidance.
        </div>
      </div>

      {/* Input */}
      <textarea
        className="min-h-[80px] w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
        placeholder="e.g., I just received an interview invite from McKinsey for next week..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={loading}
        data-testid="textarea-circumstances"
      />

      {/* Submit row */}
      <div className="flex items-center justify-between">
        {error && (
          <div className="flex items-center gap-1.5 text-xs text-red-500">
            <AlertCircle className="h-3.5 w-3.5" />
            {error}
          </div>
        )}
        {!error && <div />}
        <Button
          className="rounded-full bg-primary px-6 text-sm"
          onClick={handleSubmit}
          disabled={!text.trim() || loading}
          data-testid="button-save-circumstances"
        >
          {loading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
              Analyzing…
            </>
          ) : (
            "Update Roadmap"
          )}
        </Button>
      </div>

      {/* Result panel */}
      {lastResult && showGuidance && (
        <div
          className={`rounded-xl border p-4 space-y-3 ${urgency?.bgClass ?? ""}`}
          data-testid="circumstances-result"
        >
          {/* Urgency badge + message */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${urgency?.labelClass ?? ""}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${urgency?.dotClass ?? ""}`} />
                  {urgency?.label}
                </span>
              </div>
              <p className="text-sm text-text-primary font-medium leading-relaxed">
                {lastResult.message}
              </p>
            </div>
            <button
              onClick={() => setShowGuidance(false)}
              className="text-[10px] text-text-secondary hover:text-text-primary shrink-0 mt-1"
            >
              Dismiss
            </button>
          </div>

          {/* Action items */}
          {lastResult.actionItems.length > 0 && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-2">
                Recommended Actions
              </div>
              <ul className="space-y-1.5">
                {lastResult.actionItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-text-primary">
                    <ChevronRight className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* RAG guidance toggle */}
          {lastResult.retrievedGuidance.length > 0 && (
            <details className="text-xs">
              <summary className="cursor-pointer text-text-secondary hover:text-text-primary inline-flex items-center gap-1 select-none">
                <Sparkles className="h-3 w-3 text-primary" />
                View additional guidance
              </summary>
              <div className="mt-2 space-y-2">
                {lastResult.retrievedGuidance.slice(0, 2).map((chunk) => (
                  <div
                    key={chunk.id}
                    className="rounded-lg bg-white/60 border border-border p-3 text-text-secondary leading-relaxed"
                  >
                    <div className="flex items-start gap-1.5">
                      <TrendingUp className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                      <span>{chunk.text.slice(0, 200)}{chunk.text.length > 200 ? "…" : ""}</span>
                    </div>
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>
      )}
    </div>
  );
}
