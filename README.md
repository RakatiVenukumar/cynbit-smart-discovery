# Cynbit Smart Discovery

**Intelligent Project Discovery & Lead Qualification System**

An independent full-stack technical assessment prototype created for the **Cynbit Technologies Full Stack Developer Intern** assessment.

> **Disclaimer:** This project is an independent assessment prototype. It is not affiliated with, endorsed by, or connected to Cynbit Technologies' production website or inquiry systems. Public evaluators should use fictional contact details.

---

## Problem Statement & Proposed Improvement

Direct inspection of Cynbit Technologies' official website ([cynbit.in](https://www.cynbit.in/)) showed that while its service pillars and technical capabilities are clearly presented on `/services`, the primary inquiry mechanism on `/contact` is a single 5-field generic contact form (`fullName`, `email`, `company`, `industry`, `message`).

**Cynbit Smart Discovery** demonstrates how replacing a generic inquiry form with a structured 5-step guided discovery experience improves the workflow for both stakeholders:
- **For Prospective Clients:** Conditional questions capture relevant technical context, and an explainable, deterministic recommendation engine immediately returns a personalized **Project Blueprint** (recommended solutions, reasoning, suggested tech stack, complexity level, and implementation roadmap).
- **For Engineering & Sales Teams:** Every inquiry is automatically scored (0–100) across five weighted qualification categories and prioritized (`High`, `Medium`, `Low`) in PostgreSQL for structured triage.

---

## Features

- **Landing Page (`/`)**: Value proposition, 5-step discovery overview, supported service categories, benefits, FAQ accordion, and prototype disclaimers.
- **5-Step Interactive Discovery Wizard (`/discover`)**:
  - Multi-select service categories (aligned with Cynbit offerings + *Not Sure Yet*).
  - Business profile capture with *Other* support.
  - Conditional technical questions tailored to Website Development, AI & Automation, and Custom Software.
  - Project constraints (budget, timeline, urgency, readiness).
  - Contact capture with explicit storage consent and summary review.
  - Zero `localStorage` persistence of personal contact data.
- **Personalized Project Blueprint (`/blueprint`)**: Displays recommendations, reasoning, features, tech stack tags, phased roadmap, print/PDF export, and idempotent inquiry submission.
- **Confirmation Page (`/success`)**: Displays the server-generated Reference ID (`CSD-YYYYMMDD-XXXXX`).
- **Lead Qualification Engine**: Deterministic 0–100 scoring across Budget Readiness (25), Timeline Clarity (20), Requirement Clarity (25), Business Readiness (20), and Contact Completeness (10).
- **Public Demo Dashboard (`/demo/admin`)**: Synthetic-data analytics dashboard with Recharts visualizations and search/filter controls—never exposes real database records.
- **Protected Admin Dashboard (`/admin/login`, `/admin`, `/admin/inquiries/:id`)**: JWT + Argon2 authenticated dashboard with live PostgreSQL analytics, search/filtering, status updates, qualification breakdown, and formula-injection-safe CSV export.

## Live Production Deployment

