// --- 状态管理 ---
let appState = {
    entries: [],
    storagePath: localStorage.getItem('sv_storage_path') || '',
    revealedIds: new Set(),
    searchQuery: ''
};

// --- DOM 元素引用 ---
const dom = {
    list: document.getElementById('password-list'),
    totalCount: document.getElementById('total-count'),
    emptyState: document.getElementById('empty-state'),
    statusText: document.getElementById('status-text'),
    pathDisplay: document.getElementById('storage-path-display'),
    searchInput: document.getElementById('search-input'),
    entryForm: document.getElementById('entry-form'),
    modals: {
        entry: document.getElementById('modal-entry'),
        settings: document.getElementById('modal-settings')
    }
};

// --- 初始化 ---
async function init() {
    lucide.createIcons();
    
    // 设置默认路径显示
    dom.modals.settings.querySelector('#settings-path').value = appState.storagePath;
    updateStatusDisplay();

    // 加载数据
    if (appState.storagePath) {
        await loadDataFromDisk();
    } else {
        updateStatusDisplay('warn', '未配置路径');
    }

    bindEvents();
    renderTable();
}

// --- 事件绑定 ---
function bindEvents() {
    // 窗口控制
    document.getElementById('btn-close').addEventListener('click', () => window.electronAPI.close());
    document.getElementById('btn-min').addEventListener('click', () => window.electronAPI.minimize());

    // 导航
    document.getElementById('nav-settings').addEventListener('click', () => openModal('settings'));
    document.getElementById('btn-add').addEventListener('click', () => {
        resetEntryForm();
        openModal('entry');
    });

    // 模态框按钮
    document.getElementById('btn-cancel-entry').addEventListener('click', () => closeModal('entry'));
    document.getElementById('btn-cancel-settings').addEventListener('click', () => closeModal('settings'));
    
    // 设置保存
    document.getElementById('btn-save-settings').addEventListener('click', async () => {
        const path = document.getElementById('settings-path').value.trim();
        if (path) {
            appState.storagePath = path;
            localStorage.setItem('sv_storage_path', path);
            await loadDataFromDisk(); // 尝试重新加载
            closeModal('settings');
            showToast('路径已更新', 'success');
        }
    });

    // 表单提交
    dom.entryForm.addEventListener('submit', handleEntrySubmit);

    // 搜索
    dom.searchInput.addEventListener('input', (e) => {
        appState.searchQuery = e.target.value.toLowerCase();
        renderTable();
    });
}

// --- 核心逻辑 ---

async function loadDataFromDisk() {
    updateStatusDisplay('loading', '读取中...');
    try {
        const data = await window.electronAPI.loadData(appState.storagePath);
        if (Array.isArray(data)) {
            appState.entries = data;
            updateStatusDisplay('success', '就绪');
        } else {
            // 文件可能不存在，使用空数组
            appState.entries = [];
            updateStatusDisplay('success', '新文件');
            // 尝试创建空文件
            await saveDataToDisk();
        }
        renderTable();
    } catch (err) {
        console.error(err);
        updateStatusDisplay('error', '读取失败');
        showToast('无法读取文件: ' + err.message, 'error');
    }
}

async function saveDataToDisk() {
    if (!appState.storagePath) return;
    try {
        await window.electronAPI.saveData(appState.storagePath, appState.entries);
        updateStatusDisplay('success', '已保存');
    } catch (err) {
        updateStatusDisplay('error', '保存失败');
        showToast('保存失败', 'error');
    }
}

async function handleEntrySubmit(e) {
    e.preventDefault();
    const idVal = document.getElementById('entry-id').value;
    const site = document.getElementById('site').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (idVal) {
        // 编辑
        const id = parseInt(idVal);
        const index = appState.entries.findIndex(e => e.id === id);
        if (index !== -1) {
            appState.entries[index] = { ...appState.entries[index], site, username, password };
        }
    } else {
        // 新增
        const newId = appState.entries.length > 0 ? Math.max(...appState.entries.map(e => e.id)) + 1 : 1;
        appState.entries.push({ id: newId, site, username, password });
    }

    await saveDataToDisk();
    closeModal('entry');
    renderTable();
    showToast('条目已保存', 'success');
}

// --- UI 渲染 ---

