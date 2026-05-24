import { dashboardTemplate } from './dashboard';
import { generatorTemplate } from './generator';
import { modalsTemplate } from './modals';
import { sidebarTemplate } from './sidebar';

export function mountLayout(): void {
  document.body.className = 'bg-neutral-900 text-neutral-200 font-sans h-screen flex overflow-hidden selection:bg-white selection:text-neutral-950';
  document.body.innerHTML = `
    ${sidebarTemplate()}
    <main class="flex-1 flex flex-col min-w-0 bg-neutral-900 relative h-full">
      ${headerTemplate()}
      <div class="flex-1 overflow-hidden relative min-h-0">
        ${dashboardTemplate()}
        ${generatorTemplate()}
      </div>
      <div id="toast-container" class="absolute bottom-4 right-4 flex flex-col gap-2 pointer-events-none z-50"></div>
    </main>
    ${modalsTemplate()}`;
}

function headerTemplate(): string {
  return `
    <header class="h-16 border-b border-neutral-800 flex items-center justify-between px-8 bg-neutral-900/50 backdrop-blur-md shrink-0 drag-region z-20">
      <div class="flex items-center gap-4 flex-1">
        <h2 id="header-title" class="text-xl font-semibold text-white">密码库</h2>
        <div id="header-search-container" class="flex items-center flex-1 gap-4">
          <div class="h-4 w-px bg-neutral-700 mx-2"></div>
          <div class="relative group w-64 no-drag">
            <i data-lucide="search" class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 w-4 h-4 group-focus-within:text-white transition-colors"></i>
            <input type="text" id="search-input" placeholder="搜索..." class="w-full bg-neutral-800 border border-neutral-700 text-sm text-neutral-200 rounded-md pl-9 pr-4 py-2 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all placeholder:text-neutral-500">
          </div>
        </div>
      </div>
      <button id="btn-add" class="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-all shadow-lg shadow-blue-950/20 active:scale-95 no-drag">
        <i data-lucide="plus" class="w-4 h-4"></i>
        新建
      </button>
    </header>`;
}
