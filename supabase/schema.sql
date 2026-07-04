-- ============================================================================
-- AI Incident Commander — Supabase (PostgreSQL + pgvector) Schema
-- ============================================================================

-- 1. Enable pgvector extension for Hindsight Persistent Memory
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA public;

-- 2. Organizations Table
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    avatar_color TEXT NOT NULL DEFAULT '#3B82F6',
    plan TEXT NOT NULL CHECK (plan IN ('starter', 'pro', 'enterprise')) DEFAULT 'enterprise',
    member_count INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Team Members Table
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'incident-commander', 'sre', 'devops', 'viewer')),
    avatar_initials TEXT NOT NULL,
    avatar_color TEXT NOT NULL DEFAULT '#6366F1',
    team TEXT NOT NULL DEFAULT 'Platform Engineering',
    status TEXT NOT NULL CHECK (status IN ('online', 'away', 'offline')) DEFAULT 'online',
    incidents_resolved INTEGER NOT NULL DEFAULT 0,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Incidents Table
CREATE TABLE IF NOT EXISTS public.incidents (
    id TEXT PRIMARY KEY, -- e.g., 'INC-2947'
    org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    priority TEXT NOT NULL CHECK (priority IN ('P0', 'P1', 'P2', 'P3')),
    severity TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
    status TEXT NOT NULL CHECK (status IN ('active', 'investigating', 'mitigating', 'resolved', 'postmortem')),
    environment TEXT NOT NULL CHECK (environment IN ('production', 'staging', 'development')),
    service TEXT NOT NULL,
    lead TEXT NOT NULL,
    mttr TEXT,
    mttd TEXT,
    affected_users INTEGER DEFAULT 0,
    revenue_at_risk TEXT DEFAULT '$0',
    summary TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    root_cause TEXT,
    timeline JSONB DEFAULT '[]'::jsonb,
    probable_causes JSONB DEFAULT '[]'::jsonb,
    recommended_actions JSONB DEFAULT '[]'::jsonb,
    blast_radius JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- 5. Timeline Events Table
CREATE TABLE IF NOT EXISTS public.timeline_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_id TEXT REFERENCES public.incidents(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actor TEXT NOT NULL,
    action TEXT NOT NULL,
    detail TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('detection', 'acknowledgment', 'investigation', 'action', 'update', 'resolution'))
);

-- 6. Hindsight Persistent Memories (with pgvector)
CREATE TABLE IF NOT EXISTS public.hindsight_memories (
    id TEXT PRIMARY KEY, -- e.g., 'mem-001'
    incident_id TEXT NOT NULL,
    title TEXT NOT NULL,
    service TEXT NOT NULL,
    environment TEXT NOT NULL,
    severity TEXT NOT NULL,
    root_cause TEXT NOT NULL,
    resolution TEXT NOT NULL,
    engineer_name TEXT NOT NULL,
    engineer_role TEXT NOT NULL,
    engineer_avatar TEXT NOT NULL,
    time_to_resolution INTEGER NOT NULL DEFAULT 15,
    business_impact TEXT NOT NULL,
    recovery_success_rate DOUBLE PRECISION NOT NULL DEFAULT 95.0,
    similarity_score DOUBLE PRECISION DEFAULT 85.0,
    relevance_badge TEXT DEFAULT 'High Similarity',
    use_count INTEGER NOT NULL DEFAULT 1,
    tags TEXT[] DEFAULT '{}',
    runbook_url TEXT,
    embedding VECTOR(1536), -- Vector embedding for cosine similarity matching
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_used_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for HNSW fast approximate nearest neighbor (ANN) search using cosine distance
CREATE INDEX IF NOT EXISTS hindsight_memories_embedding_idx 
ON public.hindsight_memories 
USING hnsw (embedding vector_cosine_ops);

-- 7. cascadeflow Audit Ledger Table
CREATE TABLE IF NOT EXISTS public.cascadeflow_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_id TEXT NOT NULL,
    user_role TEXT NOT NULL,
    incident_id TEXT NOT NULL,
    incident_title TEXT NOT NULL,
    selected_model TEXT NOT NULL,
    latency_ms INTEGER NOT NULL,
    tokens INTEGER NOT NULL,
    cost_usd DOUBLE PRECISION NOT NULL,
    confidence DOUBLE PRECISION NOT NULL,
    memory_used BOOLEAN NOT NULL DEFAULT false,
    policy_decision TEXT NOT NULL,
    status TEXT NOT NULL
);

-- ============================================================================
-- Supabase RPC Function: match_memories (Vector Similarity Search)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.match_memories(
    query_embedding VECTOR(1536),
    match_threshold DOUBLE PRECISION DEFAULT 0.5,
    match_count INTEGER DEFAULT 5
)
RETURNS TABLE (
    id TEXT,
    incident_id TEXT,
    title TEXT,
    service TEXT,
    environment TEXT,
    severity TEXT,
    root_cause TEXT,
    resolution TEXT,
    engineer_name TEXT,
    engineer_role TEXT,
    engineer_avatar TEXT,
    time_to_resolution INTEGER,
    business_impact TEXT,
    recovery_success_rate DOUBLE PRECISION,
    similarity_score DOUBLE PRECISION,
    relevance_badge TEXT,
    use_count INTEGER,
    tags TEXT[],
    runbook_url TEXT,
    created_at TIMESTAMPTZ,
    last_used_at TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        m.id,
        m.incident_id,
        m.title,
        m.service,
        m.environment,
        m.severity,
        m.root_cause,
        m.resolution,
        m.engineer_name,
        m.engineer_role,
        m.engineer_avatar,
        m.time_to_resolution,
        m.business_impact,
        m.recovery_success_rate,
        -- Calculate cosine similarity (1 - cosine distance) * 100 as percentage
        ROUND((1 - (m.embedding <=> query_embedding)) * 100)::DOUBLE PRECISION AS similarity_score,
        m.relevance_badge,
        m.use_count,
        m.tags,
        m.runbook_url,
        m.created_at,
        m.last_used_at
    FROM public.hindsight_memories m
    WHERE m.embedding IS NOT NULL AND (1 - (m.embedding <=> query_embedding)) > match_threshold
    ORDER BY m.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;
