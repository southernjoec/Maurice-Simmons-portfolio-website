# Personal Portfolio: React + Express on Google Cloud Run

A dynamic portfolio web app built with AI-assisted development (DevOps IA 3).

- **Front end:** React 19 + Vite (`client/`)
- **Back end:** Node.js + Express (`server/`): content API, contact form, health check
- **Deploy:** Docker → Google Cloud Run, triggered by GitHub Actions on push to `main`

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
1. In a GCP project with billing enabled, enable the APIs:
   ```bash
   gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com
   ```
2. Create a deployer service account and grant it roles:
   ```bash
   PROJECT_ID=your-project-id
   gcloud iam service-accounts create github-deployer --project $PROJECT_ID
   SA=github-deployer@$PROJECT_ID.iam.gserviceaccount.com
   for ROLE in run.admin cloudbuild.builds.editor artifactregistry.admin storage.admin iam.serviceAccountUser serviceusage.serviceUsageConsumer; do
     gcloud projects add-iam-policy-binding $PROJECT_ID --member="serviceAccount:$SA" --role="roles/$ROLE"
   done
   gcloud iam service-accounts keys create gcp-key.json --iam-account $SA
   ```
3. In the GitHub repo, go to **Settings → Secrets and variables → Actions** and add two secrets:
   - `GCP_PROJECT_ID`: your project ID
   - `GCP_SA_KEY`: the entire contents of `gcp-key.json` (then delete the local file; it's in `.gitignore`)
4. Push to `main`. The **Deploy to Cloud Run** workflow builds the image, deploys it, and prints the
   service URL.

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
├── .github/workflows/      deploy.yml (Cloud Run CI/CD)
├── CLAUDE.md               AI assistant rules
└── docs/                   plan, prompt log, screenshots
```
