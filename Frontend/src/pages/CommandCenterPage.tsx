import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Users, DollarSign, AlertTriangle, Clock, ChevronRight, CheckCircle2 } from 'lucide-react';
import { supabase, clientsDB, projectsDB } from '../lib/supabase';
import { Spinner } from '../components/ui/Spinner';

export const CommandCenterPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalProjects: 0,
    totalCOI: 0,
    nextTouchpoint: 'Ninguno',
    pendingVetting: 0
  });
  const [activeProjects, setActiveProjects] = useState<any[]>([]);
  const [expiredClients, setExpiredClients] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Fetch Projects
        const projects = await projectsDB.list();
        const active = projects.filter(p => p.status !== 'completado' && p.status !== 'cancelado');
        
        // Sum total COI (total_price) across active projects
        const totalCOI = active.reduce((sum, p) => sum + (p.total_price || p.base_price || 0), 0);

        // Sort active projects by updated_at descending
        const sortedActive = [...active].sort((a, b) => 
          new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime()
        );

        // 2. Fetch Clients
        const clients = await clientsDB.list();
        const activeClientsCount = clients.filter(c => c.status === 'active').length;

        // Find clients with touchpoint expired (> 30 days since updated_at/created_at)
        const expired = clients.filter(client => {
          const lastContact = new Date(client.updated_at || client.created_at);
          const daysSinceContact = Math.floor((Date.now() - lastContact.getTime()) / (1000 * 3600 * 24));
          return daysSinceContact > 30;
        });

        // 3. Fetch Findings pending vetting gate (status = 'identificado')
        const { data: findings } = await supabase
          .from('findings')
          .select('id')
          .eq('status', 'identificado');
        const pendingVettingCount = findings?.length || 0;

        setMetrics({
          totalProjects: active.length,
          totalCOI,
          nextTouchpoint: active.length > 0 ? 'Revisión Pendiente' : 'Ninguno',
          pendingVetting: pendingVettingCount
        });
        setActiveProjects(sortedActive.slice(0, 5));
        setExpiredClients(expired);
      } catch (err) {
        console.error('Error fetching CommandCenter data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-[var(--eva-black)]">
        <Spinner size="lg" />
        <p className="text-xs text-[var(--eva-txt-muted)] uppercase tracking-widest">Sincronizando Command Center...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--eva-black)] text-[var(--eva-txt-primary)] p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        
        {/* Header */}
        <header className="border-b border-[var(--eva-border)] pb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-[var(--eva-olive)] animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--eva-txt-muted)]">
              Operational war room
            </span>
          </div>
          <h1 className="font-brand text-3xl font-medium text-white leading-tight">Command Center</h1>
          <p className="font-ui text-sm text-[var(--eva-txt-secondary)] mt-1">
            Resumen ejecutivo e indicadores clave de rendimiento del portafolio.
          </p>
        </header>

        {/* McKinsey 4-Metric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Active Projects */}
          <div className="bg-[var(--eva-surface)] border border-[var(--eva-border)] rounded-xl p-6 flex flex-col justify-between shadow-card hover:border-[var(--eva-olive)]/35 transition-all">
            <div className="flex items-center justify-between text-[var(--eva-txt-muted)] mb-4">
              <span className="font-mono text-[10px] uppercase tracking-wider">Engagements Activos</span>
              <Briefcase size={16} />
            </div>
            <div>
              <p className="text-4xl font-light text-white font-ui">{metrics.totalProjects}</p>
              <p className="text-[11px] text-[var(--eva-txt-secondary)] mt-2 font-ui">Proyectos en ejecución</p>
            </div>
          </div>

          {/* Pipeline Value */}
          <div className="bg-[var(--eva-surface)] border border-[var(--eva-border)] rounded-xl p-6 flex flex-col justify-between shadow-card hover:border-[var(--eva-gold)]/35 transition-all">
            <div className="flex items-center justify-between text-[var(--eva-txt-muted)] mb-4">
              <span className="font-mono text-[10px] uppercase tracking-wider">COI Identificado</span>
              <DollarSign size={16} className="text-[var(--eva-gold)]" />
            </div>
            <div>
              <p className="text-3xl font-mono font-bold text-[var(--eva-gold)]">
                ${metrics.totalCOI.toLocaleString()} <span className="text-xs font-light">MXN</span>
              </p>
              <p className="text-[11px] text-[var(--eva-txt-secondary)] mt-2 font-ui">Valor capturado acumulado</p>
            </div>
          </div>

          {/* Next Touchpoint */}
          <div className="bg-[var(--eva-surface)] border border-[var(--eva-border)] rounded-xl p-6 flex flex-col justify-between shadow-card hover:border-[var(--eva-olive)]/35 transition-all">
            <div className="flex items-center justify-between text-[var(--eva-txt-muted)] mb-4">
              <span className="font-mono text-[10px] uppercase tracking-wider">Próximo Touchpoint</span>
              <Clock size={16} />
            </div>
            <div>
              <p className="text-xl font-medium text-white truncate font-brand italic">{metrics.nextTouchpoint}</p>
              <p className="text-[11px] text-[var(--eva-txt-secondary)] mt-2 font-ui">Seguimiento de relaciones</p>
            </div>
          </div>

          {/* Pending Vetting */}
          <div className="bg-[var(--eva-surface)] border border-[var(--eva-border)] rounded-xl p-6 flex flex-col justify-between shadow-card hover:border-red-500/20 transition-all">
            <div className="flex items-center justify-between text-[var(--eva-txt-muted)] mb-4">
              <span className="font-mono text-[10px] uppercase tracking-wider">Hallazgos sin Vetting</span>
              <AlertTriangle size={16} className="text-red-400" />
            </div>
            <div>
              <p className="text-4xl font-light text-red-400 font-ui">{metrics.pendingVetting}</p>
              <p className="text-[11px] text-[var(--eva-txt-secondary)] mt-2 font-ui">Pendientes de validación gate</p>
            </div>
          </div>
        </div>

        {/* Main Content Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
          
          {/* Active Projects Table (2/3) */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-brand font-medium flex items-center gap-2 border-b border-[var(--eva-border)] pb-2 text-white">
              <Clock className="text-[var(--eva-txt-secondary)]" size={18} />
              Engagements Activos Recientes
            </h2>
            <div className="bg-[var(--eva-surface)] border border-[var(--eva-border)] rounded-xl overflow-hidden shadow-card">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[var(--eva-surface-2)] border-b border-[var(--eva-border)] text-[var(--eva-txt-secondary)] text-xs font-mono uppercase">
                      <th className="py-3.5 px-5 font-semibold">Proyecto</th>
                      <th className="py-3.5 px-5 font-semibold">Cliente</th>
                      <th className="py-3.5 px-5 font-semibold">Fase / Tab</th>
                      <th className="py-3.5 px-5 font-semibold">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--eva-border)] text-sm">
                    {activeProjects.map((project) => (
                      <tr key={project.id} className="hover:bg-[var(--eva-surface-2)]/40 transition-colors">
                        <td className="py-4 px-5 font-medium text-white">{project.name}</td>
                        <td className="py-4 px-5 text-[var(--eva-txt-secondary)]">{project.clients?.name || 'Cliente'}</td>
                        <td className="py-4 px-5">
                          <span className="px-2.5 py-0.5 text-xs font-semibold rounded bg-[#4a5c3a20] text-[var(--eva-olive)] border border-[var(--eva-olive)]/20">
                            {project.current_phase}
                          </span>
                        </td>
                        <td className="py-4 px-5">
                          <button 
                            onClick={() => navigate(`/dashboard/proyectos/${project.id}`)}
                            className="flex items-center gap-1 text-xs text-[var(--eva-olive)] hover:text-white transition-colors"
                          >
                            Abrir <ChevronRight size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {activeProjects.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-[var(--eva-txt-muted)] font-ui">
                          No hay proyectos activos en este momento.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Expired Touchpoints Sidebar (1/3) */}
          <div className="space-y-4">
            <h2 className="text-lg font-brand font-medium flex items-center gap-2 border-b border-[var(--eva-border)] pb-2 text-white">
              <AlertTriangle className="text-red-400" size={18} />
              Touchpoints Vencidos
            </h2>
            <div className="bg-[var(--eva-surface)] border border-[var(--eva-border)] rounded-xl p-5 shadow-card space-y-4">
              <p className="text-[11px] text-[var(--eva-txt-muted)] font-mono uppercase tracking-wider">
                Clientes sin contacto &gt; 30 días
              </p>
              <div className="space-y-3">
                {expiredClients.map((client) => {
                  const lastContact = new Date(client.updated_at || client.created_at);
                  const days = Math.floor((Date.now() - lastContact.getTime()) / (1000 * 3600 * 24));
                  return (
                    <div 
                      key={client.id}
                      onClick={() => navigate(`/dashboard/clientes/${client.id}`)}
                      className="p-3 bg-[var(--eva-surface-2)] border border-[var(--eva-border)] hover:border-red-500/20 rounded-lg cursor-pointer transition-all hover:scale-[1.01]"
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-semibold text-white truncate max-w-[150px]">{client.name}</h4>
                        <span className="text-[10px] font-mono bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded">
                          Hace {days} días
                        </span>
                      </div>
                      <p className="text-xs text-[var(--eva-txt-secondary)] mt-1.5 font-ui">{client.sector}</p>
                    </div>
                  );
                })}
                {expiredClients.length === 0 && (
                  <div className="text-center py-8 text-[var(--eva-txt-muted)] space-y-3">
                    <CheckCircle2 size={32} className="text-[var(--eva-olive)] mx-auto opacity-60" />
                    <p className="text-xs font-ui">Todos los clientes están al corriente con sus touchpoints.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CommandCenterPage;
