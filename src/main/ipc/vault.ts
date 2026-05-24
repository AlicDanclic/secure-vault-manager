import fs from 'node:fs';
import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '../../shared/constants/ipc';
import type { LoadVaultRequest, MigrateVaultRequest, SaveVaultRequest } from '../../shared/types/vault';
import { decryptEntries, encryptEntries, readJsonFile } from '../utils/crypto-vault';

export function registerVaultIpc(): void {
  ipcMain.handle(IPC_CHANNELS.VAULT_LOAD, async (_event, { filePath, password }: LoadVaultRequest) => {
    if (!filePath) return [];
    if (!fs.existsSync(filePath)) return [];

    const payload = readJsonFile(filePath);
    if (Array.isArray(payload)) {
      throw new Error('检测到明文旧格式，请先使用迁移工具生成加密 JSON 文件');
    }

    return decryptEntries(payload, password);
  });

  ipcMain.handle(IPC_CHANNELS.VAULT_SAVE, async (_event, { filePath, data, password }: SaveVaultRequest) => {
    if (!filePath) return { success: false, message: 'No path provided' };

    const encryptedPayload = encryptEntries(data, password);
    fs.writeFileSync(filePath, JSON.stringify(encryptedPayload, null, 2), 'utf-8');
    return { success: true };
  });

  ipcMain.handle(IPC_CHANNELS.VAULT_MIGRATE, async (_event, { sourcePath, targetPath, password }: MigrateVaultRequest) => {
    if (!sourcePath || !targetPath) {
      return { success: false, count: 0 };
    }

    const legacyData = readJsonFile(sourcePath);
    if (!Array.isArray(legacyData)) {
      throw new Error('源文件不是旧版明文数组 JSON');
    }

    const encryptedPayload = encryptEntries(legacyData, password);
    fs.writeFileSync(targetPath, JSON.stringify(encryptedPayload, null, 2), 'utf-8');
    return { success: true, count: legacyData.length };
  });
}
