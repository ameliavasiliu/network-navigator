import * as React from "react";
import { useNavigate } from "react-router-dom";
import { FeatureCard } from "@/components/feature-card";
import { KpiCard } from "@/components/kpi-card";
import { PageHeader } from "@/components/page-header";
import { Network, MessageSquareText, Rocket } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();

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
          label="Next Practice"
          value="Not Set"
          helper="Schedule your next session"
          testId="card-kpi-next-practice"
        />
        <KpiCard
          label="Document Status"
          value="1 Missing"
          helper="Resume & Cover Letter"
          testId="card-kpi-document-status"
        />
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
          <ul className="divide-y divide-border" data-testid="list-roadmaps-preview">
            {["Investment Banking", "Marketing", "Medical School"].map((name, idx) => (
              <li
                key={name}
                className="flex items-center justify-between px-4 py-2.5"
                data-testid={`row-roadmap-preview-${idx}`}
              >
                <div className="min-w-0">
                  <div
                    className="truncate text-sm font-medium"
                    data-testid={`text-roadmap-name-${idx}`}
                  >
                    {name} path
                  </div>
                  <div className="text-xs text-text-secondary" data-testid={`text-roadmap-date-${idx}`}>
                    {idx === 0 ? "11/23/2026" : idx === 1 ? "11/19/2026" : "11/01/2026"}
                  </div>
                </div>
                <button
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-text-primary"
                  onClick={() => navigate("/network-navigator/roadmap/1")}
                  data-testid={`button-go-roadmap-${idx}`}
                >
                  Go here
                  <Rocket className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
