import type { DeckDefinition } from '../../core/types'
import CoverSlide from './slides/CoverSlide.vue'
import CanvasSlide from './slides/CanvasSlide.vue'
import ComponentsSlide from './slides/ComponentsSlide.vue'
import LibrarySlide from './slides/LibrarySlide.vue'
import DeveloperCodeSlide from './slides/DeveloperCodeSlide.vue'
import ApiDesignSlide from './slides/ApiDesignSlide.vue'
import SystemDiagramsSlide from './slides/SystemDiagramsSlide.vue'
import ScalingSlide from './slides/ScalingSlide.vue'
import DeliverySlide from './slides/DeliverySlide.vue'

export const demoDeck: DeckDefinition = {
  title: 'SlideCraft 框架导览',
  subtitle: '组件化 HTML 幻灯片框架',
  slides: [
    {
      id: 'cover',
      title: '用组件，构建你的下一套课件',
      section: '开场',
      duration: '框架概览',
      component: CoverSlide,
      notes: '介绍 SlideCraft 的定位：源码阶段使用 Vue 组件提高复用性，交付阶段生成一个可以离线打开的 HTML 文件。',
    },
    {
      id: 'canvas',
      title: '一种设计尺寸，稳定呈现在每个窗口',
      section: '核心设计',
      duration: '画布与缩放',
      component: CanvasSlide,
      notes: '所有页面都按 1920 × 1080 设计。强调最大缩放比例为 1，大窗口不会继续放大，小窗口会完整缩小。',
    },
    {
      id: 'components',
      title: '制作一页，只需要描述内容',
      section: '组件体系',
      duration: '组件使用',
      component: ComponentsSlide,
      notes: '结合左侧代码说明 TwoColumn 的插槽用法。特殊页面仍可直接编写 HTML 和 CSS，不受现有组件限制。',
    },
    {
      id: 'library',
      title: '常用表达，都有对应组件',
      section: '组件体系',
      duration: '组件目录',
      component: LibrarySlide,
      notes: '组件分为布局、文本、媒体、图形和信息几类。新增组件时应复用全局主题变量，不要在页面中重复定义颜色和字号体系。',
    },
    {
      id: 'developer-code',
      title: '面向开发培训的代码表达',
      section: '开发培训组件',
      duration: '代码与配置',
      component: DeveloperCodeSlide,
      notes: '展示 CodeBlock 的行号、指定行和错误行高亮，以及 CodeDiff、TerminalBlock 和 ConfigBlock 的组合方式。',
    },
    {
      id: 'api-design',
      title: '把请求与响应放在同一页讲解',
      section: '开发培训组件',
      duration: '接口设计',
      component: ApiDesignSlide,
      notes: '通过创建订单接口展示 RequestResponse，对照说明请求头、请求体、状态码和响应体。',
    },
    {
      id: 'system-diagrams',
      title: '用声明式数据描述系统结构',
      section: '开发培训组件',
      duration: '架构与时序',
      component: SystemDiagramsSlide,
      notes: 'ArchitectureDiagram 使用逻辑坐标放置节点，SequenceDiagram 根据参与者和消息自动计算布局。',
    },
    {
      id: 'scaling',
      title: '只缩小，不放大',
      section: '核心设计',
      duration: '缩放规则',
      component: ScalingSlide,
      notes: '可用空间由外层容器测量，并扣除工具栏、导航栏和内边距。全屏时隐藏这些区域，让 1920 × 1080 屏幕可以实现 1:1 显示。',
    },
    {
      id: 'delivery',
      title: '一套框架，完成整个制作流程',
      section: '开始使用',
      duration: '构建交付',
      component: DeliverySlide,
      notes: '制作新课件时复制 decks/demo，修改页面和注册信息。运行 npm run build:offline 后，dist/index.html 就是可发送的单文件版本。',
    },
  ],
}
