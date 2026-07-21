import React, { useState } from 'react';
import { Lead, LeadStatus, MessageTemplate } from '../types';
import { 
  MessageCircle, 
  Instagram, 
  MapPin, 
  Star, 
  Phone, 
  Globe, 
  Copy, 
  Check, 
  ExternalLink, 
  FileText, 
  Edit3, 
  Trash2, 
  Send,
  Building2,
  ChevronDown,
  Sparkles
} from 'lucide-react';

interface LeadCardProps {
  lead: Lead;
  templates: MessageTemplate[];
  onUpdateStatus: (id: string, status: LeadStatus) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onDeleteLead: (id: string) => void;
}

const STATUS_CONFIG: Record<LeadStatus, { label: string; badgeClass: string }> = {
  novo: {
    label: 'Novo Lead',
    badgeClass: 'bg-blue-950/80 text-blue-300 border-blue-800/60',
  },
  contatado: {
    label: 'Contatado',
    badgeClass: 'bg-amber-950/80 text-amber-300 border-amber-800/60',
  },
  negociando: {
    label: 'Em Negociação',
    badgeClass: 'bg-purple-950/80 text-purple-300 border-purple-800/60',
  },
  qualificado: {
    label: 'Qualificado',
    badgeClass: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60',
  },
  desqualificado: {
    label: 'Desqualificado',
    badgeClass: 'bg-slate-900 text-slate-400 border-slate-700',
  },
};

