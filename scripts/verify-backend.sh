#!/bin/sh

set -eu

: "${TEST_TIMEOUT_SECONDS:=180}"
: "${BUILD_TIMEOUT_SECONDS:=180}"

web_dist_dir="web/dist"
web_dist_placeholder="$web_dist_dir/index.html"
created_web_dist_placeholder=0

if [ ! -f "$web_dist_placeholder" ]; then
  mkdir -p "$web_dist_dir"
  printf '%s\n' '<!doctype html><html><body>Docker backend verification</body></html>' > "$web_dist_placeholder"
  created_web_dist_placeholder=1
fi

cleanup_web_dist_placeholder() {
  if [ "$created_web_dist_placeholder" -eq 1 ]; then
    rm -f "$web_dist_placeholder"
    rmdir "$web_dist_dir" 2>/dev/null || true
  fi
}

trap cleanup_web_dist_placeholder EXIT INT TERM

run_timed() {
  duration="$1"
  shift
  timeout "$duration" "$@"
}

echo "==> Resolving root-module packages"
# Avoid go list ./... walking frontend node_modules; relaykit is verified separately.
packages="$(find . \
  \( -path './.git' -o -path './relaykit' -o -path './vendor' -o -path './web' \) -prune \
  -o -type f -name '*.go' -exec dirname {} \; \
  | sort -u)"

if [ -z "$packages" ]; then
  echo "No root-module packages were found" >&2
  exit 1
fi

for package_dir in $packages; do
  package="$package_dir"
  if [ "$package_dir" = "." ]; then
    package="."
  fi
  echo "==> go test $package"
  if run_timed "$TEST_TIMEOUT_SECONDS" go test "$package"; then
    continue
  else
    status=$?
    echo "go test failed or timed out for $package" >&2
    exit "$status"
  fi
done

echo "==> go build root-module packages"
for package_dir in $packages; do
  package="$package_dir"
  if [ "$package_dir" = "." ]; then
    package="."
  fi
  echo "==> go build $package"
  if run_timed "$BUILD_TIMEOUT_SECONDS" go build "$package"; then
    continue
  else
    status=$?
    echo "go build failed or timed out for $package" >&2
    exit "$status"
  fi
done

echo "==> relaykit: go test ./..."
(cd relaykit && run_timed "$TEST_TIMEOUT_SECONDS" go test ./...)

echo "==> relaykit: go build ./..."
(cd relaykit && run_timed "$BUILD_TIMEOUT_SECONDS" go build ./...)

echo "Backend Docker verification passed"
