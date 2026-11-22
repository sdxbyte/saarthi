import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

let cachedApp: any = null;

function resolveServerApp() {
  if (cachedApp) return cachedApp;
  const candidateBundles = [
    path.join(process.cwd(), 'dist', 'vercel-server.cjs'),
    path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', 'dist', 'vercel-server.cjs'),
  ];
  for (const bundlePath of candidateBundles) {
    if (fs.existsSync(bundlePath)) {
      const req = createRequire(path.join(process.cwd(), 'package.json'));
      const mod = req(bundlePath);
      cachedApp = mod.app || mod.default || mod;
      return cachedApp;
    }
  }
  return null;
}

export default async function handler(req: any, res: any) {
  try {
    let app = resolveServerApp();
    if (!app) {
      const fallbackPath = ['..', 'src', 'serverApp'].join('/');
      const mod = await import(/* @vite-ignore */ fallbackPath);
      app = mod.app || mod.default;
    }
    return app(req, res);
  } catch (err: any) {
    console.error('[Vercel API Handler Error]', err);
    return res.status(500).json({
      error: 'Server initialization failed',
      message: err?.message || 'Unknown initialization error',
    });
  }
}
