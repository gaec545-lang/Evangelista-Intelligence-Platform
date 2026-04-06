import { useState } from 'react';
import { api } from '../lib/api';
import { FileText, Download, Loader2 } from 'lucide-react';

interface DocumentDownloaderProps {
  template: string;
  label: string;
  data: Record<string, any>;
  accent?: 'foundation' | 'architecture' | 'sentinel';
}

export default function DocumentDownloader({ template, label, data, accent = 'foundation' }: DocumentDownloaderProps) {
  const [loading, setLoading] = useState(false);

  const accentColors = {
    foundation: 'bg-eva-foundation/10 text-eva-foundation hover:bg-eva-foundation/20 border-eva-foundation/20',
    architecture: 'bg-eva-architecture/10 text-eva-architecture hover:bg-eva-architecture/20 border-eva-architecture/20',
    sentinel: 'bg-eva-sentinel/10 text-eva-sentinel hover:bg-eva-sentinel/20 border-eva-sentinel/20',
  };

  const handleDownload = async () => {
    setLoading(true);
    try {
      await api.downloadDocument(template, data);
    } catch (err) {
      console.error('Error descargando documento:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition-all ${accentColors[accent]} disabled:opacity-50`}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
      <FileText className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
}
