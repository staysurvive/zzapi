# Homepage V5 分阶段实施计划

## Preconditions

- [ ] 用户已批准 `signal-corridor-with-value-tabs-final.png` 和本规划摘要。
- [ ] `task.py start` 后再修改产品代码。
- [ ] 精确路径暂存；禁止 `git add .`，不得包含当前其他 Trellis task、格式化存量文件或 `outputs/`。
- [ ] 每个阶段同时完成对应测试与浏览器局部截图，不把测试堆到最后。

## Stage 0 — Governance And Freeze Boundary

- [ ] 按 `research/home-v5-freeze-contract.md` 保存冻结文件 hash/diff 与 Hero element baseline。
- [ ] 收窄旧 `home-freeze-manifest.md`：Dedicated Homepage V5 允许 below-fold 例外，Hero/Opening 保持冻结。
- [ ] 更新 `.trellis/spec/frontend/product-shell.md` 的 homepage boundary，保留非首页 product work 的完整冻结规则。
- [ ] 确认最新目标图 SHA-256 与 PRD 一致。

Commit: `docs(trellis): finalize homepage v5 target and freeze boundary`

## Stage 1 — Truthful Data Foundation

- [ ] 新建 `homepage-v5-data.ts`，实现稳定排序、模型选择、endpoint/pricing/traffic 投影与状态枚举。
- [ ] 新建 `use-homepage-v5-data.ts`，以 ambient + nav module + auth 为查询 gate。
- [ ] pricing/perf 使用首页专用 silent request config；独立缓存与独立失败。
- [ ] 覆盖 current/loading/last-known/empty/error/auth-required/disabled。
- [ ] 单元测试禁止 official/verified/request_count/growth_pct/假 capability 进入 projection。

Commit: `feat(web): add truthful homepage v5 data foundation`

Rollback: 删除两个新文件与测试；无现有行为改变。

## Stage 2 — Signal Corridor Narrative

- [ ] 建立 `components/v5` 与 `HomepageV5` 组合。
- [ ] 实现 Model Identity、Request Corridor、Current Catalog、Developer Integration 四段。
- [ ] 流程用 `<ol>`、状态用 `<dl>`、真实模型选择用 button + `aria-pressed`。
- [ ] Developer code 使用 status-derived/placeholder base URL 和 `$ZZAPI_KEY`。
- [ ] 修改 Home default branch：保留 `LandingEntrance → Hero`，只替换 `.home-below-fold` 子树；加入 main/skip/lang 无视觉语义修复。
- [ ] 旧 Stats / Features / HowItWorks / CTA 不再进入 DOM；确认无引用后删除对应文件与 exports。
- [ ] 组件顺序、custom-home 三分支、opening/Hero 回归测试通过。

Commit: `feat(web): build homepage signal corridor narrative`

Rollback: 恢复旧 composition；冻结文件未改。

## Stage 3 — Value Tabs And Conversion

- [ ] 复用 Base UI Tabs 实现三项 vertical manual activation。
- [ ] Usage Clarity、Routing Control、Runtime Signals 三个 Panel 不重复前四段。
- [ ] keyboard/focus/ARIA、隐藏 Panel 不可聚焦、click/touch、主题/语言后 selection 保持。
- [ ] Final CTA 对 guest/authenticated 使用现有真实路由；Footer 原样复用。
- [ ] 对 Tabs 的 loading/empty/error/auth/disabled 与固定高度写行为测试。

Commit: `feat(web): add homepage value tabs and final conversion`

Rollback: HomepageV5 去掉 ValueTabs，数据层保留。

## Stage 4 — Theme, Motion And Responsive

- [ ] 完整重写 `home-below-fold.css` 为 `[data-home-v5]` scope，删除旧结构选择器。
- [ ] 完成 1440 / 1280 / 1024 / 768 / 390 / <=359 重新排版。
- [ ] light/default-dark/preset tokens 与 forced-colors/focus 对比度通过。
- [ ] 实现 ambient-gated 一次性 signal/reveal 与 manual Tabs transition。
- [ ] 实现 live reduced-motion preference 与 visibility pause；JS/IO 缺失时内容默认可见。
- [ ] CSS scope、reduced motion、稳定尺寸、overflow contract 测试通过。

