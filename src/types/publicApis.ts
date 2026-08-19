export interface PublicApiEntry {
  id: string;
  name: string;
  description: string;
  descriptionNp?: string;
  auth: 'No Auth' | 'apiKey' | 'OAuth' | 'X-Mashape-Key' | 'User-Agent';
  https: boolean;
  cors: 'yes' | 'no' | 'unknown';
  category: string;
  categoryNp?: string;
  link: string;
  sampleEndpoint?: string;
  sampleMethod?: 'GET' | 'POST';
  sampleHeaders?: Record<string, string>;
  sampleParams?: Record<string, string>;
  isPopular?: boolean;
}

export interface ApiCategoryInfo {
  id: string;
  name: string;
  nameNp: string;
  iconName: string;
  description: string;
  count: number;
}

export interface ApiTestRequest {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  params?: Record<string, string>;
  body?: string;
}

export interface ApiTestResponse {
  status: number;
  statusText: string;
  ok: boolean;
  durationMs: number;
  headers: Record<string, string>;
  data: any;
  rawText: string;
  sizeBytes: number;
  timestamp: string;
}
