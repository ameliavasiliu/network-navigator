import * as React from "react";
import { useRoadmap } from "@/context/roadmap-context";
import type { Contact, ContactAffiliation } from "@/context/roadmap-context";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Search, Mail, Phone, GraduationCap, Linkedin } from "lucide-react";

const AFFILIATIONS: ContactAffiliation[] = ["alumni", "recruiter", "referral", "friend", "other"];
const STATUSES: Contact["status"][] = ["identified", "messaged", "responded", "call_completed", "referral_requested"];

const STATUS_LABELS: Record<Contact["status"], string> = {
  identified: "Identified",
  messaged: "Messaged",
  responded: "Responded",
  call_completed: "Call completed",
  referral_requested: "Referral requested",
};

type DraftContact = Omit<Contact, "id">;

const emptyDraft = (): DraftContact => ({
  name: "",
  company: "",
  role: "",
  affiliation: "other",
  school: "",
  email: "",
  phone: "",
  linkedinUrl: "",
  notes: "",
  status: "identified",
  lastInteractionDate: new Date().toISOString(),
});

export default function ContactsPage() {
  const { globalContacts, addContact, updateContact, deleteContact } = useRoadmap();
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [affiliationFilter, setAffiliationFilter] = React.useState<string>("all");
  const [showAdd, setShowAdd] = React.useState(false);
  const [draft, setDraft] = React.useState<DraftContact>(emptyDraft);

  const filtered = globalContacts.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.name.toLowerCase().includes(q) || (c.company || "").toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    const matchAffil = affiliationFilter === "all" || c.affiliation === affiliationFilter;
    return matchSearch && matchStatus && matchAffil;
  });

  const handleAdd = () => {
    if (!draft.name.trim()) return;
    addContact({ ...draft, lastInteractionDate: new Date().toISOString() });
    setDraft(emptyDraft());
    setShowAdd(false);
  };

  return (
    <div className="space-y-6 max-w-5xl" data-testid="screen-contacts-global">
      <PageHeader
        title="Contacts"
        subtitle="Your shared network across every roadmap. Add, search, and track the people you're talking to."
        testId="header-contacts"
      />

      <div className="flex flex-wrap items-center gap-3" data-testid="contacts-toolbar">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
          <input
            type="text"
            placeholder="Search by name or company..."
            className="w-full rounded-lg border border-border bg-white pl-9 pr-3 py-2 text-sm outline-none focus:border-primary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-testid="input-contacts-search"
          />
        </div>
        <select
          className="rounded-lg border border-border bg-white px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          data-testid="select-status-filter"
        >
          <option value="all">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
        <select
          className="rounded-lg border border-border bg-white px-3 py-2 text-sm"
          value={affiliationFilter}
          onChange={(e) => setAffiliationFilter(e.target.value)}
          data-testid="select-affiliation-filter"
        >
          <option value="all">All affiliations</option>
          {AFFILIATIONS.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
        <Button onClick={() => setShowAdd((v) => !v)} className="rounded-full bg-primary" data-testid="button-toggle-add-contact">
          <Plus className="h-4 w-4 mr-1" /> Add Contact
        </Button>
      </div>

      {showAdd && (
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-3" data-testid="form-add-contact">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input label="Name *" value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} testId="input-new-contact-name" />
            <Input label="Company" value={draft.company} onChange={(v) => setDraft({ ...draft, company: v })} testId="input-new-contact-company" />
            <Input label="Role" value={draft.role} onChange={(v) => setDraft({ ...draft, role: v })} testId="input-new-contact-role" />
            <Input label="School" value={draft.school} onChange={(v) => setDraft({ ...draft, school: v })} testId="input-new-contact-school" />
            <Input label="Email" value={draft.email} onChange={(v) => setDraft({ ...draft, email: v })} testId="input-new-contact-email" />
            <Input label="Phone" value={draft.phone} onChange={(v) => setDraft({ ...draft, phone: v })} testId="input-new-contact-phone" />
            <Input label="LinkedIn URL" value={draft.linkedinUrl} onChange={(v) => setDraft({ ...draft, linkedinUrl: v })} testId="input-new-contact-linkedin" />
            <label className="block">
              <div className="text-xs font-medium text-text-secondary mb-1">Affiliation</div>
              <select
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm"
                value={draft.affiliation}
                onChange={(e) => setDraft({ ...draft, affiliation: e.target.value as ContactAffiliation })}
                data-testid="select-new-contact-affiliation"
              >
                {AFFILIATIONS.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </label>
            <label className="block">
              <div className="text-xs font-medium text-text-secondary mb-1">Status</div>
              <select
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm"
                value={draft.status}
                onChange={(e) => setDraft({ ...draft, status: e.target.value as Contact["status"] })}
                data-testid="select-new-contact-status"
              >
                {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
              </select>
            </label>
          </div>
          <textarea
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm"
            placeholder="Notes..."
            value={draft.notes}
            onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
            data-testid="textarea-new-contact-notes"
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setShowAdd(false)} data-testid="button-cancel-add-contact">Cancel</Button>
            <Button onClick={handleAdd} className="bg-primary" data-testid="button-save-new-contact">Save Contact</Button>
          </div>
        </div>
      )}

      <div className="text-xs text-text-secondary" data-testid="text-contacts-count">
        Showing {filtered.length} of {globalContacts.length} contact{globalContacts.length === 1 ? "" : "s"}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-white p-10 text-center text-sm text-text-secondary" data-testid="text-no-contacts">
          {globalContacts.length === 0
            ? "No contacts yet. Add your first one to get started."
            : "No contacts match your filters."}
        </div>
      ) : (
        <div className="grid gap-3" data-testid="list-contacts-global">
          {filtered.map((c) => (
            <div key={c.id} className="rounded-xl border border-border bg-card p-4 shadow-sm" data-testid={`card-contact-${c.id}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold text-text-primary truncate">{c.name}</div>
                    <span className="rounded-full bg-primary/10 text-primary-dark text-[10px] px-2 py-0.5 uppercase tracking-wider">{c.affiliation || "other"}</span>
                  </div>
                  <div className="text-sm text-text-secondary mt-0.5">
                    {c.role || "—"}{c.company ? ` @ ${c.company}` : ""}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-text-secondary">
                    {c.school && <span className="inline-flex items-center gap-1"><GraduationCap className="h-3 w-3" />{c.school}</span>}
                    {c.email && <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" />{c.email}</span>}
                    {c.phone && <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" />{c.phone}</span>}
                    {c.linkedinUrl && <a href={c.linkedinUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:underline"><Linkedin className="h-3 w-3" />LinkedIn</a>}
                  </div>
                  {c.notes && <div className="mt-2 text-sm text-text-primary whitespace-pre-wrap">{c.notes}</div>}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <select
                    value={c.status}
                    onChange={(e) => updateContact(c.id, { status: e.target.value as Contact["status"], lastInteractionDate: new Date().toISOString() })}
                    className="rounded-md border border-border bg-white px-2 py-1 text-xs"
                    data-testid={`select-status-${c.id}`}
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                  </select>
                  <button
                    onClick={() => deleteContact(c.id)}
                    className="text-text-secondary hover:text-red-600 p-1"
                    aria-label="Delete contact"
                    data-testid={`button-delete-contact-${c.id}`}
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
