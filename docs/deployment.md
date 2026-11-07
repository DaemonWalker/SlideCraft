# 构建与离线交付

## 构建产物

在 `app/` 目录执行：

```bash
npm install
npm run build:offline
```

当前 `build:offline` 等同于 `npm run build`，流程为：

1. `vue-tsc --noEmit` 执行 TypeScript 类型检查。
2. Vite 构建应用。
3. `vite-plugin-singlefile` 将 CSS、JavaScript 和构建资源内嵌到 HTML。

最终交付文件：

```text
app/dist/index.html
```

`app/dist/` 被 `.gitignore` 忽略，应在发布时重新构建，不要手工编辑其中的文件。

## 本地预览

开发预览：

```bash
npm run dev -- --port 7100
```

构建目录预览：

```bash
npm run preview -- --port 7100
```

`preview` 用于检查构建结果，但最终离线验收仍应直接双击 `dist/index.html`，以 `file://` 方式打开。

## GitHub Pages 组件库

在线地址：[https://daemonwalker.github.io/SlideCraft/](https://daemonwalker.github.io/SlideCraft/)。

展示站源码位于 `app/src/showcase/`，组件说明和示例文案位于 `app/src/i18n/showcase.ts`。本地运行与构建：

```bash
npm run dev:showcase -- --port 7100
npm run build:pages
npm run preview -- --port 7100
```

`build:pages` 使用 Vite 的 `showcase` 模式，将 `app/src/showcase/ShowcaseApp.vue` 作为根组件，产物仍为 `app/dist/index.html`。普通 `build` 和 `build:offline` 继续使用课件根组件，不受展示站影响。

自动部署工作流位于 `.github/workflows/pages.yml`，在推送到 `main` 或手动触发时执行 `npm ci`、`npm run build:pages` 并发布 `app/dist/`。首次配置：

1. 将工作流和源码推送至 GitHub 仓库的 `main` 分支。
2. 打开仓库 **Settings → Pages**，在 **Build and deployment** 下将 **Source** 设为 **GitHub Actions**。
3. 在 **Actions** 中运行 **Deploy component library to GitHub Pages**，等待 `build` 和 `deploy` 成功。
4. 打开 Pages 地址，检查组件导航、Hash 深链接、语言切换和图片预览。

展示站使用 `#/components/<组件 id>` 定位组件，不依赖服务端路由回退。部署到仓库子路径时，现有 `base: './'` 和资源内嵌配置无需修改。

## 分发方式

将 `dist/index.html` 重命名为易于识别的课件名称后单独分发即可。接收方无需安装 Node.js、npm 或启动本地服务器，推荐使用现代 Chrome 或 Edge。

根目录已有 `MuleSoft业务开发培训-单文件离线版.html`，可作为直接打开的独立课件文件。重新构建 `app/` 不会自动更新或重命名根目录这份文件；如需替换它，应明确确认后再复制和命名。

## 离线验收清单

- [ ] `npm run build:offline` 成功，没有类型错误。
- [ ] 直接通过 `file://` 打开 HTML，首屏和全部页面正常显示。
- [ ] 断网后刷新，课件、字体回退、SVG 和图标仍可使用。
- [ ] 中文、日文、英文切换正常，刷新后语言按浏览器存储能力恢复。
- [ ] 总览、讲师备注、帮助和语言菜单正常。
- [ ] 按钮、键盘、触屏和 `#/页码` 导航正常。
- [ ] 图片放大、关闭和焦点返回正常。
- [ ] 全屏进入、退出以及全屏下的缩放正常。
- [ ] 所有页面没有内容裁切或溢出。
- [ ] 浏览器控制台没有资源加载错误或未捕获异常。

`localStorage` 在部分受限浏览器或本地文件策略下可能不可用。这不会影响当次语言切换，但刷新后语言可能恢复为中文；`http://` 与 `file://` 下保存的语言也可能不同。

## 离线资源规则

为确保单文件可用：

- 图片和 SVG 通过 ES Module 从 `src/assets/` 导入。
- 不引用 CDN、远程字体、远程脚本或必须联网的图片。
- 不在运行时通过 `fetch()` 读取课件相邻的本地文件。
- 新增大型图片前先压缩，因为资源会内嵌并增大 HTML 文件。
- 页码继续使用 `#/1` 形式，不依赖服务端路由回退。

## 当前限制

- 构建目标是单文件 HTML，不是 PDF 或 PPTX。
- 浏览器打印或另存为 PDF 不属于项目已验证的导出流程。
- 固定 1920 × 1080 画布以完整呈现为优先，小屏幕上的文字会随画布整体缩小。
- 单文件体积会随内嵌图片增加，交付前应检查文件大小和打开速度。
