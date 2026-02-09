const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    frame: false, // 隐藏原生标题栏，使用我们在 HTML 中画的
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true, // 安全设置：隔离上下文
      nodeIntegration: false  // 安全设置：禁用渲染进程直接使用 Node
    }
  });

  win.loadFile('index.html');
  
  // 开发环境可以打开下面这行调试
  // win.webContents.openDevTools();

  // --- 窗口控制事件 ---
  ipcMain.on('window:minimize', () => win.minimize());
  ipcMain.on('window:close', () => win.close());
}

// --- 文件系统操作接口 ---

// 读取数据
ipcMain.handle('file:load', async (event, filePath) => {
  if (!filePath) return null;
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
    return []; // 文件不存在返回空数组
  } catch (err) {
    console.error('Read file error:', err);
    throw err;
  }
});

// 保存数据
ipcMain.handle('file:save', async (event, { filePath, data }) => {
  if (!filePath) return { success: false, message: 'No path provided' };
  try {
    // 为了美观，格式化 JSON 保存
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return { success: true };
  } catch (err) {
    console.error('Write file error:', err);
    throw err;
  }
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});