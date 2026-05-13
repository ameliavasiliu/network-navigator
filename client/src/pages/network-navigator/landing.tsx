import * as React from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { useRoadmap } from "@/context/roadmap-context";

export default function NetworkNavigatorLanding() {
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

  return (
    <div className="space-y-8" data-testid="screen-network-navigator-landing">
      {/* Top Description Box */}
      <div className="rounded-xl border border-border bg-white p-6 shadow-sm" data-testid="box-network-description">
        <h2 className="text-lg font-semibold text-text-primary">Daily Networking & Career Momentum Coaching</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary">
          Built for students, career switchers, and early professionals chasing roles, internships, and opportunities.
          Get a tailored roadmap, daily networking actions, and step-by-step outreach guidance that turns conversations
          into referrals — and referrals into offers.
        </p>
      </div>

      <PageHeader
        title="Network Navigator"
        subtitle="Create a new roadmap or continue where you left off."
        testId="header-network-navigator"
        right={
          <Button
            onClick={() => navigate("/network-navigator/create/step-1")}
            className="rounded-full bg-gradient-to-r from-primary to-emerald-400 px-6 font-semibold text-white shadow-md hover:shadow-lg hover:brightness-105"
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
          {roadmaps.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-text-secondary" data-testid="text-no-roadmaps">
              No roadmaps yet. Create your first one to get started!
            </div>
          ) : (
            <ul className="divide-y divide-border" data-testid="list-roadmaps">
              {roadmaps.map((rm) => {
                const completedTasks = rm.tasks.filter((t) => t.status === "completed").length;
                const totalTasks = rm.tasks.length;

                return (
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
                        {rm.goal || "Untitled Roadmap"}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-text-secondary" data-testid={`text-roadmap-date-${rm.id}`}>
                        <span>{formatDate(rm.createdAt)}</span>
                        <span>·</span>
                        <span>{completedTasks}/{totalTasks} tasks done</span>
                      </div>
                    </div>
                    <button
                      className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-text-primary"
                      onClick={() => handleGoToRoadmap(rm.id)}
                      data-testid={`button-go-roadmap-${rm.id}`}
                    >
                      Go here
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
