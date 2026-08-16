<div align="center">

<img src="./web/public/logo.png" alt="ZZAPI" width="96" />

# ZZAPI

统一的 AI 模型网关与管理平台

<p>
  <a href="./README.en.md">English</a>
  ·
  <a href="https://zzapi.cccd">项目主页</a>
  ·
  <a href="https://github.com/staysurvive/zzapi/actions/workflows/docker-verify.yml">
    <img src="https://github.com/staysurvive/zzapi/actions/workflows/docker-verify.yml/badge.svg" alt="Docker Verification" />
  </a>
  <a href="./LICENSE">
    <img src="https://img.shields.io/badge/license-AGPL--3.0-brightgreen" alt="AGPL-3.0 License" />
  </a>
</p>

</div>

## 项目简介

ZZAPI 聚合多个 AI 服务商，通过统一 API 提供模型访问、渠道路由、权限管理、用量统计和成本核算能力，适合个人或组织在自有环境中部署。

## 核心能力

- 统一的 OpenAI 兼容 API，以及 Claude、Gemini 等常用格式转换
- 多渠道配置、模型映射、权重路由和失败重试
- 用户、令牌、分组和模型权限管理
- 用量统计、额度管理、计费和日志审计
- SQLite、MySQL、PostgreSQL 数据库支持
- Redis 缓存和 Docker Compose 部署
- Web 管理界面与多语言支持

## 快速开始

### 使用 Docker Compose

使用已发布的 ZZAPI 镜像启动完整服务：

```bash
docker compose -f docker-compose.yml -f docker-compose.zzapi.yml up -d
```

如果仓库是私有的，请先执行 `docker login`。

查看服务状态：

```bash
docker compose -f docker-compose.yml -f docker-compose.zzapi.yml ps
```

从当前源码构建并启动完整服务：

```bash
git clone https://github.com/staysurvive/zzapi.git
cd zzapi
docker compose -f docker-compose.yml -f docker-compose.current.yml up -d --build
```

查看服务状态：

```bash
docker compose -f docker-compose.yml -f docker-compose.current.yml ps
```

启动完成后访问 [http://localhost:3000](http://localhost:3000)。

停止已发布镜像服务但保留数据：

```bash
docker compose -f docker-compose.yml -f docker-compose.zzapi.yml down
```

停止源码构建服务但保留数据：

```bash
docker compose -f docker-compose.yml -f docker-compose.current.yml down
```

### 部署注意事项

- 生产环境必须修改 PostgreSQL、Redis 等默认密码。
- 生产环境应设置稳定且随机的 `SESSION_SECRET`。
- 通过 HTTPS 和反向代理对外提供服务时，正确配置 Cookie 和可信来源。
- 上线前请做好数据库备份、升级演练和日志保留策略。

## Docker 验证

本项目使用 Docker 执行后端、`relaykit` 和前端验证，不要求宿主机安装 Go：

```powershell
powershell -ExecutionPolicy Bypass -File scripts/verify-docker.ps1
```

单独验证某一部分：

```powershell
powershell -ExecutionPolicy Bypass -File scripts/verify-docker.ps1 -Scope backend
powershell -ExecutionPolicy Bypass -File scripts/verify-docker.ps1 -Scope frontend
```

每次推送到 `main` 或创建 Pull Request 时，GitHub Actions 也会自动执行验证。

## 项目结构

```text
controller/  请求控制器
service/     业务服务
model/       数据模型与数据库访问
relay/       AI 服务商适配与请求转发
relaykit/    独立的协议转换模块
web/         React 管理界面
scripts/     Docker 验证脚本
```

## 合法使用与来源说明

请仅在拥有合法 API 密钥、账户和服务权限的前提下使用本项目，并遵守所在地区法律法规及上游服务条款。对外提供生成式 AI 服务时，请自行完成适用的备案、许可、内容安全、实名和日志留存等义务。

本项目基于 [new-api](https://github.com/QuantumNous/new-api) 继续开发。项目保留原有 AGPL-3.0 许可证、版权声明、第三方许可和上游来源说明，详见 [LICENSE](./LICENSE)、[NOTICE](./NOTICE)、[THIRD-PARTY-LICENSES.md](./THIRD-PARTY-LICENSES.md) 和 [UPSTREAM.md](./UPSTREAM.md)。

## 反馈与协作

- 问题反馈：[GitHub Issues](https://github.com/staysurvive/zzapi/issues)
- 项目主页：[zzapi.cccd](https://zzapi.cccd)

ZZAPI 使用 AGPL-3.0 许可证，详见 [LICENSE](./LICENSE)。
