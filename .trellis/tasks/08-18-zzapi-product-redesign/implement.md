# Implementation Plan — zzapi 子页面品牌化重设计

## Delivery Rules

- 一次只启动一个子任务；每阶段通过质量门槛后再进入下一阶段。
- 每个可见阶段至少包含一次浏览器实看和一次独立审计修正循环。
- 首页冻结路径每阶段均做 `git diff` 审计，最终进行截图回归。
- 未通过的阶段不提交、不发布、不更新镜像。
- 阶段 2–6 在各自启动前必须完成 `design.md`、`implement.md`、screen contracts 与 route/role/state/evidence 矩阵；父任务的阶段摘要不能替代子任务规划。
- 可见产品族在编码前执行三方向视觉目标选择门；首页参考只用于 Brand DNA，不作为子页面 fidelity target。

## Ordered Phases

### 1. Product foundation

- 建立 scoped Product Shell、resource header、metric strip 与 additive layout variants。
- 修复 shell 级语义、skip link 和移动导航可访问性基础问题。
- 添加组件/行为回归测试，确认首页默认共享组件输出不变。

Gate：lint、typecheck、相关测试、build、首页冻结路径 diff 为零。

### 2. Public discovery

- 重新设计模型广场、模型详情、排行榜、About、Privacy、Agreement。
- 为模型发现、能力比较、趋势和品牌叙事建立不同页面结构。
- 验证公开导航与低高度移动菜单。

Gate：desktop/tablet/mobile + light/dark + loading/empty/error 截图和审计通过。

### 3. Auth and workspace shell

- 统一 zzapi 登录/注册/OTP/OAuth/重置流程的品牌与可信感。
- 重构 authenticated shell、sidebar、header、wayfinding 和权限可见性。
- 修复旧 Logo、嵌套 main、焦点与 route naming 问题。

Gate：认证关键路径、键盘操作、移动抽屉和 workspace responsive 验证通过。

### 4. User workspace

- 4A Dashboard overview/models/flow + Usage Logs/observability。
- 4B Keys + Profile。
- 4C Wallet + 用户购买/当前订阅体验（不包含管理员 `/subscriptions`）。
- 4D Playground + Chat + Chat2Link。
- 保持高效信息密度，避免全部变成同一 Card 模板。
- 覆盖计费、密钥和使用数据的安全操作状态。

Gate：各用户角色主要流程与关键数据状态通过自动和浏览器验证。

### 5. Admin platform

- 5A Channels。
- 5B Models metadata + Deployments。
- 5C Users + Redemption + 管理员 `/subscriptions`。
- 5D Dashboard users analytics 与管理员观测扩展；Dashboard 共享骨架由 4A 一次性拥有，不在此重复重构。
- 5E System Settings，按 site/auth/security/billing/models/content/operations 分组逐波验收。
- 5F System Info + 未初始化专用 Setup；Setup 不套 authenticated admin shell。
- 提升表格扫描、筛选、批量操作、状态与危险操作可理解性。
- 校验页面权限与敏感操作 UI 映射，不改变后端权限语义。

Gate：管理员/超级管理员路由、权限、密集表格移动降级和系统设置导航通过验证。

### 6. Integration QA

- 全路由矩阵检查品牌、一致性、独立性、舒适度、效率和细节。
- 覆盖 responsive、a11y、motion、i18n、console、首页冻结和生产构建。
- 按 P0/P1/P2 清零原则迭代，记录最终 `design-qa.md`。

Gate：所有父任务 Acceptance Criteria 有直接证据，完整检查通过后才进入提交与发布讨论。

## Validation Commands

```powershell
docker exec admiring_chatelet bun run typecheck
docker exec admiring_chatelet bun run lint
docker exec admiring_chatelet bun run test
docker exec admiring_chatelet bun run build
docker exec admiring_chatelet bun run copyright:check
```

当前完整 lint/test 存在存量失败。阶段一先保存机器可比较的错误集合并校准测试运行器；每波要求所有变更文件 targeted lint 零 error、相关测试通过、完整 suite 相对基线零新增失败。最终发布门槛优先清理到完整 suite 通过。`format:check` 目前在 Windows bind mount 有 `Invalid argument` 存量问题，改用 changed-file `oxfmt --check` 或 Linux 临时副本验证，不能虚报通过。

每批新文案必须使用临时 `add-missing-keys.mjs` 一次性写入七语言，运行 missing/untranslated 扫描和 `bun run i18n:sync`，检查报告后删除临时脚本；仅 sync 成功不代表翻译完成。

## Rollback Points

- Product Shell 只通过 opt-in 启用，可按页面撤销，不改变旧默认。
- 每阶段独立 commit；不得通过 reset/checkout 清除用户或其他任务改动。
- 若视觉方案失效，回退该阶段 opt-in 接入点，保留已验证的基础组件或测试，不污染首页。
