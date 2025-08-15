#!/usr/bin/env bash
set -euo pipefail
pnpm contract:lint || true
pnpm contract:sdk
echo "✅ SDK gerado em packages/api-client/"
