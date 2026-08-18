# 阶段四：用户业务页面

## Goal

将用户控制台重构为成熟的 AI Infrastructure Console，使状态、使用量、密钥、计费和调用工具更容易理解和操作。

## Requirements

- Dashboard 突出账户状态、近期使用、关键指标和下一步操作，避免无差别 Card 堆叠。
- Keys 强化密钥生命周期、安全状态、复制/撤销与创建路径。
- Usage Logs/Analytics 强化时间、模型、token、费用、状态与异常的扫描和筛选。
- Wallet/Subscriptions 明确余额、充值、计划、账单和限制之间的关系。
- Profile 保持账户、安全和偏好设置的清晰边界。
- Playground/Chat 维持高效调用与调试体验，并适配窄屏。

## Acceptance Criteria

- [ ] 每个页面的首要任务在首屏可识别，主要操作不被装饰或次要指标淹没。
- [ ] 密钥、费用和订阅敏感操作提供明确反馈与危险边界。
- [ ] 高密度日志/数据在 desktop 高效，在 mobile 有合理降级且不丢关键内容。
- [ ] 页面 loading、empty、error、disabled 与权限状态完整。
- [ ] 各页面 light/dark、desktop/tablet/mobile 实看与独立 UX/a11y 审计通过。
- [ ] 自动检查与生产构建通过，首页冻结路径无 diff。

## Out of Scope

- 不改变配额、计费、订阅、密钥或日志的后端契约与计算。
