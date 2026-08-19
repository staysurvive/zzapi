# zzapi Homepage V5 首屏以下整体重构

## Goal

在完整保留当前 `/` 首页首屏 Hero、Gateway、品牌开场和核心交互的前提下，重新设计首屏以下的内容叙事、信息架构、视觉系统和响应式体验，使首页从普通 AI API 平台介绍提升为属于 zzapi 的 AI Model Infrastructure 品牌体验。

## Background

- 当前首屏已经承担品牌入口、统一 API 与 Gateway 路由表达，本轮不重新设计。
- 当前首屏以下仍由传统 stats、features、workflow、CTA 和 footer 组成，叙事重复、视觉模块同质，缺少模型真实性、请求路由和开发者体验的产品证据。
- 用户提供的视觉思想参考为：
  - `C:/Users/npp_c/AppData/Local/Temp/codex-clipboard-c93b12a1-f751-4116-956d-e5186299393b.png`
  - `C:/Users/npp_c/AppData/Local/Temp/codex-clipboard-7f154e53-6c64-4d0c-a484-bd02f8e7fea3.png`
- 用户最终指定的首屏冻结参考已保存为 `research/references/zzapi-hero-freeze-reference-user.png`。
- 用户选择的首屏以下视觉方向为 `research/concepts/signal-corridor-v2.png`（SHA-256 `001A2083C2ECBF77E9DA919FF4F5B942113EC60A48C24D0F8BE6EF0005959FC9`）。
- 融合末尾价值 Tabs 后的最终实现视觉目标为 `research/concepts/signal-corridor-with-value-tabs-final.png`（SHA-256 `9108D0FC2784A5F572F5854F734E094E4EDEA7E0471BA4D7B176A2DBA019EFFB`）。
- 用户要求在连续叙事末尾增加高级展开式选项卡，结构参考已保存为 `research/references/truesota-expanded-tabs-reference-user.png`，并以 `https://true-sota.com/home` 的当前实现作交互研究。
- 参考只用于学习大尺度排版、留白、数据视觉对象和 Section 节奏；不得复制 TrueSOTA 的页面结构、文案、紫色体系、组件、图表或动画。

## Requirements

### R1 — 页面与首屏边界

- 只修改首页 `/`，不得改变登录、模型广场、排行榜、About、Legal、控制台或其他业务页面。
- 当前首屏 Hero、Logo、Gateway 路由图、品牌开场、导航、核心文案、布局、动效和资源原则上保持不变。
- 以上首屏与开场属于绝对冻结范围；本任务不得重新绘制、替换、重排、调整时序或用新视觉稿覆盖它们。
- 仅允许为首屏与第二屏之间的连续性增加不改变首屏主体输出的衔接处理。
- 首页专属共享调整必须明确限定在 homepage 作用域内，不改变其他路由的默认分支。

### R2 — 连续内容叙事

现有 `Stats / Features / HowItWorks / CTA` 从首页组合与 DOM 中删除。首屏以下按以下用户问题形成一条连续 signal spine，而不是传统 Feature Card 堆叠：

1. **Model Authenticity**：用户连接的模型如何被识别、检查和理解。
2. **Gateway / Usage**：一次请求经过 zzapi 后发生什么，用户获得何种透明度与控制力。
3. **Capability / Infrastructure**：多模型、路由、兼容、稳定性和状态如何组成运行中的基础设施。
4. **Developer Experience**：开发者如何通过一个兼容 API 接入不同模型。
5. **Value Tabs**：以不重复前四段内容的可操作价值证据展示用量透明、路由控制和运行信号。
6. **CTA**：从一个 API 进入整个模型世界，形成叙事闭环。

### R3 — 模型真实性表达

