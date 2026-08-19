# Homepage V5 首屏冻结合同

## 目标

允许本任务重构 `/` 的 `.home-below-fold`，同时继续把既有 Hero、开场、Gateway 网络图和首屏几何视为不可回归资产。

## 基线

- Source baseline: `d092808a802835e3108be1ad20ba0eb7d04b9cf7`
- 首屏用户参考：`references/zzapi-hero-freeze-reference-user.png`
- 既有四张 browser baseline：`.trellis/tasks/08-18-zzapi-product-redesign/research/evidence/home-freeze/`
- Hero 实测 bottom：1440=`832px`、1280=`800px`、1024=`768px`、768=`768px`、390=`743px`。

## 字节级冻结路径

```text
web/src/features/home/components/sections/hero.tsx
web/src/features/home/components/infrastructure-map.tsx
web/src/features/home/components/landing-entrance.tsx
web/src/features/home/lib/opening-focus.ts
web/src/routes/index.tsx
web/public/landing-brand-core.png
web/src/styles/index.css
```

相关 opening 类型、生命周期和首屏测试不得为了适配 V5 而弱化或删除。

## 授权路径

```text
web/src/features/home/index.tsx
web/src/features/home/components/index.ts
web/src/features/home/components/v5/**
web/src/features/home/hooks/use-homepage-v5-data.ts
web/src/features/home/lib/homepage-v5-data.ts
web/src/styles/home-below-fold.css
web/src/features/home/**/__tests__/**
web/src/styles/__tests__/home-below-fold-scope.test.ts
web/src/i18n/locales/*.json
web/src/i18n/static-keys.ts
```

`index.tsx` 仅允许：

- 调整 V5 imports。
- 给 default homepage 的 `main` 增加无视觉变化的 `id='main-content'`、`tabIndex={-1}` 与页面语言语义。
- 在 opening 完成后提供 `SkipToMain`。
- 只替换 `.home-below-fold` 子树；`LandingEntrance → Hero → .home-below-fold` 顺序保持不变。

## 视觉比较合同

- 不再比较整张旧首视口，因为 desktop 约 68px、mobile 约 101px 的 Hero 以下内容进入旧首视口。
- 对齐同视口、同主题、同 locale、同 settled state 后，只比较 `y=0` 到 Hero bottom。
- Hero bottom 以下为本任务授权差异；不得使用负 margin、absolute/sticky overlay 或 viewport pinning侵入 Hero。
- 继续检查 Logo SHA-256 `A58D26790A7C571ACE684949255261FE3BB20AD6C3E4242B27ECD40F608DAC2C`。

## 门禁命令

```powershell
git diff --exit-code d092808a802835e3108be1ad20ba0eb7d04b9cf7 -- `
  web/src/features/home/components/sections/hero.tsx `
  web/src/features/home/components/infrastructure-map.tsx `
  web/src/features/home/components/landing-entrance.tsx `
  web/src/features/home/lib/opening-focus.ts `
  web/src/routes/index.tsx `
  web/public/landing-brand-core.png `
  web/src/styles/index.css

git status --short -- `
  web/src/features/home/components/sections/hero.tsx `
  web/src/features/home/components/infrastructure-map.tsx `
  web/src/features/home/components/landing-entrance.tsx `
  web/src/features/home/lib/opening-focus.ts `
  web/src/routes/index.tsx `
  web/public/landing-brand-core.png `
  web/src/styles/index.css
```

实施时同步收窄旧 `home-freeze-manifest.md` 与 `.trellis/spec/frontend/product-shell.md` 的笼统 `web/src/features/home/**` 规则，非首页 product task 仍然不得修改首页。
