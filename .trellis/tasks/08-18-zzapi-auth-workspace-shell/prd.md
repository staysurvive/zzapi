# 阶段三：认证与工作区外壳

## Goal

建立统一、可信、低摩擦的 zzapi 身份体验与高效率工作区外壳，消除首页与登录后产品之间的品牌断层。

## Requirements

- 重构登录、注册、OTP、OAuth、忘记/重置密码、Passkey 与 2FA 相关界面。
- 使用 zzapi 品牌标识，同时保留受保护的 new-api / QuantumNous 信息。
- 重构 authenticated header/sidebar/mobile drawer 的导航层级、active state 和可达性。
- 修复 skip link、嵌套 main、移动焦点管理、低高度滚动和命名混淆。
- 权限不可用项目应有正确隐藏/禁用语义，但不改变后端权限逻辑。

## Acceptance Criteria

- [ ] 认证全流程在成功、失败、等待、禁用和回调状态下清晰一致。
- [ ] Desktop/tablet/mobile 工作区导航无重叠、截断或焦点陷阱。
- [ ] 页面只有一个主 landmark，skip link 指向真实内容。
- [ ] 品牌切换不影响站点自定义配置和受保护归属。
- [ ] 键盘、screen reader 语义、reduced motion 与对比度检查通过。
- [ ] 相关测试、lint、typecheck、build 与浏览器审计通过。

## Out of Scope

- 不改变认证协议、OAuth provider、token、Passkey 或 2FA 后端行为。