Commit: `feat(web): complete homepage v5 motion and responsive system`

## Stage 5 — i18n And Code Quality

- [ ] 加载并遵循 `i18n-translate` skill。
- [ ] 新文案以英文 key 使用 `t()`，运行 `bun run i18n:sync`，补齐 en/zh。
- [ ] 删除 zh-TW/fr/ja/ru/vi 前端 locale 与后端 zh-TW 错误资源；删除模型同步日语选项；语言选项、日期 locale、检测/登录历史偏好统一为双语契约。
- [ ] 模型名、路径、代码、catalog metadata 不翻译。
- [ ] 中文/英文自动测长文本与 overflow，并在语言选择器、个人设置和登录恢复路径验证双语契约。
- [ ] 删除确认无引用的旧 home helpers；不做无关重构。

Commit: `feat(web): localize and clean homepage v5`

## Stage 6 — Full Verification And QA

- [ ] Targeted Vitest：data projection、query gates、composition、tabs keyboard/ARIA、reduced motion、CSS scope。
- [ ] 保持 existing landing entrance lifecycle、opening focus、hero/network visual-state tests 通过。
- [ ] changed-file `oxlint`、`oxfmt --check`、copyright header 检查。
- [ ] `bun run typecheck`、`bun run build`、`git diff --check`。
- [ ] 浏览器矩阵：1440×900、1280×800、1024×768、768×1024、390×844；light/dark；populated/loading/empty/error；guest/auth；zh/en/ru；三 Tabs；keyboard/focus；reduced motion。
- [ ] 每个视口检查 `scrollWidth === clientWidth`，console 无新增 error，Tab 切换不改变 scroll position。
- [ ] Hero element screenshot 与固定 baseline 同状态比较；冻结 path diff/status/hash 通过。
- [ ] Brand、Design、Product、Responsive、Motion/Accessibility 五轮独立审查；修复全部 P0/P1/P2。
- [ ] 将 Homepage V5 同视口 source/implementation comparison 与迭代记录追加到根 `design-qa.md`；末尾 `final result: passed`。
- [ ] 运行 `trellis-check`，最后再次完整复验。

Commit: `test(web): verify homepage v5 design and regressions`

## Validation Commands

从 `web/`：

```powershell
bun run test -- src/features/home src/styles/__tests__/home-below-fold-scope.test.ts
bun x oxlint -c .oxlintrc.json <changed-ts-tsx-files>
bun x oxfmt --check <changed-ts-tsx-json-css-files>
bun run i18n:sync
bun run typecheck
bun run build
bun run copyright:check
```

从仓库根：

```powershell
git diff --check
python ./.trellis/scripts/task.py validate .trellis/tasks/08-19-zzapi-homepage-v5-below-fold
```

同时执行 `research/home-v5-freeze-contract.md` 中的固定路径命令与浏览器视觉门禁。

## Staging Discipline

每次提交前使用 `git status --short` 与 `git diff --cached --name-only` 审核范围，只暂存本任务文档、homepage V5 源码/样式/测试/i18n 与必要的 freeze/spec 修订。以下现有脏文件不得进入提交：

```text
.trellis/tasks/08-18-zzapi-admin-platform/implement.jsonl
.trellis/tasks/08-18-zzapi-auth-workspace-shell/implement.jsonl
.trellis/tasks/08-18-zzapi-user-workspace/implement.jsonl
web/src/features/auth/lib/oauth-callback-mode.ts
web/src/features/channels/lib/channel-field-update.ts
web/src/features/channels/lib/model-categories.ts
web/src/features/keys/components/api-key-group-cell.tsx
web/src/features/redemption-codes/lib/redemption-form.ts
web/src/features/usage-logs/lib/format.ts
outputs/
```
