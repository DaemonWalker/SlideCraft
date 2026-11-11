import { ref, watch } from 'vue'
import { showcaseMessages } from './showcase'

export const locales = ['zh-CN', 'ja', 'en'] as const
export type Locale = typeof locales[number]

type MessageValue = string | number | boolean | MessageValue[] | { [key: string]: MessageValue }
type MessageTree = { [key: string]: MessageValue }

const zhCN: MessageTree = {
  showcase: showcaseMessages['zh-CN'],
  app: {
    subtitle: '组件化 HTML 幻灯片框架',
    overview: '总览',
    notes: '备注',
    fullscreen: '全屏',
    exitFullscreen: '退出全屏',
    help: '快捷键',
    language: '切换语言',
    openImage: '放大图片',
    closeImage: '关闭图片预览',
    imagePreview: '图片预览',
    download: '下载附件',
    downloadAttachment: '下载附件 {fileName}',
    attachmentDownloadFailed: '附件下载失败，请重试。',
    previous: '上一页',
    next: '下一页',
    close: '关闭弹层',
    overviewTitle: '幻灯片总览',
    notesTitle: '讲师备注',
    helpTitle: '键盘快捷键',
    navigationLabel: '幻灯片导航',
    stageLabel: '幻灯片演示区域',
    toolbarLabel: '演示工具栏',
    toolsLabel: '演示工具',
    keyboardHint: '翻页　N 备注',
    noNotes: '当前页面没有讲师备注。',
    page: '第 {index} 页',
    fullscreenUnsupported: '当前浏览器不支持全屏，请使用浏览器全屏功能',
    fullscreenFailed: '无法切换全屏，请使用浏览器全屏功能',
    shortcuts: {
      next: '下一页',
      previous: '上一页',
      homeEnd: '首页 / 末页',
      notes: '讲师备注',
      overview: '幻灯片总览',
      fullscreen: '进入 / 退出全屏',
      escape: '关闭弹层或退出全屏',
    },
  },
  deck: {
    title: 'SlideCraft 框架导览',
    subtitle: '组件化 HTML 幻灯片框架',
    slides: {
      cover: {
        title: '用组件，构建你的下一套课件',
        section: '开场',
        duration: '框架概览',
        notes: '介绍 SlideCraft 的定位：源码阶段使用 Vue 组件提高复用性，交付阶段生成一个可以离线打开的 HTML 文件。',
        eyebrow: '组件驱动的演示',
        badge: '离线 · 组件化 · 单文件',
        headingBefore: '用组件，构建你的',
        headingAccent: '下一套课件',
        description: '像搭建页面一样制作幻灯片，像发送文档一样交付一个 HTML 文件。',
        footer: 'Vue 3 + TypeScript + Vite',
        blueprintAlt: '由多个内容组件组成的幻灯片示意图',
      },
      canvas: {
        title: '一种设计尺寸，稳定呈现在每个窗口',
        section: '核心设计',
        duration: '画布与缩放',
        notes: '所有页面都按 1920 × 1080 设计。强调最大缩放比例为 1，大窗口不会继续放大，小窗口会完整缩小。',
        eyebrow: '01 · 固定画布',
        subtitle: '页面内部永不重排，缩放只发生在最外层画布。',
        footer: '核心原则',
        metricDescription: '所有组件都基于同一个逻辑坐标系。',
        bullets: ['小窗口：完整等比缩小', '标准窗口：原始尺寸显示', '更大窗口：居中并保留空白'],
        imageAlt: '固定画布在窗口内居中缩放',
        imageCaption: 'SlideViewport 统一处理缩放、居中与留空',
      },
      components: {
        title: '制作一页，只需要描述内容',
        section: '组件体系',
        duration: '组件使用',
        notes: '结合左侧代码说明 TwoColumn 的插槽用法。特殊页面仍可直接编写 HTML 和 CSS，不受现有组件限制。',
        eyebrow: '02 · 组件组合',
        subtitle: '布局、样式和演示行为由框架统一负责。',
        footer: '声明式页面',
        codeTitle: '订单查询 API',
        templateTitle: '页面模板',
        templateBody: 'CoverSlide、SectionSlide 和标准内容页，快速建立结构。',
        layoutTitle: '布局组件',
        layoutBody: 'TwoColumn、Grid 和 Stack，控制内容之间的关系。',
        contentTitle: '内容组件',
        contentBody: '列表、卡片、代码、图片和表格，专注表达具体信息。',
      },
      library: {
        title: '常用表达，都有对应组件',
        section: '组件体系',
        duration: '组件目录',
        notes: '组件分为布局、文本、媒体、图形和信息几类。新增组件时应复用全局主题变量，不要在页面中重复定义颜色和字号体系。',
        eyebrow: '03 · 组件库',
        subtitle: '默认样式来自同一组主题变量，避免每一页各自为战。',
        footer: '可复用组件',
        columns: ['组件', '类别', '典型用途'],
        rows: [
          ['TwoColumn / Grid', '布局', '双栏对比、多栏卡片、内容分组'],
          ['BulletList / TagList', '文本', '要点拆解、技术标签、特性概览'],
          ['CodeBlock / ImageFigure', '媒体', '代码讲解、流程截图、图文说明'],
          ['FlowDiagram / Timeline', '图形', '步骤流程、实施路径、阶段规划'],
          ['DataTable / Callout', '信息', '参数对照、结论强调、风险提示'],
        ],
        tags: ['统一主题', 'TypeScript 类型', 'Vue Slots 扩展', '固定画布适配'],
      },
      'developer-code': {
        title: '面向开发培训的代码表达',
        section: '开发培训组件',
        duration: '代码与配置',
        notes: '展示 CodeBlock 的行号、指定行和错误行高亮，以及 CodeDiff、TerminalBlock 和 ConfigBlock 的组合方式。',
        eyebrow: '04 · 代码与配置',
        subtitle: '从源码、变更到命令输出和环境配置，保持一致的阅读体验。',
        footer: '代码讲解组件',
        configCaption: '应用环境配置',
        configEntries: [
          { key: 'APP_ENV', value: 'training', description: '标识当前运行环境。' },
          { key: 'API_BASE_URL', value: 'http://localhost:8080', description: '本地开发服务的接口地址。' },
          { key: 'DB_PASSWORD', value: 'local-only-password', sensitive: true, description: '敏感值默认掩码显示，不要在课件中放入真实密钥。' },
        ],
      },
      'api-design': {
        title: '把请求与响应放在同一页讲解',
        section: '开发培训组件',
        duration: '接口设计',
        notes: '通过创建订单接口展示 RequestResponse，对照说明请求头、请求体、状态码和响应体。',
        eyebrow: '05 · 接口设计',
        subtitle: '对照展示 HTTP 方法、请求头、状态码和 JSON 消息体。',
        footer: 'POST /api/orders',
        caption: '创建订单：201 Created',
        requestDescription: '提交客户编号和商品明细，创建一笔待处理订单。',
      },
      'system-diagrams': {
        title: '用声明式数据描述系统结构',
        section: '开发培训组件',
        duration: '架构与时序',
        notes: 'ArchitectureDiagram 使用逻辑坐标放置节点，SequenceDiagram 根据参与者和消息自动计算布局。',
        eyebrow: '06 · 架构与时序',
        subtitle: '架构图表达静态依赖，时序图表达一次调用的动态过程。',
        footer: 'SVG · 离线渲染',
        architecture: {
          caption: '订单服务架构',
          nodes: [
            { id: 'client', title: 'Web 客户端', description: 'Vue 应用' },
            { id: 'gateway', title: 'API 网关', description: '鉴权与路由' },
            { id: 'orders', title: '订单服务', description: '业务处理' },
            { id: 'queue', title: '消息队列', description: '订单事件' },
            { id: 'database', title: '订单数据库', description: '持久化' },
          ],
          edges: [
            { from: 'client', to: 'gateway', label: 'HTTPS' },
            { from: 'gateway', to: 'orders', label: 'REST' },
            { from: 'orders', to: 'queue', label: '发布事件', route: 'orthogonal' },
            { from: 'orders', to: 'database', label: 'SQL', tone: 'success' },
          ],
        },
        sequence: {
          caption: '创建订单调用时序',
          participants: [
            { id: 'client', title: '客户端', tone: 'default' },
            { id: 'orders', title: '订单服务', subtitle: 'Order API', tone: 'accent' },
            { id: 'database', title: '数据库', subtitle: 'PostgreSQL', tone: 'success' },
          ],
          messages: [
            { from: 'client', to: 'orders', label: 'POST /orders', type: 'sync' },
            { from: 'orders', to: 'database', label: 'INSERT order', type: 'sync' },
            { from: 'database', to: 'orders', label: 'orderId', type: 'return' },
            { from: 'orders', to: 'client', label: '201 Created', type: 'return' },
          ],
        },
      },
      scaling: {
        title: '只缩小，不放大',
        section: '核心设计',
        duration: '缩放规则',
        notes: '可用空间由外层容器测量，并扣除工具栏、导航栏和内边距。全屏时隐藏这些区域，让 1920 × 1080 屏幕可以实现 1:1 显示。',
        eyebrow: '07 · 缩放策略',
        subtitle: '既保证小窗口完整显示，也避免大屏拉伸图片和文字。',
        footer: '最大缩放比例为 1',
        flow: [
          { title: '较小窗口', description: '按空间等比缩小' },
          { title: '1920 × 1080', description: '保持 1:1 原始尺寸' },
          { title: '更大窗口', description: '原始尺寸居中留空' },
        ],
        formulaCaption: '唯一缩放公式',
        calloutTitle: '三条不变原则',
        calloutBody: '不变形、不裁剪、不重排。窗口变化只影响最外层缩放比例，不改变任何组件的内部布局。',
      },
      delivery: {
        title: '一套框架，完成整个制作流程',
        section: '开始使用',
        duration: '构建交付',
        notes: '制作新课件时复制 decks/demo，修改页面和注册信息。运行 npm run build:offline 后，dist/index.html 就是可发送的单文件版本。',
        eyebrow: '08 · 从开发到交付',
        heading: '一套框架，完成整个制作流程',
        subtitle: '源码保持组件化，交付保持简单。',
        steps: [
          { meta: 'STEP 01', title: '编写页面', description: '组合 Slide 与常用内容组件。' },
          { meta: 'STEP 02', title: '注册课件', description: '配置标题、章节和讲师备注。' },
          { meta: 'STEP 03', title: '本地预览', description: '检查缩放、溢出和翻页交互。' },
          { meta: 'STEP 04', title: '构建交付', description: '生成可离线打开的单文件 HTML。' },
        ],
        commandLabel: '构建命令',
        footerRight: '单文件离线版',
      },
    },
  },
}

