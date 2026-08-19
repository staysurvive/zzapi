# 深色舒适度与首页下半区配色

## Goal

在不改变首页第一屏设计和控制台信息架构的前提下，重建更舒适、清晰、属于 zzapi 的高级黑深色表面层级，并让首页第二屏之后延续第一屏的冰蓝、银灰、石墨与少量冰蓝重点。

## Background

- 当前控制台默认深色主题同时使用全局中性 charcoal token 与 `ProductShell` 的 `#0e1116` 画布，形成近黑主背景、泥灰卡片和不同色温侧栏混用的问题。
- 当前首页第一屏拥有独立 zzapi token；`.home-below-fold` 未定义配色，第二屏之后退回通用主题 token，深色模式呈现大面积扁平灰黑。
- 当前审计证据位于 `.trellis/tasks/08-18-zzapi-product-redesign/research/evidence/dark-palette-audit/`，覆盖首页 light/dark full page，以及控制台 overview、channels、usage logs、system settings 深色页面。
- 首页第一屏仍以提交 `d092808a802835e3108be1ad20ba0eb7d04b9cf7` 和现有四张 freeze baseline 为不可回归基准。

## Requirements

### R1 — 控制台默认深色体系

- 仅在 authenticated workspace 存在时启用新的 premium black / graphite 默认深色 token，不通过全局 `.dark` 顺带改变公开页面。
- 统一 header、sidebar、workspace canvas、card、input、table、popover/dialog、muted surface、border、text、focus 和 chart 色阶。
- 大画布应从近黑抬升为冷中性石墨；卡片和弹层具有明确但克制的亮度层级，避免黑底上的暖灰泥块。
- 保持所有业务布局、路由、权限、查询、表单和交互不变。

### R2 — 首页第二屏之后

- 首页第一屏 Hero、Gateway、导航、Logo、动画、DOM 和资源保持不变。
- 仅在 `.home-below-fold` 范围内建立独立 light/dark semantic token 和背景层级，让 Stats、Features、How It Works、CTA、Footer 视觉连续。
- light 使用白、冰灰、银灰和克制蓝；dark 使用高级黑、石墨黑、银灰边界和少量冰蓝重点，不使用深蓝大面积铺底。
- 保留现有内容、顺序、布局、交互和滚动动画。

### R3 — 层级与可读性

- 正文和重要辅助文字满足 WCAG 2.1 AA 对比度目标；状态不能只依赖颜色。
- stats band、feature surfaces、workflow markers、CTA field 和 footer 至少形成三个可辨识层级，但不增加无意义装饰、玻璃堆叠或强光效。
- 优先复用现有 semantic token；只针对仍有明显压暗问题的 Dashboard overlay、Canvas chart 或硬编码实色做第二轮修正。

### R4 — 兼容边界

- 不修改 `web/src/features/home/**`、`web/src/routes/index.tsx`、`web/public/landing-brand-core.png` 或 `web/src/styles/index.css`。
- 首页下半区配色放入新的 scoped stylesheet，并从共享入口显式导入。
- 用户主动选择的 theme presets 保持不变；本任务只重做默认 zzapi dark palette。
- 不删除或替换 new-api、QuantumNous、许可证或归属信息。

## Acceptance Criteria

- [x] 首页第一屏 desktop/mobile、light/dark 与 freeze baseline 无可见回归，冻结路径相对基准提交无 diff。
- [x] 首页第二屏之后在 light/dark 下不再出现整块扁平灰黑或低对比内容，五个下半区 section 具有连续且可辨识的层级。
- [x] 控制台 overview、密集表格页、日志页、系统设置页在默认 dark 下使用同一套高级黑/石墨黑/银灰色阶，蓝色只作为小面积状态与操作重点。
- [x] workspace canvas、sidebar、card、input/table、popover/dialog 至少形成可辨识的背景层级，正文与辅助信息清晰可读。
- [x] Desktop 1440x900、Tablet 834x1194、Mobile 390x844 的首页和代表性控制台页面无重叠、截断或不可达控件。
- [x] Light theme、公开页面和自定义 theme presets 没有非预期回归。
- [x] 浏览器控制台无新增错误；受影响测试、changed-file lint/format、typecheck 和 production build 通过。

## Out of Scope

- 修改首页第一屏视觉、动效或交互。
- 重排首页下半区或控制台页面的信息架构。
- 重做所有自定义 theme presets。
- 修改后端 API、权限、计费、数据或表单语义。
