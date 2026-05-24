import type { ElectronAPI } from '../../preload/index.d';
import type { VaultEntry } from '../../shared/types/vault';

interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
}

if (!window.electronAPI) {
  async function requestJson<T>(url: string, payload: unknown): Promise<T> {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = (await response.json()) as ApiResponse<T>;
    if (!response.ok || result.success === false) {
      throw new Error(result.message || '请求失败');
    }
    return (result.data ?? result) as T;
  }

  window.electronAPI = {
    minimize: () => {},
    close: () => {},
    loadData: (filePath: string, password: string) => requestJson<VaultEntry[]>('/api/load', { filePath, password }),
    saveData: (filePath: string, data: VaultEntry[], password: string) =>
      requestJson<{ success: boolean; message?: string }>('/api/save', { filePath, data, password }),
    migrateData: (sourcePath: string, targetPath: string, password: string) =>
      requestJson('/api/migrate', { sourcePath, targetPath, password }),
    isElectron: false
  } satisfies ElectronAPI;
}
