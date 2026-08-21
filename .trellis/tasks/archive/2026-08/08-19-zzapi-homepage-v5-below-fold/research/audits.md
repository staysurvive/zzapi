# Homepage V5 研究与边界

## 视觉参考

- `references/truesota-authenticity-reference.png`：只借鉴大尺度身份对象、状态层级和留白节奏。
- `references/truesota-large-data-object-reference.png`：只借鉴把复杂信息组织成单个大型视觉对象的方式。
- 不复制参考站的页面结构、紫色体系、文案、组件、图表或动画。
- 当前首页已补充可靠的 viewport 区段截图，避免 full-page stitching 对 sticky header、开场和 scroll reveal 的重复/缺失造成误判。

## 首屏冻结边界

- 冻结 `hero.tsx`、`infrastructure-map.tsx`、`landing-entrance.tsx`、opening lifecycle/types/tests、`routes/index.tsx`、`landing-brand-core.png`、`styles/index.css`。
- `index.tsx` 只允许调整 imports 与 `.home-below-fold` 内的组合；V5 必须继续位于该容器内，保留 opening 完成前隐藏下半区的契约。
- 实施前需将旧 manifest 从 `web/src/features/home/**` 整体冻结收窄为上述首屏文件和首屏视觉基线，否则门禁与本任务冲突。
- 继续以 light/dark、desktop/mobile 四张首屏截图和当前 Logo SHA-256 `A58D26790A7C571ACE684949255261FE3BB20AD6C3E4242B27ECD40F608DAC2C` 做回归校验。

## 数据真实性

- `/api/status` 可证明本站状态接口可响应，并提供系统名、文档入口和导航模块权限；不能据此声称上游健康或 SLA。
- `/api/pricing` 可提供当前可见模型、目录厂商、分组和 endpoint 路径/方法；目录厂商可能由模型名推断，不等同于官方来源。
- `/api/perf-metrics/summary?hours=24` 是真实 relay 聚合，但缺少公开样本数，不适合作为百分比主视觉，只能标注 `Observed requests · last 24h`。
- `/api/uptime/status` 依赖外部 Uptime Kuma，当前为空且最坏可等待 30 秒，不作为首页核心依赖。
- 当前本地目录快照为 3 个模型、2 个目录厂商、1 种 endpoint；只能动态展示，不能写死为产品总量。
- 禁止展示官方认证、`Verified`、`Authentic Model`、API Signature 检测、逐模型 capability 真值、`50+ / 100+`、`99.99%`、固定延迟或请求量。

推荐语义：

```text
Model identity     Configured
Catalog vendor     Reported
Endpoint route     Available
Recent traffic     Observed / No recent sample
Other capability   Not reported
```

## 请求与降级

- 先根据 `/api/status` 的 `HeaderNavModules` 判断 pricing 是否公开；匿名用户遇到 requireAuth/disabled 时不请求 `/api/pricing`。
- 首页数据请求使用 `skipErrorHandler: true` 与 `skipAuthRefresh: true`，避免公开首页 toast、刷新会话或跳转登录。
- Loading 只显示骨架/扫描阶段；Empty 使用 `Catalog not currently published` / `No recent measurements`；Error 使用 `Live catalog unavailable`。
- 缓存数据刷新失败时标为 `Last known catalog`，不得称 `Live`；pricing 有服务端和前端缓存，应称 `Current catalog`，不要称 `Real-time catalog`。

## 实现范围与风险

- 新建 `web/src/features/home/components/v5/`，按 Identity、Gateway Usage、Model Network、Developer Flow、CTA 划分职责。
- 重写 `home-below-fold.css` 为明确的 section/data 属性，移除依赖 DOM 顺序、相邻选择器和 `:has()` 的旧规则。
- 复用 `Button`、TanStack `Link`、`Footer`、`useStatus`、`useAuthStore`、`cn`；不复用与首屏耦合的 `InfrastructureMap` 或包含演示数值的 `HeroTerminalDemo`。
- 新 SVG ID 使用 `useId()`；大型图形设置稳定的 `aspect-ratio`/`min-height`，异步数据不引发 CLS。
- 移动端必须重新编排，不能缩放桌面绝对坐标；reduced motion 直接显示完成态，不持续播报动画状态。
- 不引入 VChart 或整包 `@lobehub/icons` 到首页首包。

## 响应式、动效与可访问性合同

- Hero 实测高度：`1440=832px`、`1280=800px`、`1024=768px`、`768=768px`、`390=743px`；首屏回归比较只覆盖 `y=0` 到 Hero bottom，Hero 以下为本任务授权差异。
- 内容最大宽度 `1280px`；gutter 为 desktop `48px`、tablet `32px`、mobile `20px`。仅 `>=1024px` 使用 36/64 或 40/60 双栏，`<=899px` 全部重排为单栏。
- Authenticity 在移动端重排为标题 → 状态摘要 → 单列检查项；Gateway 改为纵向语义时间线；Infrastructure 改为 Provider → zzapi → Endpoint 线性拓扑；Developer 先文字后代码。
- Scroll reveal 使用 `260–360ms`、`translateY(8px) + opacity`，同组错开 `40–60ms`，最大延迟 `240ms`。验证演示总时长约 `1.1s`，Gateway flow 单次 `900–1200ms`，不做无限循环。
- Reduced Motion 直接显示最终状态，最多保留 `150–180ms` opacity cross-fade；标签页隐藏时暂停非必要动画。
- 每个模块使用 `<section aria-labelledby>`，Hero 保持唯一 `h1`，后续使用连续 `h2`；状态必须有文本，不只依赖颜色。
- 视觉重复的 SVG 使用 `aria-hidden`，真实流程使用 `<ol>`，指标使用 `<dl>`；代码使用 `<pre><code>`，复制反馈由单一 `aria-live=polite` 提示。
- 实施时补齐 Skip Link 与 `main#main-content[tabindex=-1]`，并修复首页可见语言与 `html[lang]` 不一致；这些无常态视觉输出的 DOM 变更列为首屏冻结显式例外。
