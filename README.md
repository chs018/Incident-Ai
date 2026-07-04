# ⚡ CascadeFlow AI — AI Incident Commander

**Autonomous, Sub-Second Neural Triage for Enterprise Site Reliability Engineering**  
*Built by **Harshini Shree**, Lead Incident Commander & Product Architect*

---

## 🌟 Overview

In modern cloud engineering, when a P0 outage strikes at 3:00 AM, traditional incident response is broken. Alert fatigue, manual log-hunting across Datadog/Prometheus, and chaotic Slack war rooms cost enterprises an average of **$300,000 per minute** in downtime.

**CascadeFlow AI** replaces human triage latency with an autonomous neural nervous system. By leveraging **Groq LPU compute and Llama-3.3-70B**, CascadeFlow correlates real-time telemetry, generates sub-second Root Cause Analysis (RCA), maps architectural blast radius, and executes mitigation commands—before on-call engineers even open their laptops.

---

## 🚀 Key Features (The 8 Pillars)

1. **📊 SRE Command Center (Dashboard):** Live KPI telemetry (MTTR < 12m, 94% AI accuracy), autonomous anomaly detection (AI Health Widget), and real-time monitoring across 8 core microservices.
2. **🔥 Sub-Second Neural RCA (The War Room):** Instant root-cause explanation, automated mitigation scripting, and real-time calculation of revenue-at-risk ($1.2M/hr).
3. **🕸️ Architectural Blast Radius Mesh:** Visual directed dependency graphs mapping how database bottlenecks cascade through API gateways to end users.
4. **🧠 Organizational Hindsight (Memory Library — BETA):** Proprietary RAG & vector database (`pgvector`) indexing past resolutions so teams never solve the same bug twice.
5. **🔀 Dynamic LLM Model Routing (BETA):** Intelligent compute traffic controller routing complex reasoning to heavyweight models while sending alerts to lightweight models to optimize latency and token budgets.
6. **🔌 Unified Telemetry (Integrations):** Zero-friction hooks into Datadog, Prometheus, AWS CloudWatch, PagerDuty, Slack, and Jira.
7. **👥 Blameless Culture & On-Call (Team):** Workload distribution to combat engineer burnout and automated SOC2-compliant audit trails and postmortems.
8. **📈 Executive Analytics & Proactive ROI:** Real-time charts proving MTTR reduction, SLA uptime (99.99%), and engineering dollar savings.

---

## 🏛️ System Architecture & Layer Alignment

CascadeFlow AI is architected into **4 distinct enterprise tiers**:
* **🎨 Frontend Layer (`app/`, `components/`, `features/`):** Next.js 15 presentation, glassmorphism UI tokens, and domain modules.
* **⚙️ Backend Layer (`app/api/`, `services/slack/`, `services/sentry/`):** Serverless REST endpoints, webhook ingestion, and third-party observability integrations.
* **🧠 AI & Neural Inference Layer (`services/ai/`, `services/memory/`, `services/cascadeflow/`):** Groq LPU client (>300 tokens/sec), Hindsight Vector RAG engine, and dynamic model router.
* **🗄️ Database & Persistence Layer (`supabase/`, `lib/supabase/`):** PostgreSQL schema, RLS policies, and `pgvector` embeddings.

👉 **[Read the complete Architecture & Layer Alignment Guide (ARCHITECTURE.md)](file:///c:/HackwithChennai/ai-incident-commander/ARCHITECTURE.md)** for detailed ASCII diagrams, module workflows, and security governance.

---

## 🛠️ Tech Stack

* **Framework:** [Next.js 15](https://nextjs.org) (App Router, TypeScript, React Server Components)
* **Styling & Design System:** Custom Token-Driven Vanilla CSS / TailwindCSS, Glassmorphism (`glass-card`), HSL Palettes, Obsidian Dark & Soft Beige Light Mode (`next-themes`)
* **Animations:** `framer-motion` for tactile micro-interactions and live telemetry pulsing
* **Database & Vector Storage:** [Supabase](https://supabase.com) (PostgreSQL, `pgvector` embeddings)
* **AI Compute Layer:** Groq LPU API (`llama-3.3-70b-versatile`)
* **State & Data Fetching:** `@tanstack/react-query`

---

## 💻 Getting Started Locally

### 1. Clone the repository
```bash
git clone https://github.com/chs018/cascadeflow-ai.git
cd cascadeflow-ai
```

### 2. Install dependencies
```bash
npm install
# or
pnpm install
```

### 3. Set up environment variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_api_key
```

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser. You can sign in with the default workspace account:
* **Email:** `harshini@cloudnova.io`
* **Role:** Lead Incident Commander

---

## 🌐 Deploying to Production

### One-Click Deploy on Vercel
The easiest way to deploy CascadeFlow AI is via [Vercel](https://vercel.com):

1. Push your code to a GitHub repository.
2. Import the project into Vercel.
3. Add your environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `GROQ_API_KEY`) in the Vercel project settings.
4. Click **Deploy**. Vercel will automatically build and optimize the Next.js production bundle.

### Manual Production Build
To verify and test the production build locally before deploying:
```bash
npm run build
npm start
```

---

## 📜 License & Compliance
Built for **HackwithChennai 2026**. Designed with SOC2 Type II compliance standards and Zero-Trust RBAC architecture.
