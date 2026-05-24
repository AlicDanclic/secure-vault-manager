import type { VaultEntry } from '../../shared/types/vault';

export type ViewName = 'dashboard' | 'generator';
export type StatusType = 'success' | 'warn' | 'error' | 'loading';
export type ToastType = 'success' | 'error';

export interface AppState {
  entries: VaultEntry[];
  storagePath: string;
  masterPassword: string;
  revealedIds: Set<number>;
  searchQuery: string;
  currentView: ViewName;
}

export interface PasswordOptions {
  upper: boolean;
  lower: boolean;
  number: boolean;
  symbol: boolean;
}
