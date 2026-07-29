set -Eeuo pipefail

readonly SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
readonly ROOT_DIR="$(cd -- "${SCRIPT_DIR}/.." && pwd)"
readonly ENV_FILE="${ROOT_DIR}/.env.local"
readonly REQUIRED_DIRS=("src/components" "src/hooks" "src/services")
log() {
  printf '[workspace] %s\n' "$1"
}
fail() {
  printf '[workspace:error] %s\n' "$1" >&2
  exit 1
}
require_command() {
  command -v "$1" >/dev/null 2>&1 || fail "Missing required command: $1"
}
create_workspace() {
  local directory
  for directory in "${REQUIRED_DIRS[@]}"; do
    mkdir -p "${ROOT_DIR}/${directory}"
  done
}
inject_environment() {
  [[ -f "${ENV_FILE}" ]] || touch "${ENV_FILE}"
  grep -q '^NEXT_PUBLIC_APP_NAME=' "${ENV_FILE}" ||
    printf 'NEXT_PUBLIC_APP_NAME=Shakib Mia Portfolio\n' >>"${ENV_FILE}"
  grep -q '^NEXT_TELEMETRY_DISABLED=' "${ENV_FILE}" ||
    printf 'NEXT_TELEMETRY_DISABLED=1\n' >>"${ENV_FILE}"
}
main() {
  require_command node
  require_command npm
  create_workspace
  inject_environment
  log "Workspace core injection completed successfully."
}

main "$@"
