import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
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
  Copy,
  Check,
  Search,
  AlertCircle,
  Star,
  Clock,
  Map,
  ListChecks,
  Eye,
  RefreshCw,
  ArrowLeft,
  ArrowRight,
  Target,
  TrendingUp,
  Zap,
  Sun,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useRoadmap,
  Task,
  Contact,
  ContactAffiliation,
  CompanyInfo,
  SavedCompany,
  SavedCompanyStatus,
  StudentProfile,
  getTemplateText,
} from "@/context/roadmap-context";

const CONTACT_STATUSES = [
  { value: "identified", label: "Identified" },
  { value: "messaged", label: "Messaged" },
  { value: "responded", label: "Responded" },
  { value: "call_completed", label: "Call Completed" },
  { value: "referral_requested", label: "Referral Requested" },
] as const;

const AFFILIATIONS = [
  { value: "alumni", label: "Alumni" },
  { value: "recruiter", label: "Recruiter" },
  { value: "referral", label: "Referral" },
  { value: "friend", label: "Friend" },
  { value: "other", label: "Other" },
] as const;

const SAVED_COMPANY_STATUSES = [
  { value: "considering", label: "Considering" },
  { value: "applied", label: "Applied" },
  { value: "interviewing", label: "Interviewing" },
  { value: "rejected", label: "Rejected" },
  { value: "offer", label: "Offer" },
] as const;

function getEstimatedTimeToHire(roadmap: any): string {
  const baseWeeks: Record<string, number> = {
    finance: 16, consulting: 14, marketing: 10, tech: 12, general: 12,
  };
  const base = baseWeeks[roadmap.goalCategory] || 12;
  const tasks = roadmap.tasks || [];
  const contacts = roadmap.contacts || [];
  const saved = roadmap.savedCompanies || [];

  const completedCount = tasks.filter((t: Task) => t.status === "completed").length;
  const totalTasks = tasks.length;
  const taskProgress = totalTasks > 0 ? completedCount / totalTasks : 0;

  const contactBonus = Math.min(contacts.length * 0.02, 0.15);
  const callsCompleted = contacts.filter((c: Contact) =>
    c.status === "call_completed" || c.status === "referral_requested"
  ).length;
  const callBonus = Math.min(callsCompleted * 0.03, 0.15);

  const applications = saved.filter((c: SavedCompany) =>
    c.status === "applied" || c.status === "interviewing"
  ).length;
  const appBonus = Math.min(applications * 0.05, 0.2);
  const interviews = saved.filter((c: SavedCompany) => c.status === "interviewing").length;
  const interviewBonus = Math.min(interviews * 0.1, 0.3);

  const totalProgress = Math.min(taskProgress + contactBonus + callBonus + appBonus + interviewBonus, 0.95);
  const remaining = Math.max(1, Math.round(base * (1 - totalProgress)));

  if (remaining <= 2) return "1–2 weeks";
  if (remaining <= 4) return "2–4 weeks";
  if (remaining <= 6) return "4–6 weeks";
  if (remaining <= 8) return "6–8 weeks";
  if (remaining <= 12) return "8–12 weeks";
  return "12–16 weeks";
}

function getMilestoneInfo(roadmap: any): { phase: string; progress: number; nextMilestone: string } {
  const contacts = roadmap.contacts || [];
  const saved = roadmap.savedCompanies || [];
  const completedTasks = (roadmap.tasks || []).filter((t: Task) => t.status === "completed").length;

  const contactCount = contacts.length;
  const callCount = contacts.filter((c: Contact) =>
    c.status === "call_completed" || c.status === "referral_requested"
  ).length;
  const applicationCount = saved.filter((c: SavedCompany) =>
    ["applied", "interviewing", "offer"].includes(c.status)
  ).length;
  const interviewCount = saved.filter((c: SavedCompany) => c.status === "interviewing").length;

  if (interviewCount > 0)
    return { phase: "Interview Prep", progress: 85, nextMilestone: "Convert interviews to offers" };
  if (applicationCount >= 3)
    return { phase: "Active Applications", progress: 70, nextMilestone: "Follow up on applications" };
  if (callCount >= 2)
    return { phase: "Referral Building", progress: 55, nextMilestone: `Apply to ${Math.max(0, 3 - applicationCount)} more companies` };
  if (contactCount >= 10)
    return { phase: "Active Networking", progress: 40, nextMilestone: `Complete ${Math.max(0, 2 - callCount)} more calls` };
  if (contactCount >= 5)
    return { phase: "Growing Network", progress: 25, nextMilestone: `Add ${Math.max(0, 10 - contactCount)} more contacts` };
  if (completedTasks >= 2)
    return { phase: "Building Foundation", progress: 15, nextMilestone: `Add ${Math.max(0, 5 - contactCount)} contacts` };
  return { phase: "Getting Started", progress: 5, nextMilestone: "Complete your first 2 tasks" };
}

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
    saveCompany,
    updateSavedCompany,
    removeSavedCompany,
    updateCircumstances,
    getFollowUpSuggestions,
    getDailyTask,
    getWeeklyTask,
    getStudentProfile,
  } = useRoadmap();

  const [activeTab, setActiveTab] = React.useState<"tasks" | "roadmap" | "contacts" | "companies">("tasks");
  const [executingTaskId, setExecutingTaskId] = React.useState<string | null>(null);
  const [previewTaskId, setPreviewTaskId] = React.useState<string | null>(null);
  const [checkInText, setCheckInText] = React.useState("");

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
            data-testid="button-back-nav"
          >
            Back to Network Navigator
          </Button>
        </div>
      </div>
    );
  }

  const handleCompleteTask = (taskId: string, evidence: string) => {
    completeTask(taskId, evidence);
    setExecutingTaskId(null);
  };

  const handleSaveCheckIn = () => {
    if (checkInText.trim()) {
      addCoachCheckIn(checkInText);
      setCheckInText("");
    }
  };

  const executingTask = executingTaskId ? roadmap.tasks.find((t) => t.id === executingTaskId) : null;
  const previewTask = previewTaskId ? roadmap.tasks.find((t) => t.id === previewTaskId) : null;
  const completedCount = roadmap.tasks.filter((t) => t.status === "completed").length;
  const totalTasks = roadmap.tasks.length;

  if (executingTask) {
    return (
      <div className="space-y-6" data-testid="screen-roadmap-view">
        <TaskExecutionView
          task={executingTask}
          onBack={() => setExecutingTaskId(null)}
          onComplete={handleCompleteTask}
          onToggleSubtask={(subtaskId) => toggleSubtask(executingTask.id, subtaskId)}
          studentProfile={getStudentProfile()}
          contacts={roadmap.contacts}
          savedCompanies={roadmap.savedCompanies}
        />
      </div>
    );
  }

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

      <div className="flex gap-1 border-b border-border overflow-x-auto" data-testid="roadmap-tabs">
        {[
          { key: "tasks" as const, label: "Tasks", icon: ListChecks },
          { key: "roadmap" as const, label: "Roadmap", icon: Map },
          { key: "contacts" as const, label: `Contacts (${roadmap.contacts.length})`, icon: Users },
          { key: "companies" as const, label: `Companies`, icon: Building2 },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
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
        <TasksTab
          roadmap={roadmap}
          onStartTask={setExecutingTaskId}
          checkInText={checkInText}
          setCheckInText={setCheckInText}
          onSaveCheckIn={handleSaveCheckIn}
          getDailyTask={getDailyTask}
          getWeeklyTask={getWeeklyTask}
        />
      )}

      {activeTab === "roadmap" && (
        <RoadmapTab
          roadmap={roadmap}
          onPreviewTask={setPreviewTaskId}
          updateCircumstances={updateCircumstances}
        />
      )}

      {activeTab === "contacts" && (
        <ContactsTab
          contacts={roadmap.contacts}
          onAdd={addContact}
          onUpdate={updateContact}
          onDelete={deleteContact}
          getFollowUpSuggestions={getFollowUpSuggestions}
        />
      )}

      {activeTab === "companies" && (
        <CompaniesTab
          companies={roadmap.companies}
          savedCompanies={roadmap.savedCompanies}
          onSave={saveCompany}
          onUpdateSaved={updateSavedCompany}
          onRemoveSaved={removeSavedCompany}
          lastCompanyRefresh={roadmap.lastCompanyRefresh}
        />
      )}

      {previewTask && (
        <TaskPreviewModal
          task={previewTask}
          onClose={() => setPreviewTaskId(null)}
        />
      )}
    </div>
  );
}

