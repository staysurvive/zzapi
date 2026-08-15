[CmdletBinding()]
param(
  [ValidateSet('all', 'backend', 'frontend')]
  [string]$Scope = 'all',
  [int]$PackageTimeoutSeconds = 180,
  [int]$BuildTimeoutSeconds = 180
)

$ErrorActionPreference = 'Stop'

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
  throw 'Docker CLI was not found. Install Docker Desktop and try again.'
}

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$goImage = 'golang:1.26.1-alpine@sha256:2389ebfa5b7f43eeafbd6be0c3700cc46690ef842ad962f6c5bd6be49ed82039'
$bunImage = 'oven/bun:1@sha256:0733e50325078969732ebe3b15ce4c4be5082f18c4ac1a0f0ca4839c2e4e42a7'
$goModuleCache = 'new-api-go-mod'
$goBuildCache = 'new-api-go-build'
$bunInstallCache = 'new-api-bun-install-cache'
$bunNodeModules = 'new-api-bun-node-modules'

function Ensure-DockerVolume([string]$Name) {
  $previousErrorActionPreference = $ErrorActionPreference
  $ErrorActionPreference = 'Continue'
  & docker volume inspect $Name *> $null
  $inspectStatus = $LASTEXITCODE
  $ErrorActionPreference = $previousErrorActionPreference

  if ($inspectStatus -ne 0) {
    & docker volume create $Name *> $null
    if ($LASTEXITCODE -ne 0) {
      throw "Failed to create Docker volume: $Name"
    }
  }
}

function Invoke-Docker([string[]]$Arguments) {
  & docker @Arguments
  if ($LASTEXITCODE -ne 0) {
    throw "Docker verification command failed with exit code $LASTEXITCODE"
  }
}

$repoMount = '{0}:/workspace' -f $repoRoot
$goModuleMount = '{0}:/go/pkg/mod' -f $goModuleCache
$goBuildMount = '{0}:/root/.cache/go-build' -f $goBuildCache
$bunInstallMount = '{0}:/root/.bun/install/cache' -f $bunInstallCache
$bunNodeModulesMount = '{0}:/workspace/node_modules' -f $bunNodeModules

if ($Scope -in @('all', 'frontend')) {
  Ensure-DockerVolume $bunInstallCache
  Ensure-DockerVolume $bunNodeModules

  $frontendMount = '{0}:/workspace' -f (Join-Path $repoRoot 'web')
  $frontendArguments = @(
    'run', '--rm',
    '-v', $frontendMount,
    '-v', $bunInstallMount,
    '-v', $bunNodeModulesMount,
    '-w', '/workspace',
    $bunImage,
    'sh', '-lc', 'bun install --frozen-lockfile && bun run build:check'
  )

  Write-Host 'Running frontend verification in Docker...'
  Invoke-Docker $frontendArguments
}

if ($Scope -in @('all', 'backend')) {
  Ensure-DockerVolume $goModuleCache
  Ensure-DockerVolume $goBuildCache

  $backendArguments = @(
    'run', '--rm',
    '-e', 'GOWORK=off',
    '-e', 'CGO_ENABLED=0',
    '-e', 'GOEXPERIMENT=greenteagc',
    '-e', "TEST_TIMEOUT_SECONDS=$PackageTimeoutSeconds",
    '-e', "BUILD_TIMEOUT_SECONDS=$BuildTimeoutSeconds",
    '-v', $repoMount,
    '-v', $goModuleMount,
    '-v', $goBuildMount,
    '-w', '/workspace',
    $goImage,
    'sh', '/workspace/scripts/verify-backend.sh'
  )

  Write-Host 'Running backend verification in Docker...'
  Invoke-Docker $backendArguments
}

Write-Host "Docker verification passed for scope: $Scope"
