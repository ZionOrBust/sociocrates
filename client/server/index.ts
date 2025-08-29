import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes.js";
import { setupVite, serveStatic, log } from "./vite.js";

const app = express();
app.set("trust proxy", true);

// --- CORS with preflight ---
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Vary", "Origin");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// --- API request logging ---
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

// Optional: quick health check
app.get("/api/health", (_req, res) => res.json({ ok: true }));

let nodeServer: import("http").Server | undefined;

async function setup() {
  // Mount all API routes and get the underlying Node server Vite expects
  nodeServer = await registerRoutes(app);

  const isDevelopment = process.env.NODE_ENV === "development";
  log(`Environment: ${process.env.NODE_ENV}, Setting up ${isDevelopment ? "Vite dev server" : "static serving"}`);

  if (isDevelopment) {
    // Dev only – Vite middleware + websockets, needs the Node server instance
    await setupVite(app, nodeServer);
  } else {
    // Prod – serve built SPA; make sure this does NOT swallow /api/*
    serveStatic(app);
  }

  // Error handler after routes/static
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    try { log(`Error ${status}: ${message}`); } catch {}
  });
}

// Run setup on module load so Vercel's serverless cold start initializes routes/static
void setup();

// ---- Export-only for Vercel ----
export default app;

// ---- Local dev listener (NOT used on Vercel) ----
if (!process.env.VERCEL) {
  const port = parseInt(process.env.PORT || "5000", 10);
  // If registerRoutes returned a server, prefer it (keeps your original pattern)
  const start = () => {
    if (nodeServer) {
      nodeServer.listen(
        { port, host: "0.0.0.0", reusePort: true },
        () => log(`🏛️ Sociocratic Decision App serving on port ${port}`)
      );
    } else {
      app.listen(port, "0.0.0.0", () => log(`🏛️ Sociocratic Decision App serving on port ${port}`));
    }
  };
  // If setup() hasn’t finished yet, wait for it
  Promise.resolve().then(start);
}