const ja: MessageTree = {
  showcase: showcaseMessages.ja,
  app: {
    subtitle: 'コンポーネント型 HTML プレゼンフレームワーク',
    overview: '一覧',
    notes: 'ノート',
    fullscreen: '全画面',
    exitFullscreen: '全画面を終了',
    help: 'ショートカット',
    language: '言語を切り替える',
    openImage: '画像を拡大',
    closeImage: '画像プレビューを閉じる',
    imagePreview: '画像プレビュー',
    download: '添付ファイルをダウンロード',
    downloadAttachment: '添付ファイル {fileName} をダウンロード',
    attachmentDownloadFailed: '添付ファイルをダウンロードできませんでした。もう一度お試しください。',
    previous: '前のスライド',
    next: '次のスライド',
    close: 'ダイアログを閉じる',
    overviewTitle: 'スライド一覧',
    notesTitle: '発表者ノート',
    helpTitle: 'キーボードショートカット',
    navigationLabel: 'スライドナビゲーション',
    stageLabel: 'スライド表示エリア',
    toolbarLabel: 'プレゼンツールバー',
    toolsLabel: 'プレゼンツール',
    keyboardHint: 'ページ送り　N ノート',
    noNotes: 'このスライドには発表者ノートがありません。',
    page: '{index} ページ',
    fullscreenUnsupported: 'このブラウザーは全画面表示に対応していません。ブラウザーの全画面機能をご利用ください',
    fullscreenFailed: '全画面を切り替えられません。ブラウザーの全画面機能をご利用ください',
    shortcuts: {
      next: '次のスライド',
      previous: '前のスライド',
      homeEnd: '最初 / 最後のスライド',
      notes: '発表者ノート',
      overview: 'スライド一覧',
      fullscreen: '全画面表示の切り替え',
      escape: 'ダイアログを閉じる、または全画面を終了',
    },
  },
  deck: {
    title: 'SlideCraft フレームワークガイド',
    subtitle: 'コンポーネント型 HTML プレゼンフレームワーク',
    slides: {
      cover: {
        title: 'コンポーネントで作る、次のプレゼンテーション',
        section: 'はじめに',
        duration: 'フレームワーク概要',
        notes: 'SlideCraft の位置づけを紹介します。ソースでは Vue コンポーネントで再利用性を高め、配布時にはオフラインで開ける単一 HTML ファイルを生成します。',
        eyebrow: 'COMPONENT-DRIVEN PRESENTATION',
        badge: 'オフライン · コンポーネント · 単一ファイル',
        headingBefore: 'コンポーネントで作る、',
        headingAccent: '次のプレゼンテーション',
        description: 'ページを組み立てるようにスライドを作成し、文書を送るように1つの HTML ファイルで共有できます。',
        footer: 'Vue 3 + TypeScript + Vite',
        blueprintAlt: '複数のコンテンツコンポーネントで構成されたスライドのイラスト',
      },
      canvas: {
        title: '1つの設計サイズで、すべてのウィンドウに安定表示',
        section: 'コア設計',
        duration: 'キャンバスと拡大縮小',
        notes: 'すべてのページを 1920 × 1080 で設計します。最大拡大率は 1 で、大きなウィンドウでも拡大せず、小さなウィンドウでは全体を縮小します。',
        eyebrow: '01 · 固定キャンバス',
        subtitle: 'ページ内のレイアウトは変えず、最外層のキャンバスだけを拡大縮小します。',
        footer: '基本原則',
        metricDescription: 'すべてのコンポーネントが同じ論理座標系を使用します。',
        bullets: ['小さなウィンドウ：全体を等比縮小', '標準ウィンドウ：原寸で表示', '大きなウィンドウ：中央に配置し余白を確保'],
        imageAlt: 'ウィンドウ内で中央に拡大縮小される固定キャンバス',
        imageCaption: 'SlideViewport が拡大縮小、中央配置、余白を一括処理',
      },
      components: {
        title: 'コンテンツを記述するだけで1ページを作成',
        section: 'コンポーネント体系',
        duration: 'コンポーネントの使用',
        notes: '左側のコードを使って TwoColumn のスロット用法を説明します。特殊なページも HTML と CSS を直接記述でき、既存コンポーネントに制限されません。',
        eyebrow: '02 · コンポーネントの組み合わせ',
        subtitle: 'レイアウト、スタイル、プレゼン操作はフレームワークが統一処理します。',
        footer: '宣言的なページ',
        codeTitle: '注文検索 API',
        templateTitle: 'ページテンプレート',
        templateBody: 'CoverSlide、SectionSlide、標準コンテンツページで構造をすばやく作成します。',
        layoutTitle: 'レイアウトコンポーネント',
        layoutBody: 'TwoColumn、Grid、Stack でコンテンツ同士の関係を制御します。',
        contentTitle: 'コンテンツコンポーネント',
        contentBody: 'リスト、カード、コード、画像、表を使って具体的な情報を表現します。',
      },
      library: {
        title: 'よく使う表現に対応するコンポーネント',
        section: 'コンポーネント体系',
        duration: 'コンポーネント一覧',
        notes: 'コンポーネントはレイアウト、テキスト、メディア、図形、情報に分かれます。新規コンポーネントではグローバルなテーマ変数を再利用し、ページごとに色や文字サイズを再定義しないようにします。',
        eyebrow: '03 · コンポーネントライブラリ',
        subtitle: '共通のテーマ変数を使い、ページごとのばらつきを防ぎます。',
        footer: '再利用可能なコンポーネント',
        columns: ['コンポーネント', '分類', '主な用途'],
        rows: [
          ['TwoColumn / Grid', 'レイアウト', '2列の比較、複数列のカード、コンテンツのグループ化'],
          ['BulletList / TagList', 'テキスト', '要点、技術タグ、機能概要'],
          ['CodeBlock / ImageFigure', 'メディア', 'コード解説、フロー画像、画像と文章の説明'],
          ['FlowDiagram / Timeline', '図形', '手順、実施経路、段階計画'],
          ['DataTable / Callout', '情報', 'パラメーター比較、結論の強調、リスクの提示'],
        ],
        tags: ['統一テーマ', 'TypeScript の型', 'Vue Slots による拡張', '固定キャンバス対応'],
      },
      'developer-code': {
        title: '開発者トレーニングのためのコード表現',
        section: '開発者向けコンポーネント',
        duration: 'コードと設定',
        notes: 'CodeBlock の行番号、指定行とエラー行のハイライトに加え、CodeDiff、TerminalBlock、ConfigBlock の組み合わせを紹介します。',
        eyebrow: '04 · コードと設定',
        subtitle: 'ソース、差分、コマンド出力、環境設定を統一された見た目で表示します。',
        footer: 'コード解説コンポーネント',
        configCaption: 'アプリケーション環境設定',
        configEntries: [
          { key: 'APP_ENV', value: 'training', description: '現在の実行環境を識別します。' },
          { key: 'API_BASE_URL', value: 'http://localhost:8080', description: 'ローカル開発サービスの API アドレスです。' },
          { key: 'DB_PASSWORD', value: 'local-only-password', sensitive: true, description: '機密値は既定でマスクします。実際のキーは教材に含めないでください。' },
        ],
      },
      'api-design': {
        title: 'リクエストとレスポンスを1ページで解説',
        section: '開発者向けコンポーネント',
        duration: 'API 設計',
        notes: '注文作成 API を例に RequestResponse を使い、ヘッダー、ボディ、ステータスコードを対比しながら説明します。',
        eyebrow: '05 · API 設計',
        subtitle: 'HTTP メソッド、ヘッダー、ステータスコード、JSON ボディを対比表示します。',
        footer: 'POST /api/orders',
        caption: '注文作成：201 Created',
        requestDescription: '顧客 ID と商品明細を送信し、処理待ちの注文を作成します。',
      },
      'system-diagrams': {
        title: '宣言的なデータでシステム構造を記述',
        section: '開発者向けコンポーネント',
        duration: 'アーキテクチャとシーケンス',
        notes: 'ArchitectureDiagram は論理座標でノードを配置し、SequenceDiagram は参加者とメッセージから自動でレイアウトを計算します。',
        eyebrow: '06 · アーキテクチャとシーケンス',
        subtitle: '静的な依存関係はアーキテクチャ図、動的な呼び出しはシーケンス図で表現します。',
        footer: 'SVG · オフライン描画',
        architecture: {
          caption: '注文サービスのアーキテクチャ',
          nodes: [
            { id: 'client', title: 'Web クライアント', description: 'Vue アプリ' },
            { id: 'gateway', title: 'API ゲートウェイ', description: '認証とルーティング' },
            { id: 'orders', title: '注文サービス', description: 'ビジネス処理' },
            { id: 'queue', title: 'メッセージキュー', description: '注文イベント' },
            { id: 'database', title: '注文データベース', description: '永続化' },
          ],
          edges: [
            { from: 'client', to: 'gateway', label: 'HTTPS' },
            { from: 'gateway', to: 'orders', label: 'REST' },
            { from: 'orders', to: 'queue', label: 'イベント発行', route: 'orthogonal' },
            { from: 'orders', to: 'database', label: 'SQL', tone: 'success' },
          ],
        },
        sequence: {
          caption: '注文作成の呼び出しシーケンス',
          participants: [
            { id: 'client', title: 'クライアント', tone: 'default' },
            { id: 'orders', title: '注文サービス', subtitle: 'Order API', tone: 'accent' },
            { id: 'database', title: 'データベース', subtitle: 'PostgreSQL', tone: 'success' },
          ],
          messages: [
            { from: 'client', to: 'orders', label: 'POST /orders', type: 'sync' },
            { from: 'orders', to: 'database', label: 'INSERT order', type: 'sync' },
            { from: 'database', to: 'orders', label: 'orderId', type: 'return' },
            { from: 'orders', to: 'client', label: '201 Created', type: 'return' },
          ],
        },
      },
      scaling: {
        title: '縮小のみ、拡大はしない',
        section: 'コア設計',
        duration: '拡大縮小ルール',
        notes: '利用可能な領域は外側のコンテナで測定し、ツールバー、ナビゲーション、余白を差し引きます。全画面ではこれらを非表示にするため、1920 × 1080 の画面で 1:1 表示できます。',
        eyebrow: '07 · 拡大縮小戦略',
        subtitle: '小さなウィンドウでは全体を表示し、大画面では画像と文字の引き伸ばしを防ぎます。',
        footer: '最大拡大率は 1',
        flow: [
          { title: '小さなウィンドウ', description: '領域に合わせて等比縮小' },
          { title: '1920 × 1080', description: '1:1 の原寸を維持' },
          { title: '大きなウィンドウ', description: '原寸のまま中央に配置' },
        ],
        formulaCaption: '唯一の拡大縮小式',
        calloutTitle: '変えない3つの原則',
        calloutBody: '歪めない、切り取らない、再配置しない。ウィンドウの変化は最外層の拡大率だけに影響し、コンポーネント内部のレイアウトは変わりません。',
      },
      delivery: {
        title: '1つのフレームワークで制作プロセスを完結',
        section: '使い始める',
        duration: 'ビルドと配布',
        notes: '新しい教材を作るときは decks/demo をコピーし、ページと登録情報を変更します。npm run build:offline を実行すると、配布できる dist/index.html が生成されます。',
        eyebrow: '08 · 開発から配布まで',
        heading: '1つのフレームワークで制作プロセスを完結',
        subtitle: 'ソースはコンポーネント化し、配布はシンプルに。',
        steps: [
          { meta: 'STEP 01', title: 'ページを作成', description: 'Slide とコンテンツコンポーネントを組み合わせます。' },
          { meta: 'STEP 02', title: '教材を登録', description: 'タイトル、セクション、発表者ノートを設定します。' },
          { meta: 'STEP 03', title: 'ローカルで確認', description: '拡大縮小、はみ出し、ページ操作を確認します。' },
          { meta: 'STEP 04', title: 'ビルドして配布', description: 'オフラインで開ける単一 HTML を生成します。' },
        ],
        commandLabel: 'ビルドコマンド',
        footerRight: '単一ファイルオフライン版',
      },
    },
  },
}

