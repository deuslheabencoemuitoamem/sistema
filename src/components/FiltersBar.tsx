import React from 'react';
import { SearchFilters, LeadStatus } from '../types';
import { Filter, MessageCircle, Instagram, Search, RotateCcw, Plus, Users } from 'lucide-react';

interface FiltersBarProps {
  filters: SearchFilters;
  onChangeFilters: (filters: SearchFilters) => void;
  onResetFilters: () => void;
  totalLeads: number;
  filteredCount: number;
  onAddManualLead: () => void;
}

export const FiltersBar: React.FC<FiltersBarProps> = ({
  filters,
  onChangeFilters,
  onResetFilters,
  totalLeads,
  filteredCount,
  onAddManualLead,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
      
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Search filter text */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Filtrar por nome, cidade ou especialidade..."
            value={filters.searchTerm}
            onChange={(e) => onChangeFilters({ ...filters, searchTerm: e.target.value })}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Quick Toggles */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          
          <button
            onClick={() => onChangeFilters({ ...filters, onlyWithWhatsapp: !filters.onlyWithWhatsapp })}
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-medium transition ${
              filters.onlyWithWhatsapp
                ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Com WhatsApp</span>
          </button>

          <button
            onClick={() => onChangeFilters({ ...filters, onlyWithInstagram: !filters.onlyWithInstagram })}
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-medium transition ${
              filters.onlyWithInstagram
                ? 'bg-purple-950 border-purple-500 text-purple-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Instagram className="w-3.5 h-3.5 text-purple-400" />
            <span>Com Instagram</span>
          </button>

          {/* Status selector */}
          <select
            value={filters.status}
            onChange={(e) => onChangeFilters({ ...filters, status: e.target.value as LeadStatus | 'todos' })}
            className="bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="todos">Todos os Status</option>
            <option value="novo">Novos Leads</option>
            <option value="contatado">Contatados</option>
            <option value="negociando">Em Negociação</option>
            <option value="qualificado">Qualificados</option>
            <option value="desqualificado">Desqualificados</option>
          </select>

          <button
            onClick={onResetFilters}
            className="bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white p-1.5 rounded-xl transition"
            title="Limpar Filtros"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onAddManualLead}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 px-3 py-1.5 rounded-xl font-medium transition flex items-center gap-1.5 ml-auto md:ml-2"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>Adicionar Lead</span>
          </button>
        </div>

      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/60">
        <span>
          Exibindo <strong className="text-white font-semibold">{filteredCount}</strong> de <strong className="text-slate-300">{totalLeads}</strong> leads cadastrados
        </span>
      </div>

    </div>
  );
};
