-- ============================================================================
-- AI Incident Commander — Supabase Seed Data
-- ============================================================================

-- 1. Insert Organizations
INSERT INTO public.organizations (id, name, slug, avatar_color, plan, member_count)
VALUES 
    ('11111111-1111-4111-8111-111111111111', 'CloudNova Technologies', 'cloudnova', '#3B82F6', 'enterprise', 142),
    ('22222222-2222-4222-8222-222222222222', 'Vertex Payments', 'vertex-pay', '#8B5CF6', 'enterprise', 89),
    ('33333333-3333-4333-8333-333333333333', 'BluePeak Systems', 'bluepeak', '#10B981', 'pro', 54),
    ('44444444-4444-4444-8444-444444444444', 'SkyScale Cloud', 'skyscale', '#06B6D4', 'pro', 31)
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Team Members
INSERT INTO public.team_members (id, org_id, name, email, role, avatar_initials, avatar_color, team, status, incidents_resolved, joined_at)
VALUES 
    ('a0000000-0000-4000-8000-000000000001', '11111111-1111-4111-8111-111111111111', 'Harshini Shree', 'harshini@cloudnova.io', 'incident-commander', 'HS', '#3B82F6', 'Platform Engineering', 'online', 247, '2022-03-15T00:00:00Z'),
    ('a0000000-0000-4000-8000-000000000002', '11111111-1111-4111-8111-111111111111', 'Priya Menon', 'priya.menon@cloudnova.io', 'sre', 'PM', '#10B981', 'SRE', 'online', 189, '2021-08-20T00:00:00Z'),
    ('a0000000-0000-4000-8000-000000000003', '11111111-1111-4111-8111-111111111111', 'Rohan Kapoor', 'rohan.kapoor@cloudnova.io', 'devops', 'RK', '#8B5CF6', 'Cloud Infrastructure', 'away', 134, '2023-01-10T00:00:00Z'),
    ('a0000000-0000-4000-8000-000000000004', '11111111-1111-4111-8111-111111111111', 'Kavita Reddy', 'kavita.reddy@cloudnova.io', 'sre', 'KR', '#F59E0B', 'SRE', 'online', 98, '2023-06-01T00:00:00Z'),
    ('a0000000-0000-4000-8000-000000000005', '11111111-1111-4111-8111-111111111111', 'Dev Anand', 'dev.anand@cloudnova.io', 'admin', 'DA', '#EF4444', 'Security Operations', 'online', 312, '2020-11-05T00:00:00Z'),
    ('a0000000-0000-4000-8000-000000000006', '11111111-1111-4111-8111-111111111111', 'Sneha Iyer', 'sneha.iyer@cloudnova.io', 'devops', 'SI', '#06B6D4', 'DevOps', 'offline', 76, '2024-02-14T00:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Incidents
INSERT INTO public.incidents (
    id, org_id, title, description, priority, severity, status, environment, service, lead, mttr, mttd, affected_users, revenue_at_risk, summary, tags, root_cause, blast_radius, created_at, updated_at
)
VALUES 
    (
        'INC-2947', 
        '11111111-1111-4111-8111-111111111111',
        'Payment API returning 503 — Complete service outage',
        'The core Payment API is returning HTTP 503 errors across all geographic regions. All payment processing is halted. Customer-facing checkout flows are broken.',
        'P0',
        'critical',
        'investigating',
        'production',
        'payment-api',
        'Harshini Shree',
        NULL,
        '2m',
        84000,
        '$1.2M/hr',
        'The Payment API is returning 503 Service Unavailable errors across all regions. Elevated error rates detected correlating with deployment v2.4.1.',
        '[{"label": "database", "color": "#3B82F6"}, {"label": "connection-pool", "color": "#8B5CF6"}, {"label": "revenue-impact", "color": "#EF4444"}]'::jsonb,
        'Database connection pool exhaustion triggered by a missing index on the transactions table introduced in migration 20240704-001.',
        '{"service": "payment-api", "affectedDownstream": ["order-management", "inventory-service", "checkout-bff"], "riskLevel": "Critical"}'::jsonb,
        NOW() - INTERVAL '15 minutes',
        NOW() - INTERVAL '2 minutes'
    ),
    (
        'INC-2946', 
        '11111111-1111-4111-8111-111111111111',
        'Redis Out of Memory — Session cache eviction storm',
        'Primary Redis cluster has hit 98% memory utilization causing aggressive key eviction. User sessions are being dropped.',
        'P1',
        'high',
        'mitigating',
        'production',
        'redis-session-cache',
        'Priya Menon',
        NULL,
        '3m',
        32000,
        '$450k/hr',
        'Redis cluster memory saturation caused by unexpired authentication tokens accumulating after auth-service release.',
        '[{"label": "cache", "color": "#10B981"}, {"label": "memory", "color": "#F59E0B"}]'::jsonb,
        'Unindexed session query in v4.8.2 caused volatile-lru memory evictions, dropping authenticated user checkout sessions.',
        '{"service": "redis-session-cache", "affectedDownstream": ["auth-service", "user-dashboard"], "riskLevel": "High"}'::jsonb,
        NOW() - INTERVAL '45 minutes',
        NOW() - INTERVAL '10 minutes'
    ),
    (
        'INC-2945', 
        '11111111-1111-4111-8111-111111111111',
        'Kubernetes EKS CoreDNS Throttling & Socket Exhaustion',
        'CoreDNS query latency degraded to 450ms, causing cascading 504 timeouts across checkout API calls.',
        'P1',
        'high',
        'resolved',
        'production',
        'checkout-service',
        'Rohan Kapoor',
        '22m',
        '1m',
        18000,
        '$120k/hr',
        'DNS query throttling in EKS cluster caused by missing ndots:2 optimization in pod specs.',
        '[{"label": "kubernetes", "color": "#3B82F6"}, {"label": "dns", "color": "#8B5CF6"}]'::jsonb,
        'Missing ndots:5 optimization in pod spec caused 5x DNS queries per external API call, overwhelming CoreDNS replicas.',
        '{"service": "checkout-service", "affectedDownstream": ["api-gateway"], "riskLevel": "Medium"}'::jsonb,
        NOW() - INTERVAL '3 hours',
        NOW() - INTERVAL '2 hours 38 minutes'
    )
ON CONFLICT (id) DO UPDATE SET
    status = EXCLUDED.status,
    updated_at = EXCLUDED.updated_at;

-- 4. Insert Timeline Events
INSERT INTO public.timeline_events (incident_id, timestamp, actor, action, detail, type)
VALUES
    ('INC-2947', NOW() - INTERVAL '15 minutes', 'PagerDuty', 'Alert fired', 'payment-api error rate exceeded 10% threshold (current: 98.4%)', 'detection'),
    ('INC-2947', NOW() - INTERVAL '13 minutes', 'Harshini Shree', 'Incident acknowledged', 'Assigned as Incident Commander. War room opened.', 'acknowledgment'),
    ('INC-2947', NOW() - INTERVAL '12 minutes', 'AI Incident Commander', 'AI Analysis generated', 'Root cause identified: DB connection pool exhaustion. Confidence: 94%', 'investigation'),
    ('INC-2947', NOW() - INTERVAL '10 minutes', 'Priya Menon', 'Investigation started', 'Reviewing PostgreSQL slow query logs and connection pool metrics', 'investigation'),
    ('INC-2947', NOW() - INTERVAL '2 minutes', 'Rohan Kapoor', 'Mitigation attempted', 'Scaled payment-api pods from 8 to 16 — no improvement observed', 'action')
ON CONFLICT DO NOTHING;

-- 5. Insert Hindsight Persistent Memories (with dummy 1536-dim vector embedding array_fill)
INSERT INTO public.hindsight_memories (
    id, incident_id, title, service, environment, severity, root_cause, resolution, engineer_name, engineer_role, engineer_avatar, time_to_resolution, business_impact, recovery_success_rate, similarity_score, relevance_badge, use_count, tags, runbook_url, embedding
)
VALUES
    (
        'mem-001', 'inc-redis-2026-03', 'Redis ElastiCache OOM Eviction Storm during High Traffic',
        'payment-api', 'production', 'critical',
        'Unindexed session query in v4.8.2 caused volatile-lru memory evictions, dropping authenticated user checkout sessions.',
        'Rolled back payment-api deployment to v4.8.1, executed ElastiCache replica failover to clear memory fragmentation, and increased maxmemory to 24GB.',
        'Alex Rivera', 'Principal SRE', 'AR', 14,
        'Zero data loss. Prevented $140k/hr revenue leakage during checkout.',
        99.4, 98.2, 'Exact Pattern', 14,
        ARRAY['redis', 'oom', 'elasticache', 'payment', 'eviction'],
        'https://runbooks.internal/redis-oom-recovery',
        array_fill(0.012, ARRAY[1536])::vector(1536)
    ),
    (
        'mem-002', 'inc-k8s-2026-04', 'EKS CoreDNS Throttling & Socket Exhaustion on Checkout Pods',
        'checkout-service', 'production', 'high',
        'Missing ndots:5 optimization in pod spec caused 5x DNS queries per external API call, overwhelming CoreDNS replicas.',
        'Scaled CoreDNS pods from 3 to 10, enabled NodeLocal DNSCache via daemonset, and patched deployment spec with ndots:2.',
        'Sarah Chen', 'Cloud Architect', 'SC', 22,
        'Resolved 504 Gateway Timeouts across European checkout gateways.',
        96.8, 84.5, 'High Similarity', 8,
        ARRAY['kubernetes', 'dns', 'coredns', 'checkout', 'network'],
        'https://runbooks.internal/eks-dns-throttling',
        array_fill(0.024, ARRAY[1536])::vector(1536)
    ),
    (
        'mem-003', 'inc-pg-2026-02', 'PostgreSQL RDS Deadlock Storm on Order Status Updates',
        'order-processor', 'production', 'critical',
        'Concurrent batch invoicing job acquired exclusive row locks in reverse primary key order compared to real-time checkout webhooks.',
        'Terminated blocking PID tree via pg_stat_activity, disabled background invoice cron, and deployed hotfix sorting lock acquisition by order_id ASC.',
        'Marcus Vance', 'Database Lead', 'MV', 18,
        'Restored order confirmation emails and unblocked 4,200 pending transactions.',
        98.0, 78.1, 'Related Service', 11,
        ARRAY['postgres', 'rds', 'deadlock', 'database', 'orders'],
        'https://runbooks.internal/rds-deadlock-remediation',
        array_fill(0.035, ARRAY[1536])::vector(1536)
    ),
    (
        'mem-004', 'inc-kafka-2026-05', 'Kafka Consumer Group Lag Spike on Notification Topic',
        'notification-worker', 'production', 'medium',
        'Poison pill message with malformed JSON payload caused unhandled deserialization exception in Kafka listener loop.',
        'Configured Dead Letter Queue (DLQ) topic routing in application.properties and restarted consumer pods with auto.offset.reset=latest.',
        'Priya Patel', 'Staff SRE', 'PP', 12,
        'Cleared 180k queued push notifications without dropping valid messages.',
        100.0, 71.4, 'Structural Match', 9,
        ARRAY['kafka', 'messaging', 'consumer-lag', 'notifications', 'dlq'],
        'https://runbooks.internal/kafka-dlq-routing',
        array_fill(0.018, ARRAY[1536])::vector(1536)
    )
ON CONFLICT (id) DO UPDATE SET
    use_count = EXCLUDED.use_count,
    last_used_at = NOW();
