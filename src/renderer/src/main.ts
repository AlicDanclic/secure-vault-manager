import type { ElectronAPI } from '../../preload/index.d';
import { dom } from './dom';
import { bindEvents } from './events';
import { mountLayout } from './layout';
import { runGenerator } from './password';
import { appState } from './state';
import { renderTable } from './table';
import { updateStatusDisplay } from './ui';

declare global {
  interface Window {
    electronAPI: ElectronAPI;
    lucide: {
      createIcons: () => void;
    };
  }
}

async function init(): Promise<void> {
  mountLayout();
  window.lucide.createIcons();
  dom.settings.path.value = appState.storagePath;
  updateStatusDisplay();
  updateStatusDisplay('warn', appState.storagePath ? '需要主密码' : '未配置路径');
  bindEvents();
  renderTable();
  runGenerator();
}

init();
