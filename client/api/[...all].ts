// client/api/[...all].ts
import type { VercelRequest, VercelResponse } from "@vercel/node";

const pathOnly = (req: VercelRequest) => new URL(req.url!, "http://x").pathname;
const json = (res: VercelResponse, code: number, data: any) => res.status(code).json(data);

// Centralized dynamic imports so we can test them
const registry = {
  circles_index: () => import("../_routes/circles/index"),
  circles_id_index: () => import("../_routes/circles/_id/index"),
  circles_id_proposals: () => import("../_routes/circles/_id/proposals"),

  // Remove this line if you don't have proposals/index.ts:
  proposals_index: () => import("../_routes/proposals/index"),
  proposals_id_index: () => import("../_routes/proposals/_id/index"),
  proposals_id_consent: () => import("../_routes/proposals/_id/consent"),
  proposals_id_objections: () => import("../_routes/proposals/_id/objections"),
  proposals_id_questions: () => import("../_routes/proposals/_id/questions"),
  proposals_id_reactions: () => import("../_routes/proposals/_id/reactions"),

  auth_login: () => import("../_routes/auth/login"),
  auth_me: () => import("../_routes/auth/me"),
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const p = pathOnly(req);
  const m = (req.method || "GET").toUpperCase();

  // ---------- DEBUG: hit /api/_debug/imports ----------
  if (p === "/api/_debug/imports") {
    const results: Record<string, { ok: boolean; error?: string }> = {};
    for (const [key, importer] of Object.entries(registry)) {
      try {
        await importer();
        results[key] = { ok: true };
      } catch (e: any) {
        console.error("IMPORT_FAIL_DEBUG", { key, err: e?.message });
        results[key] = { ok: false, error: String(e?.message || e) };
      }
    }
    return json(res, 200, results);
  }
  // ----------------------------------------------------

  try {
    // Circles
    if (m === "GET" && p === "/api/circles") {
      const mod = await registry.circles_index(); return (mod as any).default(req, res);
    }
    let m1 = p.match(/^\/api\/circles\/([^/]+)$/);
    if (m1 && m === "GET") {
      (req as any).query = { ...(req as any).query, id: m1[1] };
      const mod = await registry.circles_id_index(); return (mod as any).default(req, res);
    }
    m1 = p.match(/^\/api\/circles\/([^/]+)\/proposals$/);
    if (m1 && m === "GET") {
      (req as any).query = { ...(req as any).query, id: m1[1] };
      const mod = await registry.circles_id_proposals(); return (mod as any).default(req, res);
    }

    // Proposals
    if (m === "GET" && p === "/api/proposals") {
      const mod = await registry.proposals_index(); return (mod as any).default(req, res);
    }
    let m2 = p.match(/^\/api\/proposals\/([^/]+)$/);
    if (m2 && m === "GET") {
      (req as any).query = { ...(req as any).query, id: m2[1] };
      const mod = await registry.proposals_id_index(); return (mod as any).default(req, res);
    }
    m2 = p.match(/^\/api\/proposals\/([^/]+)\/consent$/);
    if (m2 && (m === "GET" || m === "POST")) {
      (req as any).query = { ...(req as any).query, id: m2[1] };
      const mod = await registry.proposals_id_consent(); return (mod as any).default(req, res);
    }
    m2 = p.match(/^\/api\/proposals\/([^/]+)\/objections$/);
    if (m2 && (m === "GET" || m === "POST")) {
      (req as any).query = { ...(req as any).query, id: m2[1] };
      const mod = await registry.proposals_id_objections(); return (mod as any).default(req, res);
    }
    m2 = p.match(/^\/api\/proposals\/([^/]+)\/questions$/);
    if (m2 && (m === "GET" || m === "POST")) {
      (req as any).query = { ...(req as any).query, id: m2[1] };
      const mod = await registry.proposals_id_questions(); return (mod as any).default(req, res);
    }
    m2 = p.match(/^\/api\/proposals\/([^/]+)\/reactions$/);
    if (m2 && (m === "GET" || m === "POST")) {
      (req as any).query = { ...(req as any).query, id: m2[1] };
      const mod = await registry.proposals_id_reactions(); return (mod as any).default(req, res);
    }

    // Auth
    if (p === "/api/auth/login" && m === "POST") {
      const mod = await registry.auth_login(); return (mod as any).default(req, res);
    }
    if (p === "/api/auth/me" && m === "GET") {
      const mod = await registry.auth_me(); return (mod as any).default(req, res);
    }

    return json(res, 404, { message: "Not found" });
  } catch (err: any) {
    console.error("ROUTER_RUNTIME_ERROR", err?.stack || err);
    return json(res, 500, { message: "Internal error" });
  }
}