- 第二屏是本轮核心视觉记忆点，以 AI Model Identity / Runtime Signals 的精密仪器感回应“模型真实性”诉求，而非传统后台 Dashboard。
- 仅使用项目公开接口可证明的模型配置身份、目录厂商、Endpoint 路径/方法、路由配置与最近真实流量观测；目录厂商必须标为 catalog metadata，不等同于上游渠道或官方来源。
- 当前项目没有公开的官方认证、API Signature 检测或逐模型 Streaming / Tool Calling / Structured Output / Reasoning 真值表，不得把这些维度展示为已验证能力；缺失元数据使用 `Not reported`、`No recent sample` 或直接省略。
- 状态词限定为语义准确的 `Configured`、`Route available`、`Observed`、`Not reported`；不得使用 `Verified`、`Authentic Model`、`Official` 等无法证明的结论。
- 不虚构 `100%`、`99.99%`、`0ms`、百万请求或其他具体性能/业务数值。

### R4 — Gateway 与基础设施表达

- 将 request → gateway → routing → model → response 做成大型、可理解的视觉对象，不使用普通柱状图或营销卡片墙。
- 模型网络围绕 zzapi Gateway 展示当前目录可见模型、目录厂商、已配置 endpoint 和项目确定支持的协议路由语义；不得把 Hero 中的固定模型节点描述成实时连接清单。
- 数据视觉化应帮助理解请求路由、模型连接和使用透明度，而不是模拟完整控制台。

### R5 — Developer Experience

- 突出 OpenAI-compatible / one API / many models 的低摩擦接入价值。
- 代码只保留能解释接入方式的关键片段，不制作大型文档截图或伪造完整 SDK 功能。
- 请求流动、模型切换和兼容性表达必须与实际接口能力一致。

### R6 — 视觉与品牌语言

- 以选定的 `signal-corridor-v2.png` 为实现目标：一条连续纵向信号轴串联 Model Identity、Request Journey、Current Catalog、Developer Integration、Value Tabs 与 CTA。
- 方向为 Minimal / Premium / Technical / Spatial / Comfortable。
- 使用大尺度但克制的排版、1200–1440px 内容宽度、巨大留白、不对称 35/65 或 40/60 布局和少量大型视觉模块。
- zzapi 蓝只作为状态点、路由、验证信号、数字、hover 或数据流的精确信号，不作为大面积底色。
- 白、极浅灰、黑、银灰和极淡品牌色构成主要表面；深色模式使用配套的高级黑/石墨层级。
- 减少卡片数量，禁止四宫格/三列 Feature Card、卡片套卡片、霓虹、装饰粒子、无意义 3D、强玻璃和视觉特效堆叠。

### R7 — 动效

- 允许 verification scan、节点依次激活、route flow、status transition、number/label reveal 和克制 hover。
- 动效必须解释产品状态，不得阻塞阅读或表现为无尽 loading。
- 动画可中断，优先 transform/opacity；`prefers-reduced-motion` 下使用静态状态或短 cross-fade。

### R8 — 响应式与可访问性

- 独立验证 `1440`、`1280`、`1024`、`768` 和 `390` 宽度；移动端重新编排大型验证、路由、模型网络和开发者模块，不是桌面简单缩放。
- 不得出现重叠、横向页面溢出、截断、不可达 CTA 或焦点陷阱。
- 标题层级、语义 landmark、可访问名称、键盘路径、焦点可见性、对比度和 reduced motion 必须通过检查。

### R9 — 内容、数据与国际化

- 优先复用 `/api/status`、模型/Provider 配置、现有价格与能力元数据；动态数据必须有明确 loading/empty/error/fallback。
- 全站界面与 API 错误 i18n 只保留英文和简体中文；删除 zh-TW、fr、ja、ru、vi 资源与界面选项。历史中文变体统一归一化到简体中文，其他历史语言值安全回退英文。
- 保留 new-api、QuantumNous、许可证和原项目归属，不删除、不替换、不弱化。

### R10 — 末尾价值选项卡

