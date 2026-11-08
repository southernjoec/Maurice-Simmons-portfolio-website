# Implementation Plan: Personal Portfolio on Google Cloud Run

> Plan drafted by the AI assistant before any code was written, then followed during the build.
> Deviations found during implementation are recorded at the bottom.

## 1. Goal
Build a professional, responsive personal portfolio as a **dynamic** web app (static hosting is not
allowed), store it in a private GitHub repo, and deploy it to Google Cloud Run automatically on push.

## 2. Requirements checklist (from the assignment)
| # | Requirement | How it will be met |
|---|-------------|--------------------|
| 1 | Home/landing with intro, value proposition, visual design, navigation | `Hero` + `About` sections, a sticky `Navbar` with anchor links and active-section highlighting |
| 2 | 3+ projects with title, description, tech, link, image, organized layout | 4 project cards in a CSS grid; each card shows an image, tech tags, and GitHub/demo links |
| 3 | Skills with proficiency indicator; tools and technologies | Animated progress bars with text labels (Proficient, Comfortable…), plus "Currently learning" and "Everyday tools" tags |
| 4 | Contact info | Email, LinkedIn, and GitHub links **plus** a contact form validated on the server (advanced option) |
| 5 | Responsive, tested at 3+ viewports | Custom media queries at 960px and 680px; screenshots at 1440, 820, and 390px |
| 6 | Professional polish | Consistent dark theme set by CSS variables, one type scale, accessible focus states, no broken links |
| – | Dynamic app, containerized | Express API serves content and handles the contact form; multi-stage Dockerfile |
| – | Repo triggers deploy to Cloud Run | GitHub Actions workflow on push to `main` |
| – | Rules file, plan, prompt log in the repo | `CLAUDE.md`, `docs/PLAN.md`, `docs/PROMPT_LOG.md` |

## 3. Stack decision
**Option A (React + Vite) with an Express back end.**
- React meets the assignment's stack options and is the most widely documented framework, so AI output
  is usually reliable.
- Express makes the app genuinely dynamic: the content API, the contact form endpoint, and the health
  check. It also serves the built React files, so **one container** does everything.
- I chose this over Next.js because it has fewer moving parts and a simpler build to debug, which suits a
  short deadline.

## 4. Architecture
```
Browser ──► Cloud Run (one container, port 8080)
              └─ Express (server/index.js)
                   ├─ GET  /api/portfolio  → reads server/data/portfolio.json
                   ├─ POST /api/contact    → validates input, writes to Cloud Logging
                   ├─ GET  /healthz        → health/smoke test
                   └─ static files          → client/dist (React build), SPA fallback
```

## 5. Steps
1. Scaffold the Vite React app in `client/` and remove the boilerplate.
2. Create the Express server in `server/` with the API routes, then serve `client/dist`.
3. Write `portfolio.json` content and the project thumbnail images (SVG).
4. Build the components: Navbar, Hero, About, Projects, Skills, Contact, and Footer, plus loading and
   error states.
5. Write the stylesheet: theme variables, layout grids, and tablet and mobile breakpoints with a
   hamburger menu.
6. **Test locally:** `npm run build`, run the server, curl every endpoint, and take Playwright
   screenshots at 3 viewports while checking for horizontal scroll and console errors.
7. Write a multi-stage `Dockerfile` (build client, then a slim runtime that runs as a non-root user)
   and a `.dockerignore`.
8. Build and run the container locally, then smoke-test it.
9. Write the GitHub Actions workflow: build check, authenticate to GCP, `gcloud run deploy --source .`,
   then a smoke test.
10. Write `CLAUDE.md`, the prompt log, and the README with setup and deploy steps.

## 6. Risks and mitigations
- **The container listens on the wrong port.** Read `process.env.PORT` and default to 8080.
- **SPA routes return 404.** Use a catch-all that returns `index.html` (registered after `/api`).
- **Leaked GCP credentials.** Keep the key in GitHub Secrets only and list `gcp-key.json` in `.gitignore`.
- **Contact form spam.** Add a honeypot field, a per-IP rate limit, and server-side validation.
- **Deploy permission errors.** The README lists the exact IAM roles the service account needs.

## 7. Deviations during implementation
- The hero background glow ended in a visible hard edge (the fixed height was too short).
  I changed it to `inset: 0` so it fills the hero.
- `npm ci` failed inside `docker build` in the development sandbox because of network/proxy limits.
  That was an environment issue, not a Dockerfile issue, so the Dockerfile was left as is and
  verified with a proxy-enabled test build.
