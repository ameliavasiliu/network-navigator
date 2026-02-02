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
      <div className="space-y-1" data-testid="roadmap-header">
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

      {/* Horizontal scroll task lane (matches PDF intent) */}
      <div
        className="-mx-10 overflow-x-auto px-10 pb-2"
        data-testid="scroll-roadmap-lane"
      >
        <div className="flex min-w-max items-stretch gap-4" data-testid="lane-tasks">
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

          <div
            className="w-[340px] shrink-0 rounded-xl border border-border bg-card p-5 shadow-card"
            data-testid="card-roadmap-updates"
          >
            <div className="text-sm font-semibold" data-testid="text-updates-title">
              Updates
            </div>
            <div className="mt-1 text-xs text-text-secondary" data-testid="text-updates-subtitle">
              Type here any updates so we can adjust your roadmap
            </div>
            <textarea
              className="mt-3 min-h-[120px] w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-primary"
              placeholder="Type here..."
              data-testid="textarea-roadmap-updates"
            />
            <Button
              className="mt-3 w-full rounded-full bg-primary"
              data-testid="button-save-updates"
            >
              Save updates
            </Button>
          </div>
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
        "w-[360px] shrink-0 rounded-xl border border-border bg-card shadow-card",
        locked ? "opacity-55" : "opacity-100",
      )}
      data-testid={`card-task-${task.id}`}
    >
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-lg",
              locked ? "bg-black/5" : "bg-primary-muted",
            )}
            data-testid={`badge-task-${task.id}`}
          >
            {locked ? <Lock className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
          </div>
          <div>
            <div className="text-sm font-semibold" data-testid={`text-task-title-${task.id}`}>
              Task {task.id}
            </div>
            <div className="text-xs text-text-secondary" data-testid={`text-task-name-${task.id}`}>
              {task.title}
            </div>
          </div>
        </div>

        <button
          className={cn(
            "inline-flex h-8 w-8 items-center justify-center rounded-lg",
            locked ? "cursor-not-allowed" : "hover:bg-black/5",
          )}
          onClick={() => {
            if (!locked) onToggle();
          }}
          data-testid={`button-toggle-task-${task.id}`}
          aria-disabled={locked}
        >
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", expanded ? "rotate-180" : "rotate-0")}
          />
        </button>
      </div>

      {expanded ? (
        <div className="px-5 pb-5" data-testid={`panel-task-${task.id}`}>
          <div className="text-sm font-semibold" data-testid={`text-task-main-${task.id}`}>
            {task.title}
          </div>
          <div className="mt-1 text-sm text-text-secondary" data-testid={`text-task-why-${task.id}`}>
            {task.why}
          </div>

          <div className="mt-4 rounded-xl bg-black/5 p-4" data-testid={`card-task-links-${task.id}`}>
            <div className="text-xs font-semibold" data-testid={`text-task-links-title-${task.id}`}>
              Quick links
            </div>
            <ul className="mt-2 space-y-2 text-sm" data-testid={`list-task-links-${task.id}`}>
              <li className="text-text-secondary">• LinkedIn search (placeholder)</li>
              <li className="text-text-secondary">• Outreach template (placeholder)</li>
              <li className="text-text-secondary">• Notes checklist (placeholder)</li>
            </ul>
          </div>

          <div className="mt-4">
            <Button
              className="rounded-full bg-primary"
              data-testid={`button-complete-task-${task.id}`}
              disabled={locked}
            >
              Mark as done
            </Button>
          </div>
        </div>
      ) : null}

      {locked ? (
        <div className="px-5 pb-5" data-testid={`status-task-locked-${task.id}`}>
          <div className="rounded-xl bg-black/5 p-3 text-xs text-text-secondary">
            Complete the previous task to unlock.
          </div>
        </div>
      ) : null}
    </div>
  );
}
