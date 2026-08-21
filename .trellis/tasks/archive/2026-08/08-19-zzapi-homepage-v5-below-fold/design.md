# Homepage V5 技术设计

## 1. Visual Target

- 冻结首屏：`research/references/zzapi-hero-freeze-reference-user.png`。
- 首屏以下最终目标：`research/concepts/signal-corridor-with-value-tabs-final.png`，SHA-256 `9108D0FC2784A5F572F5854F734E094E4EDEA7E0471BA4D7B176A2DBA019EFFB`。
- 参考站研究：`research/truesota-tabs-live-source.md`。只采用“展开项 + 单一大型对象”的关系，不复制业务、色彩、滚动驱动或图形。

最终顺序：

```text
Frozen LandingEntrance
Frozen Hero / Gateway
transition band
Model Identity
Request Corridor
Current Catalog
Developer Integration
Value Tabs
Final CTA
Existing Footer
```

## 2. Boundary And Governance

- 实施遵守 `research/home-v5-freeze-contract.md`。
- `LandingEntrance → Hero → .home-below-fold` 的顺序和父子关系不变。
- `.home-below-fold` 增加 `data-home-v5`；所有新 CSS 从 `.home-below-fold[data-home-v5]` 或内部 `data-home-v5-*` 开始。
- 重写 `home-below-fold.css`，删除 `> div`、相邻 Section、`:has()` 等依赖旧 DOM 顺序的规则。
- 旧 `Stats / Features / HowItWorks / CTA` 不再导入或渲染；确认无引用后删除这四个旧 Section 文件。Hero 与 Opening 文件不动。
- 现有 `Footer` 必须复用，以保留配置 footer、Legal links、new-api / QuantumNous 与许可证归属。
- 为本任务收窄旧 product redesign freeze manifest 与 `product-shell.md`：非首页 product work 仍冻结整个 homepage，Homepage V5 仅获得本合同列出的例外。

## 3. Component Architecture

```text
HomepageV5
├─ ModelIdentityStage
├─ RequestCorridorStage
├─ ModelCatalogStage
├─ DeveloperIntegrationStage
├─ HomepageValueTabs
│  ├─ UsageClarityPanel
│  ├─ RoutingControlPanel
│  └─ RuntimeSignalsPanel
└─ HomepageV5Cta
```

推荐文件：

```text
web/src/features/home/components/v5/homepage-v5.tsx
web/src/features/home/components/v5/model-identity-stage.tsx
web/src/features/home/components/v5/request-corridor-stage.tsx
web/src/features/home/components/v5/model-catalog-stage.tsx
web/src/features/home/components/v5/developer-integration-stage.tsx
web/src/features/home/components/v5/homepage-value-tabs.tsx
web/src/features/home/components/v5/homepage-v5-cta.tsx
web/src/features/home/components/v5/signal-spine.tsx
web/src/features/home/hooks/use-homepage-v5-data.ts
web/src/features/home/lib/homepage-v5-data.ts
```

`HomepageV5` 接收 `isAuthenticated` 与 `openingPhase`。数据查询与首屏以下动画只在 `openingPhase === 'ambient'` 后启用；服务端/测试环境降级为静态可见最终态。

## 4. Data Contract

### 4.1 Sources

- `/api/status`：系统名、部署地址、docs link、`HeaderNavModules`。
- `/api/pricing`：当前可见模型、catalog vendor metadata、分组、真实 endpoint、quota/pricing mode。
- `/api/perf-metrics/summary?hours=24`：最近真实 relay 聚合；只作为 `Observed requests · last 24h`，不称 uptime/SLA。

不请求 `/api/uptime/status`，避免空配置和 30 秒等待成为首页依赖。不请求排行榜作为 Tabs 核心，避免再次引入竞争性数字和额外权限耦合。

### 4.2 Permission Gate

1. `useStatus()` 先返回 status/缓存/错误。
2. `getModuleAccessFromStatus(status, 'pricing')` 决定 pricing 是否 `enabled` 与 `requireAuth`。
3. `enabled=false`：不发 pricing/perf 请求，显示模块关闭的中性状态。
4. `requireAuth=true && guest`：不发请求，显示登录后可见状态；不自动跳转。
5. 允许请求时，首页专用 queryFn 直接调用统一 `api`，配置 `skipErrorHandler:true`、`skipAuthRefresh:true`，禁止 toast、刷新会话或 401 跳转。
6. pricing 与 perf 独立 query，任一失败不隐藏其他内容。

