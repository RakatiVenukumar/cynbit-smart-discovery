# Technical Report — Cynbit Smart Discovery

## 1. Executive Summary
**Cynbit Smart Discovery** is a full-stack prototype built for the Cynbit Technologies Full Stack Developer Intern assessment. It demonstrates how an intelligent, structured 5-step project discovery wizard, a deterministic recommendation engine, and a transparent lead qualification system can improve upon a conventional free-text contact form.

## 2. Assessment Context
- **Company:** Cynbit Technologies ([https://www.cynbit.in/](https://www.cynbit.in/))
- **Role:** Full Stack Developer Intern
- **Goal:** Identify one meaningful improvement to Cynbit's website from both a user and developer perspective, and deliver a working, tested, deployment-ready full-stack prototype.

## 3. Existing Website Analysis
Direct browser inspection of `cynbit.in` (`/`, `/services`, `/contact`, `/bitelevate`) confirmed that Cynbit offers AI automation, custom IT/software development, cloud systems, and digital marketing. However, the `/contact` inquiry form collects only five unstructured fields (`fullName`, `email`, `company`, `industry`, `message`). Full observations are documented in [WEBSITE_ANALYSIS.md](WEBSITE_ANALYSIS.md).

## 4. Problem Statement
1. **User Perspective:** Prospective clients who are unsure of exact technical scope receive no guidance on what to write in a generic message box and no immediate architectural feedback.
2. **Developer / Operations Perspective:** Engineering and sales teams receive unstructured text that requires manual discovery calls to extract service fit, budget, timeline, and readiness.

## 5. Proposed Solution
A standalone, integrable full-stack web application that guides visitors through 5 structured steps, generates an immediate preliminary **Project Blueprint** using explainable Python rules, persists validated inquiries to PostgreSQL with idempotency protection, and provides a lead qualification dashboard for triage.

## 6. Project Objectives
- Deliver a responsive, accessible React + Tailwind CSS frontend with all 8 specified routes.
- Implement deterministic, explainable recommendation and lead qualification engines in Python.
- Persist inquiries and administrator accounts in PostgreSQL using SQLAlchemy 2.x and Alembic. The recorded local test environment used PostgreSQL 18.7; production uses Neon PostgreSQL.
- Enforce server-side validation, Argon2 password hashing, JWT authentication, and strict separation between public demo data and real database records.

## 7. Functional Requirements
- **Public Customer Journey:** Landing page (`/`), 5-step wizard (`/discover`), personalized blueprint (`/blueprint`), confirmation with reference ID (`/success`).
- **Admin & Demo:** Public synthetic-data dashboard (`/demo/admin`), protected admin login (`/admin/login`), live dashboard (`/admin`), and inquiry detail/status management (`/admin/inquiries/:id`).

## 8. System Architecture
Modular 3-tier client-server architecture: React SPA → FastAPI REST API (`/api/*`) → PostgreSQL. See [ARCHITECTURE.md](ARCHITECTURE.md) for component and endpoint details.

## 9. Technology Stack and Justification
- **React 19 + Vite 8 + Tailwind CSS v4:** Fast development builds, responsive utility styling, and clean component composition.
- **FastAPI + Pydantic v2:** High-performance Python API with automatic OpenAPI docs (`/docs`) and strict request/response validation.
- **SQLAlchemy 2.x + Psycopg 3 + Alembic:** Type-safe ORM, parameterized queries preventing SQL injection, and versioned schema migrations.
- **PyJWT + Argon2 (`argon2-cffi`):** Industry-standard password hashing and stateless bearer authentication.

## 10. Database Design
Two relational tables managed via Alembic (`0deb275d0a33_initial_schema.py`):
- `inquiries` (UUID PK, unique `reference_id`, unique `idempotency_key`, contact fields, business profile, JSONB discovery/recommendation/breakdown payloads, `qualification_score`, `priority`, `status`, `consent`, timezone-aware timestamps).
- `administrators` (UUID PK, unique `email`, Argon2 `password_hash`, `is_active`, `created_at`).

## 11. API Design
All routes are prefixed with `/api`: `GET /api/health`, `POST /api/recommend`, `POST /api/inquiries`, `POST /api/auth/login`, `GET /api/auth/me`, `GET /api/inquiries`, `GET /api/inquiries/{id}`, `PATCH /api/inquiries/{id}`, and `GET /api/analytics`.

## 12. Recommendation Engine
Implemented in `backend/app/services/recommendation.py` using deterministic rules (no external LLMs or paid AI APIs). Evaluates selected services, business goals, challenges, digital presence, budget range, and timeline to emit one or more `Recommendation` objects with reasoning, features, tech stack, complexity (`low`/`medium`/`high`), and a phased roadmap.

## 13. Lead Qualification Engine
Implemented in `backend/app/services/qualification.py` as a transparent 0–100 prototype scoring model:
- Budget Readiness: max 25 pts
- Timeline Clarity: max 20 pts
- Requirement Clarity: max 25 pts
- Business Readiness: max 20 pts
- Contact Completeness: max 10 pts
Priority classification: `high` (75–100), `medium` (40–74), `low` (0–39).

## 14. Frontend Implementation
Built with React Router v7, `useDiscovery` hook (React state only, no `localStorage` for PII), Axios client (`VITE_API_URL`), Recharts (`BarChart`, `PieChart`), and printable blueprint support.

## 15. Backend Implementation
Clean separation across `api/routes/`, `services/`, `repositories/`, `models/`, and `schemas/`. Includes `scripts/create_admin.py` using `getpass` for secure credential entry.

## 16. Security Considerations
- Server-side Pydantic validation and input length limits.
- Parameterized SQLAlchemy queries.
- Argon2 password hashing and expiring HS256 JWT tokens.
- `sessionStorage` for admin tokens (never `localStorage`).
- Explicit consent enforcement (`422` if `consent` is `false`).
- Client-generated UUID `idempotency_key` preventing duplicate submissions.
- Restricted CORS origins via `CORS_ORIGINS`.
- CSV formula injection sanitization (`=`, `+`, `-`, `@`, `\t`, `\r` prefix escaping).
- Public `/demo/admin` uses hardcoded synthetic records only.

## 17. Testing and Actual Results
The recorded backend test run passed **27 tests with 1 warning**. The recorded frontend production build succeeded; frontend lint reported **0 errors and 1 warning**. Local browser end-to-end testing covered the customer journey and PostgreSQL persistence. Separately, the project owner confirmed successful production customer-journey verification, inquiry submission, and database persistence. The local automated results and owner-reported production verification are distinct; details are in [TEST_RESULTS.md](TEST_RESULTS.md).

## 18. Production Deployment and Configuration
The deployed application is available at:
- **Frontend:** [https://cynbit-smart-discovery.vercel.app/](https://cynbit-smart-discovery.vercel.app/)
- **Backend:** [https://cynbit-smart-discovery-api.onrender.com](https://cynbit-smart-discovery-api.onrender.com)
- **OpenAPI documentation:** [https://cynbit-smart-discovery-api.onrender.com/docs](https://cynbit-smart-discovery-api.onrender.com/docs)
- **Health endpoint:** [https://cynbit-smart-discovery-api.onrender.com/api/health](https://cynbit-smart-discovery-api.onrender.com/api/health)
- **Database:** Neon PostgreSQL, Singapore region.

The frontend is deployed on Vercel, the API on Render (`render.yaml`), and production data is stored in Neon. Production credentials and connection strings are provided through deployment environment variables and are not included in this report. Safe `.env.example` templates are available for local setup.

## 19. Expected Business Benefits
*Proposed / expected benefits (not measured in production):* Faster initial project scoping, reduced manual discovery back-and-forth, consistent lead prioritization, and higher clarity for prospective clients before their first consultation.

## 20. Known Limitations
- Scoring weights and timelines are prototype assumptions, not calibrated against Cynbit's historical sales data.
- Admin authentication uses `sessionStorage` bearer tokens (requires re-login on new tab/refresh) rather than `HttpOnly` cookies.
- Rate limiting on public endpoints is not yet backed by Redis.

## 21. Future Improvements
- Rate limiting middleware (e.g., SlowAPI + Redis) on `/api/recommend` and `/api/inquiries`.
- `HttpOnly` cookie authentication with CSRF tokens for same-domain deployments.
- Email/Slack webhook notifications on high-priority inquiry submission.

## 22. Conclusion
Cynbit Smart Discovery delivers a complete, tested, and deployable full-stack prototype that directly addresses the unstructured inquiry gap observed on `cynbit.in/contact`.

## 23. AI-Assisted Development Disclosure
Google Antigravity and AI coding assistance supported implementation, scaffolding, test authoring, and documentation preparation. The deployed recommendation and qualification behavior uses deterministic application rules, not runtime AI or external LLM calls. Test outcomes are documented in `TEST_RESULTS.md`; the project owner separately confirmed the production customer journey, inquiry submission, and PostgreSQL persistence.

## 24. Production Screenshot Evidence
The following screenshots document the deployed customer and demo journeys. Each relative link resolves to a committed screenshot file:

1. [Landing page](screenshots/01_landing_page.png)
2. [Discovery wizard](screenshots/02_discovery_wizard.png)
3. [Project blueprint](screenshots/03_project_blueprint.png)
4. [Submission confirmation](screenshots/04_success_confirmation.png)
5. [Demo dashboard](screenshots/05_demo_dashboard.png)
6. [Mobile responsive view](screenshots/06_mobile_responsive.png)
