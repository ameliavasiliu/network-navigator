import * as React from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";

const roadmaps = [
  { id: "1", name: "Investment Banking path", date: "11/23/2026" },
  { id: "2", name: "Marketing path", date: "11/19/2026" },
  { id: "3", name: "Medical school path", date: "11/01/2026" },
];

export default function NetworkNavigatorLanding() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6" data-testid="screen-network-navigator-landing">
      <PageHeader
        title="Network Navigator"
        subtitle="Create a new roadmap or continue where you left off."
        testId="header-network-navigator"
        right={
          <Button
            onClick={() => navigate("/network-navigator/wizard/step-1")}
            className="rounded-full bg-primary px-5"
            data-testid="button-create-roadmap"
          >
            Create new roadmap
          </Button>
        }
      />

      <section className="space-y-3" data-testid="section-roadmaps">
        <div className="text-lg font-semibold" data-testid="text-current-roadmaps">
          Current Roadmaps
        </div>

        <div className="rounded-xl border border-border bg-card shadow-card" data-testid="card-roadmaps">
          <ul className="divide-y divide-border" data-testid="list-roadmaps">
            {roadmaps.map((rm) => (
              <li
                key={rm.id}
                className="flex items-center justify-between px-4 py-2.5"
                data-testid={`row-roadmap-${rm.id}`}
              >
                <div className="min-w-0">
                  <div
                    className="truncate text-sm font-medium"
                    data-testid={`text-roadmap-title-${rm.id}`}
                  >
                    {rm.name}
                  </div>
                  <div className="text-xs text-text-secondary" data-testid={`text-roadmap-date-${rm.id}`}>
                    {rm.date}
                  </div>
                </div>
                <button
                  className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-text-primary"
                  onClick={() => navigate(`/network-navigator/roadmap/${rm.id}`)}
                  data-testid={`button-go-roadmap-${rm.id}`}
                >
                  Go here
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
