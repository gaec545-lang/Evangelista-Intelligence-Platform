import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  ChevronRight, 
  Clock, 
  User, 
  Database,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';
import { useProjects } from '../hooks/useProjects';
import { Project, ProjectStatus } from '../lib/types';

const ProjectsListPage: React.FC = () => {
  const { projects, loading, error } = useProjects();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Stats calculation
  const stats = useMemo(() => {
    if (!projects) return { execution: 0, scoping: 0, proposals: 0, completed: 0 };
    return {
      execution: projects.filter(p => p.status === 'en_ejecucion').length,
      scoping: projects.filter(p => p.status === 'scoping').length,
      proposals: projects.filter(p => p.status === 'propuesta_enviada').length,
      completed: projects.filter(p => p.status === 'completado').length,
    };
  }, [projects]);

  // Filtering
  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    return projects.filter(project => {
      const matchesSearch = 
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.clients?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [projects, searchTerm, statusFilter]);

  const getStatusVariant = (status: ProjectStatus): any => {
    switch (status) {
      case 'en_ejecucion': return 'info';
      case 'completado': return 'success';
      case 'scoping': return 'primary';
      case 'propuesta_enviada': return 'warning';
      case 'pausado': return 'neutral';
      case 'cancelado': return 'danger';
      default: return 'neutral';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.replace(/_/g, ' ').toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)]">
        <Spinner size="lg" />
        <p className="mt-4 text-eva-txt-muted font-mono text-xs uppercase tracking-widest animate-pulse">Sincronizando Engagements...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-serif text-eva-black mb-2">Proyectos</h1>
          <p className="text-eva-txt-mid font-medium">Gestiona todos los engagements activos y el pipeline de consultoría.</p>
        </div>
        <Button variant="primary" className="bg-eva-olive hover:bg-eva-olive-2 text-white shadow-lg">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Proyecto
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'En Ejecución', value: stats.execution, color: 'text-architecture', border: 'border-l-service-architecture' },
          { label: 'Scoping', value: stats.scoping, color: 'text-foundation', border: 'border-l-service-foundation' },
          { label: 'Propuestas', value: stats.proposals, color: 'text-eva-gold', border: 'border-l-eva-gold' },
          { label: 'Completados', value: stats.completed, color: 'text-sentinel', border: 'border-l-service-sentinel' },
        ].map((stat, i) => (
          <Card key={i} className={`p-4 bg-white border-eva-border shadow-sm border-l-4 ${stat.border}`}>
            <p className="text-eva-txt-muted text-[10px] uppercase tracking-wider mb-1 font-bold font-mono">{stat.label}</p>
            <p className={`text-3xl font-serif ${stat.color}`}>{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-eva-beige-2 p-2 rounded-lg border border-eva-border-2">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-eva-txt-muted" />
          <input 
            type="text" 
            placeholder="Buscar por proyecto o cliente..." 
            className="w-full bg-transparent border-none focus:ring-0 text-eva-txt-dark pl-10 placeholder:text-eva-txt-faint text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select 
            className="bg-white border-eva-border text-eva-txt-mid text-xs rounded-md focus:ring-eva-olive py-1"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Todos los estados</option>
            <option value="scoping">Scoping</option>
            <option value="propuesta_enviada">Propuesta</option>
            <option value="en_ejecucion">En Ejecución</option>
            <option value="completado">Completado</option>
          </select>
          <Button variant="ghost" size="sm" className="text-eva-txt-muted hover:text-eva-txt-dark hover:bg-eva-beige-3">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
        </div>
      </div>

      {/* Projects List */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                layout
              >
                <Link to={`/dashboard/projects/${project.id}`}>
                  <Card className="group p-5 bg-white border-eva-border hover:border-eva-olive hover:shadow-md transition-all duration-300">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-eva-olive-light rounded-lg group-hover:bg-eva-olive/10 transition-colors">
                            <Briefcase className="w-5 h-5 text-eva-olive" />
                          </div>
                          <div>
                            <h3 className="text-lg text-eva-black font-serif leading-tight group-hover:text-eva-olive transition-colors">
                              {project.name}
                            </h3>
                            <p className="text-eva-txt-muted text-xs flex items-center gap-1.5 mt-1 font-medium">
                              <User className="w-3 h-3" />
                              {project.clients?.name || 'Cliente no especificado'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-xs text-eva-txt-muted font-mono uppercase tracking-tight">
                          <div className="flex items-center gap-1.5 bg-eva-beige-2 px-2 py-1 rounded text-eva-txt-dark font-bold">
                            <Database className="w-3.5 h-3.5" />
                            {project.area.replace('_', ' ')}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            Fase: <span className="text-eva-txt-mid font-bold">{project.current_phase}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(project.created_at).toLocaleDateString('es-MX', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 shrink-0">
                        <Badge variant={getStatusVariant(project.status)} size="md">
                          {getStatusLabel(project.status)}
                        </Badge>
                        <div className="flex items-center text-eva-txt-muted group-hover:text-eva-olive group-hover:translate-x-1 transition-all">
                          <span className="text-[10px] uppercase tracking-widest font-bold mr-1 hidden md:inline">Abrir Workspace</span>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-eva-border rounded-2xl bg-white/50"
        >
          <div className="w-20 h-20 bg-eva-beige-2 rounded-full flex items-center justify-center mb-6 ring-1 ring-eva-border">
            {searchTerm || statusFilter !== 'all' ? (
              <AlertCircle className="w-10 h-10 text-eva-txt-faint" />
            ) : (
              <Briefcase className="w-10 h-10 text-eva-txt-faint" />
            )}
          </div>
          <h3 className="text-2xl text-eva-txt-dark font-serif mb-3">
            {searchTerm || statusFilter !== 'all' ? 'Sin coincidencias' : 'No hay proyectos que mostrar'}
          </h3>
          <p className="text-eva-txt-muted max-w-sm text-center mb-8 leading-relaxed font-medium">
            {searchTerm || statusFilter !== 'all' 
              ? 'Prueba ajustando tus términos de búsqueda o filtros para encontrar lo que necesitas.'
              : 'Comienza creando un nuevo proyecto para centralizar tus hallazgos, hipótesis y entregables.'}
          </p>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="border-eva-border text-eva-txt-mid hover:bg-eva-beige-2">
              Ver Clientes
            </Button>
            <Button variant="primary" className="bg-eva-olive hover:bg-eva-olive-2 text-white shadow-md">
              <Plus className="w-4 h-4 mr-2" />
              Crear Primer Proyecto
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProjectsListPage;

