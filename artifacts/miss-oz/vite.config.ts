import path from 'path';
import { readFileSync, writeFileSync } from 'node:fs';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

import runtimeErrorOverlay from '@replit/vite-plugin-runtime-error-modal';

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

const publicOrigin = 'https://www.missozicecream.com';
const seoRoutePages = [
  {
    path: 'events',
    title: 'Events | Miss Oz Ice Cream & Dessert Cafe',
    description: 'Plan an event with Miss Oz Ice Cream & Dessert Cafe in Portland and send an event inquiry.',
    heading: 'Events',
  },
  {
    path: 'wholesale',
    title: 'Wholesale | Miss Oz Ice Cream & Dessert Cafe',
    description: 'Explore Miss Oz ice cream and dessert wholesale offerings, and ask about becoming a partner.',
    heading: 'Wholesale',
  },
  {
    path: 'about',
    title: 'About Us | Miss Oz Ice Cream & Dessert Cafe',
    description: 'Read the story of Miss Oz Ice Cream & Dessert Cafe and meet Oz in Portland’s Pearl District.',
    heading: 'About Us',
  },
  {
    path: 'contact',
    title: 'Contact | Miss Oz Ice Cream & Dessert Cafe',
    description: 'Find Miss Oz contact details and leave a note in the guestbook.',
    heading: 'Contact',
  },
];

const routeSeoShells = {
  name: 'miss-oz-route-seo-shells',
  apply: 'build' as const,
  closeBundle() {
    const outputDir = path.resolve(import.meta.dirname, 'dist/public');
    const indexPath = path.join(outputDir, 'index.html');
    const indexHtml = readFileSync(indexPath, 'utf8');
    const escapeAttribute = (value: string) =>
      value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');

    for (const page of seoRoutePages) {
      const url = `${publicOrigin}/${page.path}`;
      const title = escapeAttribute(page.title);
      const description = escapeAttribute(page.description);
      const html = indexHtml
        .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
        .replace(
          /<meta name="description" content="[^"]*" \/>/,
          `<meta name="description" content="${description}" />`,
        )
        .replace(
          /<link rel="canonical" href="[^"]*" \/>/,
          `<link rel="canonical" href="${url}" />`,
        )
        .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${title}" />`)
        .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${description}" />`)
        .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${url}" />`)
        .replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${title}" />`)
        .replace(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${description}" />`)
        .replace(/<script id="local-business-schema" type="application\/ld\+json">[\s\S]*?<\/script>\s*/, '')
        .replace(
          '<div id="root"></div>',
          `<div id="root"><h1 class="sr-only">${page.heading}</h1></div>`,
        );

      writeFileSync(path.join(outputDir, `${page.path}.html`), html);
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
