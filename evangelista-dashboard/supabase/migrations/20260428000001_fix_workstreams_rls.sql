-- Fix RLS policies for workstreams and related tables to be more permissive (allow all authenticated users)
-- This resolves issues where users not explicitly listed in team_members could not create workstreams.

-- 1. project_workstreams
DROP POLICY IF EXISTS "team_access" ON project_workstreams;
CREATE POLICY "team_access" ON project_workstreams
  FOR ALL USING (auth.uid() IS NOT NULL);

-- 2. workstream_tasks
DROP POLICY IF EXISTS "team_access" ON workstream_tasks;
CREATE POLICY "team_access" ON workstream_tasks
  FOR ALL USING (auth.uid() IS NOT NULL);

-- 3. workstream_members
DROP POLICY IF EXISTS "team_access" ON workstream_members;
CREATE POLICY "team_access" ON workstream_members
  FOR ALL USING (auth.uid() IS NOT NULL);

-- 4. project_reports
DROP POLICY IF EXISTS "team_access" ON project_reports;
CREATE POLICY "team_access" ON project_reports
  FOR ALL USING (auth.uid() IS NOT NULL);
