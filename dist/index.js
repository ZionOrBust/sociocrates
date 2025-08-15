var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  circleMemberships: () => circleMemberships,
  circles: () => circles,
  circlesRelations: () => circlesRelations,
  clarifyingQuestions: () => clarifyingQuestions,
  consentChoiceEnum: () => consentChoiceEnum,
  consentResponses: () => consentResponses,
  insertCircleSchema: () => insertCircleSchema,
  insertClarifyingQuestionSchema: () => insertClarifyingQuestionSchema,
  insertConsentResponseSchema: () => insertConsentResponseSchema,
  insertObjectionSchema: () => insertObjectionSchema,
  insertProposalSchema: () => insertProposalSchema,
  insertQuickReactionSchema: () => insertQuickReactionSchema,
  insertUserSchema: () => insertUserSchema,
  objectionResolutions: () => objectionResolutions,
  objectionSeverityEnum: () => objectionSeverityEnum,
  objections: () => objections,
  processLogs: () => processLogs,
  processStepEnum: () => processStepEnum,
  proposalStatusEnum: () => proposalStatusEnum,
  proposals: () => proposals,
  proposalsRelations: () => proposalsRelations,
  quickReactions: () => quickReactions,
  selectCircleSchema: () => selectCircleSchema,
  selectProposalSchema: () => selectProposalSchema,
  selectUserSchema: () => selectUserSchema,
  stepTimings: () => stepTimings,
  userRoleEnum: () => userRoleEnum,
  users: () => users,
  usersRelations: () => usersRelations
});
import { pgTable, varchar, text, timestamp, boolean, integer, uuid, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
var userRoleEnum, proposalStatusEnum, objectionSeverityEnum, consentChoiceEnum, processStepEnum, users, circles, circleMemberships, stepTimings, proposals, clarifyingQuestions, quickReactions, objections, objectionResolutions, consentResponses, processLogs, usersRelations, circlesRelations, proposalsRelations, insertUserSchema, selectUserSchema, insertCircleSchema, selectCircleSchema, insertProposalSchema, selectProposalSchema, insertClarifyingQuestionSchema, insertQuickReactionSchema, insertObjectionSchema, insertConsentResponseSchema;
var init_schema = __esm({
  "shared/schema.ts"() {
    "use strict";
    userRoleEnum = pgEnum("user_role", ["admin", "participant", "observer"]);
    proposalStatusEnum = pgEnum("proposal_status", ["draft", "active", "pending_consent", "resolved", "archived"]);
    objectionSeverityEnum = pgEnum("objection_severity", ["minor_concern", "major_concern", "deal_breaker"]);
    consentChoiceEnum = pgEnum("consent_choice", ["consent", "consent_with_reservations", "withhold_consent"]);
    processStepEnum = pgEnum("process_step", [
      "proposal_presentation",
      "clarifying_questions",
      "quick_reactions",
      "objections_round",
      "resolve_objections",
      "consent_round",
      "record_outcome"
    ]);
    users = pgTable("users", {
      id: uuid("id").primaryKey().defaultRandom(),
      email: varchar("email", { length: 255 }).notNull().unique(),
      password: varchar("password", { length: 255 }).notNull(),
      name: varchar("name", { length: 255 }).notNull(),
      role: userRoleEnum("role").default("participant").notNull(),
      isActive: boolean("is_active").default(true).notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    circles = pgTable("circles", {
      id: uuid("id").primaryKey().defaultRandom(),
      name: varchar("name", { length: 255 }).notNull(),
      description: text("description"),
      createdBy: uuid("created_by").references(() => users.id).notNull(),
      isActive: boolean("is_active").default(true).notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    circleMemberships = pgTable("circle_memberships", {
      id: uuid("id").primaryKey().defaultRandom(),
      circleId: uuid("circle_id").references(() => circles.id).notNull(),
      userId: uuid("user_id").references(() => users.id).notNull(),
      role: userRoleEnum("role").default("participant").notNull(),
      // Can override user's global role within this circle
      joinedAt: timestamp("joined_at").defaultNow().notNull()
    });
    stepTimings = pgTable("step_timings", {
      id: uuid("id").primaryKey().defaultRandom(),
      circleId: uuid("circle_id").references(() => circles.id).notNull(),
      proposalPresentation: integer("proposal_presentation").default(300).notNull(),
      // seconds
      clarifyingQuestions: integer("clarifying_questions").default(600).notNull(),
      quickReactions: integer("quick_reactions").default(300).notNull(),
      objectionsRound: integer("objections_round").default(600).notNull(),
      resolveObjections: integer("resolve_objections").default(900).notNull(),
      consentRound: integer("consent_round").default(300).notNull(),
      recordOutcome: integer("record_outcome").default(180).notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    proposals = pgTable("proposals", {
      id: uuid("id").primaryKey().defaultRandom(),
      title: varchar("title", { length: 255 }).notNull(),
      description: text("description").notNull(),
      circleId: uuid("circle_id").references(() => circles.id).notNull(),
      createdBy: uuid("created_by").references(() => users.id).notNull(),
      status: proposalStatusEnum("status").default("draft").notNull(),
      currentStep: processStepEnum("current_step").default("proposal_presentation"),
      stepStartTime: timestamp("step_start_time"),
      stepEndTime: timestamp("step_end_time"),
      isActive: boolean("is_active").default(true).notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    clarifyingQuestions = pgTable("clarifying_questions", {
      id: uuid("id").primaryKey().defaultRandom(),
      proposalId: uuid("proposal_id").references(() => proposals.id).notNull(),
      userId: uuid("user_id").references(() => users.id).notNull(),
      question: text("question").notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    quickReactions = pgTable("quick_reactions", {
      id: uuid("id").primaryKey().defaultRandom(),
      proposalId: uuid("proposal_id").references(() => proposals.id).notNull(),
      userId: uuid("user_id").references(() => users.id).notNull(),
      reaction: varchar("reaction", { length: 300 }).notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    objections = pgTable("objections", {
      id: uuid("id").primaryKey().defaultRandom(),
      proposalId: uuid("proposal_id").references(() => proposals.id).notNull(),
      userId: uuid("user_id").references(() => users.id).notNull(),
      objection: text("objection").notNull(),
      severity: objectionSeverityEnum("severity").notNull(),
      isResolved: boolean("is_resolved").default(false).notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    objectionResolutions = pgTable("objection_resolutions", {
      id: uuid("id").primaryKey().defaultRandom(),
      objectionId: uuid("objection_id").references(() => objections.id).notNull(),
      userId: uuid("user_id").references(() => users.id).notNull(),
      solution: text("solution").notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    consentResponses = pgTable("consent_responses", {
      id: uuid("id").primaryKey().defaultRandom(),
      proposalId: uuid("proposal_id").references(() => proposals.id).notNull(),
      userId: uuid("user_id").references(() => users.id).notNull(),
      choice: consentChoiceEnum("choice").notNull(),
      reason: text("reason"),
      // Required if withholding consent or consenting with reservations
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    processLogs = pgTable("process_logs", {
      id: uuid("id").primaryKey().defaultRandom(),
      proposalId: uuid("proposal_id").references(() => proposals.id).notNull(),
      step: processStepEnum("step").notNull(),
      action: varchar("action", { length: 255 }).notNull(),
      userId: uuid("user_id").references(() => users.id),
      details: text("details"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    usersRelations = relations(users, ({ many }) => ({
      proposals: many(proposals),
      circleMemberships: many(circleMemberships),
      clarifyingQuestions: many(clarifyingQuestions),
      quickReactions: many(quickReactions),
      objections: many(objections),
      objectionResolutions: many(objectionResolutions),
      consentResponses: many(consentResponses)
    }));
    circlesRelations = relations(circles, ({ one, many }) => ({
      createdBy: one(users, { fields: [circles.createdBy], references: [users.id] }),
      memberships: many(circleMemberships),
      proposals: many(proposals),
      stepTimings: many(stepTimings)
    }));
    proposalsRelations = relations(proposals, ({ one, many }) => ({
      createdBy: one(users, { fields: [proposals.createdBy], references: [users.id] }),
      circle: one(circles, { fields: [proposals.circleId], references: [circles.id] }),
      clarifyingQuestions: many(clarifyingQuestions),
      quickReactions: many(quickReactions),
      objections: many(objections),
      consentResponses: many(consentResponses),
      processLogs: many(processLogs)
    }));
    insertUserSchema = createInsertSchema(users);
    selectUserSchema = createSelectSchema(users);
    insertCircleSchema = createInsertSchema(circles);
    selectCircleSchema = createSelectSchema(circles);
    insertProposalSchema = createInsertSchema(proposals);
    selectProposalSchema = createSelectSchema(proposals);
    insertClarifyingQuestionSchema = createInsertSchema(clarifyingQuestions);
    insertQuickReactionSchema = createInsertSchema(quickReactions);
    insertObjectionSchema = createInsertSchema(objections);
    insertConsentResponseSchema = createInsertSchema(consentResponses);
  }
});

// server/db.ts
var db_exports = {};
__export(db_exports, {
  db: () => db,
  pool: () => pool
});
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
var pool, db;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    neonConfig.webSocketConstructor = ws;
    pool = null;
    db = null;
    if (!process.env.DATABASE_URL) {
      console.warn("DATABASE_URL not set - running in development mode without database");
    } else {
      try {
        pool = new Pool({ connectionString: process.env.DATABASE_URL });
        db = drizzle({ client: pool, schema: schema_exports });
        console.log("\u2705 Database connected successfully");
      } catch (error) {
        console.warn("\u274C Failed to connect to database:", error.message);
      }
    }
  }
});

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
init_schema();
import { eq, desc } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
var db2;
try {
  const dbModule = await Promise.resolve().then(() => (init_db(), db_exports));
  db2 = dbModule.db;
} catch (error) {
  console.warn("Database connection failed, using development storage:", error.message);
  db2 = null;
}
var DatabaseStorage = class {
  // Auth operations
  async getUserByEmail(email) {
    if (!db2) throw new Error("Database not available");
    const [user] = await db2.select().from(users).where(eq(users.email, email));
    return user;
  }
  async createUser(userData) {
    if (!db2) throw new Error("Database not available");
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const [user] = await db2.insert(users).values({ ...userData, password: hashedPassword }).returning();
    return user;
  }
  async validateUser(email, password) {
    if (!db2) throw new Error("Database not available");
    const user = await this.getUserByEmail(email);
    if (!user) return null;
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }
  async getUser(id) {
    if (!db2) throw new Error("Database not available");
    const [user] = await db2.select().from(users).where(eq(users.id, id));
    return user;
  }
  async updateUser(id, userData) {
    if (!db2) throw new Error("Database not available");
    const [user] = await db2.update(users).set({ ...userData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(users.id, id)).returning();
    return user;
  }
  async getAllUsers() {
    if (!db2) throw new Error("Database not available");
    return await db2.select().from(users).orderBy(users.name);
  }
  async getAllCircles() {
    if (!db2) throw new Error("Database not available");
    return await db2.select().from(circles).orderBy(circles.name);
  }
  async getCircleById(id) {
    if (!db2) throw new Error("Database not available");
    const [circle] = await db2.select().from(circles).where(eq(circles.id, id));
    return circle;
  }
  async createCircle(circleData) {
    if (!db2) throw new Error("Database not available");
    const [circle] = await db2.insert(circles).values(circleData).returning();
    return circle;
  }
  async getUserCircles(userId) {
    if (!db2) throw new Error("Database not available");
    const result = await db2.select({ circle: circles }).from(circleMemberships).innerJoin(circles, eq(circleMemberships.circleId, circles.id)).where(eq(circleMemberships.userId, userId));
    return result.map((row) => row.circle);
  }
  async addUserToCircle(userId, circleId, role = "participant") {
    if (!db2) throw new Error("Database not available");
    await db2.insert(circleMemberships).values({
      userId,
      circleId,
      role
    });
  }
  async getProposalsByCircle(circleId) {
    if (!db2) throw new Error("Database not available");
    return await db2.select().from(proposals).where(eq(proposals.circleId, circleId)).orderBy(desc(proposals.createdAt));
  }
  async getProposalById(id) {
    if (!db2) throw new Error("Database not available");
    const [proposal] = await db2.select().from(proposals).where(eq(proposals.id, id));
    return proposal;
  }
  async createProposal(proposalData) {
    if (!db2) throw new Error("Database not available");
    const [proposal] = await db2.insert(proposals).values(proposalData).returning();
    return proposal;
  }
  async updateProposal(id, proposalData) {
    if (!db2) throw new Error("Database not available");
    const [proposal] = await db2.update(proposals).set({ ...proposalData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(proposals.id, id)).returning();
    return proposal;
  }
  async addClarifyingQuestion(questionData) {
    if (!db2) throw new Error("Database not available");
    const [question] = await db2.insert(clarifyingQuestions).values(questionData).returning();
    return question;
  }
  async getClarifyingQuestions(proposalId) {
    if (!db2) throw new Error("Database not available");
    return await db2.select().from(clarifyingQuestions).where(eq(clarifyingQuestions.proposalId, proposalId)).orderBy(clarifyingQuestions.createdAt);
  }
  async addQuickReaction(reactionData) {
    if (!db2) throw new Error("Database not available");
    const [reaction] = await db2.insert(quickReactions).values(reactionData).returning();
    return reaction;
  }
  async getQuickReactions(proposalId) {
    if (!db2) throw new Error("Database not available");
    return await db2.select().from(quickReactions).where(eq(quickReactions.proposalId, proposalId)).orderBy(quickReactions.createdAt);
  }
  async addObjection(objectionData) {
    if (!db2) throw new Error("Database not available");
    const [objection] = await db2.insert(objections).values(objectionData).returning();
    return objection;
  }
  async getObjections(proposalId) {
    if (!db2) throw new Error("Database not available");
    return await db2.select().from(objections).where(eq(objections.proposalId, proposalId)).orderBy(objections.createdAt);
  }
  async addConsentResponse(responseData) {
    if (!db2) throw new Error("Database not available");
    const [response] = await db2.insert(consentResponses).values(responseData).returning();
    return response;
  }
  async getConsentResponses(proposalId) {
    if (!db2) throw new Error("Database not available");
    return await db2.select().from(consentResponses).where(eq(consentResponses.proposalId, proposalId)).orderBy(consentResponses.createdAt);
  }
};
var DevelopmentStorage = class {
  users = /* @__PURE__ */ new Map();
  circles = /* @__PURE__ */ new Map();
  proposals = /* @__PURE__ */ new Map();
  memberships = /* @__PURE__ */ new Map();
  questions = /* @__PURE__ */ new Map();
  reactions = /* @__PURE__ */ new Map();
  objections = /* @__PURE__ */ new Map();
  responses = /* @__PURE__ */ new Map();
  constructor() {
    this.initializeDefaultData();
  }
  initializeDefaultData() {
    const adminId = nanoid();
    const admin = {
      id: adminId,
      email: "admin@sociocracy.org",
      password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
      // password
      name: "System Administrator",
      role: "admin",
      isActive: true,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.users.set(adminId, admin);
    const participantId = nanoid();
    const participant = {
      id: participantId,
      email: "demo@sociocracy.org",
      password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
      // password
      name: "Demo Participant",
      role: "participant",
      isActive: true,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.users.set(participantId, participant);
    const circleId = nanoid();
    const circle = {
      id: circleId,
      name: "General Circle",
      description: "Main decision-making circle for collaborative governance",
      createdBy: adminId,
      isActive: true,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.circles.set(circleId, circle);
    this.memberships.set(`${adminId}-${circleId}`, { userId: adminId, circleId, role: "admin" });
    this.memberships.set(`${participantId}-${circleId}`, { userId: participantId, circleId, role: "participant" });
    const proposalId = nanoid();
    const proposal = {
      id: proposalId,
      title: "Implement Flexible Work Hours Policy",
      description: "Proposal to allow team members to choose their working hours between 7 AM and 7 PM, with core collaboration hours from 10 AM to 3 PM.",
      circleId,
      createdBy: participantId,
      status: "active",
      currentStep: "clarifying_questions",
      stepStartTime: /* @__PURE__ */ new Date(),
      stepEndTime: new Date(Date.now() + 10 * 60 * 1e3),
      // 10 minutes from now
      isActive: true,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.proposals.set(proposalId, proposal);
    this.questions.set(proposalId, []);
    this.reactions.set(proposalId, []);
    this.objections.set(proposalId, []);
    this.responses.set(proposalId, []);
  }
  async getUserByEmail(email) {
    return Array.from(this.users.values()).find((user) => user.email === email);
  }
  async createUser(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = {
      id: nanoid(),
      ...userData,
      password: hashedPassword,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.users.set(user.id, user);
    return user;
  }
  async validateUser(email, password) {
    const user = await this.getUserByEmail(email);
    if (!user) return null;
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }
  async getUser(id) {
    return this.users.get(id);
  }
  async updateUser(id, userData) {
    const user = this.users.get(id);
    if (!user) return void 0;
    const updatedUser = { ...user, ...userData, updatedAt: /* @__PURE__ */ new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  async getAllUsers() {
    return Array.from(this.users.values()).sort((a, b) => a.name.localeCompare(b.name));
  }
  async getAllCircles() {
    return Array.from(this.circles.values()).sort((a, b) => a.name.localeCompare(b.name));
  }
  async getCircleById(id) {
    return this.circles.get(id);
  }
  async createCircle(circleData) {
    const circle = {
      id: nanoid(),
      ...circleData,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.circles.set(circle.id, circle);
    return circle;
  }
  async getUserCircles(userId) {
    const userCircleIds = Array.from(this.memberships.values()).filter((m) => m.userId === userId).map((m) => m.circleId);
    return userCircleIds.map((id) => this.circles.get(id)).filter(Boolean);
  }
  async addUserToCircle(userId, circleId, role = "participant") {
    this.memberships.set(`${userId}-${circleId}`, { userId, circleId, role });
  }
  async getProposalsByCircle(circleId) {
    return Array.from(this.proposals.values()).filter((p) => p.circleId === circleId).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  async getProposalById(id) {
    return this.proposals.get(id);
  }
  async createProposal(proposalData) {
    const proposal = {
      id: nanoid(),
      ...proposalData,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.proposals.set(proposal.id, proposal);
    this.questions.set(proposal.id, []);
    this.reactions.set(proposal.id, []);
    this.objections.set(proposal.id, []);
    this.responses.set(proposal.id, []);
    return proposal;
  }
  async updateProposal(id, proposalData) {
    const proposal = this.proposals.get(id);
    if (!proposal) return void 0;
    const updatedProposal = { ...proposal, ...proposalData, updatedAt: /* @__PURE__ */ new Date() };
    this.proposals.set(id, updatedProposal);
    return updatedProposal;
  }
  async addClarifyingQuestion(questionData) {
    const question = {
      id: nanoid(),
      ...questionData,
      createdAt: /* @__PURE__ */ new Date()
    };
    const questions = this.questions.get(questionData.proposalId) || [];
    questions.push(question);
    this.questions.set(questionData.proposalId, questions);
    return question;
  }
  async getClarifyingQuestions(proposalId) {
    return this.questions.get(proposalId) || [];
  }
  async addQuickReaction(reactionData) {
    const reaction = {
      id: nanoid(),
      ...reactionData,
      createdAt: /* @__PURE__ */ new Date()
    };
    const reactions = this.reactions.get(reactionData.proposalId) || [];
    reactions.push(reaction);
    this.reactions.set(reactionData.proposalId, reactions);
    return reaction;
  }
  async getQuickReactions(proposalId) {
    return this.reactions.get(proposalId) || [];
  }
  async addObjection(objectionData) {
    const objection = {
      id: nanoid(),
      ...objectionData,
      createdAt: /* @__PURE__ */ new Date()
    };
    const objections2 = this.objections.get(objectionData.proposalId) || [];
    objections2.push(objection);
    this.objections.set(objectionData.proposalId, objections2);
    return objection;
  }
  async getObjections(proposalId) {
    return this.objections.get(proposalId) || [];
  }
  async addConsentResponse(responseData) {
    const response = {
      id: nanoid(),
      ...responseData,
      createdAt: /* @__PURE__ */ new Date()
    };
    const responses = this.responses.get(responseData.proposalId) || [];
    responses.push(response);
    this.responses.set(responseData.proposalId, responses);
    return response;
  }
  async getConsentResponses(proposalId) {
    return this.responses.get(proposalId) || [];
  }
};
var storage = db2 ? new DatabaseStorage() : new DevelopmentStorage();

// server/routes.ts
import jwt from "jsonwebtoken";
var JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this-in-production";
var authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await storage.getUser(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};
var requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};
async function registerRoutes(app2) {
  app2.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, name, role = "participant" } = req.body;
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      const user = await storage.createUser({
        email,
        password,
        name,
        role,
        isActive: true
      });
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
      res.json({
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
        token
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.validateUser(email, password);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
      res.json({
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
        token
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });
  app2.get("/api/auth/me", authenticateToken, async (req, res) => {
    res.json({
      user: {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role
      }
    });
  });
  app2.get("/api/circles", authenticateToken, async (req, res) => {
    try {
      let circles2;
      if (req.user.role === "admin") {
        circles2 = await storage.getAllCircles();
      } else {
        circles2 = await storage.getUserCircles(req.user.id);
      }
      res.json(circles2);
    } catch (error) {
      console.error("Error fetching circles:", error);
      res.status(500).json({ message: "Failed to fetch circles" });
    }
  });
  app2.post("/api/circles", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { name, description } = req.body;
      const circle = await storage.createCircle({
        name,
        description,
        createdBy: req.user.id,
        isActive: true
      });
      res.json(circle);
    } catch (error) {
      console.error("Error creating circle:", error);
      res.status(500).json({ message: "Failed to create circle" });
    }
  });
  app2.get("/api/circles/:id", authenticateToken, async (req, res) => {
    try {
      const circle = await storage.getCircleById(req.params.id);
      if (!circle) {
        return res.status(404).json({ message: "Circle not found" });
      }
      res.json(circle);
    } catch (error) {
      console.error("Error fetching circle:", error);
      res.status(500).json({ message: "Failed to fetch circle" });
    }
  });
  app2.get("/api/circles/:circleId/proposals", authenticateToken, async (req, res) => {
    try {
      const proposals2 = await storage.getProposalsByCircle(req.params.circleId);
      res.json(proposals2);
    } catch (error) {
      console.error("Error fetching proposals:", error);
      res.status(500).json({ message: "Failed to fetch proposals" });
    }
  });
  app2.post("/api/proposals", authenticateToken, async (req, res) => {
    try {
      const { title, description, circleId } = req.body;
      const proposal = await storage.createProposal({
        title,
        description,
        circleId,
        createdBy: req.user.id,
        status: "draft",
        currentStep: "proposal_presentation",
        isActive: true
      });
      res.json(proposal);
    } catch (error) {
      console.error("Error creating proposal:", error);
      res.status(500).json({ message: "Failed to create proposal" });
    }
  });
  app2.get("/api/proposals/:id", authenticateToken, async (req, res) => {
    try {
      const proposal = await storage.getProposalById(req.params.id);
      if (!proposal) {
        return res.status(404).json({ message: "Proposal not found" });
      }
      res.json(proposal);
    } catch (error) {
      console.error("Error fetching proposal:", error);
      res.status(500).json({ message: "Failed to fetch proposal" });
    }
  });
  app2.put("/api/proposals/:id", authenticateToken, async (req, res) => {
    try {
      const proposal = await storage.updateProposal(req.params.id, req.body);
      if (!proposal) {
        return res.status(404).json({ message: "Proposal not found" });
      }
      res.json(proposal);
    } catch (error) {
      console.error("Error updating proposal:", error);
      res.status(500).json({ message: "Failed to update proposal" });
    }
  });
  app2.post("/api/proposals/:proposalId/questions", authenticateToken, async (req, res) => {
    try {
      const { question } = req.body;
      const questionData = await storage.addClarifyingQuestion({
        proposalId: req.params.proposalId,
        userId: req.user.id,
        question
      });
      res.json(questionData);
    } catch (error) {
      console.error("Error adding question:", error);
      res.status(500).json({ message: "Failed to add question" });
    }
  });
  app2.get("/api/proposals/:proposalId/questions", authenticateToken, async (req, res) => {
    try {
      const questions = await storage.getClarifyingQuestions(req.params.proposalId);
      res.json(questions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ message: "Failed to fetch questions" });
    }
  });
  app2.post("/api/proposals/:proposalId/reactions", authenticateToken, async (req, res) => {
    try {
      const { reaction } = req.body;
      const reactionData = await storage.addQuickReaction({
        proposalId: req.params.proposalId,
        userId: req.user.id,
        reaction
      });
      res.json(reactionData);
    } catch (error) {
      console.error("Error adding reaction:", error);
      res.status(500).json({ message: "Failed to add reaction" });
    }
  });
  app2.get("/api/proposals/:proposalId/reactions", authenticateToken, async (req, res) => {
    try {
      const reactions = await storage.getQuickReactions(req.params.proposalId);
      res.json(reactions);
    } catch (error) {
      console.error("Error fetching reactions:", error);
      res.status(500).json({ message: "Failed to fetch reactions" });
    }
  });
  app2.post("/api/proposals/:proposalId/objections", authenticateToken, async (req, res) => {
    try {
      const { objection, severity } = req.body;
      const objectionData = await storage.addObjection({
        proposalId: req.params.proposalId,
        userId: req.user.id,
        objection,
        severity,
        isResolved: false
      });
      res.json(objectionData);
    } catch (error) {
      console.error("Error adding objection:", error);
      res.status(500).json({ message: "Failed to add objection" });
    }
  });
  app2.get("/api/proposals/:proposalId/objections", authenticateToken, async (req, res) => {
    try {
      const objections2 = await storage.getObjections(req.params.proposalId);
      res.json(objections2);
    } catch (error) {
      console.error("Error fetching objections:", error);
      res.status(500).json({ message: "Failed to fetch objections" });
    }
  });
  app2.post("/api/proposals/:proposalId/consent", authenticateToken, async (req, res) => {
    try {
      const { choice, reason } = req.body;
      const consentData = await storage.addConsentResponse({
        proposalId: req.params.proposalId,
        userId: req.user.id,
        choice,
        reason
      });
      res.json(consentData);
    } catch (error) {
      console.error("Error adding consent response:", error);
      res.status(500).json({ message: "Failed to add consent response" });
    }
  });
  app2.get("/api/proposals/:proposalId/consent", authenticateToken, async (req, res) => {
    try {
      const responses = await storage.getConsentResponses(req.params.proposalId);
      res.json(responses);
    } catch (error) {
      console.error("Error fetching consent responses:", error);
      res.status(500).json({ message: "Failed to fetch consent responses" });
    }
  });
  app2.get("/api/admin/users", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const users2 = await storage.getAllUsers();
      const safeUsers = users2.map((user) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }));
      res.json(safeUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });
  app2.put("/api/admin/users/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { role, isActive } = req.body;
      const user = await storage.updateUser(req.params.id, { role, isActive });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import { createServer as createViteServer } from "vite";
import express from "express";
import { fileURLToPath } from "url";
import path from "path";
var __dirname = path.dirname(fileURLToPath(import.meta.url));
function log(message) {
  const timestamp2 = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
  console.log(`${timestamp2} [express] ${message}`);
}
async function setupVite(app2, server) {
  try {
    log("Setting up Vite development server...");
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false
        // Disable HMR to fix connection issues
      },
      appType: "spa",
      configFile: path.resolve(__dirname, "../vite.config.ts"),
      clearScreen: false,
      optimizeDeps: {
        include: ["react", "react-dom"]
      }
    });
    app2.use(vite.ssrFixStacktrace);
    app2.use(vite.middlewares);
    log("\u2705 Vite development server ready");
  } catch (error) {
    log(`\u274C Vite setup failed: ${error.message}`);
    throw error;
  }
}
function serveStatic(app2) {
  const distPath = path.resolve(__dirname, "../dist");
  app2.use("/app", express.static(distPath));
  app2.use("/app/*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
  app2.use("/app", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path2 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path2.startsWith("/api")) {
      let logLine = `${req.method} ${path2} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  const isDevelopment = process.env.NODE_ENV === "development";
  log(`Environment: ${process.env.NODE_ENV}, Setting up ${isDevelopment ? "Vite dev server" : "static serving"}`);
  if (isDevelopment) {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`\u{1F3DB}\uFE0F Sociocratic Decision App serving on port ${port}`);
  });
})();
