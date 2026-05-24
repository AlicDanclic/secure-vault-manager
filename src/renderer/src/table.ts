import { dom } from './dom';
import { appState } from './state';
import { ensureVaultUnlocked, saveDataToDisk } from './vault';
import { openModal, showToast } from './ui';
import { escapeHtml } from './utils';

export function renderTable(): void {
  dom.list.innerHTML = '';
  const filtered = appState.entries.filter(item =>
    item.site.toLowerCase().includes(appState.searchQuery) ||
    item.username.toLowerCase().includes(appState.searchQuery)
  );

  dom.totalCount.textContent = String(appState.entries.length);
  dom.emptyState.style.display = filtered.length === 0 ? 'flex' : 'none';
  filtered.forEach((item, index) => dom.list.appendChild(createRow(item, index)));
  window.lucide.createIcons();
  attachDynamicEvents();
}

function createRow(item: typeof appState.entries[number], index: number): HTMLTableRowElement {
  const tr = document.createElement('tr');
  const isRevealed = appState.revealedIds.has(item.id);
  const displayPwd = isRevealed ? item.password : '●●●●●●●●●●●●';
  const pwdClass = isRevealed ? 'text-white font-mono' : 'text-neutral-600 font-sans tracking-widest';
  tr.className = 'hover:bg-neutral-800/80 transition-colors group border-b border-neutral-800/50';
  tr.innerHTML = rowHtml(item, index, displayPwd, pwdClass, isRevealed);
  return tr;
}

function rowHtml(item: typeof appState.entries[number], index: number, displayPwd: string, pwdClass: string, isRevealed: boolean): string {
  return `
    <td class="px-6 py-4 text-neutral-500 text-xs">${String(index + 1).padStart(2, '0')}</td>
    <td class="px-6 py-4"><div class="flex items-center gap-3">
      <div class="w-8 h-8 rounded bg-neutral-800 flex items-center justify-center text-neutral-400 font-bold text-xs uppercase border border-neutral-700">${escapeHtml(item.site.substring(0, 2))}</div>
      <span class="font-medium text-neutral-200">${escapeHtml(item.site)}</span>
    </div></td>
    <td class="px-6 py-4 text-neutral-400 select-all">${escapeHtml(item.username)}</td>
    <td class="px-6 py-4"><div class="flex items-center gap-2">
      <span class="${pwdClass} truncate max-w-[150px] inline-block align-middle transition-all duration-300">${escapeHtml(displayPwd)}</span>
      ${isRevealed ? `<button class="btn-copy p-1 hover:text-white text-neutral-500" data-pwd="${escapeHtml(item.password)}"><i data-lucide="copy" class="w-3 h-3"></i></button>` : ''}
    </div></td>
    <td class="px-6 py-4 text-right"><div class="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
      <button class="btn-reveal p-2 rounded hover:bg-neutral-700 text-neutral-300" data-id="${item.id}" title="${isRevealed ? '隐藏' : '提取/解密'}"><i data-lucide="${isRevealed ? 'eye-off' : 'key'}" class="w-4 h-4"></i></button>
      <button class="btn-edit p-2 rounded hover:bg-neutral-700 text-neutral-400" data-id="${item.id}" title="修改"><i data-lucide="edit-2" class="w-4 h-4"></i></button>
      <button class="btn-delete p-2 rounded hover:bg-red-950/40 text-red-400 hover:text-red-300" data-id="${item.id}" title="删除"><i data-lucide="trash" class="w-4 h-4"></i></button>
    </div></td>`;
}

function attachDynamicEvents(): void {
  document.querySelectorAll<HTMLButtonElement>('.btn-reveal').forEach(btn => {
    btn.addEventListener('click', () => toggleReveal(Number.parseInt(btn.dataset.id || '', 10)));
  });
  document.querySelectorAll<HTMLButtonElement>('.btn-edit').forEach(btn => {
    btn.addEventListener('click', () => editEntry(Number.parseInt(btn.dataset.id || '', 10)));
  });
  document.querySelectorAll<HTMLButtonElement>('.btn-delete').forEach(btn => {
    btn.addEventListener('click', () => deleteEntry(Number.parseInt(btn.dataset.id || '', 10)));
  });
  document.querySelectorAll<HTMLButtonElement>('.btn-copy').forEach(btn => {
    btn.addEventListener('click', () => {
      navigator.clipboard.writeText(btn.dataset.pwd || '');
      showToast('已复制', 'success');
    });
  });
}

function toggleReveal(id: number): void {
  appState.revealedIds.has(id) ? appState.revealedIds.delete(id) : appState.revealedIds.add(id);
  renderTable();
}

function editEntry(id: number): void {
  if (!ensureVaultUnlocked()) return;
  const item = appState.entries.find(entry => entry.id === id);
  if (!item) return;
  setInput('entry-id', String(item.id));
  setInput('site', item.site);
  setInput('username', item.username);
  setInput('password', item.password);
  document.getElementById('modal-title')!.textContent = '编辑';
  openModal('entry');
}

async function deleteEntry(id: number): Promise<void> {
  if (!ensureVaultUnlocked() || !confirm('确认删除此条目？')) return;
  const previousEntries = appState.entries;
  appState.entries = appState.entries.filter(entry => entry.id !== id);
  if (!(await saveDataToDisk())) appState.entries = previousEntries;
  renderTable();
}

function setInput(id: string, value: string): void {
  (document.getElementById(id) as HTMLInputElement).value = value;
}
