import { apiClient } from './api';
import { Product } from '@formerbench/shared';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  products?: Product[];
  timestamp: string;
  isError?: boolean;
}

export interface ChatApiResponse {
  reply: string;
  products: Product[];
  success?: boolean;
  providerUsed?: string;
}

export const chatService = {
  async sendMessage(
    message: string,
    history: Array<{ role: 'user' | 'assistant'; content: string }> = []
  ): Promise<ChatApiResponse> {
    const res: any = await apiClient.post('/chat', {
      message,
      history,
    });

    return {
      reply: res.reply || res.data?.reply || '',
      products: res.products || res.data?.products || [],
      providerUsed: res.providerUsed || res.data?.providerUsed,
    };
  },
};
