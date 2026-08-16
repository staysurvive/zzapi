<div align="center">

<img src="./web/public/logo.png" alt="ZZAPI" width="96" />

# ZZAPI

A unified AI model gateway and management platform

<p>
  <a href="./README.md">中文</a>
  ·
  <a href="https://zzapi.cccd">Project website</a>
  ·
  <a href="https://github.com/staysurvive/zzapi/actions/workflows/docker-verify.yml">
    <img src="https://github.com/staysurvive/zzapi/actions/workflows/docker-verify.yml/badge.svg" alt="Docker Verification" />
  </a>
  <a href="./LICENSE">
    <img src="https://img.shields.io/badge/license-AGPL--3.0-brightgreen" alt="AGPL-3.0 License" />
  </a>
</p>

</div>

## Overview

ZZAPI aggregates multiple AI providers behind a unified API. It provides model access, channel routing, permission management, usage analytics, and cost accounting for personal or organization-managed deployments.

## Core Capabilities

- OpenAI-compatible API with Claude, Gemini, and other format conversions
- Multi-channel configuration, model mapping, weighted routing, and retries
- User, token, group, and model permission management
- Usage analytics, quota management, billing, and audit logs
- SQLite, MySQL, and PostgreSQL support
- Redis caching and Docker Compose deployment
- Web administration interface with multilingual support

## Quick Start

### Docker Compose

Start the complete service from the published ZZAPI image:

```bash
docker compose -f docker-compose.yml -f docker-compose.zzapi.yml up -d
```

If the repository is private, run `docker login` first.

Check service status:

```bash
docker compose -f docker-compose.yml -f docker-compose.zzapi.yml ps
```

Build and start the complete service from the current source checkout:

```bash
git clone https://github.com/staysurvive/zzapi.git
cd zzapi
docker compose -f docker-compose.yml -f docker-compose.current.yml up -d --build
```

Check service status:

```bash
docker compose -f docker-compose.yml -f docker-compose.current.yml ps
```

Open [http://localhost:3000](http://localhost:3000) after the service starts.

Stop the published-image service without removing persistent data:

```bash
docker compose -f docker-compose.yml -f docker-compose.zzapi.yml down
```

Stop the source-built service without removing persistent data:

```bash
docker compose -f docker-compose.yml -f docker-compose.current.yml down
```

### Deployment Notes

- Change the default PostgreSQL and Redis passwords before production use.
- Set a stable, randomly generated `SESSION_SECRET` in production.
- When serving through HTTPS and a reverse proxy, configure cookies and trusted origins correctly.
- Back up the database and test upgrades before publishing a release.

## Docker Verification

Backend, `relaykit`, and frontend checks run in Docker, so Go is not required on the host:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/verify-docker.ps1
```

Run one scope independently:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/verify-docker.ps1 -Scope backend
powershell -ExecutionPolicy Bypass -File scripts/verify-docker.ps1 -Scope frontend
```

GitHub Actions runs the same verification automatically for pushes to `main` and Pull Requests.

## Project Structure

```text
controller/  HTTP controllers
service/     Business services
model/       Data models and database access
relay/       AI provider adapters and request relay
relaykit/    Independent protocol conversion module
web/         React administration interface
scripts/     Docker verification scripts
```

## Lawful Use and Attribution

Use this project only with lawfully obtained API keys, accounts, and service permissions. Follow applicable laws and upstream terms of service. When providing generative AI services publicly, you are responsible for applicable registration, licensing, content safety, identity verification, logging, and authorization requirements.

This project continues development based on [new-api](https://github.com/QuantumNous/new-api). The original AGPL-3.0 license, copyright notices, third-party licenses, and upstream source record are preserved in [LICENSE](./LICENSE), [NOTICE](./NOTICE), [THIRD-PARTY-LICENSES.md](./THIRD-PARTY-LICENSES.md), and [UPSTREAM.md](./UPSTREAM.md).

## Feedback and Collaboration

- Issues: [GitHub Issues](https://github.com/staysurvive/zzapi/issues)
- Project website: [zzapi.cccd](https://zzapi.cccd)

ZZAPI is licensed under AGPL-3.0. See [LICENSE](./LICENSE).