const en: MessageTree = {
  showcase: showcaseMessages.en,
  app: {
    subtitle: 'Component-driven HTML presentation framework',
    overview: 'Overview',
    notes: 'Notes',
    fullscreen: 'Fullscreen',
    exitFullscreen: 'Exit fullscreen',
    help: 'Shortcuts',
    language: 'Change language',
    openImage: 'Enlarge image',
    closeImage: 'Close image preview',
    imagePreview: 'Image preview',
    download: 'Download attachment',
    downloadAttachment: 'Download attachment {fileName}',
    attachmentDownloadFailed: 'Unable to download the attachment. Please try again.',
    previous: 'Previous slide',
    next: 'Next slide',
    close: 'Close dialog',
    overviewTitle: 'Slide overview',
    notesTitle: 'Speaker notes',
    helpTitle: 'Keyboard shortcuts',
    navigationLabel: 'Slide navigation',
    stageLabel: 'Slide presentation area',
    toolbarLabel: 'Presentation toolbar',
    toolsLabel: 'Presentation tools',
    keyboardHint: 'Navigate　N Notes',
    noNotes: 'This slide has no speaker notes.',
    page: 'Slide {index}',
    fullscreenUnsupported: 'Fullscreen is not supported by this browser. Please use the browser fullscreen command.',
    fullscreenFailed: 'Unable to toggle fullscreen. Please use the browser fullscreen command.',
    shortcuts: {
      next: 'Next slide',
      previous: 'Previous slide',
      homeEnd: 'First / last slide',
      notes: 'Speaker notes',
      overview: 'Slide overview',
      fullscreen: 'Enter / exit fullscreen',
      escape: 'Close dialog or exit fullscreen',
    },
  },
  deck: {
    title: 'SlideCraft framework guide',
    subtitle: 'Component-driven HTML presentation framework',
    slides: {
      cover: {
        title: 'Build your next presentation with components',
        section: 'Introduction',
        duration: 'Framework overview',
        notes: 'Introduce the purpose of SlideCraft: Vue components keep source content reusable, while the deliverable is a single HTML file that works offline.',
        eyebrow: 'COMPONENT-DRIVEN PRESENTATION',
        badge: 'Offline · Components · Single file',
        headingBefore: 'Build your next',
        headingAccent: 'presentation with components',
        description: 'Create slides like composing a web page, then share them as easily as sending one HTML document.',
        footer: 'Vue 3 + TypeScript + Vite',
        blueprintAlt: 'A slide composed of multiple content components',
      },
      canvas: {
        title: 'One design size, consistent in every window',
        section: 'Core design',
        duration: 'Canvas and scaling',
        notes: 'Every slide is designed at 1920 × 1080. The maximum scale is 1: larger windows never enlarge the canvas, while smaller windows shrink it as a whole.',
        eyebrow: '01 · Fixed canvas',
        subtitle: 'Content never reflows. Only the outer canvas is scaled.',
        footer: 'Core principle',
        metricDescription: 'Every component uses the same logical coordinate system.',
        bullets: ['Smaller windows: scale down proportionally', 'Target window: show at the original size', 'Larger windows: center with surrounding space'],
        imageAlt: 'A fixed canvas centered and scaled inside a window',
        imageCaption: 'SlideViewport handles scaling, centering, and surrounding space',
      },
      components: {
        title: 'Describe the content to build a slide',
        section: 'Component system',
        duration: 'Using components',
        notes: 'Use the code on the left to explain TwoColumn slots. Custom slides can still use HTML and CSS directly without being restricted by the existing components.',
        eyebrow: '02 · Composing components',
        subtitle: 'The framework handles layout, styling, and presentation behavior.',
        footer: 'Declarative slides',
        codeTitle: 'Order query API',
        templateTitle: 'Slide templates',
        templateBody: 'Use CoverSlide, SectionSlide, and standard content slides to establish structure quickly.',
        layoutTitle: 'Layout components',
        layoutBody: 'TwoColumn, Grid, and Stack define relationships between content.',
        contentTitle: 'Content components',
        contentBody: 'Lists, cards, code, images, and tables focus on communicating information.',
      },
      library: {
        title: 'A component for every common pattern',
        section: 'Component system',
        duration: 'Component catalogue',
        notes: 'Components cover layout, text, media, diagrams, and information. New components should reuse global theme tokens instead of redefining colors and type scales on every slide.',
        eyebrow: '03 · Component library',
        subtitle: 'Shared theme tokens keep every slide visually consistent.',
        footer: 'Reusable components',
        columns: ['Component', 'Category', 'Typical use'],
        rows: [
          ['TwoColumn / Grid', 'Layout', 'Two-column comparisons, card grids, and content groups'],
          ['BulletList / TagList', 'Text', 'Key points, technology tags, and feature summaries'],
          ['CodeBlock / ImageFigure', 'Media', 'Code walkthroughs, flow diagrams, and visual explanations'],
          ['FlowDiagram / Timeline', 'Diagrams', 'Processes, implementation paths, and phased plans'],
          ['DataTable / Callout', 'Information', 'Parameter comparisons, key conclusions, and risk notices'],
        ],
        tags: ['Unified theme', 'TypeScript types', 'Extensible Vue Slots', 'Fixed-canvas support'],
      },
      'developer-code': {
        title: 'Code communication for developer training',
        section: 'Developer components',
        duration: 'Code and configuration',
        notes: 'Demonstrate CodeBlock line numbers, highlighted lines, and error lines, together with CodeDiff, TerminalBlock, and ConfigBlock.',
        eyebrow: '04 · Code and configuration',
        subtitle: 'Source, diffs, command output, and configuration in a consistent format.',
        footer: 'Code walkthrough components',
        configCaption: 'Application environment',
        configEntries: [
          { key: 'APP_ENV', value: 'training', description: 'Identifies the current runtime environment.' },
          { key: 'API_BASE_URL', value: 'http://localhost:8080', description: 'API address of the local development service.' },
          { key: 'DB_PASSWORD', value: 'local-only-password', sensitive: true, description: 'Sensitive values are masked. Never include real secrets.' },
        ],
      },
      'api-design': {
        title: 'Explain requests and responses side by side',
        section: 'Developer components',
        duration: 'API design',
        notes: 'Use the create-order API to demonstrate RequestResponse and explain request headers, payloads, status codes, and response bodies.',
        eyebrow: '05 · API design',
        subtitle: 'Compare HTTP methods, headers, status codes, and JSON payloads in one view.',
        footer: 'POST /api/orders',
        caption: 'Create an order: 201 Created',
        requestDescription: 'Submit a customer ID and line items to create a pending order.',
      },
      'system-diagrams': {
        title: 'Describe system structure with declarative data',
        section: 'Developer components',
        duration: 'Architecture and sequence',
        notes: 'ArchitectureDiagram positions nodes in logical coordinates, while SequenceDiagram calculates its layout from participants and messages.',
        eyebrow: '06 · Architecture and sequence',
        subtitle: 'Use an architecture diagram for static dependencies and a sequence diagram for a dynamic call flow.',
        footer: 'SVG · Offline rendering',
        architecture: {
          caption: 'Order service architecture',
          nodes: [
            { id: 'client', title: 'Web client', description: 'Vue application' },
            { id: 'gateway', title: 'API gateway', description: 'Auth and routing' },
            { id: 'orders', title: 'Order service', description: 'Business logic' },
            { id: 'queue', title: 'Message queue', description: 'Order events' },
            { id: 'database', title: 'Order database', description: 'Persistence' },
          ],
          edges: [
            { from: 'client', to: 'gateway', label: 'HTTPS' },
            { from: 'gateway', to: 'orders', label: 'REST' },
            { from: 'orders', to: 'queue', label: 'Publish event', route: 'orthogonal' },
            { from: 'orders', to: 'database', label: 'SQL', tone: 'success' },
          ],
        },
        sequence: {
          caption: 'Create-order call sequence',
          participants: [
            { id: 'client', title: 'Client', tone: 'default' },
            { id: 'orders', title: 'Order service', subtitle: 'Order API', tone: 'accent' },
            { id: 'database', title: 'Database', subtitle: 'PostgreSQL', tone: 'success' },
          ],
          messages: [
            { from: 'client', to: 'orders', label: 'POST /orders', type: 'sync' },
            { from: 'orders', to: 'database', label: 'INSERT order', type: 'sync' },
            { from: 'database', to: 'orders', label: 'orderId', type: 'return' },
            { from: 'orders', to: 'client', label: '201 Created', type: 'return' },
          ],
        },
      },
      scaling: {
        title: 'Scale down, never up',
        section: 'Core design',
        duration: 'Scaling rules',
        notes: 'The outer container measures available space after toolbars, navigation, and padding. These regions are hidden in fullscreen, allowing a 1920 × 1080 display to show the canvas at 1:1.',
        eyebrow: '07 · Scaling strategy',
        subtitle: 'Fit smaller windows without enlarging images and text on larger displays.',
        footer: 'Maximum scale is 1',
        flow: [
          { title: 'Smaller window', description: 'Scale down to fit the available space' },
          { title: '1920 × 1080', description: 'Preserve the original 1:1 size' },
          { title: 'Larger window', description: 'Center at original size with space around it' },
        ],
        formulaCaption: 'The only scaling formula',
        calloutTitle: 'Three invariants',
        calloutBody: 'No distortion, clipping, or reflow. Window changes only affect the outer scale, never the internal layout of a component.',
      },
      delivery: {
        title: 'One framework for the entire authoring workflow',
        section: 'Get started',
        duration: 'Build and deliver',
        notes: 'To create a new deck, copy decks/demo and edit its slides and registration. Run npm run build:offline to generate the shareable dist/index.html file.',
        eyebrow: '08 · From source to delivery',
        heading: 'One framework for the entire authoring workflow',
        subtitle: 'Keep source code componentized and delivery simple.',
        steps: [
          { meta: 'STEP 01', title: 'Author slides', description: 'Compose Slide with reusable content components.' },
          { meta: 'STEP 02', title: 'Register the deck', description: 'Configure titles, sections, and speaker notes.' },
          { meta: 'STEP 03', title: 'Preview locally', description: 'Check scaling, overflow, and slide navigation.' },
          { meta: 'STEP 04', title: 'Build and deliver', description: 'Generate a single HTML file that works offline.' },
        ],
        commandLabel: 'Build command',
        footerRight: 'Single-file offline edition',
      },
    },
  },
}