- **Frontend:** [https://cynbit-smart-discovery.vercel.app/](https://cynbit-smart-discovery.vercel.app/)
- **Backend health:** [https://cynbit-smart-discovery-api.onrender.com/api/health](https://cynbit-smart-discovery-api.onrender.com/api/health)
- **API documentation:** [https://cynbit-smart-discovery-api.onrender.com/docs](https://cynbit-smart-discovery-api.onrender.com/docs)
- **Production database:** Neon PostgreSQL, Singapore region.

The production customer journey, inquiry submission, and database persistence have been verified by the project owner. The backend test and frontend build results are recorded in [`docs/TEST_RESULTS.md`](docs/TEST_RESULTS.md).

## Production Screenshots

- [Landing page](docs/screenshots/01_landing_page.png)
- [Discovery wizard](docs/screenshots/02_discovery_wizard.png)
- [Project blueprint](docs/screenshots/03_project_blueprint.png)
- [Submission confirmation](docs/screenshots/04_success_confirmation.png)
- [Demo dashboard](docs/screenshots/05_demo_dashboard.png)
- [Mobile responsive view](docs/screenshots/06_mobile_responsive.png)

The full technical report is available as [Markdown](docs/TECHNICAL_REPORT.md) and [PDF](docs/Cynbit_Smart_Discovery_Technical_Report.pdf).

---

## Technology Stack

- **Frontend:** React 19, Vite 8, Tailwind CSS v4, React Router v7, Axios, Lucide React, Recharts
- **Backend:** Python 3.11, FastAPI, SQLAlchemy 2.x, Psycopg 3, Alembic, Pydantic v2, PyJWT, Argon2 (`argon2-cffi`), Uvicorn
- **Database:** Neon PostgreSQL (production, Singapore region); PostgreSQL 18.7 in the documented local test environment
- **Testing:** Pytest, FastAPI `TestClient`, Oxlint, Vite production build

---

## Project Structure

```
cynbit-smart-discovery/
├── backend/
│   ├── alembic/                 # Database migrations
│   ├── app/
│   │   ├── api/routes/          # health, recommend, inquiries, auth, analytics
│   │   ├── core/                # config, JWT + Argon2 security
│   │   ├── db/                  # SQLAlchemy session & Base
│   │   ├── models/              # Inquiry, Administrator
│   │   ├── repositories/        # Parameterized DB queries
│   │   ├── schemas/             # Pydantic request/response models
│   │   ├── services/            # recommendation.py, qualification.py
│   │   └── utils/               # reference_id & idempotency generators
│   ├── scripts/create_admin.py  # Interactive CLI admin creation
│   ├── tests/                   # Pytest unit & integration tests
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/          # UI primitives, layout, ProtectedRoute
│   │   ├── data/                # Service & wizard options
│   │   ├── hooks/               # useDiscovery state hook
│   │   ├── pages/               # Landing, Discover, Blueprint, Success, Admin, Demo
│   │   ├── services/api.js      # Axios client
│   │   └── utils/               # Formatters & UUID idempotency key
│   ├── vercel.json              # SPA rewrites
│   └── .env.example
├── docs/
│   ├── WEBSITE_ANALYSIS.md
│   ├── ARCHITECTURE.md
│   ├── TEST_RESULTS.md
│   ├── TECHNICAL_REPORT.md
│   ├── Cynbit_Smart_Discovery_Technical_Report.pdf
│   └── screenshots/
├── render.yaml                  # Render backend deployment spec
└── README.md
```

---

## Local Setup & Installation

### 1. Database (PostgreSQL)
Create a PostgreSQL database (e.g., `cynbit_smart_discovery`).

### 2. Backend
```bash
cd backend
cp .env.example .env
# Edit .env with your DATABASE_URL and a strong SECRET_KEY

# Run migrations
venv/Scripts/python.exe -m alembic upgrade head

# (Optional) Create an admin user securely
venv/Scripts/python.exe scripts/create_admin.py

# Start FastAPI server
venv/Scripts/python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```
API docs are available at `http://127.0.0.1:8000/docs`.

### 3. Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`.

---

## Testing

```bash
# Backend unit + API integration tests
cd backend
venv/Scripts/python.exe -m pytest tests/ -v

# Frontend lint & production build
cd frontend
npm run lint
npm run build
```

---

## Deployment

- **Frontend (Vercel):** Production URL is [cynbit-smart-discovery.vercel.app](https://cynbit-smart-discovery.vercel.app/). For a new deployment, set root directory to `frontend`, build command `npm run build`, output directory `dist`, and environment variable `VITE_API_URL=https://<your-render-service>.onrender.com/api`. `frontend/vercel.json` handles SPA route rewrites.
- **Backend (Render):** Use `render.yaml` (`rootDir: backend`, `startCommand: alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port $PORT`, health check `/api/health`). Set `DATABASE_URL`, `SECRET_KEY`, and `CORS_ORIGINS`.
- **Backend API:** [cynbit-smart-discovery-api.onrender.com](https://cynbit-smart-discovery-api.onrender.com), with interactive docs at [/docs](https://cynbit-smart-discovery-api.onrender.com/docs).
- **Database (Neon):** Production PostgreSQL is hosted in the Singapore region. Supply the connection string through the deployment environment's `DATABASE_URL` setting; never commit it.

---

## Known Limitations & AI-Assisted Development Disclosure

- Recommendations and qualification scores use deterministic prototype rules rather than actual Cynbit pricing, effort estimates, or historical sales data.
- Admin JWT tokens are stored in `sessionStorage` (cleared when the browser tab closes) rather than `localStorage` or cross-origin `HttpOnly` cookies.
- Public endpoint rate limiting is not backed by a shared service such as Redis.
- **AI-Assisted Development Disclosure:** Google Antigravity and other AI coding assistance supported implementation, scaffolding, test authoring, and documentation. AI is not used by the running recommendation or qualification engines; these use deterministic application rules. Recorded test results and project-owner-confirmed production verification are described separately in [`docs/TEST_RESULTS.md`](docs/TEST_RESULTS.md).
