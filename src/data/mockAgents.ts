import { colors } from '@/theme';
import type { AgentProfile } from '@/types/agents';

export const mockAgents: AgentProfile[] = [
  { id: 'atlas', name: 'Atlas', role: 'Planejamento', description: 'Organiza seu plano e mantém seus estudos no caminho certo.', breed: 'Pastor-alemão', symbol: 'map-outline' },
  { id: 'peter', name: 'Peter', role: 'Desempenho', description: 'Analisa seus resultados e encontra onde você pode melhorar.', breed: 'Border collie', symbol: 'analytics-outline' },
  { id: 'marley', name: 'Marley', role: 'Revisão', description: 'Cuida das suas revisões para você não esquecer o que aprendeu.', breed: 'Golden retriever', symbol: 'library-outline' },
];

export const agentColors = { luna: colors.luna, atlas: colors.atlas, peter: colors.peter, marley: colors.marley } as const;
