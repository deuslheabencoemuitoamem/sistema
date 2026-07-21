import React, { useState } from 'react';
import { Lead } from '../types';
import { X, Plus, Building2, Phone, MapPin, Instagram, Globe } from 'lucide-react';

interface ManualLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLead: (lead: Lead) => void;
  currentQuery: string;
}

export const ManualLeadModal: React.FC<ManualLeadModalProps> = ({
  isOpen,
  onClose,
  onAddLead,
  currentQuery,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Escritório de Advocacia');
  const [phone, setPhone] = useState('');
  const [instagram, setInstagram] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Natal');
  const [state, setState] = useState('RN');
  const [website, setWebsite] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    let cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length === 10 || cleanPhone.length === 11) {
      cleanPhone = '55' + cleanPhone;
    }

    let cleanIg = instagram.trim().replace(/^@/, '');

    const defaultMsg = `Olá, encontrei o perfil da ${name} no Google Meu Negócio.`;

    const newLead: Lead = {
      id: `manual_${Date.now()}`,
      name: name.trim(),
      category: category.trim() || 'Empresa / Profissional',
      phone: phone.trim(),
      rawPhone: cleanPhone,
      hasWhatsapp: Boolean(cleanPhone),
      whatsappLink: cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(defaultMsg)}` : '',
      instagramHandle: cleanIg ? `@${cleanIg}` : null,
      instagramUrl: cleanIg ? `https://instagram.com/${cleanIg}` : null,
      instagramDirectUrl: cleanIg ? `https://ig.me/m/${cleanIg}` : null,
      googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${city} ${state}`)}`,
      address: address.trim() || `${city}, ${state}`,
      city: city.trim() || 'Natal',
      state: state.trim() || 'RN',
      rating: 5.0,
      reviewsCount: 1,
      website: website.trim() || null,
      status: 'novo',
      notes: notes.trim() || 'Cadastrado manualmente',
      createdAt: new Date().toISOString(),
      sourceQuery: currentQuery || 'manual',
    };

    onAddLead(newLead);
    onClose();

    // Reset fields
    setName('');
    setPhone('');
    setInstagram('');
    setAddress('');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-400" />
            Adicionar Lead Manualmente
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div>
            <label className="text-xs text-slate-300 font-medium block mb-1">Nome da Empresa / Advogado *</label>
            <input
              type="text"
              required
              placeholder="Ex: Dra. Juliana Santos Advocacia"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Categoria</label>
              <input
                type="text"
                placeholder="Ex: Direito Trabalhista"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Telefone / WhatsApp *</label>
              <input
                type="text"
                required
                placeholder="(84) 99888-7766"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Instagram (@usuario)</label>
              <input
                type="text"
                placeholder="@julianasantos.adv"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Cidade e UF</label>
              <div className="flex gap-1">
                <input
                  type="text"
                  placeholder="Natal"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <input
                  type="text"
                  placeholder="RN"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-16 text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white text-center uppercase focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-300 font-medium block mb-1">Endereço Completo</label>
            <input
              type="text"
              placeholder="Av. Sen. Salgado Filho, Natal - RN"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs text-slate-300 font-medium block mb-1">Anotações / Observações</label>
            <textarea
              placeholder="Anotações sobre a empresa ou contato..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-white px-3 py-2"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-xl"
            >
              Salvar Lead
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
