# System Architecture — Cynbit Smart Discovery

## 1. High-Level Architecture

Cynbit Smart Discovery follows a modular **client-server architecture** separating presentation, deterministic business logic, and relational persistence:

```
┌───────────────────────────┐         HTTPS / REST (/api/*)        ┌─────────────────────────────┐
│   React + Vite Frontend   │ ───────────────────────────────────► │   FastAPI Backend (Python)  │
│  Tailwind CSS + Recharts  │ ◄─────────────────────────────────── │  Pydantic + PyJWT + Argon2  │
└───────────────────────────┘            JSON Payloads             └──────────────┬──────────────┘
                                                                                  │ SQLAlchemy 2.x
                                                                                  │ (Psycopg 3)
                                                                                  ▼
                                                                   ┌─────────────────────────────┐
                                                                   │       PostgreSQL 18.7       │
                                                                   │  inquiries | administrators │
                                                                   └─────────────────────────────┘
```

## 2. Component Responsibilities

### Frontend (`frontend/src/`)
- **`pages/LandingPage.jsx`**: Value proposition, service categories, 5-step process overview, FAQ, and prototype disclaimers.
- **`pages/DiscoverPage.jsx`**: 5-step wizard with conditional questions (Website, AI Automation, Custom Software), validation, review summary, and React-only state (`hooks/useDiscovery.js`) so no PII is stored in `localStorage`.
- **`pages/BlueprintPage.jsx`**: Displays server-generated recommendations, reasoning, tech stacks, roadmaps, and submits inquiries with a client-generated UUID `idempotency_key`.
- **`pages/admin/*`**: Protected `AdminDashboardPage.jsx` & `InquiryDetailPage.jsx` (using `sessionStorage` JWT), plus public synthetic-data `DemoAdminPage.jsx`.

### Backend (`backend/app/`)
- **`core/config.py` & `core/security.py`**: Pydantic Settings environment loading, Argon2 password hashing (`argon2-cffi`), and HS256 JWT creation/verification (`PyJWT`).
- **`services/recommendation.py`**: Explainable, deterministic Python rule engine mapping selected services, goals, challenges, digital presence, budget, and timeline into structured `Recommendation` objects.
- **`services/qualification.py`**: Deterministic 0–100 lead scoring engine across 5 weighted categories (Budget 25, Timeline 20, Requirement Clarity 25, Business Readiness 20, Contact Completeness 10) classifying leads as `high` (75–100), `medium` (40–74), or `low` (0–39).
- **`repositories/` & `models/`**: SQLAlchemy 2.x ORM models (`Inquiry`, `Administrator`) and parameterized queries via Psycopg 3.

## 3. Database Schema

Managed via **Alembic** (`backend/alembic/versions/0deb275d0a33_initial_schema.py`):
- **`inquiries`**: `id` (UUID PK), `reference_id` (unique), `idempotency_key` (unique), contact fields, business profile fields, JSONB columns (`selected_services`, `business_goals`, `project_requirements`, `recommendation`, `qualification_breakdown`), `qualification_score`, `priority`, `status`, `consent`, timezone-aware `created_at` / `updated_at`.
- **`administrators`**: `id` (UUID PK), `email` (unique), `password_hash`, `is_active`, `created_at`.

## 4. API Endpoints (`/api` prefix)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| `GET` | `/api/health` | Public | Minimal health check |
| `POST` | `/api/recommend` | Public | Validate discovery inputs & return deterministic recommendations |
| `POST` | `/api/inquiries` | Public | Validate consent, check idempotency, compute score/recs, persist inquiry |
| `POST` | `/api/auth/login` | Public | Verify Argon2 hash & issue JWT |
| `GET` | `/api/auth/me` | Admin JWT | Return authenticated admin profile |
| `GET` | `/api/inquiries` | Admin JWT | List/search/filter inquiries |
| `GET` | `/api/inquiries/{id}` | Admin JWT | Full inquiry details + qualification breakdown |
| `PATCH` | `/api/inquiries/{id}` | Admin JWT | Update inquiry status (`new`, `contacted`, `in_progress`, `converted`, `closed`) |
| `GET` | `/api/analytics` | Admin JWT | Aggregated KPIs, service demand, priority & status distributions |
