// ============================================================
// resume-feedback-panel.tsx
// Drop this file in: client/src/components/resume-feedback-panel.tsx
//
// Usage in roadmap-view.tsx (TasksTab or wherever resume lives):
//
//   import { ResumeFeedbackPanel } from "@/components/resume-feedback-panel";
//
//   <ResumeFeedbackPanel
//     resumeText={globalResume?.parsedText ?? ""}
//     fileName={globalResume?.fileName ?? ""}
//     goal={roadmap.goal}
//     studentProfile={getStudentProfile()}
//   />
// ============================================================

import * as React from "react";
import {
  CheckCircle,
  AlertCircle,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  FileText,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useResumeFeedback,
  type ResumeDimension,
  type RetrievedChunk,
} from "@/hooks/use-rag";

// ─── Score ring ───────────────────────────────────────────────

function ScoreRing({ score }: { score: number }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 75
      ? "text-green-500"
      : score >= 50
      ? "text-yellow-500"
      : "text-red-400";

  return (
    <div className="relative flex items-center justify-center w-20 h-20">
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={radius} fill="none" stroke="currentColor" className="text-gray-100" strokeWidth="6" />
        <circle
          cx="36"
          cy="36"
          r={radius}
          fill="none"
          stroke="currentColor"
          className={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="flex flex-col items-center z-10">
        <span className={`text-xl font-bold leading-none ${color}`}>{score}</span>
        <span className="text-[10px] text-text-secondary leading-none mt-0.5">/ 100</span>
      </div>
    </div>
  );
}

// ─── Dimension row ────────────────────────────────────────────

function DimensionRow({ dim }: { dim: ResumeDimension }) {
  const [open, setOpen] = React.useState(false);

  const barColor =
    dim.score >= 75
      ? "bg-green-400"
      : dim.score >= 50
      ? "bg-yellow-400"
      : "bg-red-400";

  return (
    <div className="rounded-lg border border-border bg-white p-3">
      <button
        className="flex w-full items-center gap-3 text-left"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-text-primary">{dim.name}</span>
            <span className="text-xs font-bold text-text-secondary">{dim.score}/100</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${barColor}`}
              style={{ width: `${dim.score}%` }}
            />
          </div>
        </div>
        {open ? (
          <ChevronUp className="h-3.5 w-3.5 text-text-secondary shrink-0" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 text-text-secondary shrink-0" />
        )}
      </button>

      {open && (
        <div className="mt-3 space-y-2 pt-2 border-t border-border">
          <p className="text-xs text-text-secondary">{dim.feedback}</p>
          {dim.suggestions.length > 0 && (
            <ul className="space-y-1">
              {dim.suggestions.map((s, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-text-primary">
                  <TrendingUp className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

// ─── RAG guidance cards ───────────────────────────────────────

function GuidanceCard({ chunk }: { chunk: RetrievedChunk }) {
  const [expanded, setExpanded] = React.useState(false);
  const preview = chunk.text.slice(0, 120) + (chunk.text.length > 120 ? "…" : "");

  return (
    <div className="rounded-lg border border-primary/15 bg-primary/5 p-3">
      <div className="flex items-start gap-2">
        <Sparkles className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
        <div className="flex-1">
          <p className="text-xs text-text-primary leading-relaxed">
            {expanded ? chunk.text : preview}
          </p>
          {chunk.text.length > 120 && (
            <button
              className="mt-1 text-[10px] font-medium text-primary hover:underline"
              onClick={() => setExpanded((e) => !e)}
            >
              {expanded ? "Show less" : "Read more"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main panel ───────────────────────────────────────────────

interface ResumeFeedbackPanelProps {
  resumeText: string;
  fileName: string;
  goal: string;
  studentProfile?: { school?: string; major?: string; yearInSchool?: string };
}

export function ResumeFeedbackPanel({
  resumeText,
  fileName,
  goal,
  studentProfile = {},
}: ResumeFeedbackPanelProps) {
  const { analysis, loading, error, analyze, reset } = useResumeFeedback();
  const [hasRun, setHasRun] = React.useState(false);

  // Auto-run when resume text is available and analysis hasn't run yet
  React.useEffect(() => {
    if (resumeText && resumeText.length > 50 && !hasRun && !loading) {
      setHasRun(true);
      analyze({ resumeText, fileName, goal, studentProfile });
    }
  }, [resumeText, hasRun, loading, analyze, fileName, goal, studentProfile]);

  const handleRerun = () => {
    reset();
    setHasRun(true);
    analyze({ resumeText, fileName, goal, studentProfile });
  };

  // ── No resume uploaded ──
  if (!resumeText || resumeText.length < 50) {
    return (
      <div
        className="rounded-xl border border-dashed border-border bg-card p-6 text-center"
        data-testid="resume-feedback-empty"
      >
        <FileText className="h-8 w-8 text-text-secondary mx-auto mb-2" />
        <p className="text-sm font-semibold text-text-primary">No resume uploaded yet</p>
        <p className="text-xs text-text-secondary mt-1">
          Upload your resume in the wizard or dashboard to get personalized feedback.
        </p>
      </div>
    );
  }

  // ── Loading ──
  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card p-6" data-testid="resume-feedback-loading">
        <div className="flex items-center gap-3">
          <RefreshCw className="h-4 w-4 animate-spin text-primary" />
          <span className="text-sm text-text-secondary">Analyzing your resume…</span>
        </div>
        <div className="mt-4 space-y-2">
          {[80, 65, 55, 90].map((w, i) => (
            <div key={i} className="h-3 rounded bg-gray-100 animate-pulse" style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4" data-testid="resume-feedback-error">
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span className="text-sm font-medium">Analysis failed</span>
        </div>
        <p className="mt-1 text-xs text-red-500">{error}</p>
        <Button
          size="sm"
          variant="outline"
          className="mt-3 text-xs"
          onClick={handleRerun}
        >
          Try again
        </Button>
      </div>
    );
  }

  // ── No analysis yet ──
  if (!analysis) return null;

  const scoreLabel =
    analysis.overallScore >= 80
      ? "Strong"
      : analysis.overallScore >= 60
      ? "Good"
      : analysis.overallScore >= 40
      ? "Needs Work"
      : "Needs Significant Work";

  const scoreLabelColor =
    analysis.overallScore >= 80
      ? "text-green-600"
      : analysis.overallScore >= 60
      ? "text-yellow-600"
      : "text-red-500";

  return (
    <div className="space-y-4" data-testid="resume-feedback-panel">
      {/* Header + overall score */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-text-secondary">
              Resume Analysis
            </div>
            <div className="text-sm font-semibold text-text-primary mt-0.5 flex items-center gap-2">
              {fileName || "Your Resume"}
              <span className={`text-xs font-bold ${scoreLabelColor}`}>· {scoreLabel}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ScoreRing score={analysis.overallScore} />
            <button
              onClick={handleRerun}
              className="text-[11px] text-text-secondary hover:text-primary flex items-center gap-1"
              title="Re-run analysis"
            >
              <RefreshCw className="h-3 w-3" />
              Refresh
            </button>
          </div>
        </div>

        {/* Strengths */}
        {analysis.topStrengths.length > 0 && (
          <div className="mb-3">
            <div className="text-[10px] font-bold uppercase tracking-wider text-green-600 mb-1.5">
              Top Strengths
            </div>
            <div className="flex flex-wrap gap-1.5">
              {analysis.topStrengths.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1 rounded-full bg-green-50 border border-green-200 px-2 py-0.5 text-[11px] font-medium text-green-700"
                >
                  <CheckCircle className="h-2.5 w-2.5" />
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Improvements */}
        {analysis.topImprovements.length > 0 && (
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-600 mb-1.5">
              Priority Improvements
            </div>
            <ul className="space-y-1">
              {analysis.topImprovements.map((imp, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-text-primary">
                  <AlertCircle className="h-3 w-3 text-amber-500 mt-0.5 shrink-0" />
                  {imp}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Dimension breakdown */}
      <div className="space-y-2" data-testid="resume-dimensions">
        <div className="text-xs font-bold uppercase tracking-wider text-text-secondary px-1">
          Breakdown
        </div>
        {analysis.dimensions.map((dim) => (
          <DimensionRow key={dim.name} dim={dim} />
        ))}
      </div>

      {/* RAG-retrieved guidance */}
      {analysis.retrievedGuidance.length > 0 && (
        <div className="space-y-2" data-testid="resume-rag-guidance">
          <div className="text-xs font-bold uppercase tracking-wider text-text-secondary px-1">
            Relevant Guidance
          </div>
          {analysis.retrievedGuidance.map((chunk) => (
            <GuidanceCard key={chunk.id} chunk={chunk} />
          ))}
        </div>
      )}
    </div>
  );
}
