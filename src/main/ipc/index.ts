import type { BrowserWindow } from 'electron';
import { registerVaultIpc } from './vault';
import { registerWindowIpc } from './window';

export function registerIpcHandlers(win: BrowserWindow): void {
  registerWindowIpc(win);
  registerVaultIpc();
}
