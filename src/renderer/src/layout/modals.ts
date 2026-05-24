export function modalsTemplate(): string {
  return `${entryModalTemplate()}${settingsModalTemplate()}`;
}

function entryModalTemplate(): string {
  return `
    <div id="modal-entry" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 hidden opacity-0 transition-opacity duration-200">
      <div class="bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl w-[480px] p-6 transform scale-95 transition-transform duration-200">
        <h3 class="text-lg font-semibold text-white mb-4" id="modal-title">新建</h3>
        <form id="entry-form" class="space-y-4">
          <input type="hidden" id="entry-id">
          ${inputGroup('网站', 'site', 'text', '网站')}
          ${inputGroup('账户', 'username', 'text', '账户')}
          <div>
            <label class="text-xs text-neutral-400 uppercase">密码</label>
            <div class="relative flex gap-2 mt-1">
              <input type="text" id="password" required class="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg py-2 px-3 text-neutral-200 font-mono focus:border-white focus:outline-none">
            <button type="button" id="btn-quick-gen" class="px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors border border-blue-500" title="生成强密码">
                <i data-lucide="wand-2" class="w-4 h-4"></i>
              </button>
            </div>
          </div>
          <div class="flex justify-end gap-3 pt-4">
            <button type="button" id="btn-cancel-entry" class="px-4 py-2 text-neutral-400 hover:text-white">取消</button>
            <button type="submit" class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg">保存</button>
          </div>
        </form>
      </div>
    </div>`;
}

function settingsModalTemplate(): string {
  return `
    <div id="modal-settings" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 hidden opacity-0 transition-opacity duration-200">
      <div class="bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl w-[500px] p-6 transform scale-95 transition-transform duration-200">
        <h3 class="text-lg font-semibold text-white mb-4">设置</h3>
        <div class="space-y-4">
          ${pathInput('加密数据文件路径 (.json)', 'settings-path', '例如: D:\\passwords.json')}
          ${passwordInput('主密码', 'settings-password', '用于加密和解密本地数据')}
          <div class="pt-4 border-t border-neutral-800 space-y-3">
            <div><h4 class="text-sm font-semibold text-white">旧版明文 JSON 迁移</h4><p class="text-[10px] text-neutral-500 mt-1">读取旧数组格式 JSON，生成新的加密 JSON 文件。</p></div>
            ${pathInput('旧明文文件路径', 'legacy-source-path', '例如: D:\\passwords-old.json')}
            ${pathInput('新加密文件路径', 'legacy-target-path', '例如: D:\\passwords-secure.json')}
            ${passwordInput('迁移主密码', 'migration-password', '留空则使用上方主密码')}
            <button id="btn-migrate" class="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center justify-center gap-2"><i data-lucide="file-lock-2" class="w-4 h-4"></i>生成加密 JSON</button>
          </div>
          <div class="flex justify-end gap-3 pt-4 border-t border-neutral-800">
            <button id="btn-cancel-settings" class="px-4 py-2 text-neutral-400 hover:text-white">关闭</button>
            <button id="btn-save-settings" class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg">解锁 / 创建</button>
          </div>
        </div>
      </div>
    </div>`;
}

function inputGroup(label: string, id: string, type: string, name: string): string {
  return `<div><label class="text-xs text-neutral-400 uppercase">${label}</label><input type="${type}" id="${id}" required class="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-2 px-3 mt-1 text-neutral-200 focus:border-white focus:outline-none" placeholder="${name}"></div>`;
}

function pathInput(label: string, id: string, placeholder: string): string {
  return `<div><label class="text-xs text-neutral-400 uppercase">${label}</label><input type="text" id="${id}" class="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-2 px-3 mt-1 text-neutral-300 font-mono text-xs focus:border-white focus:outline-none" placeholder="${placeholder}"></div>`;
}

function passwordInput(label: string, id: string, placeholder: string): string {
  return `<div><label class="text-xs text-neutral-400 uppercase">${label}</label><input type="password" id="${id}" class="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-2 px-3 mt-1 text-neutral-300 focus:border-white focus:outline-none" placeholder="${placeholder}"></div>`;
}
