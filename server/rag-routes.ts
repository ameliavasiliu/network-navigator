// ============================================================
// rag-routes.ts
// Express routes that expose the RAG engine to the frontend.
// Mount this in routes.ts with: registerRAGRoutes(app)
//
// Endpoints:
//   POST /api/rag/resume-feedback     — full resume analysis
//   POST /api/rag/circumstances       — circumstance-aware guidance
//   POST /api/rag/coach-query         — general RAG-powered coaching
//   GET  /api/rag/health              — verify RAG is initialized
// ============================================================

import type { Express, Request, Response } from "express";
import {
  initRAG,
  analyzeResume,
  analyzeCircumstance,
  retrieve,
} from "./rag-engine.js";

// Input validation helpers
function requireString(value: unknown, field: string, maxLen = 10000): string {
  if (typeof value !== "string") throw new Error(`${field} must be a string`);
  if (value.length > maxLen) throw new Error(`${field} exceeds maximum length`);
  return value.trim();
}

function requireStringOptional(value: unknown, fallback = ""): string {
  if (typeof value !== "string") return fallback;
  return value.trim().slice(0, 10000);
}

export function registerRAGRoutes(app: Express): void {
  // Initialize the RAG engine on first route registration
  initRAG();

  // ── Health check ──────────────────────────────────────────
  app.get("/api/rag/health", (_req: Request, res: Response) => {
    res.json({ status: "ok", engine: "tfidf-cosine", initialized: true });
  });

  // ── Resume Feedback ───────────────────────────────────────
  // POST /api/rag/resume-feedback
  // Body: {
  //   resumeText: string,       — parsed resume text
  //   fileName: string,         — original file name (for ATS hint)
  //   goal: string,             — user's career goal
  //   studentProfile: {         — from getStudentProfile()
  //     school, major, yearInSchool
  //   }
  // }
  app.post("/api/rag/resume-feedback", (req: Request, res: Response) => {
    try {
      const resumeText = requireString(req.body.resumeText, "resumeText");
      const fileName = requireStringOptional(req.body.fileName, "resume.pdf");
      const goal = requireStringOptional(req.body.goal, "career transition");
      const studentProfile = req.body.studentProfile ?? {};

      if (resumeText.length < 50) {
        return res.status(400).json({
          error: "Resume text is too short to analyze. Please ensure the file parsed correctly.",
        });
      }

      const analysis = analyzeResume(resumeText, fileName, goal, studentProfile);
      return res.json(analysis);
    } catch (err: any) {
      return res.status(400).json({ error: err.message ?? "Resume analysis failed" });
    }
  });

  // ── Circumstances Analysis ────────────────────────────────
  // POST /api/rag/circumstances
  // Body: {
  //   circumstanceText: string,   — what the user typed
  //   roadmapContext: {
  //     goal, goalCategory, completedTasks, totalTasks,
  //     contactCount, applicationCount
  //   }
  // }
  app.post("/api/rag/circumstances", (req: Request, res: Response) => {
    try {
      const circumstanceText = requireString(req.body.circumstanceText, "circumstanceText", 2000);

      if (circumstanceText.length < 5) {
        return res.status(400).json({ error: "Please describe your circumstance in more detail." });
      }

      const ctx = req.body.roadmapContext ?? {};
      const roadmapContext = {
        goal: requireStringOptional(ctx.goal),
        goalCategory: requireStringOptional(ctx.goalCategory, "general"),
        completedTasks: typeof ctx.completedTasks === "number" ? ctx.completedTasks : 0,
        totalTasks: typeof ctx.totalTasks === "number" ? ctx.totalTasks : 0,
        contactCount: typeof ctx.contactCount === "number" ? ctx.contactCount : 0,
        applicationCount: typeof ctx.applicationCount === "number" ? ctx.applicationCount : 0,
      };

      const result = analyzeCircumstance(circumstanceText, roadmapContext);
      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message ?? "Circumstances analysis failed" });
    }
  });

  // ── General Coach Query ───────────────────────────────────
  // POST /api/rag/coach-query
  // Body: {
  //   query: string,        — user's question or message
  //   category?: string,    — optional: "resume" | "networking" | "roadmap" | "coaching"
  //   topK?: number         — number of chunks to retrieve (default 3)
  // }
  app.post("/api/rag/coach-query", (req: Request, res: Response) => {
    try {
      const query = requireString(req.body.query, "query", 1000);
      const topK = typeof req.body.topK === "number" ? Math.min(req.body.topK, 8) : 3;
      const category = req.body.category as any;

      const VALID_CATEGORIES = ["resume", "circumstances", "roadmap", "networking", "coaching", undefined];
      if (!VALID_CATEGORIES.includes(category)) {
        return res.status(400).json({ error: "Invalid category" });
      }

      const chunks = retrieve(query, topK, category);

      // Build a synthesized answer from the retrieved chunks
      const synthesized = chunks.length > 0
        ? chunks.map((c) => c.text).join("\n\n")
        : "No specific guidance found for that query. Try rephrasing or ask about resume, networking, or roadmap topics.";

      return res.json({
        query,
        chunks,
        synthesized,
        chunkCount: chunks.length,
      });
    } catch (err: any) {
      return res.status(400).json({ error: err.message ?? "Coach query failed" });
    }
  });

  // ── Roadmap-aware coaching ────────────────────────────────
  // POST /api/rag/roadmap-coaching
  // Body: {
  //   roadmapState: {
  //     goal, goalCategory, completedTasks, totalTasks,
  //     contactCount, callCount, applicationCount,
  //     interviewCount, daysSinceLastActivity
  //   }
  // }
  // Returns personalized coaching messages based on current roadmap state.
  app.post("/api/rag/roadmap-coaching", (req: Request, res: Response) => {
    try {
      const state = req.body.roadmapState ?? {};
      const completedTasks = typeof state.completedTasks === "number" ? state.completedTasks : 0;
      const totalTasks = typeof state.totalTasks === "number" ? state.totalTasks : 0;
      const contactCount = typeof state.contactCount === "number" ? state.contactCount : 0;
      const callCount = typeof state.callCount === "number" ? state.callCount : 0;
      const applicationCount = typeof state.applicationCount === "number" ? state.applicationCount : 0;
      const interviewCount = typeof state.interviewCount === "number" ? state.interviewCount : 0;
      const daysSince = typeof state.daysSinceLastActivity === "number" ? state.daysSinceLastActivity : 0;
      const goal = requireStringOptional(state.goal, "a new role");
      const goalCategory = requireStringOptional(state.goalCategory, "general");

      // Build a context-aware query for retrieval
      let situationQuery = "";
      let primaryMessage = "";
      let suggestedActions: string[] = [];

      if (interviewCount > 0) {
        situationQuery = "interview preparation next steps convert to offer";
        primaryMessage = `You have ${interviewCount} interview${interviewCount > 1 ? "s" : ""} in progress — this is excellent. Your focus should be 100% on preparation right now.`;
        suggestedActions = [
          "Complete STAR-format stories for the top 5 behavioral questions",
          "Research each interviewer on LinkedIn",
          "Review the company's latest news, products, and financials",
          "Do one practice interview with a friend or career center",
        ];
      } else if (applicationCount >= 3) {
        situationQuery = "application follow up after applying networking";
        primaryMessage = `With ${applicationCount} applications out, your pipeline is live. Now it's about following up and adding network support.`;
        suggestedActions = [
          "Follow up on applications older than 7 days",
          "Identify contacts at each company you've applied to",
          "Continue adding new applications (target 8–12 total active)",
        ];
      } else if (callCount >= 2) {
        situationQuery = "referral ask when to ask for referral networking";
        primaryMessage = `You have had ${callCount} networking calls — you are building real relationships. This is the right time to start asking for introductions and referrals.`;
        suggestedActions = [
          "Ask your strongest contacts if they know anyone at your target companies",
          "Start applying to companies where you have warm connections",
          "Keep track of which contacts might be referral opportunities",
        ];
      } else if (contactCount >= 5) {
        situationQuery = "active networking outreach follow up calls";
        primaryMessage = `You have ${contactCount} contacts in your network. Great foundation — now push for actual conversations.`;
        suggestedActions = [
          "Schedule calls with your 3 most responsive contacts",
          "Follow up with anyone you messaged 7+ days ago",
          "Aim for 2 calls per week as a target",
        ];
      } else if (daysSince > 3) {
        situationQuery = "consistency momentum job search habits";
        primaryMessage = `It looks like you haven't been active in ${daysSince} days. No judgment — let's get one small thing done today.`;
        suggestedActions = [
          "Send one outreach message today — even a brief follow-up",
          "Update your contacts list with anyone you've spoken to recently",
          "Review your task list and mark anything completed",
        ];
      } else {
        situationQuery = `${goalCategory} networking strategy beginner starting`;
        primaryMessage = `You are in the foundation-building phase for ${goal}. Building the right habits now will pay off over the next few weeks.`;
        suggestedActions = [
          "Complete your resume and LinkedIn before heavy outreach",
          "Identify 20–30 target companies across large, mid-size, and startup tiers",
          "Send your first 3 outreach messages to alumni or classmates",
        ];
      }

      const retrievedChunks = retrieve(situationQuery, 3);

      return res.json({
        primaryMessage,
        suggestedActions,
        retrievedGuidance: retrievedChunks,
        progressSummary: {
          completedTasks,
          totalTasks,
          contactCount,
          callCount,
          applicationCount,
          interviewCount,
        },
      });
    } catch (err: any) {
      return res.status(400).json({ error: err.message ?? "Roadmap coaching failed" });
    }
  });
}
