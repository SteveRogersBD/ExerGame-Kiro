// Shared types for API responses
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// Status mapping for homework
export const HOMEWORK_STATUS_MAP = {
  'NOT_STARTED': 'NOT_STARTED',
  'IN_PROGRESS': 'IN_PROGRESS', 
  'DONE': 'DONE',
  'COMPLETED': 'DONE',
  'PENDING': 'NOT_STARTED',
  'ACTIVE': 'IN_PROGRESS'
} as const;

export type HomeworkStatusKey = keyof typeof HOMEWORK_STATUS_MAP;