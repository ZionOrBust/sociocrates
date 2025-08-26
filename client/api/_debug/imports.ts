// client/api/_debug/imports.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";

// Point directly at your route modules under _routes:
const registry = {
  circles_index: () => import("../_routes/circles/index"),
  circles_id_index: () => import("../_routes/circles/_id/index"),
  circles_id_proposals: () => import("../_routes/circles/_id/proposals"),

  // Remove this line if you don't have proposals/index.ts
  proposals_index: () => import("../_routes/proposals/index"),
  proposals_id_index: () => import("../_routes/proposals/_id/index"),
  proposals_id_consent: () => import("../_routes/proposals/_id/consent"),
  proposals_id_objections: () => import("../_routes/proposals/_id/objections"),
  proposals_id_questions: () => import("../_routes/proposals/_id/questions"),
  proposals_id_reactions: () => import("../_routes/proposals/_id/reactions"),

  auth_login: () => import("../_routes/auth/login"),
  auth_me: () => import("../_routes/auth/me"),
};

export default async function handler(_req: VercelRequest, res: VercelResponse) {
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
  res.status(200).json(results);
}
