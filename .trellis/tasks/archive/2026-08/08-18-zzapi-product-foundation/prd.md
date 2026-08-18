# 阶段一：子页面品牌基础设施

## Goal

建立不会影响首页、可被后续各产品模块逐步采用的 zzapi 子页面 Product Shell 与设计基础设施，并修复 shell 级语义和移动导航可访问性缺陷。

## Requirements

- 新增 scoped Product Shell、Resource Header 和 Metric Strip 基础组件。
- 新增子页面专属设计 token 和样式作用域，不修改全局 `:root` 或首页专属 CSS。
- 为 PublicLayout、SectionPageLayout、DataTablePage 等共享层提供显式 opt-in 能力，默认输出兼容现状。
- 建立 public/auth/workspace 三种画布语义，但 ProductShell 本身不拥有 `main`，也不强制页面使用同一布局。
- public product 和 workspace 在本阶段分别由明确的 layout 拥有唯一主 landmark/skip target；auth 在本阶段只保证 ProductShell 无 landmark，AuthLayout 的唯一 main ownership 延后到阶段三随认证结构一起落地。
- 为 product public header 建立独立 opt-in 移动菜单，补齐 focus、ARIA、Escape、焦点归还、背景隔离和低高度滚动；首页 legacy header 保持不变。
- 页面进入动效采用短 opacity/位移反馈，支持 reduced motion；不触碰首页动效。
- 为新增 API、可访问行为和首页兼容性添加稳定回归测试。

## Acceptance Criteria

- [ ] 所有新增 CSS selector 均受 `[data-zzapi-product]` / `[data-product-*]` 作用域保护。
- [ ] 未显式 opt-in 的现有页面和首页共享组件输出保持不变。
- [ ] 相对固定基准提交的首页冻结文件无 diff，首页桌面/移动与明/暗基线无可见回归。
- [ ] Product Shell 支持 public/auth/workspace 变体且始终无 landmark；public product 与 workspace 各自只有一个语义化 `main`，auth 本阶段不新增 landmark。
- [ ] 移动菜单完全键盘可操作，关闭时不可进入 Tab 顺序，Escape 与焦点归还有效。
- [ ] reduced-motion 用户不会收到大范围位移动画。
- [ ] 新增组件和交互拥有行为测试；受影响 lint、typecheck、测试和 build 通过。
- [ ] 不新增未翻译文案，不移除 new-api / QuantumNous 受保护信息。
- [ ] 变更文件 targeted lint 零 error、相关测试通过、完整 suite 相对存量基线零新增失败。

## Out of Scope

- 本阶段不全面重构任何业务页面内容。
- 不修改业务请求、权限、表格数据模型或后端逻辑。
- 不引入新的 UI 框架、动画框架或大型依赖。
