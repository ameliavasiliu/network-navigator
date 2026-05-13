import * as React from "react";
import { useNavigate } from "react-router-dom";
import { FeatureCard } from "@/components/feature-card";
import { KpiCard } from "@/components/kpi-card";
import { PageHeader } from "@/components/page-header";
import { Network, Rocket, Info } from "lucide-react";
import { useRoadmap } from "@/context/roadmap-context";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const MOMENTUM_KEY = "opendoorai-momentum";

interface MomentumState {
  streak: number;
  lastVisitDate: string;
}

const STREAK_TIERS: Array<{ min: number; emoji: string; label: string }> = [
  { min: 29, emoji: "👽", label: "Legendary momentum (29+ days)" },
  { min: 22, emoji: "💎", label: "Diamond streak (22–28 days)" },
  { min: 15, emoji: "🔥", label: "On fire (15–21 days)" },
  { min: 8, emoji: "🤩", label: "In the zone (8–14 days)" },
  { min: 2, emoji: "😄", label: "Building momentum (2–7 days)" },
  { min: 1, emoji: "🙂", label: "Day one — let's go (1 day)" },
  { min: 0, emoji: "😔", label: "No streak yet" },
];

function getTier(streak: number) {
  return STREAK_TIERS.find((t) => streak >= t.min) || STREAK_TIERS[STREAK_TIERS.length - 1];
}

