import { createServer as createViteServer } from "vite";
import express, { type Express } from "express";
import type { Server } from "http";
import path from "path";

// IMPORTANT: When bundling, __dirname becomes the dist folder.
// Use process.cwd() to reliably reference the project root.
const projectRoot = process.cwd();

export function log(message: string) {
  const timestamp = new Date().toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  console.log(`${timestamp} [express] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  try {
    log("Setting up Vite development server...");

    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false // Disable HMR to fix connection issues
      },
      appType: "spa",
      // Always point to the client vite config from project root
      configFile: path.resolve(projectRoot, "client/vite.config.ts"),
      clearScreen: false,
      optimizeDeps: {
        include: ['react', 'react-dom']
      }
    });

    app.use(vite.ssrFixStacktrace);
    app.use(vite.middlewares);

    log("✅ Vite development server ready");
  } catch (error: any) {
    log(`❌ Vite setup failed: ${error.message}`);
    throw error;
  }
}

export function serveStatic(app: Express) {
  // Serve the built client from client/dist when not in dev
  const distPath = path.resolve(projectRoot, "client/dist");

  // Serve static assets from /app/
  app.use("/app", express.static(distPath));

  // Handle SPA routing for /app/* routes
  app.use("/app/*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });

  // Fallback for root /app route
  app.use("/app", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}
