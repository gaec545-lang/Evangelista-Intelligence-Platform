import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { Project, Client } from '../../lib/types';
// Note: Assuming api and activityLogDB are available or will be imported correctly based on your app structure.
// Using native fetch for the API call to avoid axios dependency issues if it's not setup in the file.

export type DocumentType = 
  | 'propuesta' | 'nda' | 'contrato' | 'orden_servicio'
  | 'dictamen' | 'reporte_avance' | 'reporte_parcial'
  | 'reporte_final' | 'acta_entrega' | 'manual_usuario'
  | 'expediente_operativo' | 'orden_servicio_interna' | 'lecciones_aprendidas';

interface DocumentGeneratorButtonProps {
  docType: DocumentType;
  project: Project;
  client: Client;
  variables: Record<string, unknown>;
  outputFormat?: 'docx' | 'pdf';
  label?: string;
  disabled?: boolean;
  className?: string;
  onGenerated?: (folio: string) => void;
}

const CLIENT_FACING_TYPES: DocumentType[] = [
  'propuesta', 'nda', 'contrato', 'orden_servicio',
  'dictamen', 'reporte_avance', 'reporte_parcial',
  'reporte_final', 'acta_entrega', 'manual_usuario',
];

const DOC_TYPE_LABELS: Record<DocumentType, string> = {
  propuesta:              'Propuesta Comercial',
  nda:                    'NDA',
  contrato:               'Contrato',
  orden_servicio:         'Orden de Servicio',
  dictamen:               'Dictamen Forense',
  reporte_avance:         'Reporte de Avance',
  reporte_parcial:        'Reporte Parcial',
  reporte_final:          'Reporte Final',
  acta_entrega:           'Acta de Entrega',
  manual_usuario:         'Manual de Usuario',
  expediente_operativo:   'Expediente Operativo',
  orden_servicio_interna: 'Orden de Servicio Interna',
  lecciones_aprendidas:   'Lecciones Aprendidas',
};

const AREA_LABELS: Record<string, string> = {
  supply_chain: 'Cadena de Suministro',
  finanzas: 'Finanzas',
  operaciones: 'Operaciones',
  ventas: 'Ventas',
  logistica: 'Logística',
  rrhh: 'Recursos Humanos',
  tecnologia: 'Tecnología',
  multi: 'Multidisciplinario'
};

export const DocumentGeneratorButton = ({
  docType, project, client, variables,
  outputFormat = 'docx', label, disabled, className = '', onGenerated
}: DocumentGeneratorButtonProps) => {
  const [loading, setLoading] = useState(false);

  const formatDocumentDate = (date: Date) => {
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return `Puebla, Pue. · ${meses[date.getMonth()]} ${date.getFullYear()}`;
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      console.log(`Generando documento ${docType} en ${backendUrl}...`);

      if (!client || !client.id) {
        throw new Error("Datos del cliente no disponibles.");
      }

      const payload = {
        doc_type: docType,
        client_id: client.id,
        project_id: project.id,
        client_facing: CLIENT_FACING_TYPES.includes(docType),
        output_format: outputFormat,
        variables: {
          client_name: client.contact_name || client.name || 'Cliente',
          client_company: client.company_name || client.name || 'Empresa',
          client_rfc: client.rfc || '[RFC]',
          project_name: project.name,
          project_area: AREA_LABELS[project.area] || project.area,
          date: formatDocumentDate(new Date()),
          signer_name: 'Adriel Evangelista',
          signer_role: 'Director General',
          phone: '[TELÉFONO]',
          email: 'contacto@evangelistaco.mx',
          website: 'evangelistaco.mx',
          ...variables,
        },
      };

      const response = await fetch(`${backendUrl}/api/v1/documents/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Backend (${response.status}): ${errText}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      const contentDisposition = response.headers.get('content-disposition');
      let filename = `${docType}_${project.id}.${outputFormat}`;
      if (contentDisposition && contentDisposition.includes('filename=')) {
        filename = contentDisposition.split('filename=')[1].replace(/"/g, '');
      } else {
        const folioHeader = response.headers.get('x-document-folio');
        if (folioHeader) {
          filename = `${folioHeader}.${outputFormat}`;
        }
      }
      
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);

      const folio = response.headers.get('x-document-folio');
      if (folio && onGenerated) onGenerated(folio);

    } catch (error: any) {
      console.error("Error detallado generando documento:", error);
      alert(`Hubo un error al generar el documento: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleGenerate}
      disabled={disabled || loading}
      className={`flex items-center justify-center gap-2 px-3 py-1.5 bg-eva-beige-2/50 border border-eva-border
                 rounded-lg text-[9px] font-black uppercase tracking-widest text-eva-olive hover:bg-eva-olive/5 hover:border-eva-olive/30
                 shadow-sm active:scale-95 transition-all duration-300 disabled:opacity-30 ${className}`}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      {label ?? `Generar ${DOC_TYPE_LABELS[docType]} .${outputFormat}`}
    </button>
  );
};