export const LeadCard: React.FC<LeadCardProps> = ({
  lead,
  templates,
  onUpdateStatus,
  onUpdateNotes,
  onDeleteLead,
}) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templates[0]?.id || '');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesText, setNotesText] = useState(lead.notes || '');

  // Calculate customized message for WhatsApp
  const selectedTemplate = templates.find(t => t.id === selectedTemplateId) || templates[0];
  const customMessage = selectedTemplate
    ? selectedTemplate.content
        .replace(/\{nome\}/g, lead.name)
        .replace(/\{categoria\}/g, lead.category)
        .replace(/\{cidade\}/g, lead.city || 'sua região')
        .replace(/\{estado\}/g, lead.state || '')
    : `Olá ${lead.name}, encontrei seu perfil no Google Meu Negócio!`;

  const waDirectUrl = lead.rawPhone
    ? `https://wa.me/${lead.rawPhone}?text=${encodeURIComponent(customMessage)}`
    : null;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleSaveNotes = () => {
    onUpdateNotes(lead.id, notesText);
    setIsEditingNotes(false);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-lg hover:border-slate-700 transition duration-200 flex flex-col justify-between group relative overflow-hidden">
      
      {/* Top Header info */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                <Building2 className="w-3 h-3 text-emerald-400" />
                {lead.category}
              </span>

              {lead.city && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-950/60 text-slate-400 border border-slate-800">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {lead.city} - {lead.state}
                </span>
              )}
            </div>

            <h3 className="text-lg font-bold text-white tracking-tight leading-snug group-hover:text-emerald-300 transition">
              {lead.name}
            </h3>
          </div>

          {/* Status selector badge */}
          <div className="relative shrink-0">
            <select
              value={lead.status}
              onChange={(e) => onUpdateStatus(lead.id, e.target.value as LeadStatus)}
              className={`text-xs font-semibold px-2.5 py-1 rounded-full border appearance-none pr-6 cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500 ${STATUS_CONFIG[lead.status]?.badgeClass}`}
            >
              <option value="novo" className="bg-slate-900 text-slate-200">Novo Lead</option>
              <option value="contatado" className="bg-slate-900 text-slate-200">Contatado</option>
              <option value="negociando" className="bg-slate-900 text-slate-200">Em Negociação</option>
              <option value="qualificado" className="bg-slate-900 text-slate-200">Qualificado</option>
              <option value="desqualificado" className="bg-slate-900 text-slate-200">Desqualificado</option>
            </select>
            <ChevronDown className="w-3 h-3 absolute right-2 top-2 pointer-events-none text-slate-400" />
          </div>
        </div>

        {/* Address and Rating */}
        <div className="text-xs text-slate-400 space-y-1 pt-1">
          <p className="flex items-center gap-1.5 text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="truncate">{lead.address}</span>
          </p>

          <div className="flex items-center gap-3 pt-0.5">
            {lead.rating && (
              <div className="flex items-center gap-1 text-amber-400 font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{lead.rating.toFixed(1)}</span>
                {lead.reviewsCount !== null && (
                  <span className="text-slate-500 font-normal">({lead.reviewsCount} avaliações no Google)</span>
                )}
              </div>
            )}

            {lead.website && (
              <a
                href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition underline decoration-slate-700"
              >
                <Globe className="w-3 h-3" />
                <span>Site da empresa</span>
              </a>
            )}
          </div>
        </div>

        {/* Phone display */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center text-emerald-400">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Telefone Extraído</span>
              <span className="text-sm font-semibold text-slate-100">{lead.phone}</span>
            </div>
          </div>

          <button
            onClick={() => handleCopy(lead.phone, 'phone')}
            className="text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 p-1.5 rounded-lg transition active:scale-95"
            title="Copiar Número"
          >
            {copiedType === 'phone' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* Dynamic Template Selection for WhatsApp */}
        {waDirectUrl && (
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                <FileText className="w-3 h-3 text-emerald-400" />
                Modelo de Mensagem do WhatsApp:
              </label>
            </div>
            <select
              value={selectedTemplateId}
              onChange={(e) => setSelectedTemplateId(e.target.value)}
              className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {templates.map((tpl) => (
                <option key={tpl.id} value={tpl.id}>
                  {tpl.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* 3 MANDATORY PRIMARY ACTION LINKS REQUESTED BY USER */}
      <div className="mt-5 pt-4 border-t border-slate-800 space-y-2.5">
        
        {/* LINK 1: ABRE A CONVERSA NO WHATSAPP */}
        {waDirectUrl ? (
          <a
            href={waDirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onUpdateStatus(lead.id, 'contatado')}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-950/50 transition active:scale-[0.98] group/btn"
          >
            <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
            <span className="text-sm">Abrir Conversa no WhatsApp</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover/btn:translate-x-0.5 transition" />
          </a>
        ) : (
          <div className="w-full bg-slate-950/60 border border-slate-800 text-slate-500 text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-2">
            <MessageCircle className="w-4 h-4 text-slate-600" />
            <span>WhatsApp não identificado para este número</span>
          </div>
        )}

        {/* LINK 2: ABRE A CONVERSA / PERFIL NO INSTAGRAM */}
        {lead.instagramUrl ? (
          <div className="flex items-center gap-2">
            <a
              href={lead.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-gradient-to-r from-purple-700 via-pink-600 to-amber-600 hover:from-purple-600 hover:to-amber-500 text-white font-semibold py-2 px-3 rounded-xl flex items-center justify-center gap-2 shadow-sm transition active:scale-[0.98] text-xs"
            >
              <Instagram className="w-4 h-4" />
              <span>Abrir Perfil Instagram ({lead.instagramHandle || 'Perfil'})</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>

            {lead.instagramDirectUrl && (
              <a
                href={lead.instagramDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-purple-950/80 hover:bg-purple-900 border border-purple-700/60 text-purple-200 font-medium py-2 px-3 rounded-xl flex items-center gap-1.5 transition text-xs whitespace-nowrap"
                title="Abrir Chat Direct no Instagram"
              >
                <Send className="w-3.5 h-3.5 text-purple-400" />
                <span>Direct</span>
              </a>
            )}
          </div>
        ) : (
          <div className="w-full bg-slate-950/40 border border-slate-800/80 text-slate-500 text-xs py-2 px-3 rounded-xl flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-500">
              <Instagram className="w-3.5 h-3.5 text-slate-600" />
              Instagram não vinculado publicamente
            </span>
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(`${lead.name} instagram ${lead.city || ''}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-purple-400 hover:underline flex items-center gap-1"
            >
              Pesquisar no Google
            </a>
          </div>
        )}

        {/* LINK 3: ABRE O PERFIL DO GOOGLE MEU NEGÓCIO / MAPS ONDE O WHATSAPP FOI EXTRAÍDO */}
        <a
          href={lead.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium py-2 px-3 rounded-xl flex items-center justify-center gap-2 border border-slate-700/80 transition active:scale-[0.98] text-xs"
        >
          <MapPin className="w-4 h-4 text-rose-400" />
          <span>Ver Perfil no Google Meu Negócio / Maps</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </a>

        {/* Notes & Card Footer Actions */}
        <div className="pt-2">
          {isEditingNotes ? (
            <div className="space-y-2">
              <textarea
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                placeholder="Adicionar anotação sobre o lead..."
                className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 h-16"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsEditingNotes(false)}
                  className="text-xs text-slate-400 hover:text-white px-2 py-1"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveNotes}
                  className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-3 py-1 rounded-md"
                >
                  Salvar Nota
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-950/40 p-2 rounded-lg border border-slate-800/60">
              <p className="truncate italic max-w-[80%]">
                {lead.notes || 'Sem observações'}
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsEditingNotes(true)}
                  className="text-slate-400 hover:text-emerald-400 p-1 rounded transition"
                  title="Editar Anotação"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDeleteLead(lead.id)}
                  className="text-slate-500 hover:text-rose-400 p-1 rounded transition"
                  title="Excluir Lead"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
