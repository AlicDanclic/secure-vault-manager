import { appState } from './state';
import { renderTable } from './table';
import { openModal, showToast, updateStatusDisplay } from './ui';
import { getErrorMessage } from './utils';

export async function loadDataFromDisk(): Promise<void> {
  if (!appState.masterPassword) {
    updateStatusDisplay('warn', '需要主密码');
    showToast('请先在设置中输入主密码', 'error');
    return;
  }

  updateStatusDisplay('loading', '读取中...');
  try {
    const data = await window.electronAPI.loadData(appState.storagePath, appState.masterPassword);
    appState.entries = Array.isArray(data) ? data : [];
    appState.revealedIds.clear();
    updateStatusDisplay('success', data.length ? '就绪' : '新文件');
    if (!data.length) await saveDataToDisk();
    renderTable();
  } catch (err) {
    console.error(err);
    updateStatusDisplay('error', '读取失败');
    showToast('无法读取文件: ' + getErrorMessage(err), 'error');
  }
}

export async function saveDataToDisk(): Promise<boolean> {
  if (!appState.storagePath) return false;
  if (!appState.masterPassword) {
    updateStatusDisplay('error', '未解锁');
    showToast('请先在设置中输入主密码', 'error');
    return false;
  }

  try {
    await window.electronAPI.saveData(appState.storagePath, appState.entries, appState.masterPassword);
    updateStatusDisplay('success', '已保存');
    return true;
  } catch {
    updateStatusDisplay('error', '保存失败');
    showToast('保存失败', 'error');
    return false;
  }
}

export function ensureVaultUnlocked(): boolean {
  if (!appState.storagePath) {
    showToast('请先设置加密数据文件路径', 'error');
    openModal('settings');
    return false;
  }
  if (!appState.masterPassword) {
    showToast('请先输入主密码解锁', 'error');
    openModal('settings');
    return false;
  }
  return true;
}
