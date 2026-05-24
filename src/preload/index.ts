import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '../shared/constants/ipc';
import type { ElectronAPI } from './index.d';
import type { VaultEntry } from '../shared/types/vault';

const electronAPI: ElectronAPI = {
  minimize: () => ipcRenderer.send(IPC_CHANNELS.WINDOW_MINIMIZE),
  close: () => ipcRenderer.send(IPC_CHANNELS.WINDOW_CLOSE),
  loadData: (filePath: string, password: string) => ipcRenderer.invoke(IPC_CHANNELS.VAULT_LOAD, { filePath, password }),
  saveData: (filePath: string, data: VaultEntry[], password: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.VAULT_SAVE, { filePath, data, password }),
  migrateData: (sourcePath: string, targetPath: string, password: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.VAULT_MIGRATE, { sourcePath, targetPath, password }),
  isElectron: true
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);
