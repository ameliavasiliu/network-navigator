import * as React from "react";
import { useRoadmap } from "@/context/roadmap-context";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ExternalLink, Building2 } from "lucide-react";

const STATUSES = ["considering", "applied", "interviewing", "rejected", "offer"] as const;

const STATUS_COLORS: Record<string, string> = {
  considering: "bg-gray-100 text-gray-700",
  applied: "bg-blue-100 text-blue-800",
  interviewing: "bg-amber-100 text-amber-800",
  rejected: "bg-red-100 text-red-800",
  offer: "bg-emerald-100 text-emerald-800",
};

export default function CompaniesPage() {
  const { globalSavedCompanies, saveCompany, updateSavedCompany, removeSavedCompany } = useRoadmap();
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [showAdd, setShowAdd] = React.useState(false);
  const [draft, setDraft] = React.useState({
    name: "",
    overview: "",
    careersUrl: "",
    status: "considering" as (typeof STATUSES)[number],
  });

  const filtered = globalSavedCompanies.filter((c) => statusFilter === "all" || c.status === statusFilter);

  const counts = STATUSES.reduce<Record<string, number>>((acc, s) => {
    acc[s] = globalSavedCompanies.filter((c) => c.status === s).length;
    return acc;
  }, {});

  const handleAdd = () => {
    if (!draft.name.trim()) return;
    saveCompany(draft);
    setDraft({ name: "", overview: "", careersUrl: "", status: "considering" });
    setShowAdd(false);
  };

  return (
    <div className="space-y-6 max-w-5xl" data-testid="screen-companies-global">
      <PageHeader
        title="Companies"
        subtitle="Your shared target list across every roadmap. Save, organize, and track your application status."
        testId="header-companies"
      />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-2" data-testid="company-status-tiles">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(statusFilter === s ? "all" : s)}
            className={`rounded-lg border px-3 py-2 text-left transition-colors ${
              statusFilter === s ? "border-primary bg-primary/5" : "border-border bg-card hover:bg-black/5"
            }`}
            data-testid={`tile-status-${s}`}
          >
            <div className="text-xs font-medium text-text-secondary capitalize">{s}</div>
            <div className="text-xl font-bold text-text-primary mt-0.5">{counts[s] || 0}</div>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs text-text-secondary">
          {statusFilter === "all" ? "Showing all" : `Filtered: ${statusFilter}`} ({filtered.length} of {globalSavedCompanies.length})
          {statusFilter !== "all" && (
            <button onClick={() => setStatusFilter("all")} className="ml-2 underline" data-testid="button-clear-filter">clear</button>
          )}
        </div>
        <Button onClick={() => setShowAdd((v) => !v)} className="rounded-full bg-primary" data-testid="button-toggle-add-company">
          <Plus className="h-4 w-4 mr-1" /> Add Company
        </Button>
      </div>

      {showAdd && (
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-3" data-testid="form-add-company">
          <Input label="Company name *" value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} testId="input-new-company-name" />
          <Input label="Careers URL" value={draft.careersUrl} onChange={(v) => setDraft({ ...draft, careersUrl: v })} testId="input-new-company-url" />
          <textarea
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm"
            placeholder="Overview / why this company..."
            value={draft.overview}
            onChange={(e) => setDraft({ ...draft, overview: e.target.value })}
            data-testid="textarea-new-company-overview"
          />
          <label className="block">
            <div className="text-xs font-medium text-text-secondary mb-1">Status</div>
            <select
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm"
              value={draft.status}
              onChange={(e) => setDraft({ ...draft, status: e.target.value as any })}
              data-testid="select-new-company-status"
            >
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setShowAdd(false)} data-testid="button-cancel-add-company">Cancel</Button>
            <Button onClick={handleAdd} className="bg-primary" data-testid="button-save-new-company">Save</Button>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-white p-10 text-center text-sm text-text-secondary" data-testid="text-no-companies">
          {globalSavedCompanies.length === 0
            ? "No companies saved yet. Add one or save them from a roadmap."
            : "No companies match this status."}
        </div>
      ) : (
        <div className="grid gap-3" data-testid="list-companies-global">
          {filtered.map((c) => (
            <div key={c.id} className="rounded-xl border border-border bg-card p-4 shadow-sm" data-testid={`card-saved-company-${c.id}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-text-secondary" />
                    <div className="font-semibold text-text-primary truncate">{c.name}</div>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider ${STATUS_COLORS[c.status] || "bg-gray-100 text-gray-700"}`}>{c.status}</span>
                  </div>
                  {c.overview && <div className="text-sm text-text-secondary mt-1 whitespace-pre-wrap">{c.overview}</div>}
                  {c.careersUrl && (
                    <a href={c.careersUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs text-primary-dark hover:underline" data-testid={`link-careers-${c.id}`}>
                      <ExternalLink className="h-3 w-3" /> Careers page
                    </a>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <select
                    value={c.status}
                    onChange={(e) => updateSavedCompany(c.id, { status: e.target.value as any })}
                    className="rounded-md border border-border bg-white px-2 py-1 text-xs"
                    data-testid={`select-saved-company-status-${c.id}`}
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button
                    onClick={() => removeSavedCompany(c.id)}
                    className="text-text-secondary hover:text-red-600 p-1"
                    aria-label="Remove company"
                    data-testid={`button-remove-company-${c.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Input({ label, value, onChange, testId }: { label: string; value: string; onChange: (v: string) => void; testId: string }) {
  return (
    <label className="block">
      <div className="text-xs font-medium text-text-secondary mb-1">{label}</div>
      <input
        type="text"
        className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        data-testid={testId}
      />
    </label>
  );
}
