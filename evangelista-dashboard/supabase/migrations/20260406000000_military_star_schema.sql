-- Supabase Military-Grade Data Model (Star Schema)
-- Creates Core operational schema and Blind/Audit recovery schema

-- 1. Create Logical Schemas
CREATE SCHEMA IF NOT EXISTS core;
CREATE SCHEMA IF NOT EXISTS audit;

-- 2. Grant Permissions
-- 'core' is accessible to authenticated users (through Supabase API / authenticated role)
GRANT USAGE ON SCHEMA core TO authenticated;
GRANT USAGE ON SCHEMA core TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA core TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA core TO service_role;
-- 'audit' is restricted (blind to public API, accessible only to triggers and service_role)
GRANT USAGE ON SCHEMA audit TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA audit TO service_role;


-- ==========================================
-- CORE SCHEMA: DIMENSIONS & FACTS
-- ==========================================

-- Dimension: Clients
CREATE TABLE core.dim_clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    sector TEXT,
    factor_gamma NUMERIC,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dimension: Queries (Engagements / Simulations)
CREATE TABLE core.dim_queries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES core.dim_clients(id) ON DELETE CASCADE,
    query_type TEXT NOT NULL, -- e.g., 'monte_carlo', 'rag_extraction'
    parameters JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dimension: Agents
CREATE TABLE core.dim_agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    version TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fact: Analysis Results
CREATE TABLE core.fact_analysis_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES core.dim_clients(id) ON DELETE CASCADE,
    query_id UUID NOT NULL REFERENCES core.dim_queries(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES core.dim_agents(id) ON DELETE SET NULL,
    confidence_score NUMERIC,
    output_text TEXT,
    latency_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- ==========================================
-- AUDIT SCHEMA: DISASTER RECOVERY LOGS
-- ==========================================

-- Audit: Clients Snapshot
CREATE TABLE audit.log_clients (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action TEXT NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    client_id UUID NOT NULL,
    payload JSONB NOT NULL,
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit: Queries Snapshot
CREATE TABLE audit.log_queries (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action TEXT NOT NULL,
    query_id UUID NOT NULL,
    payload JSONB NOT NULL,
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit: Facts Snapshot
CREATE TABLE audit.log_analysis_results (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action TEXT NOT NULL,
    fact_id UUID NOT NULL,
    payload JSONB NOT NULL,
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- ==========================================
-- RLS (ROW LEVEL SECURITY)
-- ==========================================

-- Force RLS on audit tables to completely block unauthorized operations
ALTER TABLE audit.log_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit.log_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit.log_analysis_results ENABLE ROW LEVEL SECURITY;

-- Block all direct usage from public/authenticated users. 
-- Policies exclusively allow 'postgres' and 'service_role' (bypasses RLS by default) 
-- No policies defined for 'authenticated' = Implicit DENY ALL for the web/app tier.


-- ==========================================
-- PL/pgSQL TRIGGERS FOR AUTOMATED AUDITING
-- ==========================================

-- Trigger Function: Client Audit
CREATE OR REPLACE FUNCTION audit.fn_log_clients()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        INSERT INTO audit.log_clients (action, client_id, payload)
        VALUES ('DELETE', OLD.id, row_to_json(OLD)::jsonb);
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO audit.log_clients (action, client_id, payload)
        VALUES ('UPDATE', NEW.id, row_to_json(NEW)::jsonb);
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO audit.log_clients (action, client_id, payload)
        VALUES ('INSERT', NEW.id, row_to_json(NEW)::jsonb);
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER tr_audit_clients
AFTER INSERT OR UPDATE OR DELETE ON core.dim_clients
FOR EACH ROW EXECUTE FUNCTION audit.fn_log_clients();

-- Trigger Function: Queries Audit
CREATE OR REPLACE FUNCTION audit.fn_log_queries()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        INSERT INTO audit.log_queries (action, query_id, payload)
        VALUES ('DELETE', OLD.id, row_to_json(OLD)::jsonb);
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO audit.log_queries (action, query_id, payload)
        VALUES ('UPDATE', NEW.id, row_to_json(NEW)::jsonb);
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO audit.log_queries (action, query_id, payload)
        VALUES ('INSERT', NEW.id, row_to_json(NEW)::jsonb);
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER tr_audit_queries
AFTER INSERT OR UPDATE OR DELETE ON core.dim_queries
FOR EACH ROW EXECUTE FUNCTION audit.fn_log_queries();

-- Trigger Function: Facts Audit
CREATE OR REPLACE FUNCTION audit.fn_log_facts()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        INSERT INTO audit.log_analysis_results (action, fact_id, payload)
        VALUES ('DELETE', OLD.id, row_to_json(OLD)::jsonb);
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO audit.log_analysis_results (action, fact_id, payload)
        VALUES ('UPDATE', NEW.id, row_to_json(NEW)::jsonb);
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO audit.log_analysis_results (action, fact_id, payload)
        VALUES ('INSERT', NEW.id, row_to_json(NEW)::jsonb);
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER tr_audit_facts
AFTER INSERT OR UPDATE OR DELETE ON core.fact_analysis_results
FOR EACH ROW EXECUTE FUNCTION audit.fn_log_facts();
