import type { VercelRequest, VercelResponse } from "@vercel/node";

// Make a single place to import modules and log failures clearly
async function safeImport<T = any>(specifier: string, label: string) {
  try {
    const mod = (await import(specifier)) as T;
    return { ok: true as const, mod };
  } catch (err: any) {
    // This shows up in Vercel Function logs
    console.error("IMPORT_FAIL", { label, specifier, message: err?.message, stack: err?.stack });
    return { ok: false as const, error: String(err?.message || err) };
  }
}

// A registry of all route modules we expect to import
const registry = {
  circles_index: () => import("../_routes/circles/index"),
  circles_id_index: () => import("../_routes/circles/_id/index"),
  circles_id_proposals: () => import("../_routes/circles/_id/proposals"),

  proposals_index: () => import("../_routes/proposals/index"), // keep if file exists
  proposals_id_index: () => import("../_routes/proposals/_id/index"),
  proposals_id_consent: () => import("../_routes/proposals/_id/consent"),
  proposals_id_objections: () => import("../_routes/proposals/_id/objections"),
  proposals_id_questions: () => import("../_routes/proposals/_id/questions"),
  proposals_id_reactions: () => import("../_routes/proposals/_id/reactions"),

  auth_login: () => import("../_routes/auth/login"),
  auth_me: () => import("../_routes/auth/me"),

  // If you don't have admin routes, delete these two lines.
  // admin_users_index: () => import("../_routes/admin/users/index"),
  // admin_users_id: () => import("../_routes/admin/users/_id"),
};

const pathOnly = (req: VercelRequest) => new URL(req.url!, "http://x").pathname;
const json = (res: VercelResponse, code: number, data: any) => res.status(code).json(data);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const p = pathOnly(req);
  const m = (req.method || "GET").toUpperCase();

  // ---------- DEBUG ENDPOINT ----------
  // Call /api/_debug/imports to run and report ALL dynamic imports.
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
  // ---------- END DEBUG ----------

  try {
    // ---- Circles ----
    if (m === "GET" && p === "/api/circles") {
      const r = await safeImport("../_routes/circles/index", "circles_index");
      if (!r.ok) return json(res, 500, { message: "Import failed", where: "circles_index", error: r.error });
      return (r.mod as any).default(req, res);
    }

    let match = p.match(/^\/api\/circles\/([^/]+)$/);
    if (match && m === "GET") {
      (req as any).query = { ...(req as any).query, id: match[1] };
      const r = await safeImport("../_routes/circles/_id/index", "circles_id_index");
      if (!r.ok) return json(res, 500, { message: "Import failed", where: "circles_id_index", error: r.error });
      return (r.mod as any).default(req, res);
    }

    match = p.match(/^\/api\/circles\/([^/]+)\/proposals$/);
    if (match && m === "GET") {
      (req as any).query = { ...(req as any).query, id: match[1] };
      const r = await safeImport("../_routes/circles/_id/proposals", "circles_id_proposals");
      if (!r.ok) return json(res, 500, { message: "Import failed", where: "circles_id_proposals", error: r.error });
      return (r.mod as any).default(req, res);
    }

    // ---- Proposals ----
    if (m === "GET" && p === "/api/proposals") {
      const r = await safeImport("../_routes/proposals/index", "proposals_index");
      if (!r.ok) return json(res, 500, { message: "Import failed", where: "proposals_index", error: r.error });
      return (r.mod as any).default(req, res);
    }

    match = p.match(/^\/api\/proposals\/([^/]+)$/);
    if (match && m === "GET") {
      (req as any).query = { ...(req as any).query, id: match[1] };
      const r = await safeImport("../_routes/proposals/_id/index", "proposals_id_index");
      if (!r.ok) return json(res, 500, { message: "Import failed", where: "proposals_id_index", error: r.error });
      return (r.mod as any).default(req, res);
    }

    match = p.match(/^\/api\/proposals\/([^/]+)\/consent$/);
    if (match && (m === "GET" || m === "POST")) {
      (req as any).query = { ...(req as any).query, id: match[1] };
      const r = await safeImport("../_routes/proposals/_id/consent", "proposals_id_consent");
      if (!r.ok) return json(res, 500, { message: "Import failed", where: "proposals_id_consent", error: r.error });
      return (r.mod as any).default(req, res);
    }

    match = p.match(/^\/api\/proposals\/([^/]+)\/objections$/);
    if (match && (m === "GET" || m === "POST")) {
      (req as any).query = { ...(req as any).query, id: match[1] };
      const r = await safeImport("../_routes/proposals/_id/objections", "proposals_id_objections");
      if (!r.ok) return json(res, 500, { message: "Import failed", where: "proposals_id_objections", error: r.error });
      return (r.mod as any).default(req, res);
    }

    match = p.match(/^\/api\/proposals\/([^/]+)\/questions$/);
    if (match && (m === "GET" || m === "POST")) {
      (req as any).query = { ...(req as any).query, id: match[1] };
      const r = await safeImport("../_routes/proposals/_id/questions", "proposals_id_questions");
      if (!r.ok) return json(res, 500, { message: "Import failed", where: "proposals_id_questions", error: r.error });
      return (r.mod as any).default(req, res);
    }

    match = p.match(/^\/api\/proposals\/([^/]+)\/reactions$/);
    if (match && (m === "GET" || m === "POST")) {
      (req as any).query = { ...(req as any).query, id: match[1] };
      const r = await safeImport("../_routes/proposals/_id/reactions", "proposals_id_reactions");
      if (!r.ok) return json(res, 500, { message: "Import failed", where: "proposals_id_reactions", error: r.error });
      return (r.mod as any).default(req, res);
    }

    // ---- Auth ----
    if (p === "/api/auth/login" && m === "POST") {
      const r = await safeImport("../_routes/auth/login", "auth_login");
      if (!r.ok) return json(res, 500, { message: "Import failed", where: "auth_login", error: r.error });
      return (r.mod as any).default(req, res);
    }
    if (p === "/api/auth/me" && m === "GET") {
      const r = await safeImport("../_routes/auth/me", "auth_me");
      if (!r.ok) return json(res, 500, { message: "Import failed", where: "auth_me", error: r.error });
      return (r.mod as any).default(req, res);
    }

    return json(res, 404, { message: "Not found" });
  } catch (err: any) {
    console.error("ROUTER_RUNTIME_ERROR", err?.stack || err);
    return json(res, 500, { message: "Internal error" });
  }
}
