# SlideCraft

基于 Vue 3、TypeScript 和 Vite 的组件化 HTML 幻灯片框架。开发时按 Vue 组件维护课件，构建后交付一个无需服务器、可直接离线打开的 `index.html`。

## 主要特性

- 固定 1920 × 1080 设计画布，小窗口等比缩小，大窗口保持原始尺寸并居中。
- 按钮、键盘、触屏翻页，以及 `#/页码` 定位。
- 幻灯片总览、讲师备注、快捷键帮助和全屏演示。
- 8 个布局组件、16 个内容组件和 9 页示例课件。
- 中文、日文、英文界面与课件内容切换，自动保存语言选择。
- 图片点击放大、开发环境内容溢出警告。
- CSS、JavaScript 和本地图片内嵌的单文件离线构建。

## 快速开始

环境要求：Node.js 18 或更高版本，以及 npm。

```bash
cd app
npm install
npm run dev -- --port 7100
```

打开终端输出的本地地址即可预览。Vite 参数可以继续追加在 `npm run dev --` 之后。

生成离线版本：

```bash
cd app
npm run build:offline
```

交付文件位于 `app/dist/index.html`，可用现代 Chrome 或 Edge 直接打开，无需启动服务。

## 在线组件库

GitHub Pages 展示站：[https://daemonwalker.github.io/SlideCraft/](https://daemonwalker.github.io/SlideCraft/)。可浏览全部 24 个布局与内容组件，查看真实画布预览、Props、Slots 和示例代码，并切换中文、日文和英文。

本地启动展示站或生成 Pages 构建：

```bash
cd app
npm run dev:showcase -- --port 7100
npm run build:pages
```

推送到 `main` 后，`.github/workflows/pages.yml` 会自动构建并部署。首次使用前需在仓库 **Settings → Pages** 中将 **Source** 设为 **GitHub Actions**，详见[构建与交付](docs/deployment.md)。

## 演示操作

| 操作 | 方式 |
| --- | --- |
| 下一页 | `→`、`PageDown`、`Space` 或底部下一页按钮 |
| 上一页 | `←`、`PageUp` 或底部上一页按钮 |
| 首页 / 末页 | `Home` / `End` |
| 总览 | `O` 或工具栏“总览” |
| 讲师备注 | `N` 或工具栏“备注” |
| 全屏 | `F` 或工具栏“全屏” |
| 快捷键帮助 | `?` 或工具栏帮助按钮 |
| 关闭弹层 / 退出全屏 | `Esc` |
| 触屏翻页 | 水平滑动 |

也可通过 `#/1`、`#/2` 等 Hash 直接定位页面。

## 项目结构

```text
.
├─ app/                              # SlideCraft 源码与构建配置
│  ├─ src/
│  │  ├─ core/                       # 页面容器、缩放、翻页与类型
│  │  ├─ components/                 # 布局、内容和语言选择组件
│  │  ├─ decks/demo/                 # 示例课件
│  │  ├─ showcase/                   # GitHub Pages 组件展示站
│  │  ├─ i18n/                       # 中日英字典与语言状态
│  │  ├─ styles/                     # 全局样式和主题变量
│  │  ├─ App.vue                     # 演示工具栏、导航与弹层
│  │  └─ main.ts                     # 应用入口
│  ├─ index.html
│  ├─ package.json
│  └─ vite.config.ts
├─ docs/                             # 使用与开发文档
├─ AGENTS.md                         # 协作者文档导航
└─ MuleSoft业务开发培训-单文件离线版.html # 根目录现有的独立离线课件
```

根目录的 MuleSoft HTML 是可直接打开的现成交付文件；SlideCraft 的源码修改和重新构建在 `app/` 中进行。

## 文档

| 文档 | 内容 |
| --- | --- |
| [快速开始](docs/getting-started.md) | 安装、预览、演示操作与首次修改 |
| [课件制作](docs/authoring.md) | 新建课件、注册页面、添加文案与资源 |
| [组件参考](docs/components.md) | 页面、布局和内容组件的 Props、Slots 与用途 |
| [多语言](docs/internationalization.md) | 字典结构、翻译 API、语言持久化与新增语言 |
| [项目架构](docs/architecture.md) | 模块职责、画布缩放、导航和单文件构建原理 |
| [构建与交付](docs/deployment.md) | 离线构建、验收清单、分发和限制 |
| [开发规范](docs/development.md) | 编码约定、修改流程与验证要求 |

完整索引见 [docs/README.md](docs/README.md)。

## 当前边界

- 面向固定 16:9 画布，不是响应式网页排版框架。
- 当前不包含 PDF、PPTX 导出或可视化编辑器。
- 当前一次加载一套课件，示例课件在 `App.vue` 中注册。
- 项目没有配置自动化测试、ESLint 或格式化脚本；构建检查和人工演示验收要求见[开发规范](docs/development.md)。

## 第三方资源

图标来自 Lucide，通过 `@lucide/vue` 使用，许可证为 ISC。项目内示例示意图使用本地 SVG，不依赖外部图片服务。
