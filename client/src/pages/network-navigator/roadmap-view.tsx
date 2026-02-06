import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown, Lock, Sparkles, CheckCircle, Globe, BookOpen, ExternalLink } from "lucide-react";
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

  const handleCompleteTask = (taskId: string, evidence: string) => {
    completeTask(taskId, evidence);
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
          {roadmap.goalCategory && (
            <>
              <span>·</span>
              <span className="capitalize">{roadmap.goalCategory === "finance" ? "Investment Banking" : roadmap.goalCategory === "tech" ? "Product / Tech" : roadmap.goalCategory} track</span>
            </>
          )}
        </div>
      </div>

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
                onComplete={handleCompleteTask}
              />
            );
          })}
        </div>
      </div>

      <div
        className="rounded-xl border border-border bg-card p-6 shadow-sm"
        data-testid="section-roadmap-updates"
      >
        <div className="text-sm font-semibold" data-testid="text-updates-title">
          Weekly Progress Updates
        </div>
        <div className="mt-1 text-xs text-text-secondary" data-testid="text-updates-subtitle">
          Share what happened this week. Mention specifics — the system will detect keywords like "no response," "interview," or "visa" and add relevant follow-up tasks to your roadmap.
        </div>
        <textarea
          className="mt-4 min-h-[100px] w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
          placeholder="e.g., I sent 5 outreach messages but got no response from 3 of them. I have an interview next week at Goldman..."
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
                {update.adaptiveAction && (
                  <div className="mt-2 rounded-md bg-primary/5 border border-primary/10 px-3 py-2 text-xs text-primary-dark">
                    <span className="font-semibold">Roadmap updated:</span> {update.adaptiveAction}
                  </div>
                )}
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
  onComplete: (taskId: string, evidence: string) => void;
}) {
  const [evidenceValue, setEvidenceValue] = React.useState("");
  const [gateError, setGateError] = React.useState("");

  const handleSubmitEvidence = () => {
    if (!evidenceValue.trim()) {
      setGateError("Please provide the required input before completing this task.");
      return;
    }
    if (task.completionGate.type === "number" && isNaN(Number(evidenceValue))) {
      setGateError("Please enter a valid number.");
      return;
    }
    setGateError("");
    onComplete(task.id, evidenceValue.trim());
    setEvidenceValue("");
  };

  const handleConfirmGate = () => {
    onComplete(task.id, "confirmed");
    setEvidenceValue("");
  };

  return (
    <div
      className={cn(
        "w-[380px] shrink-0 rounded-xl border border-border bg-card shadow-sm transition-all duration-200",
        locked ? "opacity-60 bg-gray-50/50" : "opacity-100 hover:shadow-md",
        completed ? "border-green-200 bg-green-50/30" : "",
        expanded ? "ring-1 ring-primary/20" : ""
      )}
      data-testid={`card-task-${task.id}`}
    >
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

      {expanded ? (
        <div className="px-4 pb-4 pt-1 space-y-4" data-testid={`panel-task-${task.id}`}>
          <div className="rounded-lg bg-gray-50 p-3 text-sm text-text-secondary" data-testid={`text-task-objective-${task.id}`}>
            <span className="font-semibold text-text-primary">Objective:</span> {task.objective}
          </div>

          <div className="rounded-lg bg-amber-50/60 border border-amber-100 p-3 text-sm text-amber-900" data-testid={`text-task-why-${task.id}`}>
            <span className="font-semibold">Why this matters:</span> {task.whyItMatters}
          </div>

          <div data-testid={`section-task-steps-${task.id}`}>
            <div className="text-xs font-bold uppercase tracking-wider text-text-secondary/70 flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5" />
              How to do it
            </div>
            <ol className="mt-2 space-y-2 list-none">
              {task.steps.map((step, idx) => (
                <li key={idx} className="flex gap-2 text-sm text-text-primary leading-relaxed">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary-dark">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {task.culturalTip && (
            <div className="rounded-lg bg-blue-50/60 border border-blue-100 p-3" data-testid={`section-task-cultural-${task.id}`}>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 mb-1">
                <Globe className="h-3.5 w-3.5" />
                Cultural Tip for International Students
              </div>
              <div className="text-sm text-blue-900 leading-relaxed">
                {task.culturalTip}
              </div>
            </div>
          )}

          {task.resources.length > 0 && (
            <div data-testid={`section-task-resources-${task.id}`}>
              <div className="text-xs font-bold uppercase tracking-wider text-text-secondary/70 flex items-center gap-1.5">
                <ExternalLink className="h-3.5 w-3.5" />
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
                      data-testid={`link-resource-${task.id}-${idx}`}
                    >
                      {resource.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {completed && task.completionEvidence && (
            <div className="rounded-lg bg-green-50 border border-green-100 p-3" data-testid={`section-task-evidence-${task.id}`}>
              <div className="text-xs font-bold uppercase tracking-wider text-green-700 mb-1">
                Your Submission
              </div>
              <div className="text-sm text-green-900 whitespace-pre-wrap">
                {task.completionEvidence}
              </div>
            </div>
          )}

          {!completed && (
            <div className="pt-2 space-y-3 border-t border-border" data-testid={`section-task-gate-${task.id}`}>
              <div className="text-xs font-bold uppercase tracking-wider text-text-secondary/70">
                Complete this task
              </div>

              {task.completionGate.type === "confirm" ? (
                <div className="space-y-2">
                  <div className="text-sm text-text-primary">{task.completionGate.prompt}</div>
                  <Button
                    className="w-full rounded-full bg-primary font-medium hover:brightness-95"
                    onClick={handleConfirmGate}
                    data-testid={`button-confirm-task-${task.id}`}
                  >
                    Yes, I confirm
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary block">
                    {task.completionGate.prompt}
                  </label>
                  {task.completionGate.type === "text" ? (
                    <textarea
                      className="w-full min-h-[80px] rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                      placeholder={task.completionGate.placeholder || ""}
                      value={evidenceValue}
                      onChange={(e) => {
                        setEvidenceValue(e.target.value);
                        setGateError("");
                      }}
                      data-testid={`input-evidence-${task.id}`}
                    />
                  ) : (
                    <input
                      type="number"
                      className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                      placeholder={task.completionGate.placeholder || ""}
                      value={evidenceValue}
                      onChange={(e) => {
                        setEvidenceValue(e.target.value);
                        setGateError("");
                      }}
                      data-testid={`input-evidence-${task.id}`}
                    />
                  )}
                  {gateError && (
                    <div className="text-xs text-red-600" data-testid={`error-gate-${task.id}`}>
                      {gateError}
                    </div>
                  )}
                  <Button
                    className="w-full rounded-full bg-primary font-medium hover:brightness-95"
                    onClick={handleSubmitEvidence}
                    data-testid={`button-complete-task-${task.id}`}
                  >
                    Submit & Complete Task
                  </Button>
                </div>
              )}
            </div>
          )}
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
