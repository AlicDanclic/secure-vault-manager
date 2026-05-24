import { $ } from './dom';
import { appState } from './state';
import { renderTable } from './table';
import { closeModal, showToast } from './ui';
import { ensureVaultUnlocked, saveDataToDisk } from './vault';

export async function handleEntrySubmit(e: SubmitEvent): Promise<void> {
  e.preventDefault();
  if (!ensureVaultUnlocked()) return;

  const idVal = $<HTMLInputElement>('entry-id').value;
  const entry = {
    site: $<HTMLInputElement>('site').value,
    username: $<HTMLInputElement>('username').value,
    password: $<HTMLInputElement>('password').value
  };

  if (idVal) {
    const id = Number.parseInt(idVal, 10);
    const index = appState.entries.findIndex(item => item.id === id);
    if (index !== -1) appState.entries[index] = { ...appState.entries[index], ...entry };
  } else {
    const id = appState.entries.length ? Math.max(...appState.entries.map(item => item.id)) + 1 : 1;
    appState.entries.push({ id, ...entry });
  }

  if (!(await saveDataToDisk())) return;
  closeModal('entry');
  renderTable();
  showToast('条目已保存', 'success');
}
