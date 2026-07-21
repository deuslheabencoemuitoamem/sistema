import React, { useState } from 'react';
import { Lead } from '../types';
import { Copy, Check, MessageCircle, Instagram, Download, Trash2, RefreshCw } from 'lucide-react';

interface BatchActionsProps {
  leads: Lead[];
  onExportCSV: () => void;
  onClearLeads: () => void;
  onReloadSample: () => void;
}

export const BatchActions: React.FC<BatchActionsProps> = ({
  leads,
  onExportCSV,
  onClearLeads,
  onReloadSample,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopyNumbers = () => {
    const numbers = leads
      .map(l => l.rawPhone)
      .filter(Boolean)
      .join('\n');

    navigator.clipboard.writeText(numbers);
    setCopiedKey('numbers');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCopyInstagrams = () => {
    const igs = leads
      .map(l => l.instagramUrl)
      .filter(Boolean)
      .join('\n');

    navigator.clipboard.writeText(igs);
    setCopiedKey('igs');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (leads.length === 0) return null;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
      <div className="flex items-center gap-2 text-slate-400">
        <span className="font-semibold text-white">Ações em Massa:</span>
        <span>({leads.length} leads selecionados)</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={handleCopyNumbers}
          className="bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition active:scale-95"
          title="Copiar lista de telefones do WhatsApp"
        >
          {copiedKey === 'numbers' ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Números Copiados!</span>
            </>
          ) : (
            <>
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Copiar Telefones</span>
            </>
          )}
        </button>

        <button
          onClick={handleCopyInstagrams}
          className="bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition active:scale-95"
          title="Copiar links dos perfis do Instagram"
        >
          {copiedKey === 'igs' ? (
            <>
              <Check className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-purple-400">Instagrams Copiados!</span>
            </>
          ) : (
            <>
              <Instagram className="w-3.5 h-3.5 text-purple-400" />
              <span>Copiar Instagrams</span>
            </>
          )}
        </button>

        <button
          onClick={onExportCSV}
          className="bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800/80 text-emerald-300 font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition active:scale-95"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Exportar Planilha (CSV)</span>
        </button>

        <button
          onClick={onReloadSample}
          className="bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 p-1.5 rounded-lg transition"
          title="Recarregar Exemplos do Rio Grande do Norte"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onClearLeads}
          className="bg-slate-950 hover:bg-rose-950/60 text-slate-500 hover:text-rose-400 border border-slate-800 p-1.5 rounded-lg transition"
          title="Limpar Lista"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
