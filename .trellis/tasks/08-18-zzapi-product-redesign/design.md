# Technical Design — zzapi 子页面品牌化重设计

## Architecture

采用“冻结首页第一屏 + 子页面显式 opt-in”的增量架构。现有业务组件、路由数据契约、TanStack Router、React Query、Base UI 和 Tailwind 保持不变，在其上建立 scoped Product Shell。

### Frozen boundary

以下路径不得修改：

```text
web/src/features/home/**
web/src/routes/index.tsx
web/public/landing-brand-core.png
web/src/styles/index.css
```

`web/src/styles/index.css` 整个文件冻结。共享组件若必须扩展，只能新增 opt-in prop/variant，默认输出保持不变。用户后续授权的首页第二屏之后配色调整必须放在新的 `.home-below-fold` scoped stylesheet 中，并从共享入口显式导入；该例外不得影响第一屏。

### Product layer

计划新增：

```text
web/src/styles/product-shell.css
web/src/components/layout/components/product-shell.tsx
web/src/components/layout/components/resource-header.tsx
web/src/components/metric-strip.tsx
```

- `ProductShell`：提供 `data-zzapi-product` 作用域和 public/auth/workspace 画布变体；始终渲染无 landmark 语义的容器，不自行拥有 `main`。
- `ResourceHeader`：组合 eyebrow、title、description、status/meta 与 actions，不绑定固定页面模板。
- `MetricStrip`：为需要紧凑关键指标的页面提供横向/堆叠式结构，不默认生成 Card 网格。
- `product-shell.css`：由 ProductShell 自身 side-effect import；只使用 `[data-zzapi-product]`、`[data-product-*]` 等前缀，不改 `:root`、`index.css` 和全局默认 token。

### Additive integration

- `PublicLayout` 新增 `appearance='product'`，默认分支完全不变；product 分支无论是否使用默认宽度容器都输出唯一 `<main id='main-content'>`。
- product public header 使用独立 opt-in 分支/组件，移动焦点修复不改变首页 legacy header。
- workspace 保留 `SidebarInset` 为唯一 `<main id='main-content'>`，内部 `Main` 仅作为无 landmark 内容容器。
- `SectionPageLayout` 新增单一 `appearance='product'` 和 Description/Meta/Status slots，旧调用点保持兼容。
- `DataTablePage` 新增 `appearance='product'`，业务查询、表格模型与操作逻辑不变。
- Button 等基础组件仅在阶段内有真实消费者时新增 `brand` / `brand-outline` 等 additive variant；若阶段一没有消费者则不改 Button，且任何新增都不得改变 default variant。
- DataTablePage 只在现有首个根 `div` 上增加 data/class，不增加会破坏 fixed-height、bulk action 或 footer portal 的 wrapper。
- Portal 内容不能依赖祖先局部 token；需要品牌化时显式 opt-in，禁止通过 body 副作用泄漏到首页。

## Visual System

- Brand anchor：zzapi 蓝保持稳定，用于活动导航、主操作、焦点和关键数据，而非大面积填充。
- Surfaces：低对比背景层与精细边界建立空间感；玻璃和强阴影只在确有层级意义时使用。
- Typography：标题收紧字距与行高；正文和高密度数据维持可读性；信息层级由字号、字重、色阶和间距共同表达。
- Shape：避免过度圆角；容器、控件和状态使用少量可解释的半径层级。
- Brand details：线路、节点、网格和 Z 几何仅作为导航、状态或分区提示，禁止成为噪声背景。

## Motion

- 页面进入使用约 160–180ms 的 opacity + 2–4px 位移，不使用全页 blur；通过 additive product motion variant 接入，不修改共享 `pageEnter` 默认值。
- 交互反馈即时、可中断；默认无弹跳，避免用户等待。
- `prefers-reduced-motion` 下改为短 cross-fade 或静态反馈。
- 首页开场、Gateway 和现有首页动效不触碰。

## Responsive Strategy

- Compact：移动导航重排，主要操作靠近任务，表格转为横向安全滚动或语义化摘要；不隐藏关键数据。
- Standard：平板使用较少列数与可折叠辅助区，避免桌面侧栏压缩内容。
- Wide：桌面保留高效信息密度和稳定操作区，不人为拉大留白。

## Accessibility

- 统一 `#main-content` 目标：public product 由 PublicLayout 拥有，workspace 由 SidebarInset 拥有，auth 由 AuthLayout 拥有；页面内部容器不得再次渲染 main。
- 移动菜单补齐焦点顺序、`aria-expanded` / `aria-controls`、Escape、焦点归还与低高度滚动。
- 所有行/卡片动作提供键盘路径；状态和颜色均有文本或图标语义。
- focus ring 与品牌蓝绑定并满足对比度。

## Internationalization

新增 UI 文案使用 `useTranslation()` 和 `t()`。Locale 修改只通过 `web/scripts/add-missing-keys.mjs`，随后运行 `bun run i18n:sync`，禁止直接编辑 locale JSON。

## Compatibility and Rollback

- 每阶段采用 opt-in 迁移，未迁移页面继续使用旧实现，降低一次性回归面。
- 每阶段独立检查、提交和可回滚；不得通过修改默认全局 token“顺带”改变未迁移页面。
- 数据请求、权限和路由契约保持原样，视觉/结构改动与业务逻辑改动分离审查。

## Validation Evidence

- 自动：受影响 lint、typecheck、相关 Vitest、production build。
- 浏览器：IAB 中验证 desktop/tablet/mobile、light/dark、关键交互和 console。
- 视觉：每阶段保留截图；最终 `design-qa.md` 记录来源、实现、视口、状态、比较历史与结论。
- 首页：对照已保存基线 `C:/Users/npp_c/AppData/Local/Temp/zzapi-home-frozen-baseline-d092808a`。

## Visual Truth and QA Roles

- 首页截图是品牌基准和首页冻结证据，不是子页面 fidelity source。
- 每个可见产品族实施前，先保存当前界面截图并形成三个真实视觉方向；用户选定后将同 route/state/viewport 的目标写入 manifest。
- Product Design audit 用于全路由产品、UX、响应式和可访问性审查。
- Design QA 只比较具有明确 source target 的代表性页面；source 与 implementation 必须同状态、同视口并进入同一比较输入。
- 未建立视觉 target 的页面不得声称 Design QA passed，只能使用 screen contract + audit + browser evidence 验收。

## Evidence Manifests

- `research/route-surface-manifest.md`：路由、角色、逻辑 section、阶段与状态责任。
- `research/home-freeze-manifest.md`：固定基准提交、截图、哈希和共享依赖。
- `research/quality-baseline.md`：当前自动检查基线与零新增策略。
- 各子任务在启动前补齐 screen contract、design.md、implement.md 与具体 evidence matrix。
