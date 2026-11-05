export type SourceType =
  | 'official'
  | 'official_pdf'
  | 'official_manual'
  | 'primary_public'
  | 'authorized_distributor'
  | 'general_marketplace'
  | 'reference';

export type ConfidenceLevel = 'high' | 'medium' | 'low' | 'unknown';

export interface SourceItem {
  title: string;
  url: string;
  type: SourceType;
  publisher: string;
}

export interface SearchObjectResponse {
  query: string;
  identifiedObject: string;
  category: string;
  answer: string;
  verdict: string;
  confidence: ConfidenceLevel;
  caution: string;
  sources: SourceItem[];
  needsMoreInformation: boolean;
  followUpQuestion: string | null;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text?: string;
  data?: SearchObjectResponse;
  isLoading?: boolean;
  error?: string;
}
