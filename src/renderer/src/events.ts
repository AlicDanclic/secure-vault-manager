import { $, dom } from './dom';
import { handleEntrySubmit } from './entry-form';
import { handleMigration } from './migration';
import { generatePassword, runGenerator } from './password';
import { appState } from './state';
import { renderTable } from './table';
import { closeModal, openModal, resetEntryForm, showToast, switchView } from './ui';
import { ensureVaultUnlocked, loadDataFromDisk } from './vault';

export function bindEvents(): void {
  $<HTMLDivElement>('btn-close').addEventListener('click', () => window.electronAPI.close());
  $<HTMLDivElement>('btn-min').addEventListener('click', () => window.electronAPI.minimize());
  dom.nav.dashboard.addEventListener('click', () => switchView('dashboard'));
  dom.nav.generator.addEventListener('click', () => switchView('generator'));
  dom.nav.settings.addEventListener('click', () => openModal('settings'));
  dom.btnAdd.addEventListener('click', openEntryModal);
  $<HTMLButtonElement>('btn-cancel-entry').addEventListener('click', () => closeModal('entry'));
  $<HTMLButtonElement>('btn-cancel-settings').addEventListener('click', () => closeModal('settings'));
  $<HTMLButtonElement>('btn-save-settings').addEventListener('click', unlockVault);
  $<HTMLButtonElement>('btn-migrate').addEventListener('click', handleMigration);
  dom.entryForm.addEventListener('submit', handleEntrySubmit);
  dom.searchInput.addEventListener('input', updateSearch);
  bindGeneratorEvents();
}

function openEntryModal(): void {
  if (!ensureVaultUnlocked()) return;
  resetEntryForm();
  openModal('entry');
}

async function unlockVault(): Promise<void> {
  const path = dom.settings.path.value.trim();
  if (!path) return;
  appState.storagePath = path;
  appState.masterPassword = dom.settings.password.value;
  localStorage.setItem('sv_storage_path', path);
  await loadDataFromDisk();
  if (appState.masterPassword) {
    closeModal('settings');
    showToast('保险库已解锁', 'success');
  }
}

function updateSearch(e: Event): void {
  appState.searchQuery = (e.target as HTMLInputElement).value.toLowerCase();
  renderTable();
}

function bindGeneratorEvents(): void {
  dom.gen.lengthSlider.addEventListener('input', e => {
    dom.gen.lengthVal.textContent = (e.target as HTMLInputElement).value;
    runGenerator();
  });
  [dom.gen.chkUpper, dom.gen.chkLower, dom.gen.chkNumber, dom.gen.chkSymbol].forEach(chk => {
    chk.addEventListener('change', runGenerator);
  });
  dom.gen.btnGen.addEventListener('click', runGenerator);
  dom.gen.btnCopy.addEventListener('click', () => {
    navigator.clipboard.writeText(dom.gen.result.textContent || '');
    showToast('密码已复制', 'success');
  });
  dom.btnQuickGen.addEventListener('click', quickGenerate);
}

function quickGenerate(): void {
  const pwd = generatePassword(20, { upper: true, lower: true, number: true, symbol: true });
  const input = $<HTMLInputElement>('password');
  input.value = pwd;
  input.classList.add('bg-neutral-700/60');
  setTimeout(() => input.classList.remove('bg-neutral-700/60'), 200);
}