const messages: Record<Locale, MessageTree> = { 'zh-CN': zhCN, ja, en }
const STORAGE_KEY = 'slidecraft-locale'

const initialLocale = (): Locale => {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (locales.includes(saved as Locale)) return saved as Locale
  } catch {
    // localStorage may be unavailable for local files in restricted browsers.
  }
  return 'zh-CN'
}

const locale = ref<Locale>(initialLocale())

watch(locale, (value) => {
  document.documentElement.lang = value
  try {
    window.localStorage.setItem(STORAGE_KEY, value)
  } catch {
    // Language switching still works when persistence is unavailable.
  }
}, { immediate: true })

const readMessage = (path: string, language: Locale): MessageValue | undefined => {
  const value = path.split('.').reduce<MessageValue | undefined>((node, key) => {
    if (node && typeof node === 'object' && !Array.isArray(node)) return node[key]
    return undefined
  }, messages[language])
  return value
}

export function useI18n() {
  const t = (path: string, params: Record<string, string | number> = {}) => {
    const value = readMessage(path, locale.value) ?? readMessage(path, 'zh-CN')
    if (typeof value !== 'string') return path
    return Object.entries(params).reduce(
      (text, [key, replacement]) => text.split(`{${key}}`).join(String(replacement)),
      value,
    )
  }

  const tm = <T>(path: string): T => {
    return (readMessage(path, locale.value) ?? readMessage(path, 'zh-CN')) as T
  }

  const setLocale = (value: Locale) => {
    locale.value = value
  }

  return { locale, locales, t, tm, setLocale }
}
