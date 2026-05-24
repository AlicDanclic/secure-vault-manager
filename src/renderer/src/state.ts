import type { AppState } from './types';

export const appState: AppState = {
  entries: [],
  storagePath: localStorage.getItem('sv_storage_path') || '',
  masterPassword: '',
  revealedIds: new Set(),
  searchQuery: '',
  currentView: 'dashboard'
};
