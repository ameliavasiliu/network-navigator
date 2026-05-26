// ============================================================
// use-rag.ts
// React hook for calling the RAG API endpoints.
// Drop this file in: client/src/hooks/use-rag.ts
// ============================================================

import { useState, useCallback } from "react";

// ─── Types (mirror server response shapes) ───────────────────

export interface ResumeDimension {
  name: string;
  score: number;
  feedback: string;
  suggestions: string[];
}

export interface RetrievedChunk {
  id: string;
  category: string;
  tags: string[];
  text: string;
  score: number;
}

export interface ResumeAnalysis {
  overallScore: number;
  dimensions: ResumeDimension[];
  topStrengths: string[];
  topImprovements: string[];
  retrievedGuidance: RetrievedChunk[];
}

export interface CircumstanceResult {
  message: string;
  actionItems: string[];
  urgencyLevel: "low" | "medium" | "high";
  retrievedGuidance: RetrievedChunk[];
}

export interface RoadmapCoachResult {
  primaryMessage: string;
  suggestedActions: string[];
  retrievedGuidance: RetrievedChunk[];
  progressSummary: {
    completedTasks: number;
    totalTasks: number;
    contactCount: number;
    callCount: number;
    applicationCount: number;
    interviewCount: number;
  };
}

// ─── API helper ──────────────────────────────────────────────

async function postRAG<T>(endpoint: string, body: object): Promise<T> {
  const res = await fetch(`/api/rag/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? `RAG request failed (${res.status})`);
  }
  return data as T;
}

// ─── Resume Feedback Hook ────────────────────────────────────

export function useResumeFeedback() {
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(
    async (params: {
      resumeText: string;
      fileName: string;
      goal: string;
      studentProfile?: { school?: string; major?: string; yearInSchool?: string };
    }) => {
      setLoading(true);
      setError(null);
      try {
        const result = await postRAG<ResumeAnalysis>("resume-feedback", params);
        setAnalysis(result);
        return result;
      } catch (err: any) {
        setError(err.message ?? "Failed to analyze resume");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setAnalysis(null);
    setError(null);
  }, []);

  return { analysis, loading, error, analyze, reset };
}

// ─── Circumstances Hook ──────────────────────────────────────

export function useCircumstances() {
  const [result, setResult] = useState<CircumstanceResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(
    async (params: {
      circumstanceText: string;
      roadmapContext: {
        goal: string;
        goalCategory: string;
        completedTasks: number;
        totalTasks: number;
        contactCount: number;
        applicationCount: number;
      };
    }) => {
      setLoading(true);
      setError(null);
      try {
        const res = await postRAG<CircumstanceResult>("circumstances", params);
        setResult(res);
        return res;
      } catch (err: any) {
        setError(err.message ?? "Failed to analyze circumstances");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { result, loading, error, submit, reset };
}

// ─── Roadmap Coaching Hook ───────────────────────────────────

export function useRoadmapCoaching() {
  const [coaching, setCoaching] = useState<RoadmapCoachResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCoaching = useCallback(
    async (roadmapState: {
      goal: string;
      goalCategory: string;
      completedTasks: number;
      totalTasks: number;
      contactCount: number;
      callCount: number;
      applicationCount: number;
      interviewCount: number;
      daysSinceLastActivity?: number;
    }) => {
      setLoading(true);
      setError(null);
      try {
        const res = await postRAG<RoadmapCoachResult>("roadmap-coaching", {
          roadmapState,
        });
        setCoaching(res);
        return res;
      } catch (err: any) {
        setError(err.message ?? "Failed to fetch coaching");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { coaching, loading, error, fetchCoaching };
}
