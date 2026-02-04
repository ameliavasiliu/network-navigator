import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertRoadmapSchema,
  insertTaskSchema,
  insertProgressUpdateSchema,
} from "@shared/schema";
import { fromError } from "zod-validation-error";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Roadmap routes
  app.post("/api/roadmaps", async (req, res) => {
    try {
      const data = insertRoadmapSchema.parse(req.body);
      const roadmap = await storage.createRoadmap(data);
      res.json(roadmap);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ error: fromError(error).toString() });
      }
      res.status(500).json({ error: "Failed to create roadmap" });
    }
  });

  app.get("/api/roadmaps", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }
      const roadmaps = await storage.getRoadmapsByUserId(userId);
      res.json(roadmaps);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch roadmaps" });
    }
  });

  app.get("/api/roadmaps/:id", async (req, res) => {
    try {
      const roadmap = await storage.getRoadmap(req.params.id);
      if (!roadmap) {
        return res.status(404).json({ error: "Roadmap not found" });
      }
      res.json(roadmap);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch roadmap" });
    }
  });

  // Task routes
  app.post("/api/tasks", async (req, res) => {
    try {
      const data = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(data);
      res.json(task);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ error: fromError(error).toString() });
      }
      res.status(500).json({ error: "Failed to create task" });
    }
  });

  app.get("/api/roadmaps/:roadmapId/tasks", async (req, res) => {
    try {
      const tasks = await storage.getTasksByRoadmapId(req.params.roadmapId);
      res.json(tasks);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });

  app.patch("/api/tasks/:id/complete", async (req, res) => {
    try {
      const task = await storage.completeTask(req.params.id);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json(task);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to complete task" });
    }
  });

  // Progress update routes
  app.post("/api/progress-updates", async (req, res) => {
    try {
      const data = insertProgressUpdateSchema.parse(req.body);
      const update = await storage.createProgressUpdate(data);
      res.json(update);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ error: fromError(error).toString() });
      }
      res.status(500).json({ error: "Failed to create progress update" });
    }
  });

  app.get("/api/roadmaps/:roadmapId/progress-updates", async (req, res) => {
    try {
      const updates = await storage.getProgressUpdatesByRoadmapId(req.params.roadmapId);
      res.json(updates);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch progress updates" });
    }
  });

  return httpServer;
}
