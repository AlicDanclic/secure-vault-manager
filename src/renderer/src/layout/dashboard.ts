export function dashboardTemplate(): string {
  return `
    <div id="view-dashboard" class="absolute inset-0 flex flex-col p-8 transition-opacity duration-300">
      <div class="flex-1 bg-neutral-800/50 border border-neutral-700 rounded-lg overflow-hidden shadow-sm flex flex-col min-h-0">
        <div class="flex-1 overflow-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-neutral-800 border-b border-neutral-700 sticky top-0 z-10 shadow-sm">
              <tr>
                <th class="px-6 py-4 font-semibold text-neutral-300 w-16 bg-neutral-800">#</th>
                <th class="px-6 py-4 font-semibold text-neutral-300 w-1/4 bg-neutral-800">网站 / 软件</th>
                <th class="px-6 py-4 font-semibold text-neutral-300 w-1/4 bg-neutral-800">账户名</th>
                <th class="px-6 py-4 font-semibold text-neutral-300 bg-neutral-800">密码 (加密存储)</th>
                <th class="px-6 py-4 font-semibold text-neutral-300 w-48 text-right bg-neutral-800">操作</th>
              </tr>
            </thead>
            <tbody id="password-list" class="divide-y divide-neutral-700/50"></tbody>
          </table>
        </div>
      </div>
      <div id="empty-state" class="hidden flex-col items-center justify-center py-12 text-neutral-500 absolute inset-0 pointer-events-none">
        <p>无数据</p>
      </div>
      <div class="mt-4 text-xs text-neutral-500 text-center flex justify-center items-center gap-2 shrink-0">
        <i data-lucide="hard-drive" class="w-3 h-3"></i>
        <span id="storage-path-display">未配置路径</span>
      </div>
    </div>`;
}
