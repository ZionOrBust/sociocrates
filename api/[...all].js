import authLogin from "./auth/login.js";
import authMe from "./auth/me.js";
import circlesHandler from "./circles.js";
import circleProposalsHandler from "./circles/[id]/proposals.js";
import proposalsHandler from "./proposals.js";
import proposalDetailHandler from "./proposals/[id].js";
import adminUsersHandler from "./admin/users/index.js";
import adminUserDetailHandler from "./admin/users/[id].js";
import pingHandler from "./ping.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const orgStore = new Map();

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
}

function parseSegments(req) {
  let parts = Array.isArray(req.query?.all)
    ? req.query.all
    : typeof req.query?.all === "string"
      ? req.query.all.split("/")
      : [];

  if (!parts.length && typeof req.url === "string") {
    const match = req.url.match(/^\/?api\/(.*?)(\?|$)/);
    if (match && match[1]) {
      parts = match[1].split("/");
    }
  }

  return parts.filter(Boolean);
}

function getAuthUser(req, res) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) {
    res.status(401).json({ message: "Access token required" });
    return null;
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.user) return decoded.user;
    if (decoded.userId) {
      return {
        id: decoded.userId,
        email: decoded.email || "",
        name: decoded.name || "User",
        role: decoded.role || "participant",
      };
    }
    res.status(401).json({ message: "Invalid token" });
    return null;
  } catch {
    res.status(403).json({ message: "Invalid token" });
    return null;
  }
}

function getOrgState(userId) {
  if (!orgStore.has(userId)) {
    orgStore.set(userId, { org: null, settings: null });
  }
  return orgStore.get(userId);
}

async function readJson(req) {
  if (req.body) {
    if (typeof req.body === "string") {
      if (!req.body) return {};
      try {
        return JSON.parse(req.body);
      } catch {
        throw new Error("Invalid JSON");
      }
    }
    if (typeof req.body === "object") return req.body;
  }
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

async function orgsMe(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET, OPTIONS");
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  const user = getAuthUser(req, res);
  if (!user) return;
  const state = getOrgState(user.id);
  const requiresSetup = !state.org;
  return res.status(200).json({
    user,
    org: state.org,
    settings: state.settings,
    requiresSetup,
  });
}

async function orgsInit(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  const user = getAuthUser(req, res);
  if (!user) return;
  if (user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  try {
    const body = await readJson(req);
    const name = (body?.name || "").trim() || `${user.name || "Admin"}'s Organization`;
    const settings = body?.settings || {};
    const now = new Date().toISOString();
    const state = getOrgState(user.id);
    const org = {
      id: state.org?.id || `demo-org-${user.id}`,
      name,
      createdAt: state.org?.createdAt || now,
      updatedAt: now,
    };
    state.org = org;
    state.settings = settings;
    return res.status(201).json({ org, settings });
  } catch (error) {
    return res.status(400).json({ message: error.message || "Invalid request" });
  }
}

async function orgsSettings(req, res) {
  const user = getAuthUser(req, res);
  if (!user) return;
  if (user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  const orgId = req.query?.orgId;
  const state = getOrgState(user.id);
  if (!state.org || state.org.id !== orgId) {
    return res.status(404).json({ message: "Organization not found" });
  }

  if (req.method === "GET") {
    return res.status(200).json({ org: state.org, settings: state.settings });
  }

  if (req.method === "PUT") {
    try {
      const body = await readJson(req);
      const settings = body?.settings ?? state.settings ?? {};
      const name = typeof body?.name === "string" && body.name.trim() ? body.name.trim() : state.org.name;
      const updated = {
        ...state.org,
        name,
        updatedAt: new Date().toISOString(),
      };
      state.org = updated;
      state.settings = settings;
      return res.status(200).json({ org: updated, settings });
    } catch (error) {
      return res.status(400).json({ message: error.message || "Invalid request" });
    }
  }

  res.setHeader("Allow", "GET, PUT, OPTIONS");
  return res.status(405).json({ message: "Method Not Allowed" });
}

function resolveRoute(parts) {
  if (!parts.length) return null;

  if (parts[0] === "auth") {
    if (parts.length === 2 && parts[1] === "login") return { handler: authLogin };
    if (parts.length === 2 && parts[1] === "me") return { handler: authMe };
  }

  if (parts[0] === "admin" && parts[1] === "users") {
    if (parts.length === 2) return { handler: adminUsersHandler };
    if (parts.length === 3) return { handler: adminUserDetailHandler, params: { id: parts[2] } };
  }

  if (parts[0] === "circles") {
    if (parts.length === 1) return { handler: circlesHandler };
    if (parts.length === 3 && parts[2] === "proposals") {
      return { handler: circleProposalsHandler, params: { id: parts[1] } };
    }
  }

  if (parts[0] === "proposals") {
    if (parts.length === 1) return { handler: proposalsHandler };
    if (parts.length === 2) return { handler: proposalDetailHandler, params: { id: parts[1] } };
  }

  if (parts[0] === "orgs") {
    if (parts.length === 2 && parts[1] === "me") return { handler: orgsMe };
    if (parts.length === 2 && parts[1] === "init") return { handler: orgsInit };
    if (parts.length === 3 && parts[2] === "settings") {
      return { handler: orgsSettings, params: { orgId: parts[1] } };
    }
  }

  if (parts.length === 1 && parts[0] === "ping") {
    return { handler: pingHandler };
  }

  return null;
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  req.query = req.query || {};
  const segments = parseSegments(req);
  const route = resolveRoute(segments);

  if (!route) {
    res.setHeader("X-Debug-Route", segments.join("/") || "");
    return res.status(404).json({ message: "Not found" });
  }

  if (route.params) {
    req.query = { ...req.query, ...route.params };
  }

  try {
    return await route.handler(req, res);
  } catch (error) {
    console.error("[CatchAllError]", {
      path: segments.join("/"),
      method: req.method,
      message: error?.message || String(error),
    });
    if (!res.headersSent) {
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({ message: "Server error" });
    }
  }
}
