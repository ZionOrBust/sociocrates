// client/api/_debug/imports.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";

// Point directly at your route modules under _routes:
const registry = {
  circles_index: () => import("../../server/routes/circles/index"),
  circles_id_index: () => import("../../server/routes/circles/_id/index"),
  circles_id_proposals: () => import("../../server/routes/circles/_id/proposals"),

  // remove if you don't have it:
  proposals_index: () => import("../../server/routes/proposals/index"),
  proposals_id_index: () => import("../../server/routes/proposals/_id/index"),
  proposals_id_consent: () => import("../../server/routes/proposals/_id/consent"),
  proposals_id_objections: () => import("../../server/routes/proposals/_id/objections"),
  proposals_id_questions: () => import("../../server/routes/proposals/_id/questions"),
  proposals_id_reactions: () => import("../../server/routes/proposals/_id/reactions"),

  auth_login: () => import("../../server/routes/auth/login"),
  auth_me: () => import("../../server/routes/auth/me"),
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
