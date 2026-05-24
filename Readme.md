<p align="center">
  <img src="build/icon.png" alt="SecureVault Logo" width="120" height="120">
</p>

<h1 align="center">SecureVault</h1>

<p align="center">
  一款本地优先、黑白灰极简风格的 Electron 加密密码管理器。
</p>
<p align="center">
  <a href="https://github.com/AlicDanclic/secure-vault-manager/releases">
    <img alt="Version" src="https://img.shields.io/github/package-json/v/AlicDanclic/secure-vault-manager?style=flat-square">
  </a>
  <a href="LICENSE">
    <img alt="License" src="https://img.shields.io/badge/license-MIT-black?style=flat-square">
  </a>
</p>


---

## 📚 目录

- [项目简介](#-项目简介)
- [功能特性](#-功能特性)
- [技术栈](#-技术栈)
- [安装指南](#-安装指南)
- [快速上手](#-快速上手)
- [配置说明](#-配置说明)
- [项目结构](#-项目结构)
- [安全设计](#-安全设计)
- [开发脚本](#-开发脚本)
- [截图演示](#-截图演示)
- [测试与质量](#-测试与质量)
- [路线图](#-路线图)
- [贡献指南](#-贡献指南)
- [许可证](#-许可证)
- [致谢](#-致谢)

---

## 🎯 项目简介

SecureVault 是一个基于 Electron 的本地密码管理器，专注于本地 JSON 加密存储、极简桌面体验和安全的进程隔离架构。

> ⚠️ 主密码不会保存到本地。忘记主密码后，已加密的密码库文件无法恢复。

---

## ✨ 功能特性

### 核心功能

- 🔐 使用 AES-256-GCM 加密本地 JSON 密码库。
- 🧩 支持旧版明文 JSON 一键迁移为加密 JSON。
- 🗂️ 支持新增、编辑、删除、搜索密码条目。
- 👁️ 密码默认隐藏，可按需显示并复制。
- 🔑 内置强密码生成器，支持长度和字符集配置。

### 工程能力

- ✅ 使用 `electron-vite` 管理主进程、预加载脚本和渲染进程构建。
- ✅ 使用 TypeScript 组织主进程、preload、renderer 和 shared 类型。
- ✅ 开启 `contextIsolation: true` 和 `nodeIntegration: false`。
- ✅ preload 只暴露白名单 API，不暴露完整 `ipcRenderer`。

---

## 🧱 技术栈

| 模块 | 技术 |
| --- | --- |
| 桌面运行时 | Electron |
| 构建工具 | electron-vite / Vite |
| 语言 | TypeScript |
| UI | 原生 DOM + Tailwind CDN + Lucide Icons |
| 加密 | Node.js `crypto` / AES-256-GCM / scrypt |
| 打包 | electron-builder |

---

## 📦 安装指南

### 前置要求

- Node.js 18+
- npm 9+
- Windows / macOS / Linux

### 从源码安装

```bash
git clone https://github.com/[待补充]/secure-vault-manager.git
cd secure-vault-manager
npm install
```

### Docker

无。

### 包管理器

当前未发布到 npm / brew。

```bash
# [待补充]
npm install -g [待补充]
```

---

## 🚀 快速上手

### 启动开发环境

```bash
npm run dev
```

预期结果：

```bash
electron-vite dev
# Electron 窗口启动，进入 SecureVault 主界面
```

### 构建生产产物

```bash
npm run build
```

预期输出：

```bash
out/main/index.js
out/preload/index.js
out/renderer/index.html
```

### 启动 Web 预览服务

```bash
npm run serve
```

默认访问：

```bash
http://127.0.0.1:3003/
```

---

## 🔧 配置说明

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `PORT` | `3003` | Web 预览服务端口。 |
| 加密数据文件路径 | 无 | 在应用设置中填写，本地 JSON 文件路径。 |
| 主密码 | 无 | 用于加密和解密本地密码库，不会保存。 |
| 旧明文文件路径 | 无 | 迁移旧版明文 JSON 时使用。 |
| 新加密文件路径 | 无 | 迁移后生成的新加密 JSON 路径。 |

示例：

```bash
PORT=3003 npm run serve
```

---

## 🧩 API 文档

本项目不是对外发布的库，暂不提供公共 API。

Electron preload 暴露的内部 API：

```ts
window.electronAPI.loadData(filePath, password)
window.electronAPI.saveData(filePath, data, password)
window.electronAPI.migrateData(sourcePath, targetPath, password)
window.electronAPI.minimize()
window.electronAPI.close()
```

---

## 📁 项目结构

```text
.
├── src/
│   ├── main/          # Electron 主进程
│   ├── preload/       # 安全桥接层
│   ├── renderer/      # 渲染进程页面
│   └── shared/        # 共享类型与常量
├── build/             # 应用图标资源
├── config/            # 构建与打包配置
├── scripts/           # 工具脚本
├── tools/             # 本地 Web 预览服务
├── package.json
└── Readme.md
```

---

## 🛡️ 安全设计

- `contextIsolation: true`
- `nodeIntegration: false`
- 渲染进程不直接访问 Node.js API。
- 文件系统能力集中在主进程 IPC 中处理。
- preload 使用 `contextBridge.exposeInMainWorld` 暴露最小 API。
- 密码库使用 AES-256-GCM 加密，密钥由主密码通过 `scrypt` 派生。

> 💡 建议使用强主密码，并在迁移成功后妥善处理旧版明文 JSON 文件。

---

## 🧪 开发脚本

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 启动 Electron 开发环境。 |
| `npm run start` | 预览构建后的 Electron 应用。 |
| `npm run serve` | 启动 3003 Web 预览服务。 |
| `npm run typecheck` | 执行 TypeScript 类型检查。 |
| `npm run build` | 构建主进程、preload 和 renderer。 |
| `npm run dist` | 构建并使用 electron-builder 打包。 |

---

## 🖼️ 截图演示

![SecureVault Screenshot]([待补充])

> 截图或 GIF 演示链接待补充。

---

## ✅ 测试与质量

当前状态：

- [x] TypeScript 类型检查
- [x] Electron/Vite 构建
- [x] 本地 Web 预览服务
- [ ] 单元测试
- [ ] E2E 测试
- [ ] GitHub Actions CI

CI 徽章：[待补充]

代码覆盖率：[待补充]

---

## 🗺️ 路线图

- [x] 本地 JSON 加密存储
- [x] 明文 JSON 迁移工具
- [x] TypeScript + electron-vite 工程化重构
- [ ] 增加自动锁定和超时清除剪贴板
- [ ] 增加导入/导出备份
- [ ] 增加单元测试与端到端测试
- [ ] 增加 GitHub Actions 自动构建

---

## 🤝 贡献指南

当前仓库暂无 `CONTRIBUTING.md`。

欢迎通过以下流程参与贡献：

1. Fork 本仓库。
2. 创建功能分支。
3. 提交清晰、聚焦的变更。
4. 运行类型检查和构建。
5. 发起 Pull Request 并描述变更动机。

```bash
npm run typecheck
npm run build
```

---

## 📄 许可证

本项目基于 [MIT License](LICENSE) 开源。

---

## 🙏 致谢

- [Electron](https://www.electronjs.org/)
- [electron-vite](https://electron-vite.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- Node.js `crypto`

维护者：[待补充]

---

如果这个项目对你有帮助，请给一个 ⭐️
