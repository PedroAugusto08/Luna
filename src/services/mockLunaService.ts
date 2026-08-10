import type { ChatMessage } from '@/types/chat';
const responses = [
  'Posso ajustar seu dia sem perder a prioridade principal. Vou manter Matemática primeiro e redistribuir as revisões.',
  'Seu desempenho está evoluindo. Matemática subiu nesta semana; Direito Constitucional ainda merece atenção nas questões.',
  'As revisões mais importantes hoje são Controle de constitucionalidade e Probabilidade. Comece pela menor retenção estimada.',
];
export function createLocalUserMessage(text: string): ChatMessage {
  return { id: `user-${Date.now()}`, author: 'user', text, createdAt: new Date().toISOString() };
}

export async function getMockLunaResponse(message: string): Promise<ChatMessage> {
  await new Promise<void>((resolve) => setTimeout(resolve, 450));
  const normalized = message.toLowerCase();
  const index = normalized.includes('desempenho') ? 1 : normalized.includes('revis') ? 2 : 0;
  return { id: `luna-${Date.now()}`, author: 'luna', text: responses[index], createdAt: new Date().toISOString() };
}
