import { dom } from './dom';
import { appState } from './state';
import type { StatusType, ToastType, ViewName } from './types';

export function switchView(viewName: ViewName): void {
  appState.currentView = viewName;
  Object.values(dom.views).forEach(el => el.classList.add('hidden'));
  dom.views[viewName].classList.remove('hidden');

  const activeClass = 'bg-white/10 text-white';
  const inactiveClass = 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200';
  dom.nav.dashboard.className = navClass(viewName === 'dashboard' ? activeClass : inactiveClass);
  dom.nav.generator.className = navClass(viewName === 'generator' ? activeClass : inactiveClass);

  dom.headerTitle.textContent = viewName === 'generator' ? '强密码生成器' : '密码库';
  dom.headerSearch.style.visibility = viewName === 'generator' ? 'hidden' : 'visible';
  dom.btnAdd.style.visibility = viewName === 'generator' ? 'hidden' : 'visible';
}

export function openModal(name: keyof typeof dom.modals): void {
  const el = dom.modals[name];
  const content = el.querySelector('div')!;
  el.classList.remove('hidden');
  requestAnimationFrame(() => {
    el.classList.remove('opacity-0');
    content.classList.remove('scale-95');
    content.classList.add('scale-100');
  });
}

export function closeModal(name: keyof typeof dom.modals): void {
  const el = dom.modals[name];
  const content = el.querySelector('div')!;
  el.classList.add('opacity-0');
  content.classList.remove('scale-100');
  content.classList.add('scale-95');
  setTimeout(() => el.classList.add('hidden'), 200);
}

export function updateStatusDisplay(type?: StatusType, msg?: string): void {
  const map: Record<StatusType, string> = {
    success: 'text-neutral-200',
    warn: 'text-neutral-300',
    error: 'text-neutral-400',
    loading: 'text-neutral-300'
  };

  if (msg) {
    dom.statusText.textContent = `● ${msg}`;
    dom.statusText.className = `text-xs truncate ${type ? map[type] : 'text-neutral-500'}`;
  }

  dom.pathDisplay.textContent = appState.storagePath ? `存储: ${appState.storagePath}` : '未设置存储路径';
  dom.pathDisplay.className = appState.storagePath ? 'text-xs text-neutral-200 font-mono' : 'text-xs text-neutral-300';
  dom.encryptionStatus.textContent = appState.masterPassword ? 'AES-256-GCM 已解锁' : '等待主密码解锁';
  dom.encryptionStatus.className = appState.masterPassword ? 'text-xs text-neutral-200' : 'text-xs text-neutral-300';
}

export function showToast(msg: string, type: ToastType = 'success'): void {
  const el = document.createElement('div');
  const bg = type === 'error' ? 'bg-red-600' : 'bg-blue-600';
  el.className = `${bg} text-white px-4 py-3 rounded shadow-lg text-sm toast-enter flex items-center gap-2`;
  el.innerHTML = `<span>${msg}</span>`;
  document.getElementById('toast-container')!.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(100%)';
    el.style.transition = 'all 0.3s';
    setTimeout(() => el.remove(), 300);
  }, 2500);
}

export function resetEntryForm(): void {
  dom.entryForm.reset();
  document.getElementById('entry-id')!.setAttribute('value', '');
  document.getElementById('modal-title')!.textContent = '新建';
}

function navClass(stateClass: string): string {
  return `flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors nav-item ${stateClass}`;
}