function todayKey() {
  // Local calendar date — important for streaks across timezones near midnight UTC.
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function daysBetween(a: string, b: string) {
  const da = new Date(a + "T00:00:00").getTime();
  const db = new Date(b + "T00:00:00").getTime();
  return Math.round((db - da) / (1000 * 60 * 60 * 24));
}

function useMomentum(): MomentumState {
  const [state, setState] = React.useState<MomentumState>(() => {
    try {
      const raw = localStorage.getItem(MOMENTUM_KEY);
      const today = todayKey();
      if (!raw) {
        const fresh = { streak: 1, lastVisitDate: today };
        localStorage.setItem(MOMENTUM_KEY, JSON.stringify(fresh));
        return fresh;
      }
      const parsed: MomentumState = JSON.parse(raw);
      const diff = daysBetween(parsed.lastVisitDate, today);
      let next: MomentumState;
      if (diff === 0) next = parsed;
      else if (diff === 1) next = { streak: parsed.streak + 1, lastVisitDate: today };
      else next = { streak: 1, lastVisitDate: today };
      localStorage.setItem(MOMENTUM_KEY, JSON.stringify(next));
      return next;
    } catch {
      return { streak: 1, lastVisitDate: todayKey() };
    }
  });
  return state;
}

function MomentumCard() {
  const { streak } = useMomentum();
  const tier = getTier(streak);
  return (
    <div
      className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm"
      data-testid="card-kpi-momentum"
    >
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium text-text-secondary">Momentum</div>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="rounded-full p-1 text-text-secondary hover:bg-black/5 hover:text-text-primary"
              data-testid="button-momentum-info"
              aria-label="How momentum works"
            >
              <Info className="h-3.5 w-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left" className="max-w-xs text-xs">
            <div className="font-semibold mb-1">Momentum tiers</div>
            <ul className="space-y-0.5">
              <li>0 days → 😔</li>
              <li>1 day → 🙂</li>
              <li>2–7 days → 😄</li>
              <li>8–14 days → 🤩</li>
              <li>15–21 days → 🔥</li>
              <li>22–28 days → 💎</li>
              <li>29+ days → 👽</li>
            </ul>
            <div className="mt-1 text-[11px] opacity-80">Visit daily to keep your streak alive.</div>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="mt-1 flex items-baseline gap-2">
        <div className="text-2xl font-bold text-text-primary" data-testid="text-momentum-value">{streak}</div>
        <div className="text-2xl" aria-hidden data-testid="text-momentum-emoji">{tier.emoji}</div>
        <div className="text-xs text-text-secondary">day{streak === 1 ? "" : "s"}</div>
      </div>
      <div className="mt-1 text-xs text-text-secondary">{tier.label}</div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { roadmaps, setCurrentRoadmap } = useRoadmap();

  const handleGoToRoadmap = (id: string) => {
    setCurrentRoadmap(id);
    navigate(`/network-navigator/${id}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  const displayRoadmaps = roadmaps.slice(0, 3);

  const totalContacts = roadmaps.reduce((sum, r) => sum + (r.contacts?.length || 0), 0);

  return (
    <div className="space-y-8" data-testid="screen-dashboard">
      <PageHeader
        title="Welcome back!"
        subtitle="Your daily networking and career momentum coach."
        testId="header-dashboard"
      />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3" data-testid="section-kpis">
        <KpiCard
          label="Conversations Started"
          value={String(totalContacts)}
          helper="Contacts tracked across roadmaps"
          testId="card-kpi-contacts"
        />
        <MomentumCard />
        <div
          className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4 shadow-sm transition-colors hover:bg-primary/10"
          data-testid="card-document-status"
        >
          <div>
            <div className="text-xs font-medium text-text-secondary">Document Status</div>
            <div className="mt-1 text-sm font-semibold text-text-primary">Resume & Cover Letter</div>
          </div>

          <div className="mt-3 flex gap-2">
             <button className="flex-1 rounded-lg border border-primary/20 bg-white py-1.5 text-xs font-medium text-text-primary shadow-sm hover:bg-primary/5">
               Upload Resume
             </button>
             <button className="flex-1 rounded-lg border border-primary/20 bg-white py-1.5 text-xs font-medium text-text-primary shadow-sm hover:bg-primary/5">
               Upload CL
             </button>
          </div>
        </div>
      </section>

      <section className="space-y-4" data-testid="section-get-started">
        <div className="text-lg font-semibold" data-testid="text-get-started">
          Get Started
        </div>

        <div className="grid grid-cols-1 gap-4" data-testid="grid-feature-cards">
          <FeatureCard
            icon={<Network className="h-6 w-6" />}
            title="Network Navigator"
            description="Create a tailored networking roadmap and get actionable outreach steps."
            onStart={() => navigate("/network-navigator")}
            testId="card-feature-network-navigator"
          />
        </div>
      </section>

      <section className="space-y-3" data-testid="section-current-roadmaps">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold" data-testid="text-current-roadmaps">
            Current Roadmaps
          </div>
          <button
            className="text-sm font-medium text-text-secondary hover:text-text-primary"
            onClick={() => navigate("/network-navigator")}
            data-testid="button-view-all-roadmaps"
          >
            View all
          </button>
        </div>

        <div className="rounded-xl border border-border bg-card shadow-card" data-testid="card-roadmaps-preview">
          {displayRoadmaps.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-text-secondary" data-testid="text-no-roadmaps">
              No roadmaps yet. Create your first one in Network Navigator!
            </div>
          ) : (
            <ul className="divide-y divide-border" data-testid="list-roadmaps-preview">
              {displayRoadmaps.map((rm, idx) => {
                const completedTasks = rm.tasks.filter((t) => t.status === "completed").length;
                const totalTasks = rm.tasks.length;

                return (
                  <li
                    key={rm.id}
                    className="flex items-center justify-between px-4 py-2.5"
                    data-testid={`row-roadmap-preview-${idx}`}
                  >
                    <div className="min-w-0">
                      <div
                        className="truncate text-sm font-medium"
                        data-testid={`text-roadmap-name-${idx}`}
                      >
                        {rm.goal || "Untitled Roadmap"}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-text-secondary" data-testid={`text-roadmap-date-${idx}`}>
                        <span>{formatDate(rm.createdAt)}</span>
                        <span>·</span>
                        <span>{completedTasks}/{totalTasks} tasks</span>
                      </div>
                    </div>
                    <button
                      className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-text-primary"
                      onClick={() => handleGoToRoadmap(rm.id)}
                      data-testid={`button-go-roadmap-${idx}`}
                    >
                      Go here
                      <Rocket className="h-3.5 w-3.5" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
