import {API_CONFIG} from './config';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string>;
}

class ApiClient {
  private baseURL: string;
  private timeout: number;
  private authToken: string | null = null;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  setAuthToken(token: string) {
    this.authToken = token;
  }

  clearAuthToken() {
    this.authToken = null;
  }

  private getHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  private buildURL(endpoint: string, params?: Record<string, string>): string {
    let url = `${this.baseURL}${endpoint}`;

    if (params) {
      const queryString = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');
      url += `?${queryString}`;
    }

    return url;
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const {method = 'GET', headers, body, params} = options;

    const url = this.buildURL(endpoint, params);
    const requestHeaders = this.getHeaders(headers);

    // Log request details
    console.log('\n🚀 API Request:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📍 URL:', url);
    console.log('🔧 Method:', method);
    console.log('📋 Headers:', JSON.stringify(requestHeaders, null, 2));
    if (body) {
      console.log('📦 Body:', JSON.stringify(body, null, 2));
    }
    if (params) {
      console.log('🔗 Params:', JSON.stringify(params, null, 2));
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      // Log response details
      console.log('\n✅ API Response:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📍 URL:', url);
      console.log('📊 Status:', response.status, response.statusText);
      console.log('📋 Response Headers:', JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2));
      console.log('📦 Response Data:', JSON.stringify(data, null, 2));
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

      if (!response.ok) {
        throw {
          status: response.status,
          message: data.message || 'Request failed',
          data,
        };
      }

      return data;
    } catch (error: any) {
      clearTimeout(timeoutId);

      // Log error details
      console.log('\n❌ API Error:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📍 URL:', url);
      console.log('🔧 Method:', method);
      console.log('⚠️ Error:', JSON.stringify(error, null, 2));
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

      if (error.name === 'AbortError') {
        throw {
          status: 408,
          message: 'Request timeout',
        };
      }

      throw error;
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, {method: 'GET', params});
  }

  async post<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {method: 'POST', body});
  }

  async put<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {method: 'PUT', body});
  }

  async patch<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {method: 'PATCH', body});
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {method: 'DELETE'});
  }
}

export const apiClient = new ApiClient();
