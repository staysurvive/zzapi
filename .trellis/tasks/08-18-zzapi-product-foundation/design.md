# Technical Design — Product Foundation

## Components

### ProductShell

- 路径：`web/src/components/layout/components/product-shell.tsx`。
- 通过 `data-zzapi-product` 暴露稳定作用域，通过 `data-product-surface` 标识 `public | auth | workspace`。
- 负责画布、背景层、内容宽度/密度，不承载业务标题、固定 Hero 或主 landmark。
- 始终渲染无 landmark 的 scoped 容器；main ownership 由外层 layout 明确负责。

### ResourceHeader

- 路径：`web/src/components/layout/components/resource-header.tsx`。
- slots：eyebrow、title、description、status/meta、primary/secondary actions。
- 默认输出语义化 `h1`；复用到嵌套区域时允许调用方显式指定 heading level，但不得仅为视觉字号降级标题层级。
- actions 在 compact 下重排为不遮挡标题的可触达区域；不绑定 card 容器。

### MetricStrip

- 路径：`web/src/components/metric-strip.tsx`。
- 用于需要 2–5 个关键指标的页面，支持 horizontal wrap 与 compact stack。
- 根结构使用 `dl`，每项以 `dt`/`dd` 表达标签和值；item API 至少包含 `label`、`value`、`supportingText`、`trend/status`。
- 数值、标签、趋势/提示语义分离，趋势和状态必须提供可读文本，颜色或图形不是唯一状态编码。

## Styling

- 路径：`web/src/styles/product-shell.css`。
- 所有选择器从 `[data-zzapi-product]` 或 `[data-product-*]` 开始。
- token 使用局部 CSS custom properties；不写 `:root`，不覆盖首页或未迁移页面。
- light/dark 分别映射局部背景、前景、边界、muted、brand 和 focus。
- 动画只使用 opacity/transform，并提供 `prefers-reduced-motion` 分支。
- 由 ProductShell 模块直接 side-effect import，不修改冻结的 `web/src/styles/index.css`。

## Local Token Contract

| Token | Light | Dark | Purpose |
| --- | --- | --- | --- |
| `--product-canvas` | `#fcfdfe` | `#0e1116` | product page background |
| `--product-text-strong` | `#111318` | `#f2f5f7` | primary text |
| `--product-text-secondary` | `#59616b` | `#aab4c0` | supporting text |
| `--product-hairline` | `#dce3ea` | `#2b333e` | precision borders |
| `--product-brand` | `#1549f4` | `#73a2ff` | primary action/focus/active state |
| `--product-brand-soft` | `#eef4ff` | `#17233a` | selected/active surface |

- Typography：display `clamp(2rem, 4vw, 3.5rem)/1.04/-0.035em`；page title `clamp(1.75rem, 3vw, 2.5rem)/1.1/-0.025em`；section title `1.125rem/1.3/-0.012em`；body `0.9375rem/1.6/0`；UI `0.8125rem/1.35/0.005em`。
- Spacing：4px 基础步进；页面主要节奏 16/24/32/48/64，compact 控件 8/12。
- Radius：control 10px、surface 14px、large region 18px；禁止为装饰普遍使用 pill。
- Border：1px hairline；focus 2px brand + 2px offset，forced-colors 使用系统 Highlight。
- Motion：press 80–100ms 即时反馈；route enter 160–180ms、2–4px、无 blur/无 bounce；reduced motion 使用短 cross-fade。

## Shared Component Integration

- `PublicLayout`：新增可选 `appearance='product'`，缺省时保留现有 DOM/class/behavior；product 分支即使没有默认容器样式也输出唯一 main。
- `ProductPublicHeader`：独立 product 分支，避免修改首页 legacy header 的 JSX、事件和动画。兼容现有 dynamic/default nav，支持 external、disabled、requiresAuth、active route 与未登录 auth prompt redirect；保留 language、theme、notifications、profile，以及 custom logo/siteName/homeUrl/navContent/left/right content 扩展点。移动菜单在路由切换、卸载和异常退出时都必须清理 body scroll lock。
- `SectionPageLayout`：新增单一 `appearance='product'` 与 Description/Meta/Status slots，旧调用点无需修改。
- `DataTablePage`：真实路径 `web/src/components/data-table/layout/data-table-page.tsx`；只在已有首个根 div 增加 product data/class，不新增 wrapper，不修改 TanStack Table、mobile/card、pagination 和 footer portal 契约。
- Button：阶段一只有在 Product foundation 存在真实消费点时才新增 additive brand variants；否则不修改。任何新增不得改变 default/outline 等既有 variant。

## Accessibility Fixes

- `SkipToMain` 与实际主容器统一到 `#main-content`；目标可聚焦且焦点可见。
- 本阶段由 PublicLayout product 与 SidebarInset workspace 分别拥有唯一 main，内部 `Main` 使用无 landmark 容器；auth ProductShell 只保证自身无 landmark，AuthLayout main ownership 延后到阶段三。
- product 移动菜单关闭时使用可验证的卸载或 inert/hidden 策略；trigger 声明 expanded/controls。
- 打开后聚焦首个可操作项，Escape 关闭并回到 trigger；菜单区在低高度下可滚动。
- 路由选择、卸载和异常路径均恢复 body scroll lock；背景不可被 Tab 穿透，触控目标约 44×44。
- `requiresAuth` 登录提示 Dialog 的 portal 根节点必须显式携带 product scope/data attribute，不依赖 body 或页面祖先 token，也不得改变首页弹层样式。

## Tests

- 默认 PublicLayout/Header 结构契约，保护首页兼容分支。
- ProductShell 的 surface、无 landmark 语义和 reduced-motion class/attribute 契约。
- ProductPublicHeader 的 dynamic/default nav、external/disabled/requiresAuth、active route、工具区、扩展 slot 与 body scroll cleanup 契约。
- requiresAuth Dialog portal 的 product scope 与 legacy dialog 隔离契约。
- ResourceHeader 默认 `h1`/显式 heading level 与 MetricStrip `dl/dt/dd` 文本状态语义契约。
- 移动菜单的 Tab、Escape、ARIA 和 focus-return 行为测试。
- public product 与 workspace 只有一个 main、skip target 唯一且真实；auth ProductShell 无 landmark。
- SectionPageLayout/DataTablePage additive props 的旧调用兼容测试；DataTable product appearance 不增加高度包裹层。