- 选项卡位于 Developer Experience 之后、Final CTA 之前，承担新的“使用结果与控制能力”表达，不重复前文的模型身份、请求步骤、模型清单或代码示例。
- 三项固定为：
  1. **Usage Clarity / 用量清晰**：说明按使用量计费、配置定价与分组规则如何形成可追溯账本；不得展示匿名首页无法取得的个人用量或虚构金额。
  2. **Routing Control / 路由控制**：说明 priority、weight 与 policy-based routing 机制；若当前公共接口未公开实例权重，只展示机制，不伪装为实时配置。
  3. **Runtime Signals / 运行信号**：仅在真实性能摘要存在时展示最近 24 小时观测；无样本显示 `No recent sample`，不得称为 uptime、SLA 或官方可用性。
- 桌面采用左侧纵向展开选项 + 右侧单一大型信息对象的 38/62 构图；只学习参考站的信息关系和节奏，不复制紫色/橙色、柱状图、文案、金额、假指标或滚动劫持。
- 复用项目现有 Base UI Tabs 语义；`orientation="vertical"`，方向键/Home/End 移动焦点，Enter/Space 激活，只有一个活动 Tab 与一个可见 Panel。
- 不自动轮播、不随页面滚动自动切换、不在切换时改变页面滚动位置；移动端为纵向选项列表后接活动面板。
- Loading、empty、error、module-disabled、auth-required 与 last-known 状态维持稳定尺寸，不造成页面跳动，也不触发公开首页 toast、认证刷新或登录跳转。

## Acceptance Criteria

- [ ] 当前首屏在 desktop/mobile、light/dark 下与固定基线无可见回归，首屏冻结路径或 DOM 改动均有明确例外说明。
- [ ] 现有 Stats / Features / HowItWorks / CTA 不再进入首页 DOM，首屏以下形成 Identity → Request Corridor → Current Catalog → Developer Integration → Value Tabs → CTA 的连续叙事。
- [ ] Authenticity、Gateway Usage、Model Network、Developer Flow 至少四个大型视觉模块拥有独立产品职责和 zzapi 品牌识别度。
- [ ] 所有展示能力、状态和数据均可追溯到代码/接口/明确示例，没有无法证明的认证、百分比、可用率、延迟或请求量。
- [ ] Light/Dark 与 `1440/1280/1024/768/390` 代表视口无重叠、截断、页面横向溢出或不可达交互。
- [ ] 键盘、focus、语义结构、WCAG 2.1 AA 对比度和 reduced-motion 检查通过。
- [ ] 末尾 Tabs 具有正确的 vertical Tabs 语义、方向键/Home/End/Enter/Space 行为、单一活动面板、稳定高度、移动端重排，且不存在自动切换或滚动劫持。
- [ ] 双语 i18n 同步无缺失；语言选择器与个人设置只显示简体中文/英文，历史 locale 安全降级；受影响测试、changed-file lint/format、typecheck、production build 和浏览器 console 检查通过。
- [ ] 至少执行 Brand、Design、Product、Responsive、Motion/Accessibility 五类独立审查；所有 P0/P1/P2 问题修复并复验。
- [ ] 设计 QA 使用选定视觉目标与同状态实现截图进行同视口比较，`design-qa.md` 最终为 `passed`。
- [ ] 除 `/` 首页实现、首页专属测试/样式/资产和本任务文档外，其他产品页面无 diff。

## Out Of Scope

- 重新设计或调整当前首屏主体。
- 修改其他产品页面、认证流程、控制台业务逻辑、后端 API、数据库、计费或权限语义。
- 声称提供项目无法证明的官方模型认证或量化服务承诺。
- 复制 TrueSOTA 的视觉结构、紫色配色、文案、卡片或图表。
- 在融合后的修订视觉稿与最终规划未被再次批准前进入实现。

## Key Decisions

- 当前首屏与开场保持原样，不由任何生成稿重新实现。
- 首屏以下采用用户选定的 `signal-corridor-v2` 方向，旧 Section 全部退出首页组合。
- 末尾增加 zzapi 专属的 Usage Clarity / Routing Control / Runtime Signals 展开式 Tabs，参考站只作为交互比例研究。
