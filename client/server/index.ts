import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes.js";
import { setupVite, serveStatic, log } from "./vite.js";

const app = express();

// Let proxies (Vercel) set req.ip, etc.
app.set("trust proxy", true);

// CORS (with preflight)
app.use((req, res, next) => {
  const origin = req.headers.origin || "*";
  res.header("Access-Control-Allow-Origin", origin as string);
  res.header("Vary", "Origin");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Minimal health check to verify API routing on Vercel
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// API logging (only for /api/*)
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined;

  const originalResJson = res.json.bind(res);
  (res as any).json = (bodyJson: any, ...args: any[]) => {
    capturedJsonResponse = bodyJson;
    return originalResJson(bodyJson, ...args);
  };

  res.on("finish", () => {
    if (!path.startsWith("/api")) return;
    const duration = Date.now() - start;
    let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
    if (capturedJsonResponse) logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
    if (logLine.length > 80) logLine = logLine.slice(0, 79) + "…";
    log(logLine);
  });

  next();
});

async function buildApp() {
  // Mount all API routes first
  const server = await registerRoutes(app);

  // Only set up Vite dev server in development.
  const isDevelopment = process.env.NODE_ENV === "development";
  log(`Environment: ${process.env.NODE_ENV}, Setting up ${isDevelopment ? "Vite dev server" : "static serving"}`);

  if (isDevelopment) {
    await setupVite(app, server);
  } else {
    // IMPORTANT: serveStatic must NOT swallow /api/*.
    // Ensure serveStatic only handles non-API front-end routes.
    serveStatic(app);
  }

  // Error handler AFTER routes/static
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    // Let Vercel capture logs without crashing the worker
    try { log(`Error ${status}: ${message}`); } catch {}
  });

  return server;
}

// --- Vercel serverless export ---
// Vercel's @vercel/node looks for a default export that is a handler (Express app works).
export default app;

// If run directly (local dev), start the HTTP server.
if (import.meta && (import.meta as any).url) {
  const isDirect =
    typeof process !== "undefined" &&
    process.argv[1] &&
    (process.argv[1].endsWith("index.ts") || process.argv[1].endsWith("index.js"));

  // Fallback check for CommonJS
  const isCJSDirect = (typeof require !== "undefined" && require.main === module) as boolean | undefined;

  if (isDirect || isCJSDirect) {
    (async () => {
      const server = await buildApp();
      const port = parseInt(process.env.PORT || "5000", 10);
      server.listen(
        {
          port,
          host: "0.0.0.0",
          reusePort: true,
        },
        () => log(`🏛️ Sociocratic Decision App serving on port ${port}`)
      );
    })();
  }
} else {
  // In serverless/Vercel, we still need routes mounted.
  // Build synchronously once on cold start.
  void buildApp();
}
