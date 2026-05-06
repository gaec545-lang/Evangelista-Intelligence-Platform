import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Users, 
  Shield, 
  Activity,
  Calendar,
  Zap
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useClients } from '../hooks/useClients';
import type { TeamMember } from '../lib/types';
import { foundationDB, architectureDB, sentinelDB, activityLogDB, teamDB } from '../lib/supabase';
import MetricCard from '../components/ui/MetricCard';
import Card from '../components/ui/Card';
import Panel from '../components/ui/Panel';
import ServiceTag from '../components/ui/ServiceTag';
import { Button } from '../components/ui/Button';

export function DashboardPage() {
  const { user, teamMember, isRole } = useAuthStore();
  const { clients } = useClients();
  
  const [foundations, setFoundations] = useState<any[]>([]);
  const [architectures, setArchitectures] = useState<any[]>([]);
  const [sentinels, setSentinels] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = isRole('ceo') || user?.email === 'direccion@evangelistaco.com';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const promises: Promise<any>[] = [
          foundationDB.list(),
          architectureDB.list(),
          sentinelDB.list(),
          activityLogDB.list(10),
        ];

        if (isAdmin) {
          promises.push(teamDB.list());
        }

        const results = await Promise.all(promises);
        
        setFoundations(results[0] || []);
        setArchitectures(results[1] || []);
        setSentinels(results[2] || []);
        setActivities(results[3] || []);
        
        if (isAdmin) {
          setTeam(results[4] || []);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAdmin]);

  const activeFoundations = foundations.filter((f) => f && f.status && !f.status.startsWith('closed_'));
  const activeArchitectures = architectures.filter((a) => a && a.status && a.status !== 'completed' && a.status !== 'on_hold');
  const activeSentinels = sentinels.filter((s) => s && s.status === 'active');

  const today = new Date().toLocaleDateString('es-MX', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const renderConsultantView = () => (
    <div className="space-y-16 animate-fade-in pb-12">
      {/* Welcome Header & War Room Status */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-eva-gold opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-eva-gold"></span>
            </div>
            <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-eva-gold font-semibold">
              Command Center Activo
            </span>
          </div>
          <h1 className="font-brand text-4xl font-medium text-eva-black leading-tight">
            Buen día, <span className="italic">{user?.email?.split('@')[0] || 'Consultor'}</span>.
          </h1>
          <p className="font-ui text-[14px] text-eva-txt-muted mt-2 flex items-center gap-2">
            <Calendar size={15} />
            {today.charAt(0).toUpperCase() + today.slice(1)}
          </p>
        </div>
        
        <div className="flex gap-3">
          <Link to="/dashboard/analyze" aria-label="Ir a sección de Análisis Predictivo">
            <Button variant="primary" icon={<Plus size={16} />}>
              Desplegar Análisis Predictivo
            </Button>
          </Link>
        </div>
      </section>

      {/* Consultant KPIs Row */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-eva-border p-8 rounded-card-xl shadow-sm flex items-center gap-6 group hover:border-eva-gold transition-all duration-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-eva-gold/5 rounded-bl-full -mr-10 -mt-10 group-hover:scale-110 transition-transform" />
          <div className="w-14 h-14 rounded-2xl bg-eva-beige-2 flex items-center justify-center border border-eva-border/50">
            <Zap size={24} className="text-eva-gold" />
          </div>
          <div>
            <p className="font-ui text-[10px] uppercase tracking-[0.2em] text-eva-txt-faint font-black mb-1">Eficiencia de Análisis</p>
            <div className="flex items-baseline gap-3">
              <h3 className="font-serif text-[56px] leading-none font-bold tracking-tight text-eva-black">94.2%</h3>
              <span className="text-[10px] text-green-600 font-black bg-green-50 px-2 py-0.5 rounded-full border border-green-100">+2.1%</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-eva-border p-8 rounded-card-xl shadow-sm flex items-center gap-6 group hover:border-service-architecture transition-all duration-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-service-architecture/5 rounded-bl-full -mr-10 -mt-10 group-hover:scale-110 transition-transform" />
          <div className="w-14 h-14 rounded-2xl bg-eva-beige-2 flex items-center justify-center border border-eva-border/50">
            <CheckCircle size={24} className="text-service-architecture" />
          </div>
          <div>
            <p className="font-ui text-[10px] uppercase tracking-[0.2em] text-eva-txt-faint font-black mb-1">Dictámenes Entregados</p>
            <div className="flex items-baseline gap-3">
              <h3 className="font-serif text-[56px] leading-none font-bold tracking-tight text-eva-black">12</h3>
              <span className="text-[10px] text-eva-txt-muted font-bold tracking-tighter uppercase">Protocolo T-1</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-eva-border p-8 rounded-card-xl shadow-sm flex items-center gap-6 group hover:border-service-sentinel transition-all duration-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-service-sentinel/5 rounded-bl-full -mr-10 -mt-10 group-hover:scale-110 transition-transform" />
          <div className="w-14 h-14 rounded-2xl bg-eva-beige-2 flex items-center justify-center border border-eva-border/50">
            <Shield size={24} className="text-service-sentinel" />
          </div>
          <div>
            <p className="font-ui text-[10px] uppercase tracking-[0.2em] text-eva-txt-faint font-black mb-1">Alertas Neutralizadas</p>
            <div className="flex items-baseline gap-3">
              <h3 className="font-serif text-[56px] leading-none font-bold tracking-tight text-eva-black">8</h3>
              <span className="text-[10px] text-service-sentinel font-black bg-service-sentinel/5 px-2 py-0.5 rounded-full border border-service-sentinel/10">SECURITY OK</span>
            </div>
          </div>
        </div>
      </section>

      {/* Landing Page Fusion Banner */}
      <section className="relative overflow-hidden rounded-card-2xl bg-eva-black text-white shadow-md">
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
            <path d="M-10,50 C30,10 70,90 110,50" stroke="#b89a42" strokeWidth="0.5" fill="none" />
            <path d="M-10,80 C40,20 60,80 110,20" stroke="#3e4d32" strokeWidth="0.8" fill="none" />
          </svg>
        </div>
        
        <div className="relative z-10 p-10 md:p-14 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-eva-gold" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-eva-gold font-bold">Evangelista & Co.</span>
            </div>
            <h2 className="font-brand italic text-3xl md:text-4xl leading-tight mb-6 text-[#f9f7f2]">
              Estructuración de <span className="text-eva-gold not-italic">capital intelectual</span> y control operativo.
            </h2>
            <p className="font-ui text-[15px] text-white/70 leading-relaxed">
              No comercializamos licencias de software ni implementamos soluciones genéricas. 
              Ejecutamos un protocolo diseñado para transferir el control absoluto de los datos a la Dirección General.
            </p>
          </div>
          <div className="shrink-0 text-center lg:text-right border-t lg:border-t-0 lg:border-l border-white/10 pt-8 lg:pt-0 lg:pl-10">
            <p className="font-brand italic text-[22px] text-white/90 max-w-[220px] mx-auto lg:mx-0">
              "El costo de la certidumbre <br/><span className="text-eva-gold">se paga solo.</span>"
            </p>
          </div>
        </div>
      </section>

      {/* 3 Phases Marketing & Stats */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-eva-border shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-service-foundation/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
            <ServiceTag service="foundation" label="Fase 1" />
            <h3 className="font-brand text-xl font-medium mt-4 mb-2 text-eva-black">Auditoría Diagnóstica</h3>
            <p className="font-ui text-[13px] text-eva-txt-muted leading-relaxed mb-6 h-12">
              Evaluamos la integridad de fuentes y cuantificamos fugas de capital con evidencia irrefutable.
            </p>
          </div>
          <div className="pt-4 border-t border-eva-border flex items-center justify-between">
            <div>
              <p className="font-ui text-[10px] text-eva-txt-faint uppercase tracking-wider">Engagements</p>
              <p className="font-brand text-2xl font-bold text-service-foundation">{activeFoundations.length}</p>
            </div>
            <ArrowRight size={20} className="text-eva-border group-hover:text-service-foundation transition-colors" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-eva-border shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-service-architecture/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
            <ServiceTag service="architecture" label="Fase 2" />
            <h3 className="font-brand text-xl font-medium mt-4 mb-2 text-eva-black">Gobierno de Datos</h3>
            <p className="font-ui text-[13px] text-eva-txt-muted leading-relaxed mb-6 h-12">
              Infraestructura que consolida sistemas y crea ecosistemas segmentados para el C-Level.
            </p>
          </div>
          <div className="pt-4 border-t border-eva-border flex items-center justify-between">
            <div>
              <p className="font-ui text-[10px] text-eva-txt-faint uppercase tracking-wider">Proyectos Activos</p>
              <p className="font-brand text-2xl font-bold text-service-architecture">{activeArchitectures.length}</p>
            </div>
            <ArrowRight size={20} className="text-eva-border group-hover:text-service-architecture transition-colors" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-eva-border shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-service-sentinel/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
            <ServiceTag service="sentinel" label="Fase 3" />
            <h3 className="font-brand text-xl font-medium mt-4 mb-2 text-eva-black">Inteligencia Continua</h3>
            <p className="font-ui text-[13px] text-eva-txt-muted leading-relaxed mb-6 h-12">
              Protocolos de vigilancia sobre riesgos. El Consejo recibe alertas antes del cierre contable.
            </p>
          </div>
          <div className="pt-4 border-t border-eva-border flex items-center justify-between">
            <div>
              <p className="font-ui text-[10px] text-eva-txt-faint uppercase tracking-wider">Monitoreos</p>
              <p className="font-brand text-2xl font-bold text-service-sentinel">{activeSentinels.length}</p>
            </div>
            <ArrowRight size={20} className="text-eva-border group-hover:text-service-sentinel transition-colors" />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="space-y-8">
          <Panel title="Actividad Reciente">
            <div className="space-y-1">
              {activities.slice(0, 5).map((act: any) => (
                <div key={act.id} className="flex items-center gap-4 py-3 px-2 hover:bg-eva-beige-light rounded-lg transition-colors group">
                  <div className="w-8 h-8 rounded-full bg-eva-beige-2 flex items-center justify-center text-eva-txt-muted group-hover:bg-eva-olive-light group-hover:text-eva-olive">
                    <Activity size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-ui text-sm text-eva-black font-medium truncate">{act.action}</p>
                    <p className="font-ui text-[11px] text-eva-txt-muted">{act.team_members?.full_name || 'Sistema'}</p>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
        <div className="space-y-8">
          <Panel title="Acciones Prioritarias">
            <div className="space-y-4">
              {activeFoundations.slice(0, 4).map((f) => (
                <div key={f.id} className="p-4 rounded-xl border border-eva-border bg-white hover:border-eva-gold transition-all cursor-pointer">
                  <p className="font-ui text-[14px] font-semibold text-eva-black mb-1">{f.status === 'scoping' ? 'Redactar Dictamen' : 'Cita Estratégica'}</p>
                  <p className="font-ui text-[12px] text-eva-txt-muted truncate">{f.clients?.name}</p>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );

  const renderAdminView = () => (
    <div className="space-y-16 animate-fade-in pb-12">
      {/* Strategic Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2.5 h-2.5 rounded-full bg-eva-olive shadow-[0_0_10px_rgba(62,77,50,0.5)]" />
            <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-eva-olive font-bold">
              Vista de Dirección General
            </span>
          </div>
          <h1 className="font-brand text-4xl font-medium text-eva-black leading-tight">
            Estatus de la <span className="italic">Firma</span>.
          </h1>
          <p className="font-ui text-[14px] text-eva-txt-muted mt-2">
            Consolidado estratégico y métricas de desempeño global.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="olive" icon={<Users size={16} />} aria-label="Gestionar Equipo">
            Gestionar Equipo
          </Button>
        </div>
      </section>

      {/* Strategic Global Metrics */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <MetricCard label="Pipeline Total" value={`$${(activeFoundations.length * 12500).toLocaleString()}`} subtitle="Valor estimado" serviceColor="#b89a42" />
        <MetricCard label="Eficiencia Global" value="92.4%" subtitle="Promedio del equipo" serviceColor="#3e4d32" />
        <MetricCard label="Cuentas Sentinel" value={activeSentinels.length} subtitle="Monitoreo activo" serviceColor="#0f6e56" />
        <MetricCard label="Arquitecturas" value={activeArchitectures.length} subtitle="En implementación" serviceColor="#534ab7" />
      </section>

      {/* Strategic Landing Banner */}
      <section className="relative overflow-hidden rounded-card-2xl bg-eva-black text-white p-12 md:p-16 shadow-md">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,50 Q25,0 50,50 T100,50" stroke="white" fill="none" strokeWidth="0.2" />
          </svg>
        </div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-brand italic text-4xl md:text-5xl leading-[1.1] mb-8 text-[#f9f7f2]">
              Liderando la recuperación de <br/>
              <span className="text-eva-gold not-italic font-bold underline decoration-eva-gold/30 underline-offset-8">utilidades</span> por datos.
            </h2>
            <p className="font-ui text-lg text-white/60 leading-relaxed max-w-lg">
              "Nuestra arquitectura no es un costo, es un centro de recuperación. Estamos aquí para auditar la rentabilidad que otros ignoran."
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-card-xl border border-white/10 p-8 shadow-inner">
            <h3 className="font-mono text-[11px] uppercase tracking-widest text-eva-gold mb-6 font-bold">Resumen de Impacto Mensual</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="font-ui text-sm text-white/70">Entropía Identificada</span>
                <span className="font-brand text-[48px] leading-none text-white font-bold">$1.2M</span>
              </div>
              <div className="w-full h-[1px] bg-white/10" />
              <div className="flex justify-between items-center">
                <span className="font-ui text-sm text-white/70">Crecimiento de Pipeline</span>
                <span className="font-brand text-[48px] leading-none text-eva-gold font-bold">+18%</span>
              </div>
              <div className="w-full h-[1px] bg-white/10" />
              <div className="flex justify-between items-center">
                <span className="font-ui text-sm text-white/70">Nivel de Riesgo Global</span>
                <span className="text-green-400 font-bold text-sm uppercase tracking-widest">Controlado</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Pulse Section */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <Panel title="Pulso del Equipo de Consultores">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {team.map((member) => (
                <div key={member.id} className="p-5 rounded-2xl bg-eva-beige-light border border-eva-border flex items-center justify-between group hover:border-eva-olive transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-eva-olive/10 flex items-center justify-center text-eva-olive font-bold">
                      {member.full_name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-ui text-[14px] font-bold text-eva-black">{member.full_name}</p>
                      <p className="font-ui text-[11px] text-eva-txt-muted uppercase tracking-wider">{member.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-brand text-[15px] font-bold text-eva-black">4 Proyectos</p>
                    <div className="flex items-center gap-1 justify-end mt-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      <span className="text-[9px] font-bold text-green-600 uppercase">Óptimo</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
        <div>
          <Panel title="Sectores con Mayor Entropía">
            <div className="space-y-5 py-2">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-eva-black">
                  <span>Manufactura</span>
                  <span>42%</span>
                </div>
                <div className="w-full h-1.5 bg-eva-beige-2 rounded-full overflow-hidden">
                  <div className="h-full bg-eva-olive rounded-full" style={{ width: '42%' }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-eva-black">
                  <span>Retail</span>
                  <span>28%</span>
                </div>
                <div className="w-full h-1.5 bg-eva-beige-2 rounded-full overflow-hidden">
                  <div className="h-full bg-eva-gold rounded-full" style={{ width: '28%' }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-eva-black">
                  <span>Construcción</span>
                  <span>15%</span>
                </div>
                <div className="w-full h-1.5 bg-eva-beige-2 rounded-full overflow-hidden">
                  <div className="h-full bg-service-foundation rounded-full" style={{ width: '15%' }} />
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </section>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eva-olive" />
      </div>
    );
  }

  return isAdmin ? renderAdminView() : renderConsultantView();
}