### 4.3 Projection

`homepage-v5-data.ts` 将原始响应投影为最小 UI 合同：

```ts
type HomepageDataState =
  | 'loading'
  | 'current'
  | 'last-known'
  | 'empty'
  | 'error'
  | 'auth-required'
  | 'disabled'

type HomepageModelSignal = {
  modelName: string
  catalogVendor: string | null
  endpointMethod: string | null
  endpointPath: string | null
  pricingMode: 'usage-based' | 'per-request' | 'dynamic' | 'not-reported'
  cachePricingReported: boolean
  groupRuleReported: boolean
  traffic: 'observed' | 'no-recent-sample' | 'unavailable'
}
```

- 默认选择按 `model_name` 稳定排序后的第一项，用户在 catalog stage 选择模型后，Identity/Developer/Value Tabs 使用同一选择。
- Catalog stage 最多展示首 3 项；更多项使用动态文本 `+N current models`，不写死总量。
- `vendor_name` 显示为 `Catalog metadata`，不写 `Official provider`。
- endpoint 从 `supported_endpoint_types` 与 `supported_endpoint` 映射；没有真实映射则 `Not reported`。
- `context_length / capabilities / owner_by / API signature` 不参与投影。
- perf 只匹配当前 catalog 中同名模型；不渲染 `request_count`，不使用 `growth_pct`。

### 4.4 State Semantics

| 状态 | UI |
| --- | --- |
| loading | 固定尺寸 skeleton/scan-ready 占位，不先显示 0 或 fallback 数字 |
| current | `Current catalog` / `Observed requests · last 24h` |
| last-known | 保留缓存数据并标 `Last known catalog` |
| empty | `Catalog not currently published` / `No recent sample` |
| error | `Live catalog unavailable`，保留无需数据的产品机制解释 |
| auth-required | `Sign in to view current catalog`，仅显式 CTA 导航 |
| disabled | 省略实时值，保留 OpenAI-compatible 与 routing mechanism 事实 |

## 5. Stage Design

### Model Identity

- 桌面 40/60：左侧短叙事，右侧模型名与 `Catalog metadata / Endpoint / Recent traffic` 三层 signal stack。
- 不称 Verification、Authentic、Official、Verified。
- loading/error/empty 保持右侧最小高度，避免 CLS。

### Request Corridor

- 语义使用 `<ol>`：Client → zzapi Gateway → Policy route → Model → Response。
- 视觉 signal spine 是 `aria-hidden` 装饰层；真实流程完全由文本列表表达。
- 只声明 gateway 支持的认证、策略路由与响应返回，不展示虚构延迟或吞吐。

### Current Catalog

- 桌面 signal spine 分叉到真实模型 ID；移动端改为线性模型列表，不缩放桌面曲线。
- 模型选择使用 button + `aria-pressed`，键盘可操作；改变选择不滚动页面。

### Developer Integration

- 使用 `<pre><code>` 和真实 endpoint path。
- Base URL 来自 status/deployment；未知时使用 `<YOUR_BASE_URL>`，永不硬编码域名。
- API key 永远是 `$ZZAPI_KEY` 占位符。
- 语言切换仅展示项目确实支持的示例；第一版可保留 cURL/OpenAI-compatible 一个主要示例，不为填满 UI 伪造 SDK。
- Copy 按钮使用现有图标库和单一 `aria-live='polite'` 反馈。

## 6. Value Tabs

- 使用现有 Base UI `Tabs / TabsList / TabsTrigger / TabsContent`，不修改共享组件。
- `orientation='vertical'`；`TabsList activateOnFocus={false} loopFocus={true}`。
- ArrowUp/Down、Home/End 只移动焦点，Enter/Space 激活；切换后焦点停留在 Tab。
- 只存在一个 `aria-selected='true'` 和一个可见 Panel；隐藏 Panel 内没有可聚焦元素。
- 不自动轮播、不随滚动切换、不长距离 sticky、不 scroll-jacking。

三个 Panel：

1. **Usage Clarity**：从真实 model pricing metadata 推导 `usage-based / per-request / dynamic / not reported`；只展示 Input/Cached/Output 是否报告、Configured pricing、Group rule、Traceable，不显示个人用量或金额。
2. **Routing Control**：展示项目机制 `priority / weight / policy-based routing / retry`；未公开实例配置时明确标 `Mechanism`, 不伪装为当前权重。
3. **Runtime Signals**：有 perf 数据时显示当前模型与最近 24h 的 avg latency / success rate / TPS，并明确 `Observed requests`; 无数据只显示 `No recent sample`。成功率不做主视觉百分比，不称 SLA。

