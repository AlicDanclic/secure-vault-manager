import { dom } from './dom';
import { appState } from './state';
import { showToast } from './ui';
import { getErrorMessage } from './utils';
import { loadDataFromDisk } from './vault';

export async function handleMigration(): Promise<void> {
  const sourcePath = dom.settings.legacyPath.value.trim();
  const targetPath = dom.settings.encryptedPath.value.trim();
  const password = dom.settings.migratePassword.value || dom.settings.password.value;

  if (!sourcePath || !targetPath || !password || sourcePath === targetPath) {
    showToast(sourcePath === targetPath ? '目标文件不能覆盖源文件' : '请填写源路径、目标路径和主密码', 'error');
    return;
  }

  try {
    const result = await window.electronAPI.migrateData(sourcePath, targetPath, password);
    appState.storagePath = targetPath;
    appState.masterPassword = password;
    localStorage.setItem('sv_storage_path', targetPath);
    dom.settings.path.value = targetPath;
    dom.settings.password.value = password;
    await loadDataFromDisk();
    showToast(`已迁移 ${result.count} 条记录`, 'success');
  } catch (err) {
    showToast('迁移失败: ' + getErrorMessage(err), 'error');
  }
}
