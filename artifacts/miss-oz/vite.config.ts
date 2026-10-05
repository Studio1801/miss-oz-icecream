import path from 'path';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

import runtimeErrorOverlay from '@replit/vite-plugin-runtime-error-modal';
import { PAGE_META, PUBLIC_ORIGIN, SEO_ROUTES } from './src/pageMeta';

// During a production build (e.g. on Vercel), Replit-injected env vars are
// absent. The dev server still needs real values, which Replit always provides.
const isBuild = process.argv.includes('build');

const rawPort = process.env.PORT;

if (!rawPort && !isBuild) {
  throw new Error(
    'PORT environment variable is required but was not provided.',
  );
}

const port = rawPort ? Number(rawPort) : 5173;

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH ?? '/';

const escapeHtmlText = (value: string) =>
  value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const escapeHtmlAttribute = (value: string) =>
  escapeHtmlText(value).replaceAll('"', '&quot;');

function replaceExactlyOneHeadTag(
  head: string,
  pattern: RegExp,
  replacement: string,
  name: string,
) {
  let count = 0;
  const updatedHead = head.replace(pattern, () => {
    count += 1;
    return replacement;
  });

  if (count !== 1) {
    throw new Error(`Expected exactly one ${name} tag in the built HTML head; found ${count}.`);
  }

  return updatedHead;
}

function applyPageMeta(html: string, route: string) {
  const page = PAGE_META[route];
  if (!page) {
    throw new Error(`Missing PAGE_META entry for SEO route "${route}".`);
  }

  const headMatch = html.match(/<head\b[^>]*>[\s\S]*?<\/head>/i);
  if (!headMatch) {
    throw new Error('Could not find the built HTML <head>.');
  }

  const canonicalUrl = new URL(route === '/' ? '' : route.slice(1), `${PUBLIC_ORIGIN}/`).href;
  const title = escapeHtmlText(page.title);
  const description = escapeHtmlAttribute(page.description);
  const headReplacements: Array<[RegExp, string, string]> = [
    [/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`, 'title'],
    [
      /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="description" content="${description}" />`,
      'description',
    ],
    [
      /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
      `<link rel="canonical" href="${escapeHtmlAttribute(canonicalUrl)}" />`,
      'canonical',
    ],
    [
      /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:title" content="${escapeHtmlAttribute(page.title)}" />`,
      'Open Graph title',
    ],
    [
      /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:description" content="${description}" />`,
      'Open Graph description',
    ],
    [
      /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:url" content="${escapeHtmlAttribute(canonicalUrl)}" />`,
      'Open Graph URL',
    ],
    [
      /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:title" content="${escapeHtmlAttribute(page.title)}" />`,
      'Twitter title',
    ],
    [
      /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:description" content="${description}" />`,
      'Twitter description',
    ],
  ];

  let updatedHead = headMatch[0];
  for (const [pattern, replacement, name] of headReplacements) {
    updatedHead = replaceExactlyOneHeadTag(updatedHead, pattern, replacement, name);
  }

  return html.replace(headMatch[0], updatedHead);
}

const routeSeoShells = {
  name: 'miss-oz-route-seo-shells',
  apply: 'build' as const,
  closeBundle() {
    const outputDir = path.resolve(import.meta.dirname, 'dist/public');
    const indexPath = path.join(outputDir, 'index.html');
    const builtIndex = readFileSync(indexPath, 'utf8');
    const homeHtml = applyPageMeta(builtIndex, '/');
    writeFileSync(indexPath, homeHtml, 'utf8');

    for (const route of SEO_ROUTES) {
      if (route === '/') continue;

      const routeIndexPath = path.join(outputDir, route.slice(1), 'index.html');
      mkdirSync(path.dirname(routeIndexPath), { recursive: true });
      writeFileSync(routeIndexPath, applyPageMeta(homeHtml, route), 'utf8');
    }
  },
};

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    routeSeoShells,
    ...(process.env.NODE_ENV !== 'production' &&
    process.env.REPL_ID !== undefined
      ? [
          await import('@replit/vite-plugin-cartographer').then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, '..'),
            }),
          ),
          await import('@replit/vite-plugin-dev-banner').then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@assets': path.resolve(
        import.meta.dirname,
        '..',
        '..',
        'attached_assets',
      ),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist/public'),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: '0.0.0.0',
    allowedHosts: true,
  },
});
