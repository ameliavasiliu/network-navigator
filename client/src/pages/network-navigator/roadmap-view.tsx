import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronRight,
  Lock,
  Sparkles,
  CheckCircle,
  Globe,
  BookOpen,
  ExternalLink,
  X,
  Users,
  Plus,
  Trash2,
  Building2,
  MessageCircle,
  Edit3,
  Copy,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRoadmap, Task, Contact, CompanyInfo, StudentProfile, getTemplateText } from "@/context/roadmap-context";

const CONTACT_STATUSES = [
  { value: "identified", label: "Identified" },
  { value: "messaged", label: "Messaged" },
  { value: "responded", label: "Responded" },
  { value: "call_completed", label: "Call Completed" },
  { value: "referral_requested", label: "Referral Requested" },
] as const;

export default function RoadmapView() {
  const params = useParams();
  const navigate = useNavigate();
  const {
    roadmaps,
    setCurrentRoadmap,
    completeTask,
    toggleSubtask,
    addCoachCheckIn,
    addContact,
    updateContact,
    deleteContact,
    getStudentProfile,
  } = useRoadmap();
  const [openTaskId, setOpenTaskId] = React.useState<string | null>(null);
  const [checkInText, setCheckInText] = React.useState("");
  const [activeTab, setActiveTab] = React.useState<"tasks" | "contacts" | "companies">("tasks");

  const roadmap = roadmaps.find((r) => r.id === params.roadmapId);

  React.useEffect(() => {
    if (params.roadmapId) {
      setCurrentRoadmap(params.roadmapId);
    }
  }, [params.roadmapId, setCurrentRoadmap]);

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
    setOpenTaskId(null);
  };

  const handleSaveCheckIn = () => {
    if (checkInText.trim()) {
      addCoachCheckIn(checkInText);
      setCheckInText("");
    }
  };

  const completedCount = roadmap.tasks.filter((t) => t.status === "completed").length;
  const totalTasks = roadmap.tasks.length;
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const openTask = openTaskId ? roadmap.tasks.find((t) => t.id === openTaskId) : null;

  return (
    <div className="space-y-6" data-testid="screen-roadmap-view">
      <div className="space-y-1 pb-4 border-b border-border" data-testid="roadmap-header">
        <div className="text-xs font-medium text-text-secondary" data-testid="text-roadmap-kicker">
          Your Roadmap
        </div>
        <div className="text-2xl font-semibold" data-testid="text-roadmap-goal">
          {roadmap.goal || "Your Career Goal"}
        </div>
        <div className="flex items-center gap-4 text-xs text-text-secondary" data-testid="text-roadmap-progress">
          <span>{completedCount} of {totalTasks} tasks completed</span>
          {roadmap.goalCategory && (
            <>
              <span>·</span>
              <span className="capitalize">{roadmap.goalCategory === "finance" ? "Investment Banking" : roadmap.goalCategory === "tech" ? "Product / Tech" : roadmap.goalCategory} track</span>
            </>
          )}
        </div>
      </div>

      <div className="flex gap-2 border-b border-border" data-testid="roadmap-tabs">
        {[
          { key: "tasks" as const, label: "Tasks", icon: BookOpen },
          { key: "contacts" as const, label: `Contacts (${roadmap.contacts.length})`, icon: Users },
          { key: "companies" as const, label: `Companies (${roadmap.companies.length})`, icon: Building2 },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors",
              activeTab === key
                ? "border-primary text-primary-dark"
                : "border-transparent text-text-secondary hover:text-text-primary"
            )}
            data-testid={`tab-${key}`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {activeTab === "tasks" && (
        <div className="space-y-6">
          <div className="space-y-2" data-testid="task-list">
            {roadmap.tasks.map((t, idx) => {
              const isLocked = t.status === "locked";
              const isCompleted = t.status === "completed";
              const subtasksDone = t.subtasks.filter((s) => s.completed).length;
              const subtasksTotal = t.subtasks.length;
              const subtaskPct = subtasksTotal > 0 ? Math.round((subtasksDone / subtasksTotal) * 100) : 0;

              return (
                <div
                  key={t.id}
                  className={cn(
                    "rounded-xl border bg-card shadow-sm transition-all",
                    isLocked ? "opacity-50 border-gray-200" : "border-border hover:shadow-md cursor-pointer",
                    isCompleted ? "border-green-200 bg-green-50/30" : ""
                  )}
                  data-testid={`card-task-${t.id}`}
                >
                  <div
                    className="flex items-center gap-3 px-4 py-3"
                    onClick={() => { if (!isLocked) setOpenTaskId(t.id); }}
                    data-testid={`row-task-${t.id}`}
                  >
                    <div className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border",
                      isLocked ? "bg-gray-100 border-gray-200 text-gray-400" : "",
                      isCompleted ? "bg-green-100 border-green-200 text-green-600" : "",
                      !isLocked && !isCompleted ? "bg-primary/10 border-primary/10 text-primary-dark" : "",
                    )}>
                      {isLocked ? <Lock className="h-4 w-4" /> : isCompleted ? <CheckCircle className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={cn("text-sm font-semibold", isLocked ? "text-text-secondary" : isCompleted ? "text-green-700" : "text-text-primary")}>
                        {idx + 1}. {t.title}
                      </div>
                      {!isLocked && (
                        <div className="mt-1 flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-[200px]">
                            <div
                              className={cn("h-full rounded-full transition-all", isCompleted ? "bg-green-500" : "bg-primary")}
                              style={{ width: `${subtaskPct}%` }}
                            />
                          </div>
                          <span className="text-xs text-text-secondary">{subtasksDone}/{subtasksTotal}</span>
                        </div>
                      )}
                    </div>
                    {!isLocked && (
                      <ChevronRight className="h-4 w-4 text-text-secondary shrink-0" />
                    )}
                  </div>
                  {isLocked && (
                    <div className="px-4 pb-3">
                      <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-2 text-xs text-text-secondary">
                        <Lock className="h-3 w-3" />
                        <span>Complete previous task to unlock</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <CoachCheckInSection
            checkInText={checkInText}
            setCheckInText={setCheckInText}
            onSave={handleSaveCheckIn}
            checkIns={roadmap.checkIns}
          />
        </div>
      )}

      {activeTab === "contacts" && (
        <ContactTracker
          contacts={roadmap.contacts}
          onAdd={addContact}
          onUpdate={updateContact}
          onDelete={deleteContact}
        />
      )}

      {activeTab === "companies" && (
        <CompanyResearch companies={roadmap.companies} />
      )}

      {openTask && (
        <TaskModal
          task={openTask}
          onClose={() => setOpenTaskId(null)}
          onComplete={handleCompleteTask}
          onToggleSubtask={(subtaskId) => toggleSubtask(openTask.id, subtaskId)}
          studentProfile={getStudentProfile()}
        />
      )}
    </div>
  );
}

function TaskModal({
  task,
  onClose,
  onComplete,
  onToggleSubtask,
  studentProfile,
}: {
  task: Task;
  onClose: () => void;
  onComplete: (taskId: string, evidence: string) => void;
  onToggleSubtask: (subtaskId: string) => void;
  studentProfile: StudentProfile;
}) {
  const [evidenceValue, setEvidenceValue] = React.useState("");
  const [gateError, setGateError] = React.useState("");
  const [templateText, setTemplateText] = React.useState("");
  const [templateConfirmed, setTemplateConfirmed] = React.useState(false);
  const [templateCopied, setTemplateCopied] = React.useState(false);
  const [showInternational, setShowInternational] = React.useState(false);
  const [internationalConcern, setInternationalConcern] = React.useState(task.internationalConcern || "");

  const isCompleted = task.status === "completed";
  const subtasksDone = task.subtasks.filter((s) => s.completed).length;
  const subtasksTotal = task.subtasks.length;
  const subtaskPct = subtasksTotal > 0 ? Math.round((subtasksDone / subtasksTotal) * 100) : 0;
  const allSubtasksDone = subtasksDone === subtasksTotal;

  React.useEffect(() => {
    if (task.aiTemplate && !templateText) {
      setTemplateText(getTemplateText(task.aiTemplate.templateId, studentProfile));
    }
  }, [task.aiTemplate, studentProfile]);

  const handleSubmitEvidence = () => {
    if (!allSubtasksDone && !isCompleted) {
      setGateError("Please complete all subtasks before finishing this task.");
      return;
    }
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
  };

  const handleConfirmGate = () => {
    if (!allSubtasksDone && !isCompleted) {
      setGateError("Please complete all subtasks before finishing this task.");
      return;
    }
    setGateError("");
    onComplete(task.id, "confirmed");
  };

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(templateText);
    setTemplateCopied(true);
    setTimeout(() => setTemplateCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 overflow-y-auto" onClick={onClose} data-testid="task-modal-overlay">
      <div
        className="relative w-full max-w-2xl mt-8 mb-8 rounded-2xl bg-white shadow-xl border border-border"
        onClick={(e) => e.stopPropagation()}
        data-testid={`modal-task-${task.id}`}
      >
        <div className="sticky top-0 z-10 bg-white rounded-t-2xl border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="text-lg font-semibold text-text-primary" data-testid="modal-task-title">{task.title}</div>
              <div className="mt-1 flex items-center gap-3">
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden max-w-[240px]">
                  <div
                    className={cn("h-full rounded-full transition-all", isCompleted ? "bg-green-500" : "bg-primary")}
                    style={{ width: `${subtaskPct}%` }}
                  />
                </div>
                <span className="text-xs text-text-secondary font-medium">{subtasksDone}/{subtasksTotal} subtasks</span>
                {isCompleted && <span className="text-xs text-green-600 font-semibold">Completed</span>}
              </div>
            </div>
            <button onClick={onClose} className="ml-4 rounded-lg p-1.5 text-text-secondary hover:bg-gray-100" data-testid="button-close-modal">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
          <div className="rounded-lg bg-gray-50 p-4" data-testid="modal-objective">
            <div className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-1">Objective</div>
            <div className="text-sm text-text-primary leading-relaxed">{task.objective}</div>
          </div>

          <div className="rounded-lg bg-amber-50/60 border border-amber-100 p-4" data-testid="modal-why">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">Why This Matters</div>
            <div className="text-sm text-amber-900 leading-relaxed">{task.whyItMatters}</div>
          </div>

          <div data-testid="modal-subtasks">
            <div className="text-xs font-bold uppercase tracking-wider text-text-secondary/70 flex items-center gap-1.5 mb-3">
              <BookOpen className="h-3.5 w-3.5" />
              Step-by-Step Instructions
            </div>
            <div className="space-y-2">
              {task.subtasks.map((st) => (
                <label
                  key={st.id}
                  className={cn(
                    "flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors",
                    st.completed ? "bg-green-50/50 border-green-200" : "bg-white border-border hover:bg-gray-50",
                    isCompleted ? "pointer-events-none" : ""
                  )}
                  data-testid={`subtask-${st.id}`}
                >
                  <input
                    type="checkbox"
                    checked={st.completed}
                    onChange={() => onToggleSubtask(st.id)}
                    disabled={isCompleted}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/20 accent-emerald-600"
                    data-testid={`checkbox-${st.id}`}
                  />
                  <span className={cn("text-sm leading-relaxed", st.completed ? "text-green-700 line-through" : "text-text-primary")}>
                    {st.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {task.aiTemplate && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-3" data-testid="modal-ai-template">
              <div className="text-xs font-bold uppercase tracking-wider text-primary-dark flex items-center gap-1.5">
                <Edit3 className="h-3.5 w-3.5" />
                AI-Generated Template: {task.aiTemplate.label}
              </div>
              <textarea
                className="w-full min-h-[120px] rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 font-mono"
                value={templateText}
                onChange={(e) => setTemplateText(e.target.value)}
                disabled={isCompleted}
                data-testid="textarea-ai-template"
              />
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm cursor-pointer" data-testid="label-template-confirm">
                  <input
                    type="checkbox"
                    checked={templateConfirmed}
                    onChange={(e) => setTemplateConfirmed(e.target.checked)}
                    disabled={isCompleted}
                    className="h-4 w-4 rounded border-gray-300 accent-emerald-600"
                    data-testid="checkbox-template-confirm"
                  />
                  <span className="text-text-primary">{task.aiTemplate.confirmationLabel}</span>
                </label>
                <button
                  onClick={handleCopyTemplate}
                  className="flex items-center gap-1 text-xs text-primary hover:text-primary-dark font-medium"
                  data-testid="button-copy-template"
                >
                  {templateCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {templateCopied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          )}

          {task.internationalConsiderations && (
            <div className="rounded-lg border border-blue-100" data-testid="modal-international">
              <button
                onClick={() => setShowInternational(!showInternational)}
                className="w-full flex items-center justify-between px-4 py-3 text-left"
                data-testid="button-toggle-international"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-700">
                  <Globe className="h-3.5 w-3.5" />
                  International Considerations
                </div>
                <ChevronDown className={cn("h-4 w-4 text-blue-500 transition-transform", showInternational ? "rotate-180" : "")} />
              </button>
              {showInternational && (
                <div className="px-4 pb-4 space-y-3">
                  <div className="text-sm text-blue-900 leading-relaxed bg-blue-50/60 rounded-lg p-3">
                    {task.internationalConsiderations}
                  </div>
                  <div>
                    <label className="text-xs font-medium text-blue-700 block mb-1">What concerns do you have as an international student?</label>
                    <textarea
                      className="w-full min-h-[60px] rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400"
                      placeholder="Share any concerns and we'll try to personalize guidance..."
                      value={internationalConcern}
                      onChange={(e) => setInternationalConcern(e.target.value)}
                      data-testid="textarea-international-concern"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {task.resources.length > 0 && (
            <div data-testid="modal-resources">
              <div className="text-xs font-bold uppercase tracking-wider text-text-secondary/70 flex items-center gap-1.5 mb-2">
                <ExternalLink className="h-3.5 w-3.5" />
                Resources
              </div>
              <ul className="space-y-2">
                {task.resources.map((resource, idx) => (
                  <li key={idx}>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary underline underline-offset-2 hover:text-primary-dark"
                      data-testid={`link-resource-${idx}`}
                    >
                      {resource.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {isCompleted && task.completionEvidence && (
            <div className="rounded-lg bg-green-50 border border-green-100 p-4" data-testid="modal-evidence">
              <div className="text-xs font-bold uppercase tracking-wider text-green-700 mb-1">Your Submission</div>
              <div className="text-sm text-green-900 whitespace-pre-wrap">{task.completionEvidence}</div>
            </div>
          )}

          {!isCompleted && (
            <div className="pt-3 space-y-3 border-t border-border" data-testid="modal-gate">
              <div className="text-xs font-bold uppercase tracking-wider text-text-secondary/70">Complete This Task</div>

              {!allSubtasksDone && (
                <div className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg p-2">
                  Complete all subtasks above before you can finish this task.
                </div>
              )}

              {task.completionGate.type === "confirm" ? (
                <div className="space-y-2">
                  <div className="text-sm text-text-primary">{task.completionGate.prompt}</div>
                  {gateError && <div className="text-xs text-red-600" data-testid="error-gate">{gateError}</div>}
                  <Button
                    className="w-full rounded-full bg-primary font-medium hover:brightness-95"
                    onClick={handleConfirmGate}
                    disabled={!allSubtasksDone}
                    data-testid="button-confirm-task"
                  >
                    Yes, I confirm
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary block">{task.completionGate.prompt}</label>
                  {task.completionGate.type === "text" ? (
                    <textarea
                      className="w-full min-h-[80px] rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                      placeholder={task.completionGate.placeholder || ""}
                      value={evidenceValue}
                      onChange={(e) => { setEvidenceValue(e.target.value); setGateError(""); }}
                      data-testid="input-evidence"
                    />
                  ) : (
                    <input
                      type="number"
                      className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                      placeholder={task.completionGate.placeholder || ""}
                      value={evidenceValue}
                      onChange={(e) => { setEvidenceValue(e.target.value); setGateError(""); }}
                      data-testid="input-evidence"
                    />
                  )}
                  {gateError && <div className="text-xs text-red-600" data-testid="error-gate">{gateError}</div>}
                  <Button
                    className="w-full rounded-full bg-primary font-medium hover:brightness-95"
                    onClick={handleSubmitEvidence}
                    disabled={!allSubtasksDone}
                    data-testid="button-complete-task"
                  >
                    Submit & Complete Task
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CoachCheckInSection({
  checkInText,
  setCheckInText,
  onSave,
  checkIns,
}: {
  checkInText: string;
  setCheckInText: (val: string) => void;
  onSave: () => void;
  checkIns: Array<{ id: string; content: string; coachResponse: string; createdAt: string; adaptiveAction?: string }>;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm" data-testid="section-coach-checkin">
      <div className="flex items-center gap-2 text-sm font-semibold" data-testid="text-checkin-title">
        <MessageCircle className="h-4 w-4 text-primary" />
        Coach Check-In
      </div>
      <div className="mt-1 text-xs text-text-secondary" data-testid="text-checkin-subtitle">
        Share what's happening — progress, challenges, concerns. The system will detect relevant keywords and adjust your roadmap accordingly.
      </div>
      <textarea
        className="mt-4 min-h-[100px] w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
        placeholder="e.g., I sent outreach to 5 people but got no response from 3 of them. I have an interview at Goldman next week..."
        value={checkInText}
        onChange={(e) => setCheckInText(e.target.value)}
        data-testid="textarea-coach-checkin"
      />
      <div className="mt-3 flex justify-end">
        <Button
          className="rounded-full bg-primary px-6"
          onClick={onSave}
          data-testid="button-submit-checkin"
        >
          Submit Check-In
        </Button>
      </div>

      {checkIns.length > 0 && (
        <div className="mt-6 space-y-4" data-testid="list-checkins">
          <div className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Previous Check-Ins
          </div>
          {checkIns.map((ci) => (
            <div key={ci.id} className="rounded-lg border border-border bg-gray-50 p-4 space-y-2" data-testid={`checkin-${ci.id}`}>
              <div className="text-sm text-text-primary font-medium">{ci.content}</div>
              <div className="rounded-lg bg-primary/5 border border-primary/10 p-3">
                <div className="text-xs font-semibold text-primary-dark mb-1 flex items-center gap-1">
                  <MessageCircle className="h-3 w-3" />
                  Coach Response
                </div>
                <div className="text-sm text-text-primary whitespace-pre-wrap">{ci.coachResponse}</div>
              </div>
              {ci.adaptiveAction && (
                <div className="rounded-md bg-emerald-50 border border-emerald-100 px-3 py-2 text-xs text-emerald-800">
                  <span className="font-semibold">Roadmap updated:</span> {ci.adaptiveAction}
                </div>
              )}
              <div className="text-xs text-text-secondary">
                {new Date(ci.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ContactTracker({
  contacts,
  onAdd,
  onUpdate,
  onDelete,
}: {
  contacts: Contact[];
  onAdd: (c: Omit<Contact, "id">) => void;
  onUpdate: (id: string, updates: Partial<Contact>) => void;
  onDelete: (id: string) => void;
}) {
  const [showForm, setShowForm] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    company: "",
    role: "",
    linkedinUrl: "",
    status: "identified" as Contact["status"],
    notes: "",
    lastInteractionDate: new Date().toISOString().slice(0, 10),
  });

  const handleAdd = () => {
    if (!formData.name.trim() || !formData.company.trim()) return;
    onAdd(formData);
    setFormData({
      name: "",
      company: "",
      role: "",
      linkedinUrl: "",
      status: "identified",
      notes: "",
      lastInteractionDate: new Date().toISOString().slice(0, 10),
    });
    setShowForm(false);
  };

  return (
    <div className="space-y-4" data-testid="contact-tracker">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            Contact Tracker
          </div>
          <div className="text-xs text-text-secondary mt-0.5">Track your networking outreach and follow-ups</div>
        </div>
        <Button
          className="rounded-full bg-primary text-sm px-4"
          onClick={() => setShowForm(!showForm)}
          data-testid="button-add-contact"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Contact
        </Button>
      </div>

      {showForm && (
        <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-sm" data-testid="form-add-contact">
          <div className="grid grid-cols-2 gap-3">
            <input
              className="rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="Name *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              data-testid="input-contact-name"
            />
            <input
              className="rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="Company *"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              data-testid="input-contact-company"
            />
            <input
              className="rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="Role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              data-testid="input-contact-role"
            />
            <input
              className="rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="LinkedIn URL"
              value={formData.linkedinUrl}
              onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
              data-testid="input-contact-linkedin"
            />
          </div>
          <select
            className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary bg-white"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as Contact["status"] })}
            data-testid="select-contact-status"
          >
            {CONTACT_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <textarea
            className="w-full min-h-[60px] rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
            placeholder="Notes..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            data-testid="textarea-contact-notes"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" className="rounded-full text-sm" onClick={() => setShowForm(false)} data-testid="button-cancel-contact">Cancel</Button>
            <Button className="rounded-full bg-primary text-sm" onClick={handleAdd} data-testid="button-save-contact">Save Contact</Button>
          </div>
        </div>
      )}

      {contacts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-gray-50/50 px-4 py-8 text-center text-sm text-text-secondary" data-testid="text-no-contacts">
          No contacts yet. Start tracking your networking outreach by adding your first contact.
        </div>
      ) : (
        <div className="space-y-2" data-testid="list-contacts">
          {contacts.map((c) => (
            <div key={c.id} className="rounded-xl border border-border bg-card p-4 shadow-sm" data-testid={`contact-${c.id}`}>
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-text-primary">{c.name}</div>
                  <div className="text-xs text-text-secondary">{c.role}{c.role && c.company ? " at " : ""}{c.company}</div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    className="rounded-lg border border-border px-2 py-1 text-xs bg-white outline-none"
                    value={c.status}
                    onChange={(e) => onUpdate(c.id, { status: e.target.value as Contact["status"], lastInteractionDate: new Date().toISOString().slice(0, 10) })}
                    data-testid={`select-status-${c.id}`}
                  >
                    {CONTACT_STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => onDelete(c.id)}
                    className="rounded p-1 text-text-secondary hover:text-red-500 hover:bg-red-50"
                    data-testid={`button-delete-${c.id}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              {c.linkedinUrl && (
                <a href={c.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline mt-1 inline-block" data-testid={`link-linkedin-${c.id}`}>
                  LinkedIn Profile
                </a>
              )}
              {c.notes && <div className="mt-2 text-xs text-text-secondary bg-gray-50 rounded-lg p-2">{c.notes}</div>}
              <div className="mt-1 text-xs text-text-secondary">
                Last interaction: {new Date(c.lastInteractionDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CompanyResearch({ companies }: { companies: CompanyInfo[] }) {
  return (
    <div className="space-y-4" data-testid="company-research">
      <div>
        <div className="text-sm font-semibold flex items-center gap-2">
          <Building2 className="h-4 w-4 text-primary" />
          Target Companies & Roles
        </div>
        <div className="text-xs text-text-secondary mt-0.5">Companies generated based on your career goal. Sponsorship varies year to year — confirm during networking conversations.</div>
      </div>
      {companies.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-gray-50/50 px-4 py-8 text-center text-sm text-text-secondary">
          No companies generated for this roadmap.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3" data-testid="list-companies">
          {companies.map((co, idx) => (
            <div key={idx} className="rounded-xl border border-border bg-card p-4 shadow-sm" data-testid={`company-${idx}`}>
              <div className="text-sm font-semibold text-text-primary">{co.name}</div>
              <div className="mt-1 text-xs text-text-secondary leading-relaxed">{co.roleDescription}</div>
              <div className="mt-2 flex flex-wrap gap-1">
                {co.commonSkills.map((skill, i) => (
                  <span key={i} className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary-dark font-medium">{skill}</span>
                ))}
              </div>
              {co.jobPageUrl && (
                <a
                  href={co.jobPageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 flex items-center gap-1 text-xs text-primary underline underline-offset-2 hover:text-primary-dark"
                  data-testid={`link-company-${idx}`}
                >
                  <ExternalLink className="h-3 w-3" />
                  Careers Page
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
