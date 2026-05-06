import { useState, useEffect } from 'react';
import { projectsDB } from '../lib/supabase';
import { Project, ProjectPhase } from '../lib/types';

export const useProjects = (clientId?: string) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = clientId 
        ? await projectsDB.getByClient(clientId)
        : await projectsDB.list();
        
      setProjects(data as Project[]);
    } catch (err: any) {
      console.error('Error loading projects:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [clientId]);

  return { projects, loading, error, reload: load };
};

export const useProject = (projectId?: string) => {
  const [project, setProject] = useState<Project | null>(null);
  const [phases, setPhases] = useState<ProjectPhase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('📡 Cargando proyecto:', projectId);
      const data = await projectsDB.getById(projectId);
      
      if (!data) throw new Error('El proyecto no existe.');
      
      setProject(data);

      const pData = await projectsDB.getPhases(projectId);
      setPhases(pData || []);
      
      console.log('✅ Proyecto cargado con éxito');
    } catch (err: any) {
      console.error('❌ Error cargando proyecto:', err);
      setError(err.message || 'Error de conexión con la base de datos');
      setProject(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [projectId]);

  return { project, phases, loading, error, reload: load };
};