桌面 `360px + 1fr`，活动项约 280–310px，非活动项 92–104px，Root 最小高约 620px；右面板固定最小高度，Panel 切换不动画外层高度。768 以下 trigger list 在上、Panel 在下，仍保持 vertical semantics。

## 7. Responsive Contract

| Width | Container | Signal Corridor | Value Tabs |
| --- | --- | --- | --- |
| 1440 | max 1280, auto margin | 4 / 1 / 7 columns | 360px / 1fr, min-height 620 |
| 1280 | 40px gutters | same, 20px gap | 344px / 1fr, min-height 580 |
| 1024 | 32px gutters | 4 / 8 | minmax(300px,36%) / 1fr |
| 768 | 32px gutters | one column, axis at 32px | list then Panel, min-height 440 |
| 390 | 16px gutters | one column, axis at 24px | full-width list + content-driven Panel |

- Section padding：desktop 136px、1024 112px、768 88px、mobile 72px。
- 标题固定断点字号 56 / 48 / 40 / 34px，不用 `vw`，`letter-spacing:0`。
- 所有 flex/grid child `min-width:0`；model ID/route `overflow-wrap:anywhere`。
- 只有 code surface 可内部横向滚动；页面 `scrollWidth === clientWidth`。
- 禁止 `100vh`、scroll snap、sticky module、负 margin 或绝对坐标从下方侵入 Hero。

## 8. Motion Contract

- 所有 below-fold motion 在 `ambient` 后才允许启动。
- Section reveal：400ms，opacity + translateY(12px)，同组最大错开 180ms。
- signal draw：480ms ease-out，单次完成后常驻；节点 180–220ms，60ms stagger，最多四级。
- Tab 展开：280ms，无回弹；Panel：180ms opacity + translateY(6px)，不动画高度。
- hover 仅 `hover:hover` + `pointer:fine`，160ms，位移不超过 2px。
- 页面隐藏时暂停非必要动画；不永久设置 `will-change`。
- reduced motion：直接最终态，Tabs 无尺寸动画，Panel 最多 100–120ms opacity。
- 不复用当前会先渲染 `opacity:0` 的 `AnimateInView`；IntersectionObserver/JS 失败时内容默认可见。

## 9. Accessibility And Theme

- Hero 继续是唯一 `h1`；V5 sections 为 `h2`，Panel 为 `h3`。
- default homepage `main#main-content[tabindex=-1]`；opening 完成后提供 `SkipToMain`，避免和 opening 自带 skip control 重复。
- `main` 使用当前 i18n resolved language 的 `lang`，修复本页 visible language 与 document fallback 不一致。
- 指标使用 `<dl>`，流程使用 `<ol>`；装饰线路 `aria-hidden='true' focusable='false'`。
- 状态同时有文字/形状，不只依赖蓝色；正文 4.5:1，图形/大字 3:1。
- focus ring 2px 品牌色并为外扩预留空间；`forced-colors` 使用系统边框。
- 界面 locale 只保留 `en / zhCN`，后端语言与模型元数据同步只保留 `en / zh-CN`；任何 `zh-*` 历史值归一化到简体中文，旧 fr/ja/ru/vi/ja metadata 值回退到双语支持范围。
- light：白、近白、黑/graphite、silver、精确蓝；dark：`#0e1116` 高级黑、graphite/silver、`#73a2ff` 信号蓝。显式 preset 继续由 preset token 主导。

## 10. Performance, Rollback And Compatibility

- 不引入 VChart、Recharts、XYFlow 或整包模型 icon；使用现有 icon library 与 CSS/SVG path primitive。
- 不增加新第三方依赖；首页动态请求在 opening 完成后懒启用。
- 大型图形有稳定 `aspect-ratio/min-height`，数据切换不 CLS。
- 自定义首页 URL/HTML/Markdown 三条分支完全不进入 V5 hook 或 CSS。
- 回滚点：恢复 `index.tsx` 的旧 below-fold composition、恢复旧 `home-below-fold.css`、删除 `components/v5` 与 homepage data files；冻结 Hero 无需回滚。
