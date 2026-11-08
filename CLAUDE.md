# CLAUDE.md: Rules for AI assistants working on this repository

## Project
A personal portfolio web app for DevOps IA 3. It has a React front end (Vite) in `client/` and an
Express server in `server/`, and it's packaged as one Docker image and deployed to Google Cloud
Run by GitHub Actions on every push to `main`.

## Architecture rules
- **It must stay a dynamic app, not a static site.** Content comes from `GET /api/portfolio`, and
  the contact form posts to `POST /api/contact`. Don't hard-code portfolio content in React components.
- **All portfolio content lives in `server/data/portfolio.json`.** To change text, projects, or skills,
  edit that file only.
- The server must listen on `process.env.PORT` (Cloud Run sets it; the default is 8080).
- Keep `GET /healthz` working, because the deploy workflow's smoke test depends on it.
- The production image is built by the multi-stage `Dockerfile` at the repo root. Don't add a
  separate web server such as nginx.

## Code conventions
- Use function components and hooks, with one component per file in `client/src/components/`.
- Use plain CSS in `client/src/index.css` with CSS variables for colors. Don't add a CSS framework
  unless asked.
- The responsive breakpoints are 960px (tablet) and 680px (mobile). Every change must work at
  390px, 820px, and 1440px wide with no horizontal scrolling.
- Accessibility: use semantic elements, give every image an `alt`, label every form input, and keep
  focus states visible.
- Keep dependencies minimal. Ask before adding a new npm package.

## Safety rules
- Never commit secrets: no service account keys, `.env` files, or API tokens. Credentials go in
  GitHub Actions secrets only (`GCP_PROJECT_ID`, `GCP_SA_KEY`).
- Validate all user input on the server, not only in the browser.

## Workflow
- Use plan mode for any change that touches more than one file, and save significant plans to `docs/`.
- After every change, run `npm run build` in `client/` and confirm it passes before saying the
  work is done.
- Test locally (see the README) before pushing, because every push to `main` deploys to production.
- Add a new entry to `docs/PROMPT_LOG.md` for each significant prompt.
