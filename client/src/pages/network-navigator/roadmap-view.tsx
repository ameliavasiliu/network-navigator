import * as React from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown, Lock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type Task = {
  id: string;
  title: string;
  why: string;
  status: "available" | "locked";
};

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Connect with top consultants",
    why: "This is important because it will advance your career.",
    status: "available",
  },
  {
    id: "2",
    title: "Send 5 outreach messages",
    why: "Build momentum and learn from responses.",
    status: "locked",
  },
  {
    id: "3",
    title: "Book 2 informational calls",
    why: "Convert conversations into concrete next steps.",
    status: "locked",
  },
];

export default function RoadmapView() {
  const params = useParams();
  const [expandedId, setExpandedId] = React.useState<string>("1");

  return (
    <div className="space-y-6" data-testid="screen-roadmap-view">
      <div className="space-y-1 pb-6 border-b border-border" data-testid="roadmap-header">
        <div className="text-xs font-medium text-text-secondary" data-testid="text-roadmap-kicker">
          Goal
        </div>
        <div className="text-2xl font-semibold" data-testid="text-roadmap-goal">
          Become a consultant at a top firm
        </div>
        <div className="text-xs text-text-secondary" data-testid="text-roadmap-id">
          Roadmap ID: {params.id}
        </div>
      </div>

      {/* Horizontal scroll task lane */}
      <div
        className="-mx-10 overflow-x-auto px-10 pb-4"
        data-testid="scroll-roadmap-lane"
      >
        <div className="flex min-w-max items-start gap-6" data-testid="lane-tasks">
          {mockTasks.map((t) => {
            const isExpanded = expandedId === t.id;
            const isLocked = t.status === "locked";

            return (
              <TaskCard
                key={t.id}
                task={t}
                locked={isLocked}
                expanded={isExpanded}
                onToggle={() => setExpandedId((cur) => (cur === t.id ? "" : t.id))}
              />
            );
          })}
        </div>
      </div>

      {/* Updates Section (Moved to bottom) */}
      <div
        className="rounded-xl border border-border bg-card p-6 shadow-sm"
        data-testid="section-roadmap-updates"
      >
        <div className="text-sm font-semibold" data-testid="text-updates-title">
          Weekly Progress Updates
        </div>
        <div className="mt-1 text-xs text-text-secondary" data-testid="text-updates-subtitle">
          Share your progress or roadblocks so we can adjust your roadmap if needed. (Optional)
        </div>
        <textarea
          className="mt-4 min-h-[100px] w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
          placeholder="I messaged 3 alumni this week and..."
          data-testid="textarea-roadmap-updates"
        />
        <div className="mt-3 flex justify-end">
          <Button
            className="rounded-full bg-primary px-6"
            data-testid="button-save-updates"
          >
            Save update
          </Button>
        </div>
      </div>
    </div>
  );
}

function TaskCard({
  task,
  locked,
  expanded,
  onToggle,
}: {
  task: Task;
  locked: boolean;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={cn(
        "w-[340px] shrink-0 rounded-xl border border-border bg-card shadow-sm transition-all duration-200",
        locked ? "opacity-60 bg-gray-50/50" : "opacity-100 hover:shadow-md",
        expanded ? "ring-1 ring-primary/20" : ""
      )}
      data-testid={`card-task-${task.id}`}
    >
      {/* Collapsed header */}
      <div
        className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3"
        data-testid={`row-task-header-${task.id}`}
        onClick={() => {
          if (!locked) onToggle();
        }}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border",
              locked ? "bg-gray-100 border-gray-200 text-gray-400" : "bg-primary/10 border-primary/10 text-primary-dark",
            )}
            data-testid={`badge-task-${task.id}`}
          >
            {locked ? <Lock className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
          </div>

          <div className="min-w-0">
            <div
              className={cn("truncate text-sm font-semibold", locked ? "text-text-secondary" : "text-text-primary")}
              data-testid={`text-task-title-${task.id}`}
            >
              {task.title}
            </div>
          </div>
        </div>

        <button
          className={cn(
            "inline-flex h-6 w-6 items-center justify-center rounded-md transition-colors",
            locked ? "cursor-not-allowed text-gray-300" : "text-text-secondary hover:bg-black/5",
          )}
          aria-disabled={locked}
          aria-label={expanded ? "Collapse task" : "Expand task"}
        >
          <ChevronDown
            className={cn("h-4 w-4 transition-transform duration-200", expanded ? "rotate-180" : "rotate-0")}
          />
        </button>
      </div>

      {/* Expanded content */}
      {expanded ? (
        <div className="px-4 pb-4 pt-1" data-testid={`panel-task-${task.id}`}>
          <div className="space-y-4">
             {/* Description & Why */}
             <div className="rounded-lg bg-gray-50 p-3 text-sm text-text-secondary">
               <span className="font-semibold text-text-primary">Why:</span> {task.why}
             </div>

             {/* How to do this */}
             <div>
                <div className="text-xs font-bold uppercase tracking-wider text-text-secondary/70">
                  Recommended Approach
                </div>
                <div className="mt-1 text-sm leading-relaxed text-text-primary">
                  Start by identifying 5 alumni on LinkedIn. Use the filter tools to find people who studied {task.title.toLowerCase().includes("consultant") ? "Economics" : "your major"}.
                </div>
             </div>

             {/* Resources */}
             <div>
                <div className="text-xs font-bold uppercase tracking-wider text-text-secondary/70">
                  Resources
                </div>
                <ul className="mt-2 space-y-2">
                  <li className="flex items-center gap-2 text-sm text-primary underline underline-offset-2 cursor-pointer hover:text-primary-dark">
                    <span>📄</span> LinkedIn Search Guide
                  </li>
                  <li className="flex items-center gap-2 text-sm text-primary underline underline-offset-2 cursor-pointer hover:text-primary-dark">
                    <span>💬</span> Cold Outreach Template
                  </li>
                </ul>
             </div>

             <div className="pt-2">
                <Button
                  className="w-full rounded-full bg-primary font-medium hover:brightness-95"
                  data-testid={`button-complete-task-${task.id}`}
                >
                  Mark as Complete
                </Button>
             </div>
          </div>
        </div>
      ) : null}

      {locked ? (
        <div className="px-4 pb-4" data-testid={`status-task-locked-${task.id}`}>
          <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-2 text-xs text-text-secondary">
             <Lock className="h-3 w-3" />
             <span>Complete previous task to unlock</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
