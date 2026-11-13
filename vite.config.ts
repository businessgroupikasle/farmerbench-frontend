import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

function spa404Plugin() {
  const KNOWN_SPA_ROUTES = new Set([
    '',
    'products',
    'product',
    'about',
    'contact',
    'services',
    'service',
    'blog',
    'cart',
    'checkout',
    'dashboard',
    'admin',
    'login',
    'privacy-policy',
    'terms-and-conditions',
    'shipping-policy',
    'refund-policy',
    'disclaimer',
    'faq',
    'sitemap',
    'order-confirmation',
  ]);

  const lockStatus404 = (res: any) => {
    let currentStatus = 404;
    try {
      Object.defineProperty(res, 'statusCode', {
        get() {
          return currentStatus;
        },
        set(val: number) {
          if (val !== 200) {
            currentStatus = val;
          }
        },
        configurable: true,
      });
    } catch {
      res.statusCode = 404;
    }

    const origWriteHead = res.writeHead;
    if (typeof origWriteHead === 'function') {
      res.writeHead = function (code: number, ...args: any[]) {
        const finalCode = code === 200 ? 404 : code;
        return origWriteHead.call(this, finalCode, ...args);
      };
    }
  };

  const handleRoute = (req: any, res: any, next: any, checkDir: string) => {
    const rawUrl = req.url || '';
    const pathname = rawUrl.split('?')[0];
    const topSegment = pathname.replace(/^\/+/, '').split('/')[0];
    const ext = path.extname(pathname);

    // If it's Vite internal assets, skip
    if (
      pathname.startsWith('/@') ||
      pathname.startsWith('/src') ||
      pathname.startsWith('/node_modules') ||
      pathname.startsWith('/assets')
    ) {
      return next();
    }

    // Check if the requested static file exists on disk
    if (ext) {
      const filePath = path.resolve(checkDir, pathname.replace(/^\/+/, ''));
      if (!fs.existsSync(filePath)) {
        lockStatus404(res);
      }
      return next();
    }

    // If it's a top-level route not in known SPA routes, mark status 404
    if (!KNOWN_SPA_ROUTES.has(topSegment)) {
      lockStatus404(res);
    }
    next();
  };

  return {
    name: 'spa-404-handler',
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        handleRoute(req, res, next, path.resolve(__dirname, 'public'));
      });
    },
    configurePreviewServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        handleRoute(req, res, next, path.resolve(__dirname, 'dist'));
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), spa404Plugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@formerbench/shared': path.resolve(__dirname, './shared/src'),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  preview: {
    port: 3000,
    host: true,
  },
});
