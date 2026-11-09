# Personal Portfolio: React + Express on Google Cloud Run

A dynamic portfolio web app built with AI-assisted development (DevOps IA 3).

- **Front end:** React 19 + Vite (`client/`)
- **Back end:** Node.js + Express (`server/`): content API, contact form, health check
- **Deploy:** Docker → Google Cloud Run via Cloud Build continuous deployment on push to `main`

Repo artifacts: [`CLAUDE.md`](CLAUDE.md) (AI rules) · [`docs/PLAN.md`](docs/PLAN.md) (AI plan) ·
[`docs/PROMPT_LOG.md`](docs/PROMPT_LOG.md) (prompt log) · [`docs/screenshots/`](docs/screenshots) (3-viewport tests)

## Customize the content
Edit **`server/data/portfolio.json`** to change your name, projects, skills, and contact links. To
change the browser tab title, edit `client/index.html`. Project images live in `client/public/projects/`.

## Run locally
Requires Node.js 20 or later.

```bash
cd server && npm install && cd ../client && npm install && npm run build && cd ../server && npm start
```
Then open http://localhost:8080.

**Live-reload development** (two terminals):
```bash
cd server && npm run dev        # API on :8080
cd client && npm run dev        # UI on :5173, proxies /api to :8080
```

**Test the container:**
```bash
docker build -t portfolio . && docker run --rm -p 8080:8080 portfolio
```

## Deploy to Google Cloud Run (one-time setup)
Deployment uses **Cloud Run continuous deployment**: a Cloud Build trigger connected to this GitHub
repo builds the `Dockerfile` and deploys a new revision on every push to `main`. No service account
key is needed (the course's GCP organization blocks key creation).

1. Enable the APIs:
   ```bash
   gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com
   ```
2. In the Cloud Console, open **Cloud Run → Create service** (or **Deploy container → Service**).
3. Choose **Continuously deploy from a repository (source or function)** → **Set up with Cloud Build**.
4. **Repository provider:** GitHub → authenticate → pick `southernjoec/Maurice-Simmons-portfolio-website`.
5. **Build configuration:** branch `^main$`, build type **Dockerfile**, source location `/Dockerfile`.
6. **Service settings:** name `portfolio`, region `us-central1`, **Allow unauthenticated invocations**,
   container port `8080`.
7. Click **Create**. The first build takes a few minutes; the service URL appears at the top of the page.

After that, `git push` to `main` deploys automatically. Build history is under **Cloud Build → History**.

GitHub Actions (`.github/workflows/ci.yml`) runs a separate build check on every push: it builds the
client and the Docker image and smoke-tests the API.

Contact form submissions appear in **Cloud Run → portfolio → Logs** (search for `contact_message`).

## Project structure
```
├── client/                 React app (Vite)
│   ├── public/projects/    project images
│   └── src/components/     Navbar, Hero, About, Projects, Skills, Contact, Footer
├── server/
│   ├── data/portfolio.json all site content
│   └── index.js            Express API + static file server
├── Dockerfile              multi-stage build
├── .github/workflows/      ci.yml (build check)
├── CLAUDE.md               AI assistant rules
└── docs/                   plan, prompt log, screenshots
```
