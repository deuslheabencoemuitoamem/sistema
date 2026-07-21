import React from 'react';
import { Search, MapPin, MessageCircle, Instagram, Download, SlidersHorizontal, Sparkles, RefreshCw, FileText, Lock } from 'lucide-react';

interface HeaderProps {
  totalLeads: number;
  leadsWithWhatsapp: number;
  leadsWithInstagram: number;
  onOpenTemplates: () => void;
  onExportCSV: () => void;
  onAddManualLead: () => void;
  onLock: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalLeads,
  leadsWithWhatsapp,
  leadsWithInstagram,
  onOpenTemplates,
  onExportCSV,
  onAddManualLead,
  onLock,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 font-bold text-xl">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-100">
                  LeadExtract <span className="text-emerald-400 font-extrabold">Google</span>
                </h1>
                <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2 py-0.5 rounded-full border border-emerald-500/20 font-medium hidden sm:inline-flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Meu Negócio
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Extração de WhatsApp, Instagram e Perfis do Google
              </p>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-lg px-3 py-1.5 flex items-center gap-2">
              <span className="text-slate-400">Total Leads:</span>
              <span className="font-bold text-white text-sm">{totalLeads}</span>
            </div>

            <div className="bg-emerald-950/50 border border-emerald-800/50 text-emerald-300 rounded-lg px-3 py-1.5 flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp:</span>
              <span className="font-bold text-emerald-200">{leadsWithWhatsapp}</span>
            </div>

            <div className="bg-purple-950/50 border border-purple-800/50 text-purple-300 rounded-lg px-3 py-1.5 flex items-center gap-1.5">
              <Instagram className="w-3.5 h-3.5 text-purple-400" />
              <span>Instagram:</span>
              <span className="font-bold text-purple-200">{leadsWithInstagram}</span>
            </div>

            <div className="flex items-center gap-2 ml-auto sm:ml-0">
              <button
                onClick={onOpenTemplates}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 border border-slate-700 hover:border-slate-600 active:scale-95"
                title="Mensagens do WhatsApp"
              >
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Modelos de</span> Mensagem
              </button>

              <button
                onClick={onExportCSV}
                disabled={totalLeads === 0}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 shadow-sm active:scale-95 disabled:pointer-events-none"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar <span className="hidden sm:inline">CSV</span></span>
              </button>

              <button
                onClick={onLock}
                className="bg-slate-800 hover:bg-rose-950/80 hover:text-rose-300 text-slate-400 p-1.5 rounded-lg transition border border-slate-700 active:scale-95 cursor-pointer"
                title="Bloquear aplicativo (Sair)"
              >
                <Lock className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
