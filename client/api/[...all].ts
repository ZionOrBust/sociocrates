// client/api/[...all].ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

// tiny helpers
const getPath = (req: VercelRequest) => new URL(req.url!, 'http://x').pathname;
const json = (res: VercelResponse, code: number, data: any) => res.status(code).json(data);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const path = getPath(req);
  const method = req.method || 'GET';

  try {
    // ---- Circles ----
    if (method === 'GET' && path === '/api/circles') {
      const mod = await import('../_routes/circles/index'); // moved module (see step 3)
      return mod.default(req, res);
    }

    // /api/circles/:id
    let m = path.match(/^\/api\/circles\/([^\/]+)$/);
    if (method === 'GET' && m) {
      (req as any).query = { ...(req as any).query, id: m[1] };
      const mod = await import('../_routes/circles/_id/index');
      return mod.default(req, res);
    }

    // /api/circles/:id/proposals
    m = path.match(/^\/api\/circles\/([^\/]+)\/proposals$/);
    if (method === 'GET' && m) {
      (req as any).query = { ...(req as any).query, id: m[1] };
      const mod = await import('../_routes/circles/_id/proposals');
      return mod.default(req, res);
    }

    // ---- Proposals ----
    // /api/proposals/:id
    m = path.match(/^\/api\/proposals\/([^\/]+)$/);
    if (method === 'GET' && m) {
      (req as any).query = { ...(req as any).query, id: m[1] };
      const mod = await import('../_routes/proposals/_id/index');
      return mod.default(req, res);
    }

    // /api/proposals/:id/consent
    m = path.match(/^\/api\/proposals\/([^\/]+)\/consent$/);
    if ((method === 'GET' || method === 'POST') && m) {
      (req as any).query = { ...(req as any).query, id: m[1] };
      const mod = await import('../_routes/proposals/_id/consent');
      return mod.default(req, res);
    }

    // ---- Auth ----
    if (path === '/api/auth/login' && method === 'POST') {
      const mod = await import('../_routes/auth/login');
      return mod.default(req, res);
    }
    if (path === '/api/auth/me' && method === 'GET') {
      const mod = await import('../_routes/auth/me');
      return mod.default(req, res);
    }

    // ---- Admin users ----
    if (path === '/api/admin/users' && method === 'GET') {
      const mod = await import('../_routes/admin/users/index');
      return mod.default(req, res);
    }
    m = path.match(/^\/api\/admin\/users\/([^\/]+)$/);
    if (m) {
      (req as any).query = { ...(req as any).query, id: m[1] };
      const mod = await import('../_routes/admin/users/_id');
      return mod.default(req, res);
    }

    return json(res, 404, { message: 'Not found' });
  } catch (err) {
    console.error('Router error', err);
    return json(res, 500, { message: 'Internal error' });
  }
}
