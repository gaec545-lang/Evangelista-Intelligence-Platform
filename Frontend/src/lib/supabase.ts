import { apiClient } from './apiClient';
import type { 
  Client, Analysis, Proposal, TeamMember, FoundationEngagement, ArchitectureProject, SentinelSubscription,
  Project, ProjectPhase, DataSource, Hypothesis, InterviewNote, Finding, Deliverable, ProjectActivityLog,
  ProjectWorkstream, WorkstreamTask, ProjectReport, ProjectPayment, PhaseTransition, ProjectClosure,
  TimeEntry
} from './types';

export const supabase = null;
export const getSupabase = () => null;

function createProxy(table: string) {
  return {
    async list(...args: any[]): Promise<any[]> { return apiClient.get<any[]>(`/api/v1/${table}`); },
    async get(id: string): Promise<any> { return apiClient.get<any>(`/api/v1/${table}/${id}`); },
    async getById(id: string): Promise<any> { return apiClient.get<any>(`/api/v1/${table}/${id}`); },
    async create(data: any): Promise<any> { return apiClient.post<any>(`/api/v1/${table}`, data); },
    async update(id: string, data: any): Promise<any> { return apiClient.put<any>(`/api/v1/${table}/${id}`, data); },
    async delete(id: string): Promise<void> { return apiClient.delete<void>(`/api/v1/${table}/${id}`); },
    async getByClient(clientId: string): Promise<any[]> { return apiClient.get<any[]>(`/api/v1/${table}?client_id=${clientId}`); },
    async getByProject(projectId: string): Promise<any[]> { return apiClient.get<any[]>(`/api/v1/${table}?project_id=${projectId}`); },
    async log(data: any): Promise<any> { return apiClient.post<any>(`/api/v1/${table}`, data); },
    async getPhases(projectId: string): Promise<any[]> { return apiClient.get<any[]>(`/api/v1/${table}_phases?project_id=${projectId}`); },
    async createPhase(data: any): Promise<any> { return apiClient.post<any>(`/api/v1/${table}_phases`, data); },
    async updatePhase(id: string, data: any): Promise<any> { return apiClient.put<any>(`/api/v1/${table}_phases/${id}`, data); },
    async deletePhase(id: string): Promise<void> { return apiClient.delete<void>(`/api/v1/${table}_phases/${id}`); },
    async getPhase(id: string): Promise<any> { return apiClient.get<any>(`/api/v1/${table}_phases/${id}`); }
  } as any;
}

export const clientsDB = createProxy('clients');
export const analysesDB = createProxy('analyses');
export const proposalsDB = createProxy('proposals');
export const teamDB = createProxy('team');
export const foundationDB = createProxy('foundation');
export const architectureDB = createProxy('architecture');
export const sentinelDB = createProxy('sentinel');
export const activityLogDB = createProxy('activity_log');
export const projectsDB = createProxy('projects');
export const dataSourcesDB = createProxy('data_sources');
export const deliverablesDB = createProxy('deliverables');
export const projectActivityLogDB = createProxy('project_activity_log');
export const interviewNotesDB = createProxy('interview_notes');
export const hypothesesDB = createProxy('hypotheses');
export const findingsDB = createProxy('findings');
export const workstreamsDB = createProxy('workstreams');
export const tasksDB = createProxy('tasks');
export const reportsDB = createProxy('reports');
export const paymentsDB = createProxy('payments');
export const phaseTransitionsDB = createProxy('phase_transitions');
export const closureDB = createProxy('closure');
export const timeTrackerDB = createProxy('time_tracker');
