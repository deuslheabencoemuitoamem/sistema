export type LeadStatus = 'novo' | 'contatado' | 'negociando' | 'qualificado' | 'desqualificado';

export interface Lead {
  id: string;
  name: string;
  category: string;
  phone: string;
  rawPhone: string;
  hasWhatsapp: boolean;
  whatsappLink: string;
  instagramHandle: string | null;
  instagramUrl: string | null;
  instagramDirectUrl: string | null;
  googleMapsUrl: string;
  address: string;
  city?: string;
  state?: string;
  rating: number | null;
  reviewsCount: number | null;
  website: string | null;
  status: LeadStatus;
  notes: string;
  createdAt: string;
  sourceQuery: string;
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: string;
  resultsCount: number;
}

export interface MessageTemplate {
  id: string;
  title: string;
  content: string;
}

export interface SearchFilters {
  searchTerm: string;
  onlyWithWhatsapp: boolean;
  onlyWithInstagram: boolean;
  minRating: number;
  status: LeadStatus | 'todos';
}
