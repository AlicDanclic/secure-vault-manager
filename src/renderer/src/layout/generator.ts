export function generatorTemplate(): string {
  return `
    <div id="view-generator" class="absolute inset-0 hidden flex flex-col p-8 overflow-auto items-center justify-center bg-neutral-900 transition-opacity duration-300">
      <div class="w-full max-w-lg space-y-8">
        <div class="relative group">
          <div id="gen-result" class="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-8 text-center text-3xl font-mono text-white tracking-wider break-all shadow-2xl min-h-[100px] flex items-center justify-center">点击生成</div>
          <button id="btn-gen-copy" class="absolute top-2 right-2 p-2 text-neutral-500 hover:text-white bg-neutral-700/50 hover:bg-neutral-700 rounded-lg transition-colors opacity-0 group-hover:opacity-100" title="复制">
            <i data-lucide="copy" class="w-4 h-4"></i>
          </button>
        </div>

        <div class="bg-neutral-800/50 border border-neutral-700 rounded-xl p-6 space-y-6">
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <label class="text-sm font-medium text-neutral-300">密码长度</label>
              <span id="gen-length-val" class="text-lg font-bold text-white">16</span>
            </div>
            <input type="range" id="gen-length" min="6" max="64" value="16" class="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer">
          </div>

          <div class="grid grid-cols-2 gap-4">
            ${optionTemplate('chk-upper', '大写字母 (A-Z)')}
            ${optionTemplate('chk-lower', '小写字母 (a-z)')}
            ${optionTemplate('chk-number', '数字 (0-9)')}
            ${optionTemplate('chk-symbol', '特殊符号 (!@#)')}
          </div>

          <button id="btn-generate" class="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-bold shadow-lg shadow-blue-950/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
            <i data-lucide="refresh-cw" class="w-5 h-5"></i>
            生成新密码
          </button>
        </div>
      </div>
    </div>`;
}

function optionTemplate(id: string, label: string): string {
  return `<label class="flex items-center gap-3 p-3 bg-neutral-800 rounded-lg border border-neutral-700 cursor-pointer hover:border-neutral-600 transition-colors">
    <input type="checkbox" id="${id}" checked class="w-4 h-4 rounded border-neutral-600 bg-neutral-700 text-neutral-900 focus:ring-white focus:ring-offset-neutral-800">
    <span class="text-sm text-neutral-300">${label}</span>
  </label>`;
}
