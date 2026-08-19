# TrueSOTA 末尾展开模块源码研究

研究来源：`https://true-sota.com/home`，2026-08-19 读取线上构建产物 `HomeView-YEmyAzLN.js`。

## 已确认结构

- `ts-feature-section` 内使用 sticky 容器承载标题和 `ts-feature-stage`。
- 左侧是三个 accordion button：`payAsYouGo / directAccess / refundGuarantee`。
- 当前项通过 `aria-expanded` 和 `aria-controls` 暴露状态；桌面右侧显示单一 `ts-feature-visual`，移动端把 visual 放进展开项内部。
- 页面滚动时根据 sticky 区域的进度更新活动项；点击项时会把页面滚动到对应进度。
- `prefers-reduced-motion` 时关闭滚动进度驱动。
- 三个视觉分别为 usage bars/ledger、access route、refund flow；其中包含硬编码金额、token 量、延迟和百分比，不可用于 zzapi。

## zzapi 采用与拒绝

采用：

- 左侧展开项与右侧大型信息对象的 38/62 关系。
- 活动项扩大、非活动项收起的层级节奏。
- 桌面单一稳定面板、移动端纵向重排的基本思想。

拒绝：

- 不采用滚动位置自动切换或点击后强制滚动。
- 不采用 sticky 长距离 pinning、紫色/橙色大色块、柱状图、金额贴纸。
- 不采用参考站的业务文案或任何硬编码金额、token、延迟、百分比。
- 不复制其 DOM、CSS 类、图形或动画实现。

zzapi 使用现有 Base UI Tabs，保持键盘、焦点、reduced-motion 与真实数据降级契约。
