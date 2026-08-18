# 阶段六：全站整体验收

## Goal

以全路由和真实浏览器证据证明 zzapi 子页面体系在品牌、产品职责、响应式、可访问性、交互和代码质量上达到可发布的产品级标准。

## Requirements

- 建立公开、认证、用户、管理员和兼容路由的验收矩阵。
- 覆盖 desktop/tablet/mobile、light/dark 和关键数据/交互状态。
- 独立执行品牌、UX、responsive、motion、a11y、code architecture 审计。
- 对所有 P0/P1/P2 发现执行修复 → 同视口重拍 → 再比较闭环。
- 使用 Product Design Design QA 生成根目录 `design-qa.md`，记录来源、实现截图、视口、状态、比较历史和最终结论。
- 对首页冻结路径执行代码 diff 与四份基线截图回归。

## Acceptance Criteria

- [ ] 父任务每条 Acceptance Criteria 都有直接、当前的证据。
- [ ] 所有现有路由均在矩阵中且无旧品牌/临时模板/断裂页面。
- [ ] 无未解决的 P0/P1/P2 产品、视觉、响应式或可访问性问题。
- [ ] `design-qa.md` 的 `final result` 为 `passed`。
- [ ] 首页四份基线和冻结文件均无回归。
- [ ] i18n 同步、lint、typecheck、相关测试、production build 全部通过或对存量问题提供可验证隔离说明。
- [ ] 受保护项目身份和归属完整。

## Out of Scope

- 本阶段不引入新的产品范围；只做整合、缺陷修复和最终打磨。
