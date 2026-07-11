#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$ROOT_DIR/.env.resend-mcp"
MCP_ENTRY="$ROOT_DIR/node_modules/resend-mcp/dist/index.js"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing $ENV_FILE — add RESEND_API_KEY for MCP." >&2
  exit 1
fi

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

if [[ -z "${RESEND_API_KEY:-}" ]]; then
  echo "RESEND_API_KEY is empty in $ENV_FILE." >&2
  exit 1
fi

resolve_node() {
  export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
  if [[ -s "$NVM_DIR/nvm.sh" ]]; then
    # shellcheck disable=SC1091
    source "$NVM_DIR/nvm.sh"
    command -v node 2>/dev/null && return 0
  fi

  for candidate in \
    "/opt/homebrew/bin/node" \
    "/usr/local/bin/node" \
    "/usr/bin/node"; do
    if [[ -x "$candidate" ]]; then
      echo "$candidate"
      return 0
    fi
  done

  return 1
}

NODE_BIN="$(resolve_node || true)"
if [[ -z "$NODE_BIN" ]]; then
  echo "Could not find Node.js. Install Node 20+ or run: npm install" >&2
  exit 1
fi

if [[ ! -f "$MCP_ENTRY" ]]; then
  echo "Missing $MCP_ENTRY — run: npm install" >&2
  exit 1
fi

exec "$NODE_BIN" "$MCP_ENTRY" "$@"
