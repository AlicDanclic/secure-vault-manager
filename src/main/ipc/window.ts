import type { BrowserWindow } from 'electron';
import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '../../shared/constants/ipc';

export function registerWindowIpc(win: BrowserWindow): void {
  ipcMain.on(IPC_CHANNELS.WINDOW_MINIMIZE, () => win.minimize());
  ipcMain.on(IPC_CHANNELS.WINDOW_CLOSE, () => win.close());
}
