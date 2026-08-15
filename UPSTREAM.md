# Product Baseline and Upstream Notes

This file records the current product baseline and the relationship to the
upstream project. It does not replace the repository's `LICENSE`, `NOTICE`,
or `THIRD-PARTY-LICENSES.md` files.

## Baseline

- Repository: `https://github.com/staysurvive/new-api`
- Default branch: `main`
- Baseline commit: `f932a4a3d81d96a3bf661cd49560e35f939a1399`
- Upstream parent at the start of this product fork: `ccd535ef8e50cf6e5846a59278c40b7ff59d1b7d`
- Baseline date: 2026-08-15

The baseline is intentionally kept as a normal Git history so that each
release can be compared with the upstream parent and rolled back without
rewriting existing history.

## Current Product Changes

The current product-specific work is concentrated in these areas:

1. Frontend home experience and branding, including the landing entrance,
   infrastructure map, responsive sections, accessibility behavior, and
   visual regression tests. The integrated version is recorded in commit
   `0aa2f822`.
2. Reasoning-effort persistence and display in usage logs across the Go
   backend and frontend. The initial implementation is recorded in commit
   `c13bd833`.
3. Local development and source-based deployment using Docker Compose,
   including persistent data directories under `data/`. The deployment work
   is recorded in commits `f5610187`, `474ca9ca`, and `8b4a37b9`.
4. Project-local development workflow, specification, and task records under
   `.trellis/`, `.agents/`, and `.codex/`.

No new provider channel or relay protocol is part of this product baseline.

## Release Verification

Before tagging a product release, run:

```text
make test
cd web && bun run build:check
cd ../relaykit && GOWORK=off go build ./...
```

Also verify a database backup, an upgrade from the previous release, and the
current-source Docker Compose deployment before publishing the release.

## Attribution and License Requirements

Modified versions must continue to comply with the GNU Affero General Public
License v3.0 and preserve the repository's required notices and attributions.
In particular, keep `LICENSE`, `NOTICE`, `THIRD-PARTY-LICENSES.md`, the
original project attribution, the original project link, and a clear record of
product-specific changes. Product branding and additional documentation may
be added alongside those notices, but must not misrepresent the origin of the
modified work.
