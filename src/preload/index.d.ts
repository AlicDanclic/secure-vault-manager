import type { MigrateVaultResponse, VaultEntry } from '../shared/types/vault';

export interface ElectronAPI {
  minimize: () => void;
  close: () => void;
  loadData: (filePath: string, password: string) => Promise<VaultEntry[]>;
  saveData: (filePath: string, data: VaultEntry[], password: string) => Promise<{ success: boolean; message?: string }>;
  migrateData: (sourcePath: string, targetPath: string, password: string) => Promise<MigrateVaultResponse>;
  isElectron: boolean;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
    lucide: {
      createIcons: () => void;
    };
  }
}

export {};
