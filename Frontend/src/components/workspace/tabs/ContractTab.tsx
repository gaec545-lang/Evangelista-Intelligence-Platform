import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  DollarSign,
  Download,
  ShieldCheck,
  ClipboardList
} from 'lucide-react';
import { Project, Client, ProjectPayment } from '../../../lib/types';
import { paymentsDB, clientsDB } from '../../../lib/supabase';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { DocumentGeneratorButton } from '../../documents/DocumentGeneratorButton';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ContractTabProps {
  project: Project;
}

export default function ContractTab({ project }: ContractTabProps) {
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState<ProjectPayment[]>([]);
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    loadData();
  }, [project.id]);

  async function loadData() {
    setLoading(true);
    console.log('ContractTab: Cargando datos para proyecto', project.id, 'con cliente', project.client_id);
    try {
      // Cargar pagos independientemente
      try {
        const { data } = await paymentsDB.getByProject(project.id);
        setPayments(data || []);
      } catch (e) {
        console.error('ContractTab: Error loading payments:', e);
      }

      // Cargar cliente con validación de ID
      if (project.client_id && project.client_id.length > 10) {
        try {
          const clientData = await clientsDB.get(project.client_id);
          console.log('ContractTab: Cliente cargado:', clientData?.name);
          setClient(clientData);
        } catch (e) {
          console.error('ContractTab: Error loading client:', e);
        }
      } else {
        console.warn('ContractTab: Proyecto sin client_id válido:', project.client_id);
      }
    } catch (error) {
      console.error('ContractTab: Error in loadData sequence:', error);
    } finally {
      setLoading(false);
    }
  }

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(val);

  const handleMarkReceived = async (paymentId: string) => {
    if (!confirm('¿Marcar este pago como recibido?')) return;
    try {
      await paymentsDB.markReceived(paymentId, 'transferencia');
      loadData();
    } catch (error) {
      alert('Error al actualizar el pago');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER SECCION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-serif text-eva-black">Gestión Contractual</h3>
          <p className="text-sm text-eva-txt-muted">Control legal, documentos de confidencialidad y flujo de pagos.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" size="sm" className="bg-white">
             <ShieldCheck className="w-4 h-4 mr-2" />
             Vetting Status: OK
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* COLUMNA IZQUIERDA: DOCUMENTOS LEGALES */}
        <div className="lg:col-span-4 space-y-6">
          <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-eva-txt-faint flex items-center gap-2">
            <FileText className="w-3 h-3" />
            Documentos Legales
          </h4>

          <Card className="p-6 bg-white border-eva-border space-y-6 shadow-sm rounded-[2rem]">
            {/* NDA */}
            <div className="group relative">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-eva-beige-2 flex items-center justify-center border border-eva-border group-hover:border-eva-olive transition-colors duration-500">
                    <ShieldCheck className="w-5 h-5 text-eva-olive" />
                  </div>
                  <div>
                    <span className="text-[9px] text-eva-txt-faint uppercase tracking-widest font-black block mb-0.5">Confidencialidad</span>
                    <span className="text-sm font-bold text-eva-black">NDA Institucional</span>
                  </div>
                </div>
                <span className="text-[8px] px-2 py-0.5 rounded-full bg-eva-olive/10 text-eva-olive font-black border border-eva-olive/20 tracking-tighter whitespace-nowrap">
                  MANDATORIO
                </span>
              </div>
              <div className="flex flex-wrap gap-2 pl-13">
                <DocumentGeneratorButton 
                  docType="nda" 
                  project={project} 
                  client={client!} 
                  variables={{}} 
                  label="Generar" 
                  className="h-8 text-[9px] font-black uppercase tracking-widest px-3"
                  disabled={!client}
                />
                <Button variant="outline" size="xs" className="h-8 text-[9px] font-black uppercase tracking-widest bg-eva-beige/30 px-3">Cargar Firmado</Button>
              </div>
            </div>

            <div className="h-px bg-eva-border/60 mx-2" />

            {/* CONTRATO MAESTRO */}
            <div className="group relative">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-eva-beige-2 flex items-center justify-center border border-eva-border group-hover:border-eva-olive transition-colors duration-500">
                    <ClipboardList className="w-5 h-5 text-eva-olive" />
                  </div>
                  <div>
                    <span className="text-[9px] text-eva-txt-faint uppercase tracking-widest font-black block mb-0.5">Marco Legal</span>
                    <span className="text-sm font-bold text-eva-black">Contrato Maestro (MSA)</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pl-13">
                <DocumentGeneratorButton 
                  docType="contrato" 
                  project={project} 
                  client={client!} 
                  variables={{
                    setup_fee: project.total_price ? project.total_price * 0.5 : 0,
                    base_price: project.total_price || 0
                  }} 
                  label="Generar"
                  className="h-8 text-[9px] font-black uppercase tracking-widest px-3"
                  disabled={!client}
                />
                <Button variant="outline" size="xs" className="h-8 text-[9px] font-black uppercase tracking-widest bg-eva-beige/30 px-3">Cargar Firmado</Button>
              </div>
            </div>

            <div className="h-px bg-eva-border/60 mx-2" />

            {/* ORDEN DE SERVICIO */}
            <div className="group relative">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-eva-beige-2 flex items-center justify-center border border-eva-border group-hover:border-eva-olive transition-colors duration-500">
                    <Plus className="w-5 h-5 text-eva-txt-faint" />
                  </div>
                  <div>
                    <span className="text-[9px] text-eva-txt-faint uppercase tracking-widest font-black block mb-0.5">Instrumento Operativo</span>
                    <span className="text-sm font-bold text-eva-black">Orden de Servicio (SOW)</span>
                  </div>
                </div>
              </div>
              <div className="pl-13">
                <DocumentGeneratorButton 
                  docType="orden_servicio" 
                  project={project} 
                  client={client!} 
                  variables={{}} 
                  label="Nueva Orden de Servicio"
                  className="h-8 text-[9px] font-black uppercase tracking-widest w-full px-3"
                  disabled={!client}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* COLUMNA DERECHA: CONTROL DE PAGOS */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between">
            <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-eva-txt-faint flex items-center gap-2">
              <CreditCard className="w-3 h-3" />
              Esquema de Pagos
            </h4>
            <Button size="xs" variant="outline" className="text-[10px]">
              <Plus className="w-3 h-3 mr-1" /> Registrar Hito
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 bg-white border-eva-border shadow-sm group hover:border-eva-olive transition-colors rounded-2xl">
              <p className="text-[10px] font-mono tracking-[0.2em] text-eva-txt-faint uppercase mb-3 font-black">Monto Total</p>
              <div className="flex items-baseline gap-1">
                 <span className="text-2xl font-serif text-eva-black font-medium">{formatCurrency(project.total_price || 0).split('.')[0]}</span>
                 <span className="text-xs text-eva-txt-faint">.{formatCurrency(project.total_price || 0).split('.')[1]}</span>
              </div>
            </Card>
            <Card className="p-6 bg-white border-eva-border shadow-sm group hover:border-eva-olive transition-colors rounded-2xl">
              <p className="text-[10px] font-mono tracking-[0.2em] text-eva-txt-faint uppercase mb-3 font-black">Recibido</p>
              <div className="flex items-baseline gap-1">
                 <span className="text-2xl font-serif text-eva-olive font-medium">{formatCurrency(payments.filter(p => p.received).reduce((acc, p) => acc + p.amount, 0)).split('.')[0]}</span>
                 <span className="text-xs text-eva-olive opacity-40">.{formatCurrency(payments.filter(p => p.received).reduce((acc, p) => acc + p.amount, 0)).split('.')[1]}</span>
              </div>
            </Card>
            <Card className="p-6 bg-white border-eva-border shadow-sm group hover:border-service-foundation transition-colors rounded-2xl">
              <p className="text-[10px] font-mono tracking-[0.2em] text-eva-txt-faint uppercase mb-3 font-black">Pendiente</p>
              <div className="flex items-baseline gap-1">
                 <span className="text-2xl font-serif text-service-foundation font-medium">{formatCurrency((project.total_price || 0) - payments.filter(p => p.received).reduce((acc, p) => acc + p.amount, 0)).split('.')[0]}</span>
                 <span className="text-xs text-service-foundation opacity-40">.{formatCurrency((project.total_price || 0) - payments.filter(p => p.received).reduce((acc, p) => acc + p.amount, 0)).split('.')[1]}</span>
              </div>
            </Card>
          </div>

          <Card className="overflow-hidden bg-white border-eva-border shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-eva-beige-2/50 border-b border-eva-border">
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-eva-txt-faint">Concepto</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-eva-txt-faint">Monto</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-eva-txt-faint">Vencimiento</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-eva-txt-faint">Estado</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-eva-border">
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-eva-txt-faint italic text-sm">
                      No hay hitos de pago registrados para este proyecto.
                    </td>
                  </tr>
                ) : (
                  payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-eva-beige-2/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                           <div className={`w-2 h-2 rounded-full ${payment.payment_type === 'anticipo' ? 'bg-eva-gold' : 'bg-eva-olive'}`} />
                           <div>
                             <p className="text-sm font-bold text-eva-black">{payment.description}</p>
                             <p className="text-[10px] text-eva-txt-muted uppercase tracking-tighter">{payment.payment_type}</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-mono font-bold text-eva-black">{formatCurrency(payment.amount)}</span>
                      </td>
                      <td className="px-6 py-4 text-xs text-eva-txt-muted">
                        {payment.due_date ? format(new Date(payment.due_date), "dd MMM yyyy", { locale: es }) : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        {payment.received ? (
                          <div className="flex items-center gap-1.5 text-eva-olive">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Pagado</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-eva-gold">
                            <Clock className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Pendiente</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {!payment.received && (
                          <Button 
                            size="xs" 
                            variant="primary" 
                            onClick={() => handleMarkReceived(payment.id)}
                            className="text-[9px] bg-eva-olive hover:bg-eva-olive-2"
                          >
                            Recibir
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </Card>

          {/* Advertencia Financiera */}
          <div className="flex items-start gap-4 p-5 rounded-2xl bg-service-foundation/5 border border-service-foundation/10 shadow-sm">
             <AlertCircle className="w-5 h-5 text-service-foundation shrink-0 mt-0.5" />
             <div className="space-y-1">
                <p className="text-xs font-bold text-service-foundation uppercase tracking-wider">Protocolo de Cobranza</p>
                <p className="text-xs text-eva-txt-muted leading-relaxed">
                  Las transiciones de fase críticas (Immersion → Analysis) requieren la confirmación de recepción del **Setup Fee (Anticipo)**. 
                  Si un pago está pendiente por más de 15 días, el sistema bloqueará el avance de fase automáticamente.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
