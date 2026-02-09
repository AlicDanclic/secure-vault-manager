const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // 窗口控制
  minimize: () => ipcRenderer.send('window:minimize'),
  close: () => ipcRenderer.send('window:close'),

  // 数据操作 (返回 Promise)
  loadData: (filePath) => ipcRenderer.invoke('file:load', filePath),
  saveData: (filePath, data) => ipcRenderer.invoke('file:save', { filePath, data }),
  
  // 检查环境
  isElectron: true
});