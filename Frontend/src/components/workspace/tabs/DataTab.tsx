import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Plus, RefreshCw, AlertCircle, ShieldCheck } from 'lucide-react';
import { Project, DataSource } from '../../../lib/types';
import { dataSourcesDB, projectActivityLogDB } from '../../../lib/supabase';
import { api } from '../../../lib/api';
import { useAuthStore } from '../../../stores/authStore';
import Button from '../../ui/Button';
import { Spinner } from '../../ui/Spinner';
import DataSourceCard from '../DataSourceCard';
import { AddDataSourceModal } from '../AddDataSourceModal';

interface DataTabProps {
  project: Project;
}

export default function DataTab({ project }: DataTabProps) {
  const [sources, setSources] = useState<DataSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSource, setEditingSource] = useState<DataSource | null>(null);
  const [testingId, setTestingId] = useState<string | null>(null);
  const { user } = useAuthStore();

  const loadSources = async () => {
    setLoading(true);
    try {
      const { data, error } = await dataSourcesDB.getByProject(project.id);
      if (error) throw error;
      setSources(data || []);
    } catch (error) {
      console.error('Error loading sources:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSources();
  }, [project.id]);

  const handleSaveSource = async (formData: any) => {
    try {
      const sourceData = {
        project_id: project.id,
        client_id: project.client_id,
        name: formData.name,
        source_type: formData.source_type,
        connection_config: formData.config,
        access_mode: 'read_only' as const,
        status: 'sin_probar' as const,
        authorized_tables: formData.authorized_tables,
        notes: formData.notes,
      };

      if (editingSource) {
        const { error } = await dataSourcesDB.update(editingSource.id, sourceData);
        if (error) throw error;
      } else {
        const { data, error } = await dataSourcesDB.create(sourceData);
        if (error) throw error;
        
        if (data) {
          await projectActivityLogDB.log({
            project_id: project.id,
            action_type: 'data_source_created',
            entity_type: 'data_sources',
            entity_id: data.id,
            description: `Fuente de datos "${data.name}" registrada`,
            performed_by_name: user?.email?.split('@')[0] || 'Consultor',
          });
        }
      }
      
      await loadSources();
    } catch (error) {
      console.error('Error saving source:', error);
      throw error;
    }
  };

  const handleTest = async (source: DataSource) => {
    setTestingId(source.id);
    try {
      // LLamada al backend para probar conectividad real
      const res = await api.post<any>('/api/v1/erp-connections/test-direct', {
        source_type: source.source_type,
        connection_config: source.connection_config,
      });

      const newStatus = res.success ? 'conectado' : 'error';
      
      await dataSourcesDB.update(source.id, {
        status: newStatus,
        last_tested_at: new Date().toISOString(),
        last_test_result: res.message,
      });

      await projectActivityLogDB.log({
        project_id: project.id,
        action_type: 'data_source_tested',
        entity_type: 'data_sources',
        entity_id: source.id,
        description: `Prueba de conexión "${source.name}": ${res.success ? 'Exitosa' : 'Fallida'}`,
        performed_by_name: user?.email?.split('@')[0] || 'Consultor',
        metadata: { result: res.message }
      });

      await loadSources();
    } catch (error: any) {
      console.error('Error testing source:', error);
      await dataSourcesDB.update(source.id, {
        status: 'error',
        last_tested_at: new Date().toISOString(),
        last_test_result: error.message || 'Error de comunicación con el servidor',
      });
      await loadSources();
    } finally {
      setTestingId(null);
    }
  };

  const handleDelete = async (source: DataSource) => {
    if (!window.confirm(`¿Estás seguro de eliminar la fuente "${source.name}"?`)) return;
    
    try {
      const { error } = await dataSourcesDB.delete(source.id);
      if (error) throw error;

      await projectActivityLogDB.log({
        project_id: project.id,
        action_type: 'data_source_deleted',
        entity_type: 'data_sources',
        entity_id: source.id,
        description: `Fuente de datos "${source.name}" eliminada`,
        performed_by_name: user?.email?.split('@')[0] || 'Consultor',
      });

      await loadSources();
    } catch (error) {
      console.error('Error deleting source:', error);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-serif text-eva-black">Fuentes de Datos</h3>
          <p className="text-sm text-eva-txt-muted font-medium">Gestión de conexiones seguras y bóveda de credenciales bajo protocolo ALCOA+.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={loadSources} className="text-eva-txt-faint hover:text-eva-olive transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button 
            variant="primary" 
            onClick={() => { setEditingSource(null); setShowModal(true); }}
            className="bg-eva-olive hover:bg-eva-olive-2 text-white font-bold uppercase tracking-widest text-[10px] shadow-md"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Fuente
          </Button>
        </div>
      </div>

      {loading && sources.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4">
          <Spinner size="md" />
          <p className="text-[10px] uppercase tracking-[0.2em] text-eva-txt-faint font-bold">Accediendo a la bóveda...</p>
        </div>
      ) : sources.length === 0 ? (
        <div className="py-20 border-2 border-dashed border-eva-border rounded-2xl flex flex-col items-center justify-center text-center bg-white/50 shadow-inner">
           <Database className="w-12 h-12 text-eva-txt-faint mb-4" />
           <h4 className="text-lg font-serif text-eva-txt-muted mb-2 font-bold">No hay fuentes configuradas</h4>
           <p className="text-xs text-eva-txt-faint max-w-xs mb-8 leading-relaxed font-medium">
             Para iniciar el análisis estratégico, primero debemos establecer una conexión segura a los sistemas del cliente.
           </p>
           <Button variant="outline" onClick={() => setShowModal(true)} className="border-eva-border text-eva-txt-mid font-bold hover:bg-white shadow-sm">
             Configurar Primera Fuente
           </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {sources.map(source => (
              <DataSourceCard 
                key={source.id}
                source={source}
                onTest={() => handleTest(source)}
                onEdit={() => { setEditingSource(source); setShowModal(true); }}
                onDelete={() => handleDelete(source)}
                isTesting={testingId === source.id}
              />
            ))}
          </AnimatePresence>
          
          <button 
            onClick={() => { setEditingSource(null); setShowModal(true); }}
            className="group rounded-2xl border-2 border-dashed border-eva-border hover:border-eva-olive/30 transition-all p-8 flex flex-col items-center justify-center text-center opacity-40 hover:opacity-100 bg-white shadow-sm hover:shadow-md"
          >
            <Plus className="w-8 h-8 mb-2 text-eva-txt-faint group-hover:scale-110 transition-transform group-hover:text-eva-olive" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-eva-txt-faint group-hover:text-eva-olive">Vincular Nueva Fuente</span>
          </button>
        </div>
      )}

      <div className="p-6 rounded-2xl bg-white border border-eva-border flex items-start gap-6 shadow-sm">
        <div className="w-12 h-12 rounded-xl bg-eva-olive/10 flex items-center justify-center shrink-0 border border-eva-olive/20 shadow-sm">
           <ShieldCheck className="w-6 h-6 text-eva-olive" />
        </div>
        <div className="space-y-2">
           <h4 className="text-sm font-bold text-eva-black uppercase tracking-widest">Seguridad de Nivel Consultoría</h4>
           <p className="text-xs text-eva-txt-muted font-medium leading-relaxed max-w-3xl">
             Evangelista Intelligence Platform utiliza un esquema de **Zero-Trust Connection**. Las credenciales se almacenan cifradas en el Vault de Supabase y solo se descifran en memoria volátil al momento de ejecutar pruebas o extracciones. Toda comunicación hacia sistemas del cliente es estrictamente en modo **Solo Lectura**.
           </p>
        </div>
      </div>

      <AddDataSourceModal 
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveSource}
        initialData={editingSource}
      />
    </div>
  );
}
