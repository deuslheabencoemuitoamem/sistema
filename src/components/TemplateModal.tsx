import React, { useState } from 'react';
import { MessageTemplate } from '../types';
import { X, Plus, Trash2, Check, FileText, Sparkles, HelpCircle } from 'lucide-react';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: MessageTemplate[];
  onSaveTemplates: (templates: MessageTemplate[]) => void;
}

export const TemplateModal: React.FC<TemplateModalProps> = ({
  isOpen,
  onClose,
  templates,
  onSaveTemplates,
}) => {
  const [templateList, setTemplateList] = useState<MessageTemplate[]>(templates);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  if (!isOpen) return null;

  const handleAdd = () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    const newTpl: MessageTemplate = {
      id: `tpl_${Date.now()}`,
      title: newTitle.trim(),
      content: newContent.trim(),
    };
    const updated = [...templateList, newTpl];
    setTemplateList(updated);
    onSaveTemplates(updated);
    setNewTitle('');
    setNewContent('');
  };

  const handleDelete = (id: string) => {
    const updated = templateList.filter(t => t.id !== id);
    setTemplateList(updated);
    onSaveTemplates(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Modelos de Mensagem do WhatsApp</h2>
              <p className="text-xs text-slate-400">Personalize mensagens com variáveis dinâmicas do lead</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1">
          
          {/* Dynamic tags tip */}
          <div className="bg-emerald-950/40 border border-emerald-800/50 rounded-xl p-3 text-xs text-emerald-200 space-y-1">
            <span className="font-semibold flex items-center gap-1 text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" /> Tag dinâmicas disponíveis:
            </span>
            <div className="flex flex-wrap gap-2 pt-1">
              <code className="bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-emerald-300 font-mono">{`{nome}`}</code>
              <code className="bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-emerald-300 font-mono">{`{categoria}`}</code>
              <code className="bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-emerald-300 font-mono">{`{cidade}`}</code>
              <code className="bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-emerald-300 font-mono">{`{estado}`}</code>
            </div>
          </div>

          {/* Add New Template Form */}
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Criar Novo Modelo</h3>
            <input
              type="text"
              placeholder="Título do modelo (Ex: Apresentação Inicial)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <textarea
              placeholder="Conteúdo da mensagem. Ex: Olá {nome}, encontrei o perfil da sua empresa ({categoria}) no Google Meu Negócio em {cidade}..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              rows={3}
              className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <button
              onClick={handleAdd}
              disabled={!newTitle.trim() || !newContent.trim()}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs px-4 py-2 rounded-lg transition flex items-center gap-1.5 ml-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              Adicionar Modelo
            </button>
          </div>

          {/* Existing Templates List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Modelos Salvos ({templateList.length})</h3>
            
            {templateList.map((tpl) => (
              <div key={tpl.id} className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-slate-200">{tpl.title}</h4>
                  {templateList.length > 1 && (
                    <button
                      onClick={() => handleDelete(tpl.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 rounded transition"
                      title="Excluir Modelo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <p className="text-xs text-slate-400 bg-slate-900/90 p-2.5 rounded-lg border border-slate-800/80 font-sans whitespace-pre-wrap">
                  {tpl.content}
                </p>
              </div>
            ))}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-end">
          <button
            onClick={onClose}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-5 py-2 rounded-xl transition"
          >
            Concluído
          </button>
        </div>

      </div>
    </div>
  );
};
