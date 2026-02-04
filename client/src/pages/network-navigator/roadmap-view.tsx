import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown, Lock, Sparkles, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRoadmap, Task } from "@/context/roadmap-context";

export default function RoadmapView() {
  const params = useParams();
  const navigate = useNavigate();
  const { roadmaps, setCurrentRoadmap, completeTask, addProgressUpdate } = useRoadmap();
  const [expandedId, setExpandedId] = React.useState<string>("");
  const [updateText, setUpdateText] = React.useState("");

  const roadmap = roadmaps.find((r) => r.id === params.roadmapId);

  React.useEffect(() => {
    if (params.roadmapId) {
      setCurrentRoadmap(params.roadmapId);
    }
  }, [params.roadmapId, setCurrentRoadmap]);

  React.useEffect(() => {
    if (roadmap && roadmap.tasks.length > 0 && !expandedId) {
      const firstUnlocked = roadmap.tasks.find((t) => t.status === "unlocked");
      if (firstUnlocked) {
        setExpandedId(firstUnlocked.id);
      }
    }
  }, [roadmap, expandedId]);

  if (!roadmap) {
    return (
      <div className="space-y-6" data-testid="screen-roadmap-view">
        <div className="text-center py-12">
          <div className="text-lg font-semibold text-text-primary">Roadmap not found</div>
          <div className="text-sm text-text-secondary mt-2">
            This roadmap may have been deleted or doesn't exist.
          </div>
          <Button
            className="mt-4 rounded-full bg-primary"
            onClick={() => navigate("/network-navigator")}
          >
            Back to Network Navigator
          </Button>
        </div>
      </div>
    );
  }

  const handleCompleteTask = (taskId: string) => {
    completeTask(taskId);
    const taskIndex = roadmap.tasks.findIndex((t) => t.id === taskId);
    const nextTask = roadmap.tasks[taskIndex + 1];
    if (nextTask) {
      setExpandedId(nextTask.id);
    }
  };

  const handleSaveUpdate = () => {
    if (updateText.trim()) {
      addProgressUpdate(updateText);
      setUpdateText("");
    }
  };

  const completedCount = roadmap.tasks.filter((t) => t.status === "completed").length;
  const progressPercent = Math.round((completedCount / roadmap.tasks.length) * 100);

  return (
    <div className="space-y-6" data-testid="screen-roadmap-view">
      <div className="space-y-1 pb-6 border-b border-border" data-testid="roadmap-header">
        <div className="text-xs font-medium text-text-secondary" data-testid="text-roadmap-kicker">
          Goal
        </div>
        <div className="text-2xl font-semibold" data-testid="text-roadmap-goal">
          {roadmap.goal || "Your Career Goal"}
        </div>
        <div className="flex items-center gap-4 text-xs text-text-secondary" data-testid="text-roadmap-progress">
          <span>{completedCount} of {roadmap.tasks.length} tasks completed</span>
          <span>·</span>
          <span>{progressPercent}% complete</span>
        </div>
      </div>

      {/* Horizontal scroll task lane */}
      <div
        className="-mx-10 overflow-x-auto px-10 pb-4"
        data-testid="scroll-roadmap-lane"
      >
        <div className="flex min-w-max items-start gap-6" data-testid="lane-tasks">
          {roadmap.tasks.map((t) => {
            const isExpanded = expandedId === t.id;
            const isLocked = t.status === "locked";
            const isCompleted = t.status === "completed";

            return (
              <TaskCard
                key={t.id}
                task={t}
                locked={isLocked}
                completed={isCompleted}
                expanded={isExpanded}
                onToggle={() => setExpandedId((cur) => (cur === t.id ? "" : t.id))}
                onComplete={() => handleCompleteTask(t.id)}
              />
            );
          })}
        </div>
      </div>

      {/* Updates Section */}
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
          value={updateText}
          onChange={(e) => setUpdateText(e.target.value)}
          data-testid="textarea-roadmap-updates"
        />
        <div className="mt-3 flex justify-end">
          <Button
            className="rounded-full bg-primary px-6"
            onClick={handleSaveUpdate}
            data-testid="button-save-updates"
          >
            Save update
          </Button>
        </div>

        {roadmap.updates.length > 0 && (
          <div className="mt-6 space-y-3" data-testid="list-updates">
            <div className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Previous Updates
            </div>
            {roadmap.updates.map((update) => (
              <div
                key={update.id}
                className="rounded-lg bg-gray-50 p-3 text-sm"
                data-testid={`update-${update.id}`}
              >
                <div className="text-text-primary">{update.content}</div>
                <div className="mt-1 text-xs text-text-secondary">
                  {new Date(update.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TaskCard({
  task,
  locked,
  completed,
  expanded,
  onToggle,
  onComplete,
}: {
  task: Task;
  locked: boolean;
  completed: boolean;
  expanded: boolean;
  onToggle: () => void;
  onComplete: () => void;
}) {
  return (
    <div
      className={cn(
        "w-[340px] shrink-0 rounded-xl border border-border bg-card shadow-sm transition-all duration-200",
        locked ? "opacity-60 bg-gray-50/50" : "opacity-100 hover:shadow-md",
        completed ? "border-green-200 bg-green-50/30" : "",
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
              locked ? "bg-gray-100 border-gray-200 text-gray-400" : "",
              completed ? "bg-green-100 border-green-200 text-green-600" : "",
              !locked && !completed ? "bg-primary/10 border-primary/10 text-primary-dark" : "",
            )}
            data-testid={`badge-task-${task.id}`}
          >
            {locked ? <Lock className="h-4 w-4" /> : completed ? <CheckCircle className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
          </div>

          <div className="min-w-0">
            <div
              className={cn(
                "truncate text-sm font-semibold",
                locked ? "text-text-secondary" : completed ? "text-green-700" : "text-text-primary"
              )}
              data-testid={`text-task-title-${task.id}`}
            >
              {task.title}
            </div>
            {completed && (
              <div className="text-xs text-green-600">Completed</div>
            )}
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
              <span className="font-semibold text-text-primary">Why:</span> {task.whyItMatters}
            </div>

            {/* How to do this */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-text-secondary/70">
                Recommended Approach
              </div>
              <div className="mt-1 text-sm leading-relaxed text-text-primary">
                {task.howToDoThis}
              </div>
            </div>

            {/* Resources */}
            {task.resources.length > 0 && (
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-text-secondary/70">
                  Resources
                </div>
                <ul className="mt-2 space-y-2">
                  {task.resources.map((resource, idx) => (
                    <li key={idx}>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-primary underline underline-offset-2 cursor-pointer hover:text-primary-dark"
                      >
                        <span>📄</span> {resource.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {!completed && (
              <div className="pt-2">
                <Button
                  className="w-full rounded-full bg-primary font-medium hover:brightness-95"
                  onClick={onComplete}
                  data-testid={`button-complete-task-${task.id}`}
                >
                  Mark as Complete
                </Button>
              </div>
            )}
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
