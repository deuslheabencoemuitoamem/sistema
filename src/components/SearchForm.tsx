import React, { useState } from 'react';
import { Search, MapPin, Sparkles, Loader2, Compass, AlertCircle } from 'lucide-react';

interface SearchFormProps {
  onSearch: (query: string, appendMode?: boolean) => void;
  isLoading: boolean;
  currentQuery: string;
}

const PRESET_QUERIES = [
  "advogados rio grande do norte",
  "dentistas natal rn",
  "escritórios de advocacia mossoró rn",
  "médicos cirurgiões natal rn",
  "imobiliárias caicó rn",
  "contadores parnamirim rn",
];

export const SearchForm: React.FC<SearchFormProps> = ({
  onSearch,
  isLoading,
  currentQuery,
}) => {
  const [queryInput, setQueryInput] = useState(currentQuery || "advogados rio grande do norte");

  const handleSubmit = (e: React.FormEvent, appendMode = false) => {
    e.preventDefault();
    if (queryInput.trim()) {
      onSearch(queryInput.trim(), appendMode);
    }
  };

  const handleSelectPreset = (preset: string) => {
    setQueryInput(preset);
    onSearch(preset, false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1.5 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-emerald-400" />
            Pesquisa do Google Meu Negócio
          </label>
          <p className="text-slate-300 text-sm font-normal">
            Digite a pesquisa de empresas ou advogados para extrair os dados do Google com links para <strong className="text-emerald-300 font-semibold">WhatsApp</strong>, <strong className="text-purple-300 font-semibold">Instagram</strong> e <strong className="text-blue-300 font-semibold">Google Maps</strong>.
          </p>
        </div>

        <form onSubmit={(e) => handleSubmit(e, false)} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-5 h-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="Ex: advogados rio grande do norte..."
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={isLoading || !queryInput.trim()}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-semibold px-5 py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 text-sm active:scale-95 whitespace-nowrap cursor-pointer flex-1 sm:flex-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Extraindo do Google...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>Extrair Novos Leads</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              disabled={isLoading || !queryInput.trim()}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 disabled:opacity-50 text-emerald-300 font-semibold px-4 py-3 rounded-xl transition flex items-center justify-center gap-1.5 text-sm active:scale-95 whitespace-nowrap cursor-pointer"
              title="Adicionar os novos leads extraídos mantendo a lista atual"
            >
              <span>+ Acumular</span>
            </button>
          </div>
        </form>

        {/* Preset Chips */}
        <div>
          <span className="text-xs text-slate-400 block mb-2 font-medium">
            Sugestões de pesquisa rápida:
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESET_QUERIES.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                disabled={isLoading}
                className={`text-xs px-3 py-1.5 rounded-lg border transition flex items-center gap-1 cursor-pointer ${
                  queryInput.toLowerCase() === preset.toLowerCase()
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-medium'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span>{preset}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-3 flex items-start gap-2.5 text-xs text-slate-400">
          <AlertCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>
            Os links são gerados automaticamente para abrir a conversa no <strong>WhatsApp</strong> com mensagem personalizada, o perfil/chat no <strong>Instagram</strong>, e o perfil original do <strong>Google Meu Negócio / Google Maps</strong>.
          </span>
        </div>
      </div>
    </div>
  );
};
