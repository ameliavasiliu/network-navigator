import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, AlertCircle } from "lucide-react";
import { useRoadmap, WizardFormData } from "@/context/roadmap-context";

interface StepProps {
  data: WizardFormData;
  onChange: (updates: Partial<WizardFormData>) => void;
}

function Field({
  label,
  placeholder,
  testId,
  value,
  onChange,
  required,
}: {
  label: string;
  placeholder: string;
  testId: string;
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
}) {
  const isEmpty = required && !value.trim();
  return (
    <label className="block" data-testid={testId}>
      <div className="text-sm font-semibold flex items-center gap-1" data-testid={`${testId}-label`}>
        {label}
        {required && <span className="text-red-400 text-xs">*</span>}
      </div>
      <input
        className={`mt-2 w-full rounded-xl border bg-white px-4 py-2.5 text-sm outline-none focus:border-primary ${isEmpty ? "border-red-200" : "border-border"}`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        data-testid={`${testId}-input`}
      />
    </label>
  );
}

function StepOneContent({ data, onChange }: StepProps) {
  return (
    <div className="space-y-5" data-testid="wizard-step-1">
      <Field label="Year in school" placeholder="e.g., Sophomore" testId="field-year" value={data.yearInSchool} onChange={(val) => onChange({ yearInSchool: val })} required />
      <Field label="What are you studying?" placeholder="e.g., Economics" testId="field-major" value={data.major} onChange={(val) => onChange({ major: val })} required />
      <Field label="Where do you go to school?" placeholder="e.g., UCLA" testId="field-school" value={data.school} onChange={(val) => onChange({ school: val })} required />
      <Field label="Are you an international student?" placeholder="Yes/No" testId="field-international" value={data.isInternational} onChange={(val) => onChange({ isInternational: val })} required />
      <Field label="What degree are you getting?" placeholder="e.g., B.A." testId="field-degree" value={data.degree} onChange={(val) => onChange({ degree: val })} required />
    </div>
  );
}

function StepTwoContent({ data, onChange }: StepProps) {
  const isEmpty = !data.currentExperience.trim();
  return (
    <div className="space-y-5" data-testid="wizard-step-2">
      <label className="block" data-testid="field-resume">
        <div className="text-sm font-semibold" data-testid="field-resume-label">Upload your resume</div>
        <div className="mt-2 rounded-xl border border-dashed border-border bg-white p-5">
          <input type="file" className="text-sm" data-testid="input-resume" />
          <div className="mt-2 text-xs text-text-secondary" data-testid="text-resume-help">PDF/DOCX. (Resume parsing coming soon)</div>
        </div>
      </label>
      <label className="block" data-testid="field-experience">
        <div className="text-sm font-semibold flex items-center gap-1" data-testid="field-experience-label">
          What is your current circumstance/professional/academic experience?
          <span className="text-red-400 text-xs">*</span>
        </div>
        <textarea className={`mt-2 min-h-[120px] w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:border-primary ${isEmpty ? "border-red-200" : "border-border"}`} placeholder="Type here..." value={data.currentExperience} onChange={(e) => onChange({ currentExperience: e.target.value })} data-testid="textarea-experience" />
      </label>
    </div>
  );
}

function StepThreeContent({ data, onChange }: StepProps) {
  const isEmpty = !data.goal.trim();
  return (
    <div className="space-y-5" data-testid="wizard-step-3">
      <label className="block" data-testid="field-goal">
        <div className="text-sm font-semibold flex items-center gap-1" data-testid="field-goal-label">
          What is the professional goal you are trying to achieve/working towards?
          <span className="text-red-400 text-xs">*</span>
        </div>
        <textarea className={`mt-2 min-h-[140px] w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:border-primary ${isEmpty ? "border-red-200" : "border-border"}`} placeholder="e.g., I want to become a management consultant at McKinsey..." value={data.goal} onChange={(e) => onChange({ goal: e.target.value })} data-testid="textarea-goal" />
      </label>
    </div>
  );
}

function StepFourContent({ data, onChange }: StepProps) {
  return (
    <div className="space-y-5" data-testid="wizard-step-4">
      <label className="block" data-testid="field-considerations">
        <div className="text-sm font-semibold" data-testid="field-considerations-label">Any additional circumstances or considerations we should know about?</div>
        <textarea className="mt-2 min-h-[140px] w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-primary" placeholder="e.g., I need visa sponsorship, I'm looking for summer internships..." value={data.additionalContext} onChange={(e) => onChange({ additionalContext: e.target.value })} data-testid="textarea-considerations" />
      </label>
    </div>
  );
}

function WizardShell({ step, children }: { step: number; children: React.ReactNode }) {
  const navigate = useNavigate();
  const { createRoadmap, isWizardComplete } = useRoadmap();
  const pct = (step / 4) * 100;
  const canGenerate = isWizardComplete();

  const handleNext = () => {
    if (step < 4) {
      navigate("/network-navigator/create/step-" + (step + 1));
    } else {
      if (!canGenerate) return;
      const roadmapId = createRoadmap();
      navigate("/network-navigator/" + roadmapId);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      navigate("/network-navigator/create/step-" + (step - 1));
    } else {
      navigate("/network-navigator");
    }
  };

  const isLastStep = step === 4;
  const buttonDisabled = isLastStep && !canGenerate;

  return (
    <div className="max-w-3xl space-y-6" data-testid="screen-roadmap-wizard">
      <div className="flex items-center justify-between" data-testid="wizard-topbar">
        <button type="button" className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary" onClick={handleBack} data-testid="button-wizard-back">
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>
        <div className="text-sm font-semibold" data-testid="text-wizard-step">Step {step} of 4</div>
        <button
          type="button"
          onClick={handleNext}
          disabled={buttonDisabled}
          className={`inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-medium border ${buttonDisabled ? "bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed" : "bg-primary text-primary-foreground border-primary-border"}`}
          data-testid="button-wizard-next"
        >
          {isLastStep ? "Generate Roadmap" : "Next"}
        </button>
      </div>
      <div className="space-y-2" data-testid="wizard-progress">
        <Progress value={pct} data-testid="progress-wizard" />
        <div className="text-xs text-text-secondary" data-testid="text-wizard-progress">{Math.round(pct)}% complete</div>
      </div>
      <div className="rounded-xl border border-border bg-card p-6 shadow-card" data-testid="card-wizard">
        {children}
      </div>
      {isLastStep && !canGenerate && (
        <div className="flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800" data-testid="warning-incomplete">
          <AlertCircle className="h-4 w-4 shrink-0" />
          Please fill in all required fields (marked with *) before generating your roadmap. Use the Back button to complete any missing fields.
        </div>
      )}
    </div>
  );
}

export function Step1() {
  const { wizardFormData, updateWizardFormData, prefillWizardFromLastRoadmap } = useRoadmap();
  const hasRun = React.useRef(false);

  React.useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true;
      prefillWizardFromLastRoadmap();
    }
  }, [prefillWizardFromLastRoadmap]);

  return (
    <WizardShell step={1}>
      <StepOneContent data={wizardFormData} onChange={updateWizardFormData} />
    </WizardShell>
  );
}

export function Step2() {
  const { wizardFormData, updateWizardFormData } = useRoadmap();
  return (
    <WizardShell step={2}>
      <StepTwoContent data={wizardFormData} onChange={updateWizardFormData} />
    </WizardShell>
  );
}

export function Step3() {
  const { wizardFormData, updateWizardFormData } = useRoadmap();
  return (
    <WizardShell step={3}>
      <StepThreeContent data={wizardFormData} onChange={updateWizardFormData} />
    </WizardShell>
  );
}

export function Step4() {
  const { wizardFormData, updateWizardFormData } = useRoadmap();
  return (
    <WizardShell step={4}>
      <StepFourContent data={wizardFormData} onChange={updateWizardFormData} />
    </WizardShell>
  );
}

export default function RoadmapWizard() {
  return <Step1 />;
}