function renderTable() {
    dom.list.innerHTML = '';
    const filtered = appState.entries.filter(item => 
        item.site.toLowerCase().includes(appState.searchQuery) || 
        item.username.toLowerCase().includes(appState.searchQuery)
    );

    dom.totalCount.textContent = appState.entries.length;
    dom.emptyState.style.display = filtered.length === 0 ? 'flex' : 'none';

    filtered.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-800/80 transition-colors group border-b border-slate-800/50';
        
        const isRevealed = appState.revealedIds.has(item.id);
        // 视觉上的加密效果：如果是隐藏状态，显示哈希样式，否则显示明文
        const displayPwd = isRevealed ? item.password : '●●●●●●●●●●●●';
        const pwdClass = isRevealed ? 'text-green-400 font-mono' : 'text-slate-600 font-sans tracking-widest';

        tr.innerHTML = `
            <td class="px-6 py-4 text-slate-500 text-xs">${String(index + 1).padStart(2, '0')}</td>
            <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-xs uppercase border border-slate-700">
                        ${item.site.substring(0, 2)}
                    </div>
                    <span class="font-medium text-slate-200">${escapeHtml(item.site)}</span>
                </div>
            </td>
            <td class="px-6 py-4 text-slate-400 select-all">${escapeHtml(item.username)}</td>
            <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                    <span class="${pwdClass} truncate max-w-[150px] inline-block align-middle transition-all duration-300">
                        ${escapeHtml(displayPwd)}
                    </span>
                    ${isRevealed ? `<button class="btn-copy p-1 hover:text-white text-slate-500" data-pwd="${escapeHtml(item.password)}"><i data-lucide="copy" class="w-3 h-3"></i></button>` : ''}
                </div>
            </td>
            <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button class="btn-reveal p-2 rounded hover:bg-slate-700 ${isRevealed ? 'text-yellow-500' : 'text-blue-500'}" data-id="${item.id}" title="${isRevealed ? '隐藏' : '提取/解密'}">
                        <i data-lucide="${isRevealed ? 'eye-off' : 'key'}" class="w-4 h-4"></i>
                    </button>
                    <button class="btn-edit p-2 rounded hover:bg-slate-700 text-slate-400" data-id="${item.id}" title="修改">
                        <i data-lucide="edit-2" class="w-4 h-4"></i>
                    </button>
                    <button class="btn-delete p-2 rounded hover:bg-slate-700 text-red-500" data-id="${item.id}" title="删除">
                        <i data-lucide="trash" class="w-4 h-4"></i>
                    </button>
                </div>
            </td>
        `;
        dom.list.appendChild(tr);
    });

    // 绑定动态生成的按钮事件 (Event Delegation)
    lucide.createIcons();
    attachDynamicEvents();
}

function attachDynamicEvents() {
    // 提取/解密
    document.querySelectorAll('.btn-reveal').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            if (appState.revealedIds.has(id)) appState.revealedIds.delete(id);
            else appState.revealedIds.add(id);
            renderTable();
        });
    });

    // 编辑
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = appState.entries.find(e => e.id === parseInt(btn.dataset.id));
            if (item) {
                document.getElementById('entry-id').value = item.id;
                document.getElementById('site').value = item.site;
                document.getElementById('username').value = item.username;
                document.getElementById('password').value = item.password;
                document.getElementById('modal-title').textContent = '编辑';
                openModal('entry');
            }
        });
    });

    // 删除
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', async () => {
            if (confirm('确认删除此条目？')) {
                const id = parseInt(btn.dataset.id);
                appState.entries = appState.entries.filter(e => e.id !== id);
                await saveDataToDisk();
                renderTable();
            }
        });
    });

    // 复制
    document.querySelectorAll('.btn-copy').forEach(btn => {
        btn.addEventListener('click', () => {
            navigator.clipboard.writeText(btn.dataset.pwd);
            showToast('已复制', 'success');
        });
    });
}

// --- 辅助函数 ---

function openModal(name) {
    const el = dom.modals[name];
    const content = el.querySelector('div');
    el.classList.remove('hidden');
    // 需要一点延迟让 display:block 生效后再加 opacity
    requestAnimationFrame(() => {
        el.classList.remove('opacity-0');
        content.classList.remove('scale-95');
        content.classList.add('scale-100');
    });
}

function closeModal(name) {
    const el = dom.modals[name];
    const content = el.querySelector('div');
    el.classList.add('opacity-0');
    content.classList.remove('scale-100');
    content.classList.add('scale-95');
    setTimeout(() => el.classList.add('hidden'), 200);
}

function resetEntryForm() {
    dom.entryForm.reset();
    document.getElementById('entry-id').value = '';
    document.getElementById('modal-title').textContent = '新建';
}

function updateStatusDisplay(type, msg) {
    const map = {
        'success': 'text-emerald-500',
        'warn': 'text-yellow-500',
        'error': 'text-red-500',
        'loading': 'text-blue-500'
    };
    
    if (msg) {
        dom.statusText.textContent = `● ${msg}`;
        dom.statusText.className = `text-xs truncate ${map[type] || 'text-slate-500'}`;
    }

    if (appState.storagePath) {
        dom.pathDisplay.textContent = `存储: ${appState.storagePath}`;
        dom.pathDisplay.className = "text-xs text-emerald-500 font-mono";
    } else {
        dom.pathDisplay.textContent = "未设置存储路径";
        dom.pathDisplay.className = "text-xs text-yellow-500";
    }
}

function showToast(msg, type = 'success') {
    const container = document.getElementById('toast-container');
    const el = document.createElement('div');
    const bg = type === 'error' ? 'bg-red-600' : 'bg-blue-600';
    el.className = `${bg} text-white px-4 py-3 rounded shadow-lg text-sm toast-enter flex items-center gap-2`;
    el.innerHTML = `<span>${msg}</span>`;
    container.appendChild(el);
    setTimeout(() => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(100%)';
        el.style.transition = 'all 0.3s';
        setTimeout(() => el.remove(), 300);
    }, 2500);
}

function escapeHtml(text) {
    if (!text) return '';
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// 启动
init();