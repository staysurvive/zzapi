# zzapi 子页面品牌化重设计

## Goal

在完全冻结当前首页的前提下，重新设计并实现首页之后的全部产品页面，使公开页面、认证流程、用户工作台和管理员平台形成成熟、统一、舒适且明确属于 zzapi 的 AI Infrastructure 产品体系。

## Background

- 当前首页是最终品牌基准，来源视觉为 `C:/Users/npp_c/.codex/attachments/6044b8c8-9679-440c-bbe4-f58908c72e82/image-1.png`。
- 首页提供的品牌 DNA 包括 Z 几何、品牌蓝、精密线路、空间层次、克制科技感、清晰排版与有意义的轻动效。
- 现有子页面存在旧 Logo、通用 Admin 模板感、页面职责区分不足、部分响应式与可访问性缺陷等问题。
- 本任务按可独立验收的模块分阶段实施，任何阶段不得为了推进速度跳过验证。

## Requirements

### R1 — 首页第一屏冻结

- 禁止修改 `web/src/features/home/**`、`web/src/routes/index.tsx`、`web/public/landing-brand-core.png` 和整个 `web/src/styles/index.css`。
- 禁止改变首页第一屏 Hero、Gateway、导航、Logo、DOM、布局、文案、动画、交互或资源输出。
- 经用户 2026-08-18 补充授权，首页第二屏之后可通过新的独立 scoped stylesheet 调整 light/dark 配色；不得借此修改冻结路径或第一屏输出。
- 共享组件如需扩展，必须采用显式 opt-in 分支；默认分支保持首页现状。

### R2 — 品牌一致性而非页面复制

- 子页面应提取首页品牌 DNA，但不得机械复制 Gateway、首页 Hero 或线路网络。
- 品牌表达优先通过排版、空间、网格、边界、状态、微量节点/线路细节和品牌蓝完成。
- 不以更多光效、渐变、玻璃、阴影或动画替代信息架构与产品设计。

### R3 — 按页面职责重构

- 公开发现页突出模型发现、能力比较、趋势和品牌叙事。
- 认证页突出可信、安全、低摩擦的身份流程。
- 用户工作台突出状态、用量、密钥、计费和快速操作效率。
- 管理页保持合理信息密度，优化扫描、筛选、批量操作、状态表达和危险操作边界。
- 允许在不改变业务契约的前提下重排、合并、弱化或强化页面信息。

### R4 — 统一但可组合的设计系统

- 建立仅作用于子页面的 Product Shell、排版、颜色、间距、边界、层级、按钮、输入、表格、状态和动效规则。
- 统一组件不等于统一页面模板；页面布局必须服从具体任务。
- 优先复用当前 Base UI、Tailwind、现有组件与业务逻辑，不引入无必要依赖。

### R5 — 响应式与可访问性

- Desktop、Tablet、Mobile 分别设计；移动端不得只是桌面缩小版。
- 保持键盘可操作、清晰焦点、语义化结构、正确 ARIA、足够对比度和减少动效支持。
- 修复本任务审计发现的 `SkipToMain`、嵌套 `main`、移动菜单焦点/滚动、鼠标专属操作等相关缺陷。

### R6 — 功能、兼容与治理

- 保持所有现有路由、权限、请求、表单、数据与业务行为兼容，除非子任务明确记录并验证产品级调整。
- 新增文案必须使用 i18n，并覆盖 en、zh、zh-TW、fr、ja、ru、vi。
- 永久保留所有与 new-api、QuantumNous、许可证、归属和链接相关的受保护信息。
- 不包含后端 API、数据库或计费逻辑重构。

### R7 — 多轮质量闭环

- 每个可见阶段都执行实现 → 浏览器检查 → 独立审计 → 修正 → 再验证。
- 最终完成前必须覆盖品牌、UX、响应式、交互/动效、可访问性、代码架构和首页冻结回归。

### R8 — 可复现证据

- 使用 route / role / state 责任矩阵证明全部路由和逻辑子页均有阶段归属。
- loading、empty、error、permission-denied、mutation-pending 等状态必须记录确定性构造方式，不能用正常数据截图代替。
- 首页冻结以 `d092808a802835e3108be1ad20ba0eb7d04b9cf7` 为固定基准，而不是仅检查当前工作树是否干净。
- 首页截图只作为品牌与冻结基准；子页面 Design QA 必须使用同 route、state、viewport 的已选视觉目标。

## Phase Map

1. `08-18-zzapi-product-foundation`：子页面品牌基础设施。
2. `08-18-zzapi-public-discovery`：模型广场、模型详情、排行榜、About 与 Legal。
3. `08-18-zzapi-auth-workspace-shell`：认证流程与工作区外壳。
4. `08-18-zzapi-user-workspace`：Dashboard overview/models/flow、Keys、Usage、Wallet 中的用户订阅、Profile、Playground、Chat/Chat2Link；按 4A–4D 小波次验收。
5. `08-18-zzapi-admin-platform`：Channels、Models、Deployments、Users、Redemption、`/subscriptions`、Dashboard users analytics、System Settings/Info、Setup；按 5A–5F 小波次验收。
6. `08-18-zzapi-product-integration-qa`：全站整合、回归、设计 QA 与最终打磨。

阶段按顺序推进。后续阶段可依赖已验收的基础设施，但每个阶段必须拥有独立、可观察的验收结果。

## Acceptance Criteria

- [ ] 首页冻结路径的文件内容和第一屏桌面/移动端、明/暗主题视觉基线无回归；第二屏之后的授权配色调整有独立证据。
- [ ] 所有现有子页面路由已归入阶段并完成品牌化设计，不存在遗漏或临时旧模板页面。
- [ ] 不同产品族拥有符合职责的信息层级与布局，而不是同一套 Card/Table 模板换标题。
- [ ] 公开、认证、用户和管理员区域视觉上属于同一 zzapi 产品，同时保持各自使用效率。
- [ ] Desktop、Tablet、Mobile 的主要页面和关键状态均完成浏览器验证。
- [ ] Light/Dark、loading、empty、error、disabled、hover/focus/active 等适用状态已验证。
- [ ] 已修复审计记录中的可访问性和响应式高优先级问题。
- [ ] 新增文案在七种前端语言中完整同步。
- [ ] 受影响文件 lint、TypeScript typecheck、相关测试与生产构建通过；全仓库存量问题单独如实记录。
- [ ] 独立审计不再存在可执行的 P0/P1/P2 产品、视觉、响应式或可访问性问题。
- [ ] new-api / QuantumNous 等受保护项未被删除、替换或弱化。
- [ ] 路由、角色、状态和证据矩阵不存在未归属项；N/A 均有可验证理由。

## Out of Scope

- 修改当前首页第一屏设计或重新制作首页资源。
- 重写后端 API、数据库模型、计费、权限语义或第三方渠道协议。
- 仅为装饰引入 3D、粒子、复杂背景动画或新的大型 UI 依赖。
- 在尚未通过阶段验收时发布新 Release 或 Docker 镜像。
