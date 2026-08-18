# 阶段五：管理与系统页面

## Goal

把管理员与超级管理员页面重构为高密度但清晰、可预测、安全的路由运维和平台管理工作区。

## Requirements

- Channels、Models、Deployments 强化可用性、权重、状态、故障和批量运维信息。
- Users、Redemption、Subscriptions、Analytics 强化检索、权限、收入和风险信息层级。
- System Settings 的约 40 个逻辑子页采用稳定分组、页面命名和保存反馈。
- System Info、Site Identity、Setup 明确职责，避免命名与信息重复。
- 数据表保留合理密度，统一筛选、选择、批量操作、空状态和危险操作反馈。
- 细粒度权限在 UI 中正确消费；无法访问页面不得只依赖后端报错。

## Acceptance Criteria

- [ ] 管理员和超级管理员路由与操作按权限正确显示并可理解。
- [ ] 密集表格在常见桌面宽度高效，在 tablet/mobile 不遮挡持久操作。
- [ ] System Settings 分组、路由、保存/错误状态一致且无命名混淆。
- [ ] 所有危险或批量操作拥有明确目标、确认、进行中和结果反馈。
- [ ] 适用状态、主题、响应式、键盘和 screen reader 审计通过。
- [ ] 自动检查、生产构建和首页冻结回归通过。

## Out of Scope

- 不修改管理员权限语义、渠道调度、模型配置或系统设置后端数据契约。
