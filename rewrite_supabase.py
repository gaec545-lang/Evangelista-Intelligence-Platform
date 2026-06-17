import re

with open('/Volumes/Adriel-SSD/Evangelista & Co/Evangelista Intelligence Platform/Frontend/src/lib/supabase.ts', 'r') as f:
    lines = f.readlines()

out = []
in_db = False
db_name = None

out.append("import { apiClient } from './apiClient';\n")
out.append("export const supabase = null;\nexport const getSupabase = () => null;\n")

# Copy the types
types_import = ""
for line in lines:
    if "import type" in line or "from './types'" in line or "Client," in line or "Project," in line or "Analysis," in line:
        out.append(line)

# Let's extract all export const XXXXDB = {
dbs = []
for line in lines:
    m = re.match(r"^export const ([a-zA-Z0-9_]+DB)\s*=\s*\{", line)
    if m:
        dbs.append(m.group(1))

proxy_code = """
function createProxy(table: string) {
  return {
    async list(...args: any[]): Promise<any[]> { return apiClient.get<any[]>(`/api/v1/${table}`); },
    async get(id: string): Promise<any> { return apiClient.get<any>(`/api/v1/${table}/${id}`); },
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
"""
out.append(proxy_code)

for db in dbs:
    table = db.replace('DB', '').lower()
    if table.endswith('s') and table != 'analysis':
        table = table # keep it as is?
    out.append(f"export const {db} = createProxy('{table}');\n")

with open('/Volumes/Adriel-SSD/Evangelista & Co/Evangelista Intelligence Platform/Frontend/src/lib/supabase.ts', 'w') as f:
    f.writelines(out)
