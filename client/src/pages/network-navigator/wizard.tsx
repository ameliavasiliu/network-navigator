import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRoadmap } from "@/context/roadmap-context";

type Step = 1 | 2 | 3 | 4;

function clampStep(s: string | undefined): Step {
  const n = Number(s);
  if (n === 1 || n === 2 || n === 3 || n === 4) return n;
  return 1;
}

export default function RoadmapWizard() {
  const navigate = useNavigate();
  const params = useParams();
  const step = clampStep(params.step);
  const { wizardFormData, updateWizardFormData, createRoadmap } = useRoadmap();

  const pct = (step / 4) * 100;

  const goNext = () => {
    if (step < 4) {
      navigate(`/network-navigator/create/step-${step + 1}`);
    } else {
      const roadmapId = createRoadmap();
      navigate(`/network-navigator/${roadmapId}`);
    }
  };

  const goBack = () => {
    if (step > 1) {
      navigate(`/network-navigator/create/step-${step - 1}`);
    } else {
      navigate("/network-navigator");
    }
  };

  return (
    <div className="max-w-3xl space-y-6" data-testid="screen-roadmap-wizard">
      <div className="flex items-center justify-between" data-testid="wizard-topbar">
        <button
          className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary"
          onClick={goBack}
          data-testid="button-wizard-back"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>

        <div className="text-sm font-semibold" data-testid="text-wizard-step">
          Step {step}
        </div>

        <Button
          onClick={goNext}
          className="rounded-full bg-primary px-5"
          data-testid="button-wizard-next"
        >
          {step === 4 ? "Generate Roadmap" : "Next"}
        </Button>
      </div>

      <div className="space-y-2" data-testid="wizard-progress">
        <Progress value={pct} data-testid="progress-wizard" />
        <div className="text-xs text-text-secondary" data-testid="text-wizard-progress">
          {Math.round(pct)}% complete
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-card" data-testid="card-wizard">
        {step === 1 ? (
          <StepOne
            data={wizardFormData}
            onChange={updateWizardFormData}
          />
        ) : null}
        {step === 2 ? (
          <StepTwo
            data={wizardFormData}
            onChange={updateWizardFormData}
          />
        ) : null}
        {step === 3 ? (
          <StepThree
            data={wizardFormData}
            onChange={updateWizardFormData}
          />
        ) : null}
        {step === 4 ? (
          <StepFour
            data={wizardFormData}
            onChange={updateWizardFormData}
          />
        ) : null}
      </div>
    </div>
  );
}

interface StepProps {
  data: {
    yearInSchool: string;
    major: string;
    school: string;
    isInternational: string;
    degree: string;
    currentExperience: string;
    goal: string;
    additionalContext: string;
  };
  onChange: (updates: Partial<StepProps["data"]>) => void;
}

function Field({
  label,
  placeholder,
  testId,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  testId: string;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <label className="block" data-testid={testId}>
      <div className="text-sm font-semibold" data-testid={`${testId}-label`}>
        {label}
      </div>
      <input
        className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        data-testid={`${testId}-input`}
      />
    </label>
  );
}

function StepOne({ data, onChange }: StepProps) {
  return (
    <div className="space-y-5" data-testid="wizard-step-1">
      <Field
        label="Year in school"
        placeholder="e.g., Sophomore"
        testId="field-year"
        value={data.yearInSchool}
        onChange={(val) => onChange({ yearInSchool: val })}
      />
      <Field
        label="What are you studying?"
        placeholder="e.g., Economics"
        testId="field-major"
        value={data.major}
        onChange={(val) => onChange({ major: val })}
      />
      <Field
        label="Where do you go to school?"
        placeholder="e.g., UCLA"
        testId="field-school"
        value={data.school}
        onChange={(val) => onChange({ school: val })}
      />
      <Field
        label="Are you an international student?"
        placeholder="Yes/No"
        testId="field-international"
        value={data.isInternational}
        onChange={(val) => onChange({ isInternational: val })}
      />
      <Field
        label="What degree are you getting?"
        placeholder="e.g., B.A."
        testId="field-degree"
        value={data.degree}
        onChange={(val) => onChange({ degree: val })}
      />
    </div>
  );
}

function StepTwo({ data, onChange }: StepProps) {
  return (
    <div className="space-y-5" data-testid="wizard-step-2">
      <label className="block" data-testid="field-resume">
        <div className="text-sm font-semibold" data-testid="field-resume-label">Upload your resume</div>
        <div className="mt-2 rounded-xl border border-dashed border-border bg-white p-5">
          <input type="file" className="text-sm" data-testid="input-resume" />
          <div className="mt-2 text-xs text-text-secondary" data-testid="text-resume-help">
            PDF/DOCX. (Resume parsing coming soon)
          </div>
        </div>
      </label>

      <label className="block" data-testid="field-experience">
        <div className="text-sm font-semibold" data-testid="field-experience-label">
          What is your current circumstance/professional/academic experience?
        </div>
        <textarea
          className="mt-2 min-h-[120px] w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-primary"
          placeholder="Type here..."
          value={data.currentExperience}
          onChange={(e) => onChange({ currentExperience: e.target.value })}
          data-testid="textarea-experience"
        />
      </label>
    </div>
  );
}

function StepThree({ data, onChange }: StepProps) {
  return (
    <div className="space-y-5" data-testid="wizard-step-3">
      <label className="block" data-testid="field-goal">
        <div className="text-sm font-semibold" data-testid="field-goal-label">
          What is the professional goal you are trying to achieve/working towards?
        </div>
        <textarea
          className="mt-2 min-h-[140px] w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-primary"
          placeholder="e.g., I want to become a management consultant at McKinsey..."
          value={data.goal}
          onChange={(e) => onChange({ goal: e.target.value })}
          data-testid="textarea-goal"
        />
      </label>
    </div>
  );
}

function StepFour({ data, onChange }: StepProps) {
  return (
    <div className="space-y-5" data-testid="wizard-step-4">
      <label className="block" data-testid="field-considerations">
        <div className="text-sm font-semibold" data-testid="field-considerations-label">
          Any additional circumstances or considerations we should know about?
        </div>
        <textarea
          className="mt-2 min-h-[140px] w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-primary"
          placeholder="e.g., I need visa sponsorship, I'm looking for summer internships..."
          value={data.additionalContext}
          onChange={(e) => onChange({ additionalContext: e.target.value })}
          data-testid="textarea-considerations"
        />
      </label>
    </div>
  );
}