function TasksTab({
  roadmap,
  onStartTask,
  checkInText,
  setCheckInText,
  onSaveCheckIn,
  getDailyTask,
  getWeeklyTask,
}: {
  roadmap: any;
  onStartTask: (id: string) => void;
  checkInText: string;
  setCheckInText: (val: string) => void;
  onSaveCheckIn: () => void;
  getDailyTask: () => Task | null;
  getWeeklyTask: () => Task | null;
}) {
  const dailyTask = getDailyTask();
  const weeklyTask = getWeeklyTask();
  const hasTwoDistinct = dailyTask && weeklyTask && dailyTask.id !== weeklyTask.id;

  return (
    <div className="space-y-6" data-testid="tasks-tab">
      <div className={cn("grid gap-4", hasTwoDistinct ? "md:grid-cols-2" : "grid-cols-1")} data-testid="active-tasks">
        {dailyTask && (
          <TaskCard
            task={dailyTask}
            label="Today's Task"
            sublabel="Your daily coaching module"
            icon={<Sun className="h-3.5 w-3.5" />}
            accentColor="primary"
            onStart={() => onStartTask(dailyTask.id)}
          />
        )}
        {hasTwoDistinct && weeklyTask && (
          <TaskCard
            task={weeklyTask}
            label="This Week's Task"
            sublabel="Your deeper weekly effort"
            icon={<Calendar className="h-3.5 w-3.5" />}
            accentColor="blue"
            onStart={() => onStartTask(weeklyTask.id)}
          />
        )}
        {!dailyTask && !weeklyTask && (
          <div className="rounded-xl border border-dashed border-green-200 bg-green-50/30 p-8 text-center" data-testid="text-all-done">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-sm font-semibold text-green-700">All tasks completed</div>
            <div className="text-xs text-green-600 mt-1">Great work. You've finished every step in your roadmap.</div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3" data-testid="activity-snapshot">
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <div className="text-lg font-bold text-primary-dark" data-testid="text-contact-count">{roadmap.contacts.length}</div>
          <div className="text-xs text-text-secondary mt-0.5">Contacts</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <div className="text-lg font-bold text-primary-dark" data-testid="text-company-count">{roadmap.savedCompanies.length}</div>
          <div className="text-xs text-text-secondary mt-0.5">Saved Companies</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <div className="text-lg font-bold text-primary-dark" data-testid="text-tasks-done">
            {roadmap.tasks.filter((t: Task) => t.status === "completed").length}/{roadmap.tasks.length}
          </div>
          <div className="text-xs text-text-secondary mt-0.5">Tasks Done</div>
        </div>
      </div>

      <CoachCheckInSection
        checkInText={checkInText}
        setCheckInText={setCheckInText}
        onSave={onSaveCheckIn}
        checkIns={roadmap.checkIns}
      />
    </div>
  );
}

function TaskCard({
  task,
  label,
  sublabel,
  icon,
  accentColor,
  onStart,
}: {
  task: Task;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  accentColor: "primary" | "blue";
  onStart: () => void;
}) {
  const subtasksDone = task.subtasks.filter((s) => s.completed).length;
  const subtasksTotal = task.subtasks.length;
  const isBlue = accentColor === "blue";

  return (
    <div
      className={cn(
        "rounded-xl border-2 p-5 shadow-sm cursor-pointer hover:shadow-md transition-all",
        isBlue
          ? "border-blue-200 bg-gradient-to-br from-blue-50 to-white"
          : "border-primary/30 bg-gradient-to-br from-primary/5 to-white"
      )}
      onClick={onStart}
      data-testid={`task-card-${task.id}`}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className={cn(
          "flex h-7 w-7 items-center justify-center rounded-lg",
          isBlue ? "bg-blue-100 text-blue-600" : "bg-primary/20 text-primary-dark"
        )}>
          {icon}
        </div>
        <div>
          <div className={cn(
            "text-xs font-bold uppercase tracking-wider",
            isBlue ? "text-blue-700" : "text-primary-dark"
          )}>{label}</div>
          <div className="text-xs text-text-secondary">{sublabel}</div>
        </div>
      </div>
      <div className="text-sm font-semibold text-text-primary mb-2">{task.title}</div>
      <div className="text-xs text-text-secondary line-clamp-2 mb-3">{task.objective}</div>
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all", isBlue ? "bg-blue-500" : "bg-primary")}
            style={{ width: `${subtasksTotal > 0 ? Math.round((subtasksDone / subtasksTotal) * 100) : 0}%` }}
          />
        </div>
        <span className="text-xs text-text-secondary font-medium">{subtasksDone}/{subtasksTotal}</span>
      </div>
      <Button
        className={cn(
          "w-full rounded-full text-sm font-medium",
          isBlue ? "bg-blue-600 hover:bg-blue-700" : "bg-primary hover:brightness-95"
        )}
        data-testid={`button-start-${task.id}`}
      >
        <Zap className="h-3.5 w-3.5 mr-1" />
        Start Task
      </Button>
    </div>
  );
}

function TaskExecutionView({
  task,
  onBack,
  onComplete,
  onToggleSubtask,
  studentProfile,
  contacts,
  savedCompanies,
}: {
  task: Task;
  onBack: () => void;
  onComplete: (taskId: string, evidence: string) => void;
  onToggleSubtask: (subtaskId: string) => void;
  studentProfile: StudentProfile;
  contacts: Contact[];
  savedCompanies: SavedCompany[];
}) {
  type Phase = "coaching" | "subtasks" | "quiz" | "completion";
  const phases: Phase[] = ["coaching", "subtasks"];
  if (task.practiceQuiz && task.practiceQuiz.length > 0) phases.push("quiz");
  phases.push("completion");

  const [currentPhase, setCurrentPhase] = React.useState<Phase>("coaching");
  const [subtaskPage, setSubtaskPage] = React.useState(0);
  const [quizPage, setQuizPage] = React.useState(0);
  const [selectedAnswers, setSelectedAnswers] = React.useState<Record<number, number>>({});
  const [revealedAnswers, setRevealedAnswers] = React.useState<Record<number, boolean>>({});
  const [evidenceValue, setEvidenceValue] = React.useState("");
  const [gateError, setGateError] = React.useState("");
  const [templateText, setTemplateText] = React.useState("");
  const [templateConfirmed, setTemplateConfirmed] = React.useState(false);
  const [templateCopied, setTemplateCopied] = React.useState(false);
  const [showInternational, setShowInternational] = React.useState(false);
  const [reflectionInputs, setReflectionInputs] = React.useState<Record<number, string>>({});

  const isCompleted = task.status === "completed";
  const phaseIndex = phases.indexOf(currentPhase);
  const totalPhases = phases.length;
  const getProgressPct = () => {
    if (currentPhase === "completion") return 100;
    const basePct = (phaseIndex / totalPhases) * 100;
    const phaseWidth = 100 / totalPhases;
    if (currentPhase === "subtasks" && task.subtasks.length > 0) {
      return Math.round(basePct + (subtaskPage / task.subtasks.length) * phaseWidth);
    }
    if (currentPhase === "quiz" && task.practiceQuiz && task.practiceQuiz.length > 0) {
      return Math.round(basePct + (quizPage / task.practiceQuiz.length) * phaseWidth);
    }
    return Math.round(basePct);
  };
  const progressPct = getProgressPct();

  const phaseLabels: Record<Phase, string> = {
    coaching: "Learn",
    subtasks: "Practice",
    quiz: "Check Understanding",
    completion: "Complete",
  };

  React.useEffect(() => {
    if (task.aiTemplate && !templateText) {
      setTemplateText(getTemplateText(task.aiTemplate.templateId, studentProfile));
    }
  }, [task.aiTemplate, studentProfile]);

  const isNetworkingTask = /outreach|contact|network|alumni|connect|linkedin|message/i.test(task.title + " " + task.objective);
  const isCompanyTask = /company|compan|target list|firm|bank/i.test(task.title + " " + task.objective);

  const validateAndSubmit = () => {
    const allSubtasksDone = task.subtasks.every((s) => s.completed);
    if (!allSubtasksDone) {
      setGateError("Please complete all action steps before finishing this task.");
      return;
    }

    if (task.aiTemplate && !templateConfirmed) {
      setGateError("Please confirm you've used the AI-generated template before completing this task.");
      return;
    }

    if (isNetworkingTask && contacts.length === 0) {
      setGateError("This task requires adding contacts. Go to the Contacts tab to add at least one contact first.");
      return;
    }

    if (isCompanyTask && savedCompanies.length === 0) {
      setGateError("This task requires saving companies. Go to the Companies tab to save at least one company first.");
      return;
    }

    if (task.completionGate.type === "confirm") {
      onComplete(task.id, "confirmed");
      return;
    }

    if (task.completionGate.type === "number") {
      const num = Number(evidenceValue);
      if (isNaN(num) || evidenceValue.trim().length === 0) {
        setGateError("Please enter a valid number.");
        return;
      }
      if (num <= 0) {
        setGateError("Please enter a number greater than 0.");
        return;
      }
      onComplete(task.id, evidenceValue.trim());
      return;
    }

    const trimmed = evidenceValue.trim();
    if (trimmed.length < 20) {
      setGateError("Please provide a more detailed response (at least 20 characters).");
      return;
    }
    const wordCount = trimmed.split(/\s+/).length;
    if (wordCount < 3) {
      setGateError("Please write at least a few words describing your work.");
      return;
    }

    onComplete(task.id, trimmed);
  };

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(templateText);
    setTemplateCopied(true);
    setTimeout(() => setTemplateCopied(false), 2000);
  };

  const goToNextPhase = () => {
    const idx = phases.indexOf(currentPhase);
    if (idx < phases.length - 1) {
      setCurrentPhase(phases[idx + 1]);
    }
  };

  const goToPrevPhase = () => {
    const idx = phases.indexOf(currentPhase);
    if (idx > 0) {
      setCurrentPhase(phases[idx - 1]);
      if (phases[idx - 1] === "subtasks") {
        setSubtaskPage(task.subtasks.length - 1);
      }
    }
  };

  const currentSubtask = currentPhase === "subtasks" ? task.subtasks[subtaskPage] : null;
  const currentQuiz = currentPhase === "quiz" && task.practiceQuiz ? task.practiceQuiz[quizPage] : null;

  return (
    <div className="max-w-2xl mx-auto" data-testid="task-execution-view">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
          data-testid="button-back-to-tasks"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tasks
        </button>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            {phases.map((p, i) => (
              <button
                key={p}
                onClick={() => {
                  if (i <= phaseIndex || p === "coaching") setCurrentPhase(p);
                }}
                className={cn(
                  "flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-all",
                  currentPhase === p
                    ? "bg-primary text-white shadow-sm"
                    : i < phaseIndex
                      ? "bg-green-100 text-green-700 cursor-pointer"
                      : "bg-gray-100 text-gray-400"
                )}
                data-testid={`phase-${p}`}
              >
                {i < phaseIndex && <CheckCircle className="h-3 w-3" />}
                <span>{phaseLabels[p]}</span>
              </button>
            ))}
          </div>
          <span className="text-xs font-medium text-primary-dark">{progressPct}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <div className="text-lg font-semibold text-text-primary mb-1">{task.title}</div>

      <div className="mt-4 rounded-xl border border-border bg-card p-6 shadow-sm min-h-[300px]">
        {currentPhase === "coaching" && (
          <div className="space-y-5" data-testid="phase-coaching">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary-dark mb-2">
                <Target className="h-3.5 w-3.5" />
                Objective
              </div>
              <div className="text-sm text-text-primary leading-relaxed">{task.objective}</div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-secondary/70 mb-2">
                <TrendingUp className="h-3.5 w-3.5" />
                Why This Matters
              </div>
              <div className="text-sm text-text-secondary leading-relaxed">{task.whyItMatters}</div>
            </div>

            {task.conceptCoaching && (
              <div className="rounded-xl border border-primary/15 bg-gradient-to-b from-primary/5 to-white p-5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary-dark mb-3">
                  <BookOpen className="h-3.5 w-3.5" />
                  Coaching Guide
                </div>
                <div className="text-sm text-text-primary leading-relaxed whitespace-pre-line">
                  {task.conceptCoaching}
                </div>
              </div>
            )}

            {task.internationalConsiderations && (
              <div className="rounded-lg border border-blue-100 overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-3 bg-blue-50 text-left"
                  onClick={() => setShowInternational(!showInternational)}
                  data-testid="button-toggle-international"
                >
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-700">
                    <Globe className="h-3.5 w-3.5" />
                    International Considerations
                  </div>
                  <ChevronDown className={cn("h-3.5 w-3.5 text-blue-600 transition-transform", showInternational ? "rotate-180" : "")} />
                </button>
                {showInternational && (
                  <div className="p-3 bg-blue-50/50">
                    <div className="text-xs text-blue-800 leading-relaxed">{task.internationalConsiderations}</div>
                  </div>
                )}
              </div>
            )}

            {task.resources.length > 0 && (
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-text-secondary/70 flex items-center gap-1 mb-2">
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
                        <ExternalLink className="h-3 w-3 shrink-0" />
                        {resource.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded-lg bg-gray-50 border border-gray-100 p-3 flex items-center gap-4 text-xs text-text-secondary" data-testid="activity-context">
              <span><strong className="text-text-primary">{contacts.length}</strong> contacts tracked</span>
              <span>·</span>
              <span><strong className="text-text-primary">{savedCompanies.length}</strong> companies saved</span>
            </div>
          </div>
        )}

        {currentPhase === "subtasks" && currentSubtask && (
          <div className="space-y-5" data-testid={`phase-subtask-${subtaskPage}`}>
            <div className="flex items-center gap-2">
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-bold",
                currentSubtask.completed
                  ? "bg-green-100 border-green-400 text-green-600"
                  : "bg-primary/10 border-primary text-primary-dark"
              )}>
                {currentSubtask.completed ? <Check className="h-4 w-4" /> : subtaskPage + 1}
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                Action Step {subtaskPage + 1} of {task.subtasks.length}
              </div>
            </div>

            <div className="text-sm font-medium text-text-primary leading-relaxed bg-gray-50 rounded-lg p-4 border border-gray-100">
              {currentSubtask.label}
            </div>

            {task.aiTemplate && subtaskPage === task.subtasks.length - 1 && (
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-3" data-testid="modal-ai-template">
                <div className="flex items-center gap-2 text-xs font-bold text-primary-dark">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI-Generated Template: {task.aiTemplate.label}
                </div>
                <textarea
                  className="w-full min-h-[120px] rounded-lg border border-primary/20 bg-white px-3 py-2 text-sm whitespace-pre-wrap outline-none focus:border-primary"
                  value={templateText}
                  onChange={(e) => setTemplateText(e.target.value)}
                  data-testid="textarea-ai-template"
                />
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    className="rounded-full text-xs h-8 px-3 gap-1"
                    onClick={handleCopyTemplate}
                    data-testid="button-copy-template"
                  >
                    {templateCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {templateCopied ? "Copied" : "Copy"}
                  </Button>
                  <label className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={templateConfirmed}
                      onChange={(e) => setTemplateConfirmed(e.target.checked)}
                      className="rounded accent-primary"
                      data-testid="checkbox-template-confirm"
                    />
                    <span className="text-text-primary">{task.aiTemplate.confirmationLabel}</span>
                  </label>
                </div>
              </div>
            )}

            {!currentSubtask.completed ? (
              <Button
                className="w-full rounded-full bg-primary font-medium"
                onClick={() => {
                  onToggleSubtask(currentSubtask.id);
                }}
                data-testid="button-mark-step-done"
              >
                <Check className="h-4 w-4 mr-1.5" />
                I've Done This
              </Button>
            ) : (
              <div className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-100 p-3 text-sm text-green-700">
                <CheckCircle className="h-4 w-4" />
                Step completed
              </div>
            )}

            <div className="flex items-center gap-1 pt-2">
              {task.subtasks.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSubtaskPage(i)}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    i === subtaskPage ? "w-6 bg-primary" : task.subtasks[i].completed ? "w-2 bg-green-400" : "w-2 bg-gray-200"
                  )}
                  data-testid={`subtask-dot-${i}`}
                />
              ))}
            </div>
          </div>
        )}

        {currentPhase === "quiz" && currentQuiz && (
          <div className="space-y-5" data-testid={`phase-quiz-${quizPage}`}>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary-dark">
              <Sparkles className="h-3.5 w-3.5" />
              Check Your Understanding ({quizPage + 1} of {task.practiceQuiz!.length})
            </div>

            <div className="text-sm font-semibold text-text-primary leading-relaxed">
              {currentQuiz.question}
            </div>

            <div className="space-y-2">
              {currentQuiz.options.map((option, optIdx) => {
                const isSelected = selectedAnswers[quizPage] === optIdx;
                const isRevealed = revealedAnswers[quizPage];
                const isCorrect = optIdx === currentQuiz.correctIndex;

                return (
                  <button
                    key={optIdx}
                    onClick={() => {
                      if (!isRevealed) {
                        setSelectedAnswers({ ...selectedAnswers, [quizPage]: optIdx });
                      }
                    }}
                    className={cn(
                      "w-full text-left rounded-lg border-2 p-3 text-sm transition-all",
                      !isRevealed && isSelected ? "border-primary bg-primary/5" : "",
                      !isRevealed && !isSelected ? "border-gray-200 hover:border-gray-300 bg-white" : "",
                      isRevealed && isCorrect ? "border-green-400 bg-green-50 text-green-800" : "",
                      isRevealed && isSelected && !isCorrect ? "border-red-300 bg-red-50 text-red-800" : "",
                      isRevealed && !isSelected && !isCorrect ? "border-gray-100 bg-gray-50 text-gray-400" : "",
                    )}
                    disabled={isRevealed}
                    data-testid={`quiz-option-${optIdx}`}
                  >
                    <div className="flex items-start gap-2">
                      <div className={cn(
                        "flex h-5 w-5 items-center justify-center rounded-full border text-xs font-bold shrink-0 mt-0.5",
                        isRevealed && isCorrect ? "border-green-500 bg-green-500 text-white" : "",
                        isRevealed && isSelected && !isCorrect ? "border-red-400 bg-red-400 text-white" : "",
                        !isRevealed && isSelected ? "border-primary bg-primary text-white" : "",
                        !isRevealed && !isSelected ? "border-gray-300" : "",
                        isRevealed && !isSelected && !isCorrect ? "border-gray-200" : "",
                      )}>
                        {isRevealed && isCorrect ? <Check className="h-3 w-3" /> :
                         isRevealed && isSelected && !isCorrect ? <X className="h-3 w-3" /> :
                         String.fromCharCode(65 + optIdx)}
                      </div>
                      <span>{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {!revealedAnswers[quizPage] && selectedAnswers[quizPage] !== undefined && (
              <Button
                className="w-full rounded-full bg-primary font-medium"
                onClick={() => setRevealedAnswers({ ...revealedAnswers, [quizPage]: true })}
                data-testid="button-check-answer"
              >
                Check Answer
              </Button>
            )}

            {revealedAnswers[quizPage] && (
              <div className={cn(
                "rounded-lg border p-4 text-sm leading-relaxed",
                selectedAnswers[quizPage] === currentQuiz.correctIndex
                  ? "border-green-200 bg-green-50 text-green-800"
                  : "border-amber-200 bg-amber-50 text-amber-800"
              )} data-testid="quiz-explanation">
                <div className="font-semibold mb-1">
                  {selectedAnswers[quizPage] === currentQuiz.correctIndex ? "Correct!" : "Not quite."}
                </div>
                {currentQuiz.explanation}
              </div>
            )}

            {task.practiceQuiz!.length > 1 && (
              <div className="flex items-center gap-1 pt-2">
                {task.practiceQuiz!.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setQuizPage(i)}
                    className={cn(
                      "h-2 rounded-full transition-all",
                      i === quizPage ? "w-6 bg-primary" : revealedAnswers[i] ? "w-2 bg-green-400" : "w-2 bg-gray-200"
                    )}
                    data-testid={`quiz-dot-${i}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {currentPhase === "completion" && (
          <div className="space-y-5" data-testid="phase-completion">
            {task.reflectionPrompts && task.reflectionPrompts.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary-dark">
                  <MessageCircle className="h-3.5 w-3.5" />
                  Reflection
                </div>
                <div className="text-xs text-text-secondary">
                  Take a moment to reflect on what you've learned. These aren't graded — they're for your own growth.
                </div>
                {task.reflectionPrompts.map((prompt, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <label className="text-sm font-medium text-text-primary block">{prompt}</label>
                    <textarea
                      className="w-full min-h-[60px] rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                      placeholder="Your thoughts..."
                      value={reflectionInputs[idx] || ""}
                      onChange={(e) => setReflectionInputs({ ...reflectionInputs, [idx]: e.target.value })}
                      data-testid={`textarea-reflection-${idx}`}
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-border pt-5 mt-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary-dark mb-4">
                <Sparkles className="h-3.5 w-3.5" />
                Complete This Task
              </div>

              {!task.subtasks.every((s) => s.completed) && (
                <div className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg p-3 mb-4">
                  You still have incomplete action steps. Go back to the Practice phase and finish them before completing.
                </div>
              )}

              {task.aiTemplate && !templateConfirmed && (
                <div className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg p-3 mb-4">
                  Please go back to the Practice phase and confirm the AI-generated template before completing.
                </div>
              )}

              {isCompleted && task.completionEvidence ? (
                <div className="rounded-lg bg-green-50 border border-green-100 p-4" data-testid="modal-evidence">
                  <div className="text-xs font-bold uppercase tracking-wider text-green-700 mb-1">Your Submission</div>
                  <div className="text-sm text-green-900 whitespace-pre-wrap">{task.completionEvidence}</div>
                </div>
              ) : task.completionGate.type === "confirm" ? (
                <div className="space-y-3">
                  <div className="text-sm text-text-primary">{task.completionGate.prompt}</div>
                  {gateError && <div className="text-xs text-red-600" data-testid="error-gate">{gateError}</div>}
                  <Button
                    className="w-full rounded-full bg-primary font-medium hover:brightness-95"
                    onClick={validateAndSubmit}
                    disabled={!task.subtasks.every((s) => s.completed)}
                    data-testid="button-confirm-task"
                  >
                    Yes, I confirm
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-text-primary block">{task.completionGate.prompt}</label>
                  {task.completionGate.type === "text" ? (
                    <textarea
                      className="w-full min-h-[100px] rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
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
                  {task.completionGate.type === "text" && evidenceValue.trim().length < 20 && evidenceValue.trim().length > 0 && (
                    <div className="text-xs text-text-secondary">
                      {20 - evidenceValue.trim().length} more characters needed
                    </div>
                  )}
                  {gateError && <div className="text-xs text-red-600" data-testid="error-gate">{gateError}</div>}
                  <Button
                    className="w-full rounded-full bg-primary font-medium hover:brightness-95"
                    onClick={validateAndSubmit}
                    disabled={!task.subtasks.every((s) => s.completed)}
                    data-testid="button-complete-task"
                  >
                    Submit & Complete Task
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-4">
        <Button
          variant="outline"
          className="rounded-full gap-1"
          onClick={() => {
            if (currentPhase === "subtasks" && subtaskPage > 0) {
              setSubtaskPage(subtaskPage - 1);
            } else if (currentPhase === "quiz" && quizPage > 0) {
              setQuizPage(quizPage - 1);
            } else {
              goToPrevPhase();
            }
          }}
          disabled={phaseIndex === 0 && (currentPhase !== "subtasks" || subtaskPage === 0)}
          data-testid="button-step-prev"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Previous
        </Button>
        {currentPhase !== "completion" && (
          <Button
            className="rounded-full bg-primary gap-1"
            onClick={() => {
              if (currentPhase === "subtasks" && subtaskPage < task.subtasks.length - 1) {
                setSubtaskPage(subtaskPage + 1);
              } else if (currentPhase === "quiz" && task.practiceQuiz && quizPage < task.practiceQuiz.length - 1) {
                setQuizPage(quizPage + 1);
              } else {
                goToNextPhase();
              }
            }}
            disabled={
              currentPhase === "subtasks" && currentSubtask && !currentSubtask.completed && subtaskPage === task.subtasks.findIndex(s => !s.completed)
            }
            data-testid="button-step-next"
          >
            {currentPhase === "subtasks" && subtaskPage < task.subtasks.length - 1
              ? "Next Step"
              : currentPhase === "quiz" && task.practiceQuiz && quizPage < task.practiceQuiz.length - 1
                ? "Next Question"
                : `Continue to ${phaseLabels[phases[phaseIndex + 1]] || "Next"}`}
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}

function RoadmapTab({
  roadmap,
  onPreviewTask,
  updateCircumstances,
}: {
  roadmap: any;
  onPreviewTask: (id: string) => void;
  updateCircumstances: (text: string) => void;
}) {
  const [circumstanceText, setCircumstanceText] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const estimate = getEstimatedTimeToHire(roadmap);
  const milestone = getMilestoneInfo(roadmap);
  const completedCount = roadmap.tasks.filter((t: Task) => t.status === "completed").length;

  const handleSubmitCircumstances = () => {
    if (!circumstanceText.trim()) return;
    updateCircumstances(circumstanceText.trim());
    setSubmitted(true);
    setCircumstanceText("");
    setTimeout(() => setSubmitted(false), 4000);
  };

  const currentTaskIndex = roadmap.tasks.findIndex((t: Task) => t.status === "unlocked");

  return (
    <div className="space-y-6" data-testid="roadmap-tab">
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4" data-testid="estimated-time">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-primary-dark">Estimated Time to Hire</div>
            <div className="text-xs text-text-secondary mt-0.5">
              Based on task completion, networking activity, and interview progress
            </div>
          </div>
          <div className="text-lg font-bold text-primary-dark">{estimate}</div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 shadow-sm" data-testid="milestone-progress">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-bold uppercase tracking-wider text-text-secondary">Current Phase</div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary-dark">{milestone.phase}</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${milestone.progress}%` }} />
        </div>
        <div className="text-xs text-text-secondary flex items-center gap-1">
          <Target className="h-3 w-3" />
          Next milestone: {milestone.nextMilestone}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 shadow-sm" data-testid="roadmap-timeline">
        <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-4">Your Journey</div>
        <div className="overflow-x-auto pb-4">
          <div className="flex items-start gap-0 min-w-max px-2">
            {roadmap.tasks.map((task: Task, idx: number) => {
              const isCompleted = task.status === "completed";
              const isUnlocked = task.status === "unlocked";
              const isLocked = task.status === "locked";
              const isCurrent = idx === currentTaskIndex;

              return (
                <React.Fragment key={task.id}>
                  {idx > 0 && (
                    <div className={cn(
                      "h-0.5 w-10 mt-6 flex-shrink-0",
                      roadmap.tasks[idx - 1].status === "completed" ? "bg-green-400" : "bg-gray-200"
                    )} />
                  )}
                  <div
                    className="flex flex-col items-center gap-2 cursor-pointer flex-shrink-0 group"
                    onClick={() => onPreviewTask(task.id)}
                    data-testid={`roadmap-node-${task.id}`}
                  >
                    <div className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all",
                      isCompleted ? "bg-green-100 border-green-400 text-green-600" : "",
                      isUnlocked && isCurrent ? "bg-primary/10 border-primary text-primary-dark ring-4 ring-primary/10 scale-110" : "",
                      isUnlocked && !isCurrent ? "bg-primary/10 border-primary text-primary-dark" : "",
                      isLocked ? "bg-gray-100 border-gray-300 text-gray-400" : "",
                    )}>
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : isUnlocked ? (
                        <span className="text-sm font-bold">{idx + 1}</span>
                      ) : (
                        <Lock className="h-4 w-4" />
                      )}
                    </div>
                    <div className={cn(
                      "text-xs text-center max-w-[90px] leading-tight group-hover:text-primary-dark transition-colors",
                      isCompleted ? "text-green-700 font-medium" : "",
                      isUnlocked ? "text-text-primary font-semibold" : "",
                      isLocked ? "text-text-secondary" : "",
                    )}>
                      {task.title.length > 35 ? task.title.slice(0, 35) + "…" : task.title}
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {currentTaskIndex >= 0 && (
        <div className="rounded-xl border border-primary/20 bg-white p-5 shadow-sm" data-testid="current-step-details">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-primary-dark text-sm font-bold">
              {currentTaskIndex + 1}
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-primary-dark">Current Step</div>
              <div className="text-sm font-semibold text-text-primary">{roadmap.tasks[currentTaskIndex].title}</div>
            </div>
          </div>
          <div className="space-y-3 pl-10">
            <div>
              <div className="text-xs font-semibold text-text-secondary mb-0.5">Objective</div>
              <div className="text-sm text-text-primary">{roadmap.tasks[currentTaskIndex].objective}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-text-secondary mb-0.5">Why This Matters</div>
              <div className="text-sm text-text-secondary">{roadmap.tasks[currentTaskIndex].whyItMatters}</div>
            </div>
            {roadmap.tasks[currentTaskIndex].subtasks.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-text-secondary mb-1">Upcoming Actions</div>
                <ul className="space-y-1">
                  {roadmap.tasks[currentTaskIndex].subtasks.slice(0, 3).map((st: any) => (
                    <li key={st.id} className="flex items-start gap-2 text-xs text-text-secondary">
                      <div className="mt-0.5 h-3 w-3 rounded-sm border border-gray-300 shrink-0" />
                      {st.label}
                    </li>
                  ))}
                  {roadmap.tasks[currentTaskIndex].subtasks.length > 3 && (
                    <li className="text-xs text-text-secondary pl-5">
                      +{roadmap.tasks[currentTaskIndex].subtasks.length - 3} more steps
                    </li>
                  )}
                </ul>
              </div>
            )}
            <div className="text-xs text-text-secondary bg-gray-50 rounded-lg p-2 border border-gray-100">
              Go to the <strong>Tasks tab</strong> to work on this step
            </div>
          </div>
        </div>
      )}

      {completedCount > 0 && (
        <div className="text-xs text-text-secondary flex items-center gap-1" data-testid="text-completed-count">
          <CheckCircle className="h-3.5 w-3.5 text-green-500" />
          {completedCount} step{completedCount !== 1 ? "s" : ""} completed
        </div>
      )}

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm" data-testid="section-circumstances">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <RefreshCw className="h-4 w-4 text-primary" />
          Change in Circumstances
        </div>
        <div className="mt-1 text-xs text-text-secondary">
          Had a visa change, received an interview invite, got a referral, or experienced a delay? Describe what happened and your roadmap will adjust.
        </div>
        <textarea
          className="mt-3 min-h-[80px] w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
          placeholder="e.g., I just received an interview invite from McKinsey for next week..."
          value={circumstanceText}
          onChange={(e) => setCircumstanceText(e.target.value)}
          data-testid="textarea-circumstances"
        />
        <div className="mt-2 flex items-center justify-between">
          {submitted && (
            <div className="flex items-center gap-1.5 text-xs text-green-600" data-testid="text-circumstances-submitted">
              <CheckCircle className="h-3.5 w-3.5" />
              Roadmap updated based on your input
            </div>
          )}
          {!submitted && <div />}
          <Button
            className="rounded-full bg-primary px-6 text-sm"
            onClick={handleSubmitCircumstances}
            disabled={!circumstanceText.trim()}
            data-testid="button-save-circumstances"
          >
            Update Roadmap
          </Button>
        </div>
      </div>
    </div>
  );
}

function TaskPreviewModal({ task, onClose }: { task: Task; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose} data-testid="modal-task-preview">
      <div
        className="relative mx-4 max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-1.5 text-text-secondary hover:bg-gray-100" data-testid="button-close-preview">
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <Eye className="h-4 w-4 text-text-secondary" />
          <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">Preview — Read Only</span>
        </div>

        <div className="text-lg font-semibold text-text-primary mt-2">{task.title}</div>

        <div className="mt-4 space-y-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-text-secondary/70 mb-1">Objective</div>
            <div className="text-sm text-text-primary">{task.objective}</div>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-text-secondary/70 mb-1">Why This Matters</div>
            <div className="text-sm text-text-secondary">{task.whyItMatters}</div>
          </div>

          {task.subtasks.length > 0 && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-text-secondary/70 mb-2">Steps ({task.subtasks.length})</div>
              <ul className="space-y-1.5">
                {task.subtasks.map((st) => (
                  <li key={st.id} className="flex items-start gap-2 text-sm text-text-secondary">
                    <div className="mt-1 h-3 w-3 rounded-sm border border-gray-300 shrink-0" />
                    {st.label}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {task.internationalConsiderations && (
            <div className="rounded-lg bg-blue-50 border border-blue-100 p-3">
              <div className="text-xs font-semibold text-blue-700 flex items-center gap-1 mb-1">
                <Globe className="h-3 w-3" /> International Considerations
              </div>
              <div className="text-xs text-blue-800">{task.internationalConsiderations}</div>
            </div>
          )}
        </div>

        {task.status === "completed" && task.completionEvidence && (
          <div className="mt-4 rounded-lg bg-green-50 border border-green-100 p-3">
            <div className="text-xs font-bold text-green-700 mb-1">Completed</div>
            <div className="text-xs text-green-800 whitespace-pre-wrap">{task.completionEvidence}</div>
          </div>
        )}

        {task.status === "locked" && (
          <div className="mt-4 rounded-lg bg-gray-50 border border-gray-200 p-3 text-center">
            <div className="text-xs text-text-secondary">This task is locked. Complete earlier tasks to unlock it.</div>
          </div>
        )}

        {task.status === "unlocked" && (
          <div className="mt-4 rounded-lg bg-primary/5 border border-primary/20 p-3 text-center">
            <div className="text-xs text-primary-dark">This task is currently active. Go to the Tasks tab to work on it.</div>
          </div>
        )}
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
        Share what's happening — progress, challenges, concerns. The system will adjust your roadmap based on what you share.
      </div>
      <textarea
        className="mt-4 min-h-[100px] w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
        placeholder="e.g., I sent outreach to 5 people but got no response from 3 of them. I have an interview at Goldman next week..."
        value={checkInText}
        onChange={(e) => setCheckInText(e.target.value)}
        data-testid="textarea-coach-checkin"
      />
      <div className="mt-3 flex justify-end">
        <Button className="rounded-full bg-primary px-6" onClick={onSave} data-testid="button-submit-checkin">
          Submit Check-In
        </Button>
      </div>

      {checkIns.length > 0 && (
        <div className="mt-6 space-y-4" data-testid="list-checkins">
          <div className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Previous Check-Ins</div>
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

function ContactsTab({
  contacts,
  onAdd,
  onUpdate,
  onDelete,
  getFollowUpSuggestions,
}: {
  contacts: Contact[];
  onAdd: (c: Omit<Contact, "id">) => void;
  onUpdate: (id: string, updates: Partial<Contact>) => void;
  onDelete: (id: string) => void;
  getFollowUpSuggestions: () => Contact[];
}) {
  const [showForm, setShowForm] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState<string>("all");
  const [filterAffiliation, setFilterAffiliation] = React.useState<string>("all");
  const [showFollowUps, setShowFollowUps] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    company: "",
    role: "",
    affiliation: "other" as ContactAffiliation,
    school: "",
    email: "",
    phone: "",
    linkedinUrl: "",
    status: "identified" as Contact["status"],
    notes: "",
    lastInteractionDate: new Date().toISOString().slice(0, 10),
  });

  const handleAdd = () => {
    if (!formData.name.trim()) return;
    onAdd(formData);
    setFormData({
      name: "",
      company: "",
      role: "",
      affiliation: "other",
      school: "",
      email: "",
      phone: "",
      linkedinUrl: "",
      status: "identified",
      notes: "",
      lastInteractionDate: new Date().toISOString().slice(0, 10),
    });
    setShowForm(false);
  };

  const followUps = showFollowUps ? getFollowUpSuggestions() : [];

  const filteredContacts = contacts.filter((c) => {
    const matchesSearch = searchQuery === "" ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || c.status === filterStatus;
    const matchesAffiliation = filterAffiliation === "all" || c.affiliation === filterAffiliation;
    return matchesSearch && matchesStatus && matchesAffiliation;
  });

  return (
    <div className="space-y-4" data-testid="contacts-tab">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            Contact Tracker
          </div>
          <div className="text-xs text-text-secondary mt-0.5">Track your networking outreach and follow-ups</div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="rounded-full text-sm px-3 gap-1"
            onClick={() => setShowFollowUps(!showFollowUps)}
            data-testid="button-follow-ups"
          >
            <AlertCircle className="h-3.5 w-3.5" />
            Follow-Up Suggestions
          </Button>
          <Button
            className="rounded-full bg-primary text-sm px-4"
            onClick={() => setShowForm(!showForm)}
            data-testid="button-add-contact"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Contact
          </Button>
        </div>
      </div>

      {showFollowUps && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 space-y-3" data-testid="follow-up-suggestions">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-700">Suggested Follow-Ups</div>
          {followUps.length === 0 ? (
            <div className="text-xs text-amber-600">No follow-ups needed right now. Check back in a few days.</div>
          ) : (
            <div className="space-y-2">
              {followUps.map((c) => {
                const daysSince = Math.round((Date.now() - new Date(c.lastInteractionDate).getTime()) / (1000 * 60 * 60 * 24));
                return (
                  <div key={c.id} className="flex items-center justify-between rounded-lg bg-white border border-amber-100 p-3" data-testid={`follow-up-${c.id}`}>
                    <div>
                      <div className="text-sm font-medium text-text-primary">{c.name}</div>
                      <div className="text-xs text-text-secondary">{c.role}{c.role && c.company ? " at " : ""}{c.company}</div>
                    </div>
                    <div className="text-xs text-amber-700 font-medium">{daysSince} days ago</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-2" data-testid="contact-filters">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
          <input
            className="w-full rounded-lg border border-border pl-9 pr-3 py-2 text-sm outline-none focus:border-primary"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid="input-search-contacts"
          />
        </div>
        <select
          className="rounded-lg border border-border px-3 py-2 text-sm bg-white outline-none"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          data-testid="select-filter-status"
        >
          <option value="all">All Statuses</option>
          {CONTACT_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <select
          className="rounded-lg border border-border px-3 py-2 text-sm bg-white outline-none"
          value={filterAffiliation}
          onChange={(e) => setFilterAffiliation(e.target.value)}
          data-testid="select-filter-affiliation"
        >
          <option value="all">All Types</option>
          {AFFILIATIONS.map((a) => (
            <option key={a.value} value={a.value}>{a.label}</option>
          ))}
        </select>
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
              placeholder="Company"
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
            <select
              className="rounded-lg border border-border px-3 py-2 text-sm bg-white outline-none focus:border-primary"
              value={formData.affiliation}
              onChange={(e) => setFormData({ ...formData, affiliation: e.target.value as ContactAffiliation })}
              data-testid="select-contact-affiliation"
            >
              {AFFILIATIONS.map((a) => (
                <option key={a.value} value={a.value}>{a.label}</option>
              ))}
            </select>
            <input
              className="rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="School"
              value={formData.school}
              onChange={(e) => setFormData({ ...formData, school: e.target.value })}
              data-testid="input-contact-school"
            />
            <input
              className="rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              data-testid="input-contact-email"
            />
            <input
              className="rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              data-testid="input-contact-phone"
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
            placeholder="Notes (interaction history, key takeaways, etc.)"
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

      {filteredContacts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-gray-50/50 px-4 py-8 text-center text-sm text-text-secondary" data-testid="text-no-contacts">
          {contacts.length === 0
            ? "No contacts yet. Start tracking your networking outreach by adding your first contact."
            : "No contacts match your filters."}
        </div>
      ) : (
        <div className="space-y-2" data-testid="list-contacts">
          {filteredContacts.map((c) => (
            <div key={c.id} className="rounded-xl border border-border bg-card p-4 shadow-sm" data-testid={`contact-${c.id}`}>
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-text-primary flex items-center gap-2">
                    {c.name}
                    {c.affiliation !== "other" && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary-dark font-medium capitalize">{c.affiliation}</span>
                    )}
                  </div>
                  <div className="text-xs text-text-secondary">{c.role}{c.role && c.company ? " at " : ""}{c.company}</div>
                  {c.school && <div className="text-xs text-text-secondary">{c.school}</div>}
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
              <div className="mt-2 flex items-center gap-3 text-xs text-text-secondary">
                {c.email && <span>{c.email}</span>}
                {c.phone && <span>{c.phone}</span>}
                {c.linkedinUrl && (
                  <a href={c.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline" data-testid={`link-linkedin-${c.id}`}>
                    LinkedIn
                  </a>
                )}
              </div>
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

function CompaniesTab({
  companies,
  savedCompanies,
  onSave,
  onUpdateSaved,
  onRemoveSaved,
  lastCompanyRefresh,
}: {
  companies: CompanyInfo[];
  savedCompanies: SavedCompany[];
  onSave: (company: Omit<SavedCompany, "id" | "savedAt">) => void;
  onUpdateSaved: (id: string, updates: Partial<SavedCompany>) => void;
  onRemoveSaved: (id: string) => void;
  lastCompanyRefresh: string;
}) {
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [filterStatus, setFilterStatus] = React.useState<string>("all");
  const [addForm, setAddForm] = React.useState({ name: "", overview: "", careersUrl: "" });
  const [activeSection, setActiveSection] = React.useState<"recommended" | "saved">("recommended");

  const savedNames = new Set(savedCompanies.map((c) => c.name.toLowerCase()));

  const handleSaveCompany = (co: CompanyInfo) => {
    if (savedNames.has(co.name.toLowerCase())) return;
    onSave({
      name: co.name,
      overview: co.roleDescription,
      careersUrl: co.jobPageUrl,
      status: "considering",
    });
  };

  const handleAddManual = () => {
    if (!addForm.name.trim()) return;
    onSave({
      name: addForm.name,
      overview: addForm.overview,
      careersUrl: addForm.careersUrl,
      status: "considering",
    });
    setAddForm({ name: "", overview: "", careersUrl: "" });
    setShowAddForm(false);
  };

  const getRefreshCountdown = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const diff = tomorrow.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const filteredSaved = savedCompanies.filter((c) => filterStatus === "all" || c.status === filterStatus);

  return (
    <div className="space-y-4" data-testid="companies-tab">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            Companies
          </div>
          <div className="text-xs text-text-secondary mt-0.5">Research opportunities and track your applications</div>
        </div>
        <Button
          className="rounded-full bg-primary text-sm px-4"
          onClick={() => setShowAddForm(!showAddForm)}
          data-testid="button-add-company"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Company
        </Button>
      </div>

      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveSection("recommended")}
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
            activeSection === "recommended" ? "border-primary text-primary-dark" : "border-transparent text-text-secondary hover:text-text-primary"
          )}
          data-testid="subtab-recommended"
        >
          Recommended ({companies.length})
        </button>
        <button
          onClick={() => setActiveSection("saved")}
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
            activeSection === "saved" ? "border-primary text-primary-dark" : "border-transparent text-text-secondary hover:text-text-primary"
          )}
          data-testid="subtab-saved"
        >
          Saved ({savedCompanies.length})
        </button>
      </div>

      {showAddForm && (
        <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-sm" data-testid="form-add-company">
          <input
            className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
            placeholder="Company Name *"
            value={addForm.name}
            onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
            data-testid="input-company-name"
          />
          <textarea
            className="w-full min-h-[60px] rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
            placeholder="Company overview / notes"
            value={addForm.overview}
            onChange={(e) => setAddForm({ ...addForm, overview: e.target.value })}
            data-testid="textarea-company-overview"
          />
          <input
            className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
            placeholder="Careers page URL"
            value={addForm.careersUrl}
            onChange={(e) => setAddForm({ ...addForm, careersUrl: e.target.value })}
            data-testid="input-company-careers"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" className="rounded-full text-sm" onClick={() => setShowAddForm(false)} data-testid="button-cancel-company">Cancel</Button>
            <Button className="rounded-full bg-primary text-sm" onClick={handleAddManual} data-testid="button-save-company">Save Company</Button>
          </div>
        </div>
      )}

      {activeSection === "recommended" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs text-text-secondary">Companies matched to your career track. Sponsorship varies — confirm during networking.</div>
            <div className="flex items-center gap-1 text-xs text-text-secondary">
              <Clock className="h-3 w-3" />
              Refreshes in {getRefreshCountdown()}
            </div>
          </div>
          {companies.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-gray-50/50 px-4 py-8 text-center text-sm text-text-secondary">
              No companies generated for this roadmap.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3" data-testid="list-recommended-companies">
              {companies.map((co, idx) => {
                const isSaved = savedNames.has(co.name.toLowerCase());
                return (
                  <div key={idx} className="rounded-xl border border-border bg-card p-4 shadow-sm" data-testid={`company-${idx}`}>
                    <div className="flex items-start justify-between">
                      <div className="text-sm font-semibold text-text-primary">{co.name}</div>
                      <button
                        onClick={() => handleSaveCompany(co)}
                        className={cn(
                          "rounded p-1 transition-colors",
                          isSaved ? "text-yellow-500" : "text-gray-300 hover:text-yellow-500"
                        )}
                        disabled={isSaved}
                        data-testid={`button-star-${idx}`}
                      >
                        <Star className={cn("h-4 w-4", isSaved ? "fill-yellow-500" : "")} />
                      </button>
                    </div>
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
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeSection === "saved" && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <select
              className="rounded-lg border border-border px-3 py-2 text-sm bg-white outline-none"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              data-testid="select-filter-saved-status"
            >
              <option value="all">All Statuses</option>
              {SAVED_COMPANY_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {filteredSaved.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-gray-50/50 px-4 py-8 text-center text-sm text-text-secondary" data-testid="text-no-saved">
              {savedCompanies.length === 0
                ? "No saved companies yet. Star companies from the Recommended tab or add one manually."
                : "No saved companies match this filter."}
            </div>
          ) : (
            <div className="space-y-2" data-testid="list-saved-companies">
              {filteredSaved.map((co) => (
                <div key={co.id} className="rounded-xl border border-border bg-card p-4 shadow-sm" data-testid={`saved-company-${co.id}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm font-semibold text-text-primary">{co.name}</div>
                      {co.overview && <div className="text-xs text-text-secondary mt-0.5">{co.overview}</div>}
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        className="rounded-lg border border-border px-2 py-1 text-xs bg-white outline-none"
                        value={co.status}
                        onChange={(e) => onUpdateSaved(co.id, { status: e.target.value as SavedCompanyStatus })}
                        data-testid={`select-saved-status-${co.id}`}
                      >
                        {SAVED_COMPANY_STATUSES.map((s) => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => onRemoveSaved(co.id)}
                        className="rounded p-1 text-text-secondary hover:text-red-500 hover:bg-red-50"
                        data-testid={`button-remove-saved-${co.id}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  {co.careersUrl && (
                    <a
                      href={co.careersUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 flex items-center gap-1 text-xs text-primary underline underline-offset-2 hover:text-primary-dark"
                      data-testid={`link-saved-careers-${co.id}`}
                    >
                      <ExternalLink className="h-3 w-3" />
                      Careers Page
                    </a>
                  )}
                  <div className="mt-1 text-xs text-text-secondary">
                    Saved {new Date(co.savedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
