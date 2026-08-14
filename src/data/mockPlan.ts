import { colors } from '@/theme';
import type { SubjectProgress } from '@/types/study';


export const planSubjects: SubjectProgress[] = [
  { name: 'Direito Constitucional', progress: 68, accuracy: 74, color: colors.atlas },
  { name: 'Matemática', progress: 54, accuracy: 72, color: colors.peter },
  { name: 'Português', progress: 81, accuracy: 79, color: colors.marley },
  { name: 'Direito Administrativo', progress: 43, accuracy: 66, color: colors.luna },
];

export const planHistory = [
  'Carga de Matemática aumentada em 30 min',
  'Revisão de Constitucional antecipada',
  'Simulado semanal movido para sábado',
];
