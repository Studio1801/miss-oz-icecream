---
name: Deploying a Replit pnpm-monorepo artifact to Vercel
description: Gotchas when deploying a single artifact from the pnpm-workspace monorepo to Vercel (or any external host)
---

# Deploying a Replit artifact externally (Vercel / GitHub)

**Vite config hard-requires Replit-only env vars.** Artifact vite configs may *throw* if `PORT`/`BASE_PATH` are absent. That breaks any external build (Vercel), which has neither. Make them tolerant: only require `PORT` for the dev server (guard with an `isBuild` check), default `port` to 5173 and `basePath` to `'/'`. Verify with a bare `pnpm build` (no env vars).
**Why:** Vercel runs `vite build` with none of Replit's env vars set.

**Vercel Root Directory vs. repo-root `vercel.json`.** On import, Vercel often sets the project's **Root Directory** to the artifact folder (e.g. `artifacts/miss-oz`). When it does, Vercel reads `vercel.json` from *inside that folder* — a repo-root `vercel.json` is ignored, and the default output dir `public` is looked for relative to the root dir, so the build "succeeds" then fails with `No Output Directory named "public" found`.
**How to apply:** Put a `vercel.json` **inside the artifact dir** with `outputDirectory: "dist/public"` (relative to that dir) plus the SPA rewrite `[{ "source": "/(.*)", "destination": "/index.html" }]`. pnpm workspace install still runs from repo root automatically. The tell-tale sign the root dir is set: build logs run in `/vercel/path0/artifacts/<name>`.

**Connection recovery:** A connected Vercel account can still return `403` with `invalidToken`; this connection is API-key based, so OAuth reauthorization is not available.
**Why:** Vercel explicitly classifies this response as an invalid credential, not a project or build permission problem.
**How to apply:** Do not repeatedly retry deployment or request a token in chat. Have the user replace the credential through the secure integration flow, then retry the API once.
