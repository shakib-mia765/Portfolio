#!/usr/bin/env bash

set -Eeuo pipefail
APP_NAME="ultrafaang-portfolio"
NODE_VERSION_REQUIRED="20"
PNPM_VERSION_REQUIRED="9"
log() {
  echo ""
  echo "[SETUP] $1"
}
warn() {
  echo ""
  echo "[WARN] $1"
}
fail() {
  echo ""
  echo "[ERROR] $1"
  exit 1
}
require_command() {
  command -v "$1" >/dev/null 2>&1 ||
    fail "$1 is required"
}
check_node() {
  log "Checking Node.js version"
  require_command node
  local current_node
  current_node=$(node -v | cut -d "." -f1 | tr -d "v")

  if [[ "$current_node" != "$NODE_VERSION_REQUIRED" ]]; then
    fail "Node.js ${NODE_VERSION_REQUIRED} required. Found ${current_node}"
  fi
}
setup_pnpm() {
  log "Configuring pnpm"

  corepack enable

  corepack prepare \
    pnpm@"${PNPM_VERSION_REQUIRED}" \
    --activate
}
install_dependencies() {
  log "Installing dependencies"

  pnpm install --frozen-lockfile
}
setup_environment() {
  log "Checking environment configuration"

  if [[ ! -f ".env" ]]; then

    if [[ -f ".env.example" ]]; then
      cp .env.example .env
      log ".env created from .env.example"
    else
      warn "No environment template found"
    fi
  fi
}
validate_project() {
  log "Validating project structure"

  [[ -f "package.json" ]] ||
    fail "package.json missing"

  [[ -f "pnpm-lock.yaml" ]] ||
    fail "pnpm-lock.yaml missing"
}
prepare_database() {
  log "Preparing Prisma environment"

  if [[ -d "prisma" ]]; then
    pnpm prisma generate
  else
    log "Prisma directory not found, skipping"
  fi
}
summary() {
  echo ""
  echo "=============================="
  echo " Setup Completed"
  echo "=============================="
  echo "Application : $APP_NAME"
  echo "Node        : $(node -v)"
  echo "pnpm        : $(pnpm -v)"
  echo "=============================="
  echo ""
}
main() {
  log "Starting project bootstrap"
  validate_project
  check_node
  setup_pnpm
  setup_environment
  install_dependencies
  prepare_database
  summary
  log "Environment ready 🚀"
}
main "$@"
