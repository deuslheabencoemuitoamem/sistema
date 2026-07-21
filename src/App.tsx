import React, { useState, useEffect, useMemo } from 'react';
import { Lead, LeadStatus, MessageTemplate, SearchFilters } from './types';
import { INITIAL_LEADS, DEFAULT_TEMPLATES, SAMPLE_QUERY } from './data/sampleLeads';
import { Header } from './components/Header';
import { SearchForm } from './components/SearchForm';
import { LeadCard } from './components/LeadCard';
import { FiltersBar } from './components/FiltersBar';
import { BatchActions } from './components/BatchActions';
import { TemplateModal } from './components/TemplateModal';
import { ManualLeadModal } from './components/ManualLeadModal';
import { AuthGate } from './components/AuthGate';
import { 
  Building2, 
  MessageCircle, 
  Instagram, 
  MapPin, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  FileSpreadsheet
} from 'lucide-react';

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('leadextract_auth') === 'true';
    } catch {
      return false;
    }
  });

  const handleAuthenticate = () => {
    setIsAuthenticated(true);
    try {
      localStorage.setItem('leadextract_auth', 'true');
    } catch (e) {
      console.error('Failed to save auth state', e);
    }
  };

  const handleLock = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('leadextract_auth');
    } catch (e) {
      console.error('Failed to remove auth state', e);
    }
  };

  // Load saved leads or initial sample leads
  const [leads, setLeads] = useState<Lead[]>(() => {
    try {
      const saved = localStorage.getItem('leadextract_leads');
      return saved ? JSON.parse(saved) : INITIAL_LEADS;
    } catch {
      return INITIAL_LEADS;
    }
  });

  // Load saved templates or defaults
  const [templates, setTemplates] = useState<MessageTemplate[]>(() => {
    try {
      const saved = localStorage.getItem('leadextract_templates');
      return saved ? JSON.parse(saved) : DEFAULT_TEMPLATES;
    } catch {
      return DEFAULT_TEMPLATES;
    }
  });

  const [currentQuery, setCurrentQuery] = useState<string>(SAMPLE_QUERY);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modal controls
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  // Filters state
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: '',
    onlyWithWhatsapp: false,
    onlyWithInstagram: false,
    minRating: 0,
    status: 'todos',
  });

  // Persist leads and templates
  useEffect(() => {
    try {
      localStorage.setItem('leadextract_leads', JSON.stringify(leads));
    } catch (e) {
      console.error('Failed to save leads to localStorage', e);
    }
  }, [leads]);

  useEffect(() => {
    try {
      localStorage.setItem('leadextract_templates', JSON.stringify(templates));
    } catch (e) {
      console.error('Failed to save templates to localStorage', e);
    }
  }, [templates]);

  // Handle Search Execution
  const handleSearch = async (query: string, appendMode: boolean = false) => {
    setCurrentQuery(query);
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch('/api/search-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erro ao conectar com o serviço de extração.');
      }

      if (!data.leads || data.leads.length === 0) {
        setErrorMessage('Nenhum perfil encontrado para essa pesquisa no Google. Tente refinar a busca.');
      } else {
        if (appendMode) {
          // Merge avoiding duplicates by name or rawPhone
          setLeads(prev => {
            const existingNames = new Set(prev.map(p => p.name.toLowerCase()));
            const newUniqueLeads = data.leads.filter(
              (l: Lead) => !existingNames.has(l.name.toLowerCase())
            );
            return [...prev, ...newUniqueLeads];
          });
          setSuccessMessage(`Adicionados +${data.leads.length} novos perfis do Google à sua lista!`);
        } else {
          setLeads(data.leads);
          setSuccessMessage(`Sucesso! Encontrados ${data.leads.length} perfis com dados extraídos do Google Meu Negócio.`);
        }
        setTimeout(() => setSuccessMessage(null), 5000);
      }
    } catch (err: any) {
      console.error('Search error:', err);
      setErrorMessage(
        err.message || 'Falha ao realizar a busca no Google Meu Negócio. Exibindo exemplos prévios.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Lead Actions
  const handleUpdateStatus = (id: string, newStatus: LeadStatus) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
  };

  const handleUpdateNotes = (id: string, newNotes: string) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, notes: newNotes } : l));
  };

  const handleDeleteLead = (id: string) => {
    setLeads(prev => prev.filter(l => l.id !== id));
  };

  const handleAddLead = (newLead: Lead) => {
    setLeads(prev => [newLead, ...prev]);
    setSuccessMessage('Lead adicionado com sucesso!');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleReloadSample = () => {
    setLeads(INITIAL_LEADS);
    setCurrentQuery(SAMPLE_QUERY);
    setSuccessMessage('Exemplos de advogados do Rio Grande do Norte recarregados.');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleClearLeads = () => {
    if (window.confirm('Deseja realmente limpar toda a lista de leads atual?')) {
      setLeads([]);
    }
  };

  // Filtered Leads calculation
  const filteredLeads = useMemo(() => {
    return leads.filter(l => {
      // Text match
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        const matchesName = l.name.toLowerCase().includes(term);
        const matchesCategory = l.category.toLowerCase().includes(term);
        const matchesCity = (l.city || '').toLowerCase().includes(term);
        const matchesNotes = (l.notes || '').toLowerCase().includes(term);
        if (!matchesName && !matchesCategory && !matchesCity && !matchesNotes) {
          return false;
        }
      }

      // Whatsapp filter
      if (filters.onlyWithWhatsapp && !l.hasWhatsapp) {
        return false;
      }

      // Instagram filter
      if (filters.onlyWithInstagram && !l.instagramUrl) {
        return false;
      }

      // Status filter
      if (filters.status !== 'todos' && l.status !== filters.status) {
        return false;
      }

      return true;
    });
  }, [leads, filters]);

  // Export CSV Helper (UTF-8 BOM)
  const handleExportCSV = () => {
    if (leads.length === 0) return;

    const headers = [
      'Nome da Empresa',
      'Categoria',
      'Telefone',
      'WhatsApp Digitos',
      'Link WhatsApp',
      'Instagram Handle',
      'Link Instagram',
      'Link Direct Instagram',
      'Link Google Meu Negocio / Maps',
      'Endereço',
      'Cidade',
      'Estado',
      'Nota Google',
      'Avaliações',
      'Website',
      'Status',
      'Anotações',
      'Termo de Pesquisa'
    ];

    const rows = leads.map(l => [
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${(l.category || '').replace(/"/g, '""')}"`,
      `"${(l.phone || '').replace(/"/g, '""')}"`,
      `"${l.rawPhone || ''}"`,
      `"${l.whatsappLink || ''}"`,
      `"${l.instagramHandle || ''}"`,
      `"${l.instagramUrl || ''}"`,
      `"${l.instagramDirectUrl || ''}"`,
      `"${l.googleMapsUrl || ''}"`,
      `"${(l.address || '').replace(/"/g, '""')}"`,
      `"${l.city || ''}"`,
      `"${l.state || ''}"`,
      `"${l.rating ?? ''}"`,
      `"${l.reviewsCount ?? ''}"`,
      `"${l.website || ''}"`,
      `"${l.status}"`,
      `"${(l.notes || '').replace(/"/g, '""')}"`,
      `"${(l.sourceQuery || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `leads_google_meu_negocio_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const leadsWithWhatsappCount = leads.filter(l => l.hasWhatsapp).length;
  const leadsWithInstagramCount = leads.filter(l => Boolean(l.instagramUrl)).length;

  if (!isAuthenticated) {
    return <AuthGate onAuthenticate={handleAuthenticate} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-white flex flex-col">
      
      {/* App Header */}
      <Header
        totalLeads={leads.length}
        leadsWithWhatsapp={leadsWithWhatsappCount}
        leadsWithInstagram={leadsWithInstagramCount}
        onOpenTemplates={() => setIsTemplateModalOpen(true)}
        onExportCSV={handleExportCSV}
        onAddManualLead={() => setIsManualModalOpen(true)}
        onLock={handleLock}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Toast / Status Notifications */}
        {successMessage && (
          <div className="bg-emerald-950/90 border border-emerald-700/80 text-emerald-200 p-4 rounded-xl flex items-center justify-between text-xs sm:text-sm shadow-lg animate-fade-in">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
            <button onClick={() => setSuccessMessage(null)} className="text-emerald-400 hover:text-white">
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="bg-rose-950/90 border border-rose-700/80 text-rose-200 p-4 rounded-xl flex items-center justify-between text-xs sm:text-sm shadow-lg animate-fade-in">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button onClick={() => setErrorMessage(null)} className="text-rose-400 hover:text-white">
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Search Bar Input */}
        <SearchForm
          onSearch={handleSearch}
          isLoading={isLoading}
          currentQuery={currentQuery}
        />

        {/* Filters & Controls */}
        <FiltersBar
          filters={filters}
          onChangeFilters={setFilters}
          onResetFilters={() => setFilters({
            searchTerm: '',
            onlyWithWhatsapp: false,
            onlyWithInstagram: false,
            minRating: 0,
            status: 'todos',
          })}
          totalLeads={leads.length}
          filteredCount={filteredLeads.length}
          onAddManualLead={() => setIsManualModalOpen(true)}
        />

        {/* Batch Actions Bar */}
        <BatchActions
          leads={filteredLeads}
          onExportCSV={handleExportCSV}
          onClearLeads={handleClearLeads}
          onReloadSample={handleReloadSample}
        />

        {/* Leads Grid Display */}
        {filteredLeads.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredLeads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                templates={templates}
                onUpdateStatus={handleUpdateStatus}
                onUpdateNotes={handleUpdateNotes}
                onDeleteLead={handleDeleteLead}
              />
            ))}
          </div>
        ) : (
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center space-y-4 max-w-xl mx-auto my-8">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-slate-400">
              <Building2 className="w-8 h-8 text-slate-500" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Nenhum lead encontrado</h3>
              <p className="text-xs text-slate-400 mt-1">
                Tente alterar os termos de busca ou limpar os filtros aplicados.
              </p>
            </div>
            <button
              onClick={handleReloadSample}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-2 rounded-xl transition inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Carregar Exemplos de Advogados do RN
            </button>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            Extrator de Leads Google Meu Negócio • WhatsApp, Instagram e Google Maps
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp Direct Link
            </span>
            <span className="flex items-center gap-1">
              <Instagram className="w-3.5 h-3.5 text-purple-400" /> Instagram Direct
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-400" /> Google Maps Profile
            </span>
          </div>
        </div>
      </footer>

      {/* Template Settings Modal */}
      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        templates={templates}
        onSaveTemplates={setTemplates}
      />

      {/* Manual Lead Modal */}
      <ManualLeadModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        onAddLead={handleAddLead}
        currentQuery={currentQuery}
      />

    </div>
  );
}
