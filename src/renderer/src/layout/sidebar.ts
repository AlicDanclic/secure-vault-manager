export function sidebarTemplate(): string {
  return `
    <aside class="w-64 bg-neutral-950 border-r border-neutral-800 flex flex-col shrink-0">
      <div class="h-10 flex items-center px-4 drag-region">
        <div class="flex gap-2 group">
          <div id="btn-close" class="w-3 h-3 rounded-full text-neutral-900 bg-neutral-300 hover:bg-neutral-200 transition-colors cursor-pointer no-drag flex items-center justify-center text-neutral-900 font-bold text-[8px]"></div>
          <div id="btn-min" class="w-3 h-3 rounded-full text-neutral-900 bg-neutral-400 hover:bg-neutral-300 transition-colors cursor-pointer no-drag flex items-center justify-center text-neutral-900 font-bold text-[8px]"></div>
          <div class="w-3 h-3 rounded-full bg-neutral-600 hover:bg-neutral-500 transition-colors cursor-pointer no-drag opacity-50 cursor-not-allowed"></div>
        </div>
      </div>

      <div class="px-6 py-4 flex items-center gap-3 border-b border-neutral-800">
        <div class="p-2 bg-white rounded-lg shadow-lg shadow-black/20">
          <i data-lucide="shield" class="w-5 h-5 text-neutral-950"></i>
        </div>
        <div>
          <h1 class="font-bold text-lg tracking-tight text-white">SecureVault</h1>
          <p class="text-xs text-neutral-500">v1.2.1 (Fix)</p>
        </div>
      </div>

      <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
        <div id="nav-dashboard" class="flex items-center gap-3 px-3 py-2 rounded-md bg-white/10 text-white cursor-pointer transition-colors nav-item">
          <i data-lucide="server" class="w-4 h-4"></i>
          <span class="text-sm font-medium flex-1">所有项目</span>
          <span id="total-count" class="text-xs bg-neutral-800 px-2 py-0.5 rounded-full text-neutral-500">0</span>
        </div>
        <div id="nav-generator" class="flex items-center gap-3 px-3 py-2 rounded-md text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 cursor-pointer transition-colors nav-item">
          <i data-lucide="key" class="w-4 h-4"></i>
          <span class="text-sm font-medium flex-1">强密码生成器</span>
        </div>
        <div id="nav-settings" class="flex items-center gap-3 px-3 py-2 rounded-md text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 cursor-pointer transition-colors">
          <i data-lucide="settings" class="w-4 h-4"></i>
          <span class="text-sm font-medium flex-1">设置 / 存储路径</span>
        </div>
      </nav>

      <div class="p-4 border-t border-neutral-800 bg-neutral-950">
        <div class="flex items-center gap-3 p-2 rounded-md hover:bg-neutral-900 transition-colors">
          <div class="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-xs font-bold text-white">A</div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-white truncate">Admin</p>
            <p id="status-text" class="text-xs text-neutral-400 truncate">● 正在连接...</p>
            <p id="encryption-status" class="text-xs text-neutral-400 truncate">等待主密码解锁</p>
          </div>
        </div>
      </div>
    </aside>`;
}
