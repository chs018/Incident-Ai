# 🏛️ CascadeFlow AI — System Architecture & Layer Alignment

**Lead Architect & Incident Commander:** **Harshini Shree** (`harshini@cloudnova.io`)  
**Design Standard:** Enterprise Full-Stack Next.js 15 (App Router) Modular Architecture  

---

## 📐 Executive Architectural Overview

CascadeFlow AI is structured around a **4-Tier Modular Architecture** separating **Frontend Presentation**, **Backend Serverless Orchestration**, **AI Neural Inference**, and **Database Persistence**. 

Unlike traditional monoliths, CascadeFlow leverages Next.js 15 App Router to co-locate serverless API routes with frontend presentation layers while strictly isolating domain logic, AI model routing, and vector memory into dedicated service layers.

```
cascadeflow-ai/
├── 🎨 FRONTEND LAYER (UI, Components, & State)
│   ├── app/                # Next.js 15 App Router (Pages, Layouts, & Routing)
│   ├── components/         # Shared Design System & Glassmorphism UI Tokens
│   └── features/           # Domain-Specific Frontend Feature Modules
│
├── ⚙️ BACKEND LAYER (API Routes & Integrations)
│   ├── app/api/            # Serverless REST Endpoints & Webhook Ingestion
│   └── services/           # Core Orchestration, Slack, Sentry, & Linear Hooks
│
├── 🧠 AI & NEURAL INFERENCE LAYER (Groq LPU, RAG, & Routing)
│   ├── services/ai/        # Groq LPU Client, Prompt Templates, & Response Parsers
│   ├── services/memory/    # Hindsight Vector RAG Engine & Similarity Calculator
│   └── services/cascadeflow/ # Dynamic Model Router & Policy Governance
│
└── 🗄️ DATABASE & PERSISTENCE LAYER (Supabase & pgvector)
    ├── supabase/           # SQL Database Schema, RLS Policies, & Seed Data
    └── lib/supabase/       # Server & Client Database Connectors
```

---

## 🎨 1. Frontend Layer (Presentation & UI)
The Frontend Layer is built for high performance, zero-layout-shift rendering, and rich glassmorphism aesthetics.

* **`app/` (Next.js 15 App Router):** Contains our top-level routing structure divided by route groups:
  * `(app)/` — Protected workspace routes (`/dashboard`, `/war-room`, `/analytics`, `/memory`, `/routing`, `/team`, `/settings`, `/integrations`).
  * `(auth)/` — Authentication flows (`/login`, `/signup`, `/verify-email`).
  * `(onboarding)/` — Workspace initialization wizard (`/onboarding`).
* **`components/` (Design System):** Reusable UI tokens including `app-shell`, `header`, `sidebar`, `metric-card`, `status-badge`, and theme switchers (`theme-provider`, `theme-toggle`).
* **`features/` (Domain Modules):** Modularized feature components encapsulating complex UI logic:
  * `features/dashboard/` — SRE Command Center, KPI sparklines, and Service Health Grid.
  * `features/war-room/` — Sub-second RCA panel, Blast Radius Mesh, and live collaboration feed.
  * `features/memory/` — Hindsight Vector RAG library and knowledge graph visualizers.
  * `features/routing/` — Dynamic LLM model router dashboard and cost policy manager.

---

## ⚙️ 2. Backend Layer (Serverless API & Orchestration)
The Backend Layer handles secure authentication, telemetry ingestion, and third-party observability integrations.

* **`app/api/` (Serverless Endpoints):**
  * `api/analyze-incident/` — Triggers neural root-cause analysis against live telemetry.
  * `api/generate-postmortem/` — Compiles blameless SOC2-compliant incident reports.
  * `api/incidents/[id]/actions/` — Handles war room mitigations, escalations, and acknowledgments.
  * `api/webhooks/ingest/` — High-throughput ingestion endpoint for Datadog, AWS, and Prometheus alerts.
  * `api/integrations/slack/` — Real-time ChatOps bidirectional Slack integration.
* **`services/` (Backend Integration Clients):**
  * `services/slack/` — Orchestrates Slack channel creation and incident broadcasting.
  * `services/sentry/` — Pulls stack traces and exception payloads.
  * `services/linear/` — Auto-creates tracking tickets and engineering tasks.

---

## 🧠 3. AI & Neural Inference Layer (Groq LPU & RAG)
The AI Layer is isolated from standard backend logic to allow high-speed neural reasoning and dynamic model routing.

* **`services/ai/` (Neural Inference Engine):**
  * `groq-client.ts` — Interfaces directly with Groq LPU hardware running `llama-3.3-70b-versatile` at >300 tokens/sec.
  * `prompt-templates.ts` — System prompts engineered for SRE triage, N+1 query detection, and Kubernetes debugging.
  * `response-parser.ts` — Validates and formats LLM JSON outputs into structured RCA cards.
  * `confidence-calculator.ts` — Computes diagnostic confidence scores (e.g., 94% benchmark).
* **`services/memory/` (Hindsight Vector RAG):**
  * `reflection-engine.ts` — Indexes resolved incidents into high-dimensional vector embeddings.
  * `similarity-calculator.ts` — Performs cosine similarity math to match incoming alerts with historical solutions.
* **`services/cascadeflow/` (Dynamic Model Router):**
  * `model-router.ts` — Routes complex reasoning to high-power models (Groq/Claude) and simple alerts to lightweight models.
  * `budget-manager.ts` — Enforces token budgets and tracks real-time AI cost ROI.

---

## 🗄️ 4. Database & Persistence Layer (Supabase & pgvector)
The Database Layer ensures data persistence, real-time subscriptions, and vector similarity search.

* **`supabase/schema.sql`**: Definitive PostgreSQL schema defining tables for `incidents`, `team_members`, `timeline_events`, `microservices`, and `hindsight_memories` (equipped with `pgvector` embedding columns).
* **`supabase/seed.sql`**: Complete enterprise seed data establishing **Harshini Shree** (`harshini@cloudnova.io`) as the primary Incident Commander, alongside live P0 incident data (`INC-2947`).
* **`lib/supabase/`**: Server-side (`server.ts`) and client-side (`client.ts`) Supabase connectors utilizing Next.js cookies and Row-Level Security (RLS).

---

## 🔒 Security & Compliance Governance
* **Zero-Trust RBAC:** Granular role-based access control separating Incident Commanders, SREs, and Read-Only viewers.
* **SOC2 Type II Audit Trail:** All human terminal executions and AI inferences are logged immutably in `timeline_events`.
* **Environment Security:** Sensitive credentials (`GROQ_API_KEY`, Supabase keys) are strictly isolated in `.env.local` and excluded from version control via `.gitignore`.
