import {
  type User,
  type InsertUser,
  type Roadmap,
  type InsertRoadmap,
  type Task,
  type InsertTask,
  type ProgressUpdate,
  type InsertProgressUpdate,
  users,
  roadmaps,
  tasks,
  progressUpdates,
} from "@shared/schema";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { eq, and, asc, desc } from "drizzle-orm";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  createRoadmap(roadmap: InsertRoadmap): Promise<Roadmap>;
  getRoadmap(id: string): Promise<Roadmap | undefined>;
  getRoadmapsByUserId(userId: string): Promise<Roadmap[]>;
  updateRoadmap(id: string, updates: Partial<InsertRoadmap>): Promise<Roadmap | undefined>;

  createTask(task: InsertTask): Promise<Task>;
  getTasksByRoadmapId(roadmapId: string): Promise<Task[]>;
  updateTask(id: string, updates: Partial<InsertTask>): Promise<Task | undefined>;
  completeTask(id: string): Promise<Task | undefined>;

  createProgressUpdate(update: InsertProgressUpdate): Promise<ProgressUpdate>;
  getProgressUpdatesByRoadmapId(roadmapId: string): Promise<ProgressUpdate[]>;
}

export class DbStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async createRoadmap(roadmap: InsertRoadmap): Promise<Roadmap> {
    const result = await db.insert(roadmaps).values(roadmap).returning();
    return result[0];
  }

  async getRoadmap(id: string): Promise<Roadmap | undefined> {
    const result = await db.select().from(roadmaps).where(eq(roadmaps.id, id)).limit(1);
    return result[0];
  }

  async getRoadmapsByUserId(userId: string): Promise<Roadmap[]> {
    return db
      .select()
      .from(roadmaps)
      .where(eq(roadmaps.userId, userId))
      .orderBy(desc(roadmaps.createdAt));
  }

  async updateRoadmap(
    id: string,
    updates: Partial<InsertRoadmap>
  ): Promise<Roadmap | undefined> {
    const result = await db
      .update(roadmaps)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(roadmaps.id, id))
      .returning();
    return result[0];
  }

  async createTask(task: InsertTask): Promise<Task> {
    const result = await db.insert(tasks).values(task).returning();
    return result[0];
  }

  async getTasksByRoadmapId(roadmapId: string): Promise<Task[]> {
    return db
      .select()
      .from(tasks)
      .where(eq(tasks.roadmapId, roadmapId))
      .orderBy(asc(tasks.order));
  }

  async updateTask(id: string, updates: Partial<InsertTask>): Promise<Task | undefined> {
    const result = await db
      .update(tasks)
      .set(updates)
      .where(eq(tasks.id, id))
      .returning();
    return result[0];
  }

  async completeTask(id: string): Promise<Task | undefined> {
    const result = await db
      .update(tasks)
      .set({ isCompleted: true, completedAt: new Date() })
      .where(eq(tasks.id, id))
      .returning();
    return result[0];
  }

  async createProgressUpdate(update: InsertProgressUpdate): Promise<ProgressUpdate> {
    const result = await db.insert(progressUpdates).values(update).returning();
    return result[0];
  }

  async getProgressUpdatesByRoadmapId(roadmapId: string): Promise<ProgressUpdate[]> {
    return db
      .select()
      .from(progressUpdates)
      .where(eq(progressUpdates.roadmapId, roadmapId))
      .orderBy(desc(progressUpdates.createdAt));
  }
}

export const storage = new DbStorage();
