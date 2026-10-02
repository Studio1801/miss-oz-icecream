---
name: GitHub Git transport
description: Difference between the GitHub App connection and local Git-over-HTTPS credentials in this workspace.
---

An active GitHub REST connection does not guarantee that the `origin` HTTPS remote can push. Do not retrieve or expose raw credentials. If Git transport rejects authentication, leave the changes committed locally and ask the user to restore the supported Replit Git connection rather than rewriting history through the REST API.

**Why:** In this workspace, rebasing from GitHub succeeded while `git push origin main` was rejected for invalid authentication, despite the GitHub App connection being installed.

**How to apply:** After the requested rebase, if `git push` rejects authentication, report that the rebase was clean, the push failed, and the local commit is retained. Do not retry with secrets or use the API to rewrite commit history.