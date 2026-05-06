-- REDESIGN: PROJECT-CENTRIC MODEL SCHEMA
-- This migration creates the tables required for the new Evangelista Intelligence Platform workspace.

-- 1. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    area TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'scoping',
    current_phase TEXT NOT NULL DEFAULT 'scoping',
    complexity_alpha NUMERIC DEFAULT 0,
    complexity_beta NUMERIC DEFAULT 0,
    gamma_sources NUMERIC DEFAULT 1.0,
    base_price NUMERIC,
    total_price NUMERIC,
    travel_expenses NUMERIC DEFAULT 0,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Project Phases Table
CREATE TABLE IF NOT EXISTS public.project_phases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    phase_name TEXT NOT NULL,
    phase_order INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pendiente',
    responsible TEXT,
    notes TEXT,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Data Sources Table
CREATE TABLE IF NOT EXISTS public.data_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    source_type TEXT NOT NULL,
    connection_config JSONB DEFAULT '{}',
    access_mode TEXT DEFAULT 'read_only',
    status TEXT DEFAULT 'sin_probar',
    last_tested_at TIMESTAMP WITH TIME ZONE,
    last_test_result TEXT,
    authorized_tables TEXT[],
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Hypotheses Table
CREATE TABLE IF NOT EXISTS public.hypotheses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    statement TEXT NOT NULL,
    framework_used TEXT,
    area TEXT,
    hypothesis_type TEXT,
    status TEXT DEFAULT 'planteada',
    evidence TEXT,
    economic_impact NUMERIC,
    impact_score NUMERIC,
    parent_hypothesis_id UUID REFERENCES public.hypotheses(id) ON DELETE SET NULL,
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Interview Notes Table
CREATE TABLE IF NOT EXISTS public.interview_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    session_title TEXT NOT NULL,
    content TEXT NOT NULL,
    interviewer TEXT NOT NULL,
    interviewee TEXT,
    interview_type TEXT,
    captured_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    location TEXT,
    alcoa_hash TEXT,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Findings Table
CREATE TABLE IF NOT EXISTS public.findings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    data_source_id UUID REFERENCES public.data_sources(id) ON DELETE SET NULL,
    folio TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    technical_description TEXT,
    severity TEXT NOT NULL,
    area TEXT,
    economic_impact NUMERIC,
    economic_impact_basis TEXT,
    recommended_action TEXT,
    evidence TEXT,
    hash_md5 TEXT,
    git_commit TEXT,
    captured_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'identificado'
);

-- 7. Deliverables Table
CREATE TABLE IF NOT EXISTS public.deliverables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    deliverable_type TEXT NOT NULL,
    title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'borrador',
    file_url TEXT,
    file_name TEXT,
    version INTEGER DEFAULT 1,
    notes TEXT,
    generated_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Project Activity Log Table
CREATE TABLE IF NOT EXISTS public.project_activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL,
    entity_type TEXT,
    entity_id UUID,
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    performed_by_name TEXT,
    performed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Basic RLS Policies (Allow all for authenticated users during transition)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for authenticated" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.project_phases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for authenticated" ON public.project_phases FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.data_sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for authenticated" ON public.data_sources FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.hypotheses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for authenticated" ON public.hypotheses FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.interview_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for authenticated" ON public.interview_notes FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.findings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for authenticated" ON public.findings FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.deliverables ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for authenticated" ON public.deliverables FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.project_activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for authenticated" ON public.project_activity_log FOR ALL TO authenticated USING (true) WITH CHECK (true);
