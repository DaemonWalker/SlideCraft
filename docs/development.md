# 开发规范

## 工作目录与命令

应用命令统一在 `app/` 下执行：

```bash
npm install
npm run dev
npm run dev:showcase -- --port 7101
npm run build
npm run build:pages
```

开发服务器默认使用 7100 端口，占用时自动尝试下一个可用端口；应打开终端实际输出的地址。`npm run build` 和 `npm run build:pages` 都会先运行 `vue-tsc --noEmit`，再分别执行课件与组件展示站的 Vite 构建。项目当前没有自动化测试、ESLint 或格式化脚本，因此类型检查和人工演示检查都是必要步骤。修改公共组件时，还需在展示站检查对应示例及三语言排版。

## 代码风格

遵循现有代码风格，不引入另一套约定：

- Vue 单文件组件使用 `<script setup lang="ts">` 和 Composition API。
- TypeScript 开启严格模式；为 Props、课件结构和字典数组提供明确类型。
- 使用 2 空格缩进、单引号，不添加行尾分号。
- 布局和内容组件优先从 `components/index.ts` 导入。
- 页面独有样式放在对应 SFC 的 `<style scoped>` 中。
- 跨组件颜色、字体、圆角和阴影复用 `styles/global.css` 中的主题变量。
- 图标使用现有 `@lucide/vue`，不要新增远程图标或字体依赖。

## 课件与固定画布

- 所有页面按 1920 × 1080 逻辑尺寸设计。
- 不要让窗口尺寸改变页面内部排版；适配由 `SlideViewport` 统一处理。
- 优先组合现有 `Slide`、布局和内容组件；特殊设计可使用页面局部 HTML、CSS 或 SVG。
- 内容过多时优先删减或拆页，不要通过破坏固定画布规则解决溢出。
- 页面 `id` 必须唯一，并与 `deck.slides.<id>` 字典键一致。
- 当前 `App.vue` 使用字典显示页面元数据；注册表与三份语言字典需要同步维护。

## 多语言与可访问性

- 用户可见文案、图片 `alt`、无障碍标签和讲师备注应覆盖全部支持语言。
- 字符串使用 `t()`；数组和对象使用 `computed(() => tm<T>(...))`。
- 新增交互控件时提供可访问名称、键盘操作和可见焦点样式。
- 新增弹层时优先复用原生 `dialog` 行为，避免与页面翻页快捷键冲突。
- 动效应尊重现有 `prefers-reduced-motion` 设置。

## 资源与离线约束

- 图片放入 `src/assets/` 并通过 ES Module 导入。
- 可下载附件放入 `src/assets/attachments/`，使用 `?attachment` 导入；不要绕过构建校验手工拼接附件 Data URL。
- 不使用 CDN、远程脚本、远程字体或运行时 `fetch()` 本地文件。
- 优先使用 SVG、WebP 或压缩后的 PNG，避免无必要地增大单文件 HTML。
- 不直接手工编辑 `dist/index.html`；交付文件必须由源码重新构建。
- `node_modules/`、`dist/`、日志和验证临时目录已被忽略，不应作为源码交付。

## 常见修改入口

| 任务 | 主要文件 | 还需检查 |
| --- | --- | --- |
| 修改页面结构 | `src/decks/<deck>/slides/*.vue` | 三语言排版、溢出、组件文档 |
| 新增或排序页面 | `src/decks/<deck>/index.ts` | 三语言 `deck.slides`、Hash、总览 |
| 更换当前课件 | `src/App.vue` | `deck` 字典、所有 `demoDeck` 引用 |
| 修改界面文案 | `src/i18n/index.ts` | 所有语言、工具栏和弹层 |
| 新增语言 | `src/i18n/index.ts` | `LanguagePicker.vue`、语言排版、文档 |
| 修改公共组件 | `src/components/` | 全部调用方、组件导出、组件参考 |
| 修改主题 | `src/styles/global.css` | 深浅色页面、三语言、所有组件 |
| 修改构建方式 | `vite.config.ts`、`package.json` | 离线打开、资源内嵌、交付文档 |

## 修改后的最低验证

1. 在 `app/` 执行 `npm run build`，确保类型检查和构建成功。
2. 检查浏览器控制台，无新增错误和 `[SlideCraft]` 溢出警告。
3. 逐一查看受影响页面，并切换中文、日文、英文。
4. 验证上一页、下一页、首页、末页、总览跳转和 `#/页码`。
5. 验证讲师备注、帮助、图片预览和语言菜单的键盘交互。
6. 验证进入和退出全屏，以及小窗口下的等比缩放。
7. 涉及交付改动时，直接以 `file://` 打开 `dist/index.html`，断网复验。
8. 更新受影响的 README、`docs/` 和 `AGENTS.md` 导航。

根目录现有的 `MuleSoft业务开发培训-单文件离线版.html` 是独立交付文件；除非任务明确要求，不要用新构建结果覆盖它。
