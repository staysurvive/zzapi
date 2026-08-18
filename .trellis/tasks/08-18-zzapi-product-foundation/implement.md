# Implementation Plan — Product Foundation

## Checklist

1. 读取前端规范、现有 layout/header/table/button 实现与测试模式。
2. 按 `research/home-freeze-manifest.md` 锁定首页文件、共享默认分支和四份视觉基线。
3. 校准自动质量基线：保存完整 lint/test 的精确失败集合，确认 typecheck，识别 test runner 与 Bun 版本差异。
4. 添加 `product-shell.css` 和无 landmark ProductShell、ResourceHeader、MetricStrip。
5. 为 PublicLayout/ProductPublicHeader、SectionPageLayout、DataTablePage 添加最小 additive opt-in API；覆盖现有 header 导航、工具区、扩展 slot 和 requiresAuth portal 兼容契约。
6. 修复 public product 与 workspace 的 skip target/main ownership；auth 只验证 ProductShell 无 landmark，将 AuthLayout ownership 留给阶段三；实现 product public menu 的完整可访问性与 body scroll cleanup 契约。
7. 为新增组件、legacy 兼容分支、单一 main 和移动菜单行为添加回归测试。
8. 运行变更文件 lint/format、typecheck、相关 Vitest、完整 suite 差集、copyright 与生产 build。
9. 在 IAB 中检查首页 1440×900/390×844、light/dark，并确认 console 无新增错误。
10. 独立审计代码边界、响应式、可访问性和首页冻结；修正后复验。

## Risky Files

```text
web/src/components/layout/components/public-layout.tsx
web/src/components/layout/components/product-public-header.tsx
web/src/components/layout/components/section-page-layout.tsx
web/src/components/data-table/layout/data-table-page.tsx
web/src/components/ui/button.tsx
```

共享文件必须只做 additive 变更。任何首页默认分支 DOM/class/animation 改变都视为阶段失败。

`web/src/components/ui/button.tsx` 仅在阶段一出现真实 brand variant 消费点时修改，否则保持不动。

## Forbidden / Frozen Files

```text
web/src/features/home/**
web/src/routes/index.tsx
web/public/landing-brand-core.png
web/src/styles/index.css
```

这些路径不得修改；新产品样式只能进入独立 scoped 文件。

## Validation

- `git diff --exit-code d092808a802835e3108be1ad20ba0eb7d04b9cf7 -- web/src/features/home web/src/routes/index.tsx web/public/landing-brand-core.png web/src/styles/index.css`
- `git status --short -- <frozen paths>`，捕获冻结目录中的未跟踪文件。
- `bun run typecheck`
- 变更文件 targeted lint 和 `oxfmt --check` 零错误。
- 相关 Vitest 行为测试通过；完整 lint/test 相对保存基线零新增失败。
- `bun run build`。
- 新增 TS/TSX `bun run copyright:check`。
- IAB 首页 1440×900、390×844，light/dark 视觉复核。
