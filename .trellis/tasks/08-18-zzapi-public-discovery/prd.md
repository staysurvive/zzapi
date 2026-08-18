# 阶段二：公开发现页面

## Goal

将模型广场、模型详情、排行榜、About 与 Legal 页面重构为清晰的模型发现、数据比较和品牌叙事体验。

## Requirements

- 模型广场突出搜索、筛选、Provider、能力、价格与使用入口，减少传统卡片墙噪声。
- 模型详情建立能力、兼容性、价格和调用信息的明确层级。
- 排行榜突出排名、趋势、差距与比较，不依赖单一传统表格表达。
- About 在无自定义内容时仍提供有价值的 zzapi 产品叙事，同时保留 new-api / QuantumNous 归属。
- Legal 页面提升阅读、导航与长文本移动体验，不改变法律文本语义。
- 公开导航、移动菜单、docs fallback 与页面命名保持可理解。

## Acceptance Criteria

- [ ] 五类公开页面拥有符合各自任务的独立布局。
- [ ] 搜索、筛选、详情入口和排行榜比较在键盘与移动端可用。
- [ ] 页面在 light/dark、desktop/tablet/mobile 下可读、无截断和重叠。
- [ ] loading、empty、error 状态与 Product Shell 一致且不误导。
- [ ] 新增文案完成七语言 i18n；受影响检查和浏览器审计通过。
- [ ] 首页冻结路径无 diff，受保护归属完整保留。

## Out of Scope

- 不改变模型、价格、排名或 Legal 内容的数据来源和后端语义。
