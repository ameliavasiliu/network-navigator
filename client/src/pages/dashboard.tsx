import * as React from "react";
import { useNavigate } from "react-router-dom";
import { FeatureCard } from "@/components/feature-card";
import { KpiCard } from "@/components/kpi-card";
import { PageHeader } from "@/components/page-header";
import { Network, MessageSquareText, Rocket } from "lucide-react";
import { useRoadmap } from "@/context/roadmap-context";

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

  return (
    <div className="space-y-8" data-testid="screen-dashboard">
      <PageHeader
        title="Hello, Dev User!"
        subtitle="Here's an overview of your interview preparation journey."
        testId="header-dashboard"
      />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3" data-testid="section-kpis">
        <KpiCard
          label="Mock Interviews"
          value="0"
          helper="Completed sessions"
          testId="card-kpi-mock-interviews"
        />
        <KpiCard
          label="Active Weeks Streak"
          value="2"
          helper="Consecutive weeks you've used the platform"
          testId="card-kpi-active-streak"
        />
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

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2" data-testid="grid-feature-cards">
          <FeatureCard
            icon={<Network className="h-6 w-6" />}
            title="Network Navigator"
            description="Create a tailored networking roadmap and get actionable outreach steps."
            onStart={() => navigate("/network-navigator")}
            testId="card-feature-network-navigator"
          />
          <FeatureCard
            icon={<MessageSquareText className="h-6 w-6" />}
            title="Mock Interview Tool"
            description="Practice interview questions with structured sessions and targeted feedback."
            onStart={() => navigate("/mock-interview")}
            testId="card-feature-mock-interview"
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
