#!/usr/bin/env bash

set -Eeuo pipefail


# ============================================================
# Production Deployment Controller
#
# Responsibilities:
# - Kubernetes deployment orchestration
# - Immutable manifest delivery
# - Zero downtime rollout
# - Automatic rollback protection
# - Production safety validation
#
# Architecture:
# - GitOps Compatible
# - Kubernetes Native
# - Enterprise Operations Ready
# ============================================================


ENVIRONMENT="${ENVIRONMENT:-production}"
NAMESPACE="${NAMESPACE:-production}"

APP_NAME="${APP_NAME:-ultrafaang-portfolio}"

K8S_DIR="./infra/k8s/overlays/${ENVIRONMENT}"

BUILD_DIR="./build"

TIMEOUT="${DEPLOY_TIMEOUT:-300s}"

RELEASE_ID="${GITHUB_SHA:-local}"

MANIFEST_FILE="${BUILD_DIR}/${ENVIRONMENT}-${RELEASE_ID}.yaml"



timestamp() {
  date +"%Y-%m-%d %H:%M:%S"
}



log() {
  echo "$(timestamp) [INFO] $1"
}



warn() {
  echo "$(timestamp) [WARN] $1"
}



fail() {
  echo "$(timestamp) [ERROR] $1"
  exit 1
}



rollback() {

  warn "Deployment failed. Executing rollback"


  kubectl rollout undo \
    deployment/"$APP_NAME" \
    -n "$NAMESPACE" \
    || warn "Rollback failed"



}


trap rollback ERR



require_command() {

  command -v "$1" >/dev/null 2>&1 \
    || fail "Missing dependency: $1"

}



check_dependencies() {

  log "Checking required tools"


  require_command kubectl

}



check_context() {

  log "Validating cluster context"


  CONTEXT=$(kubectl config current-context)


  log "Cluster: $CONTEXT"



  if [[ "$ENVIRONMENT" == "production" ]] &&
     [[ "$CONTEXT" != *"prod"* ]]; then

    fail "Production deployment blocked: invalid cluster"

  fi


}



validate_namespace() {

  log "Checking namespace"


  kubectl get namespace "$NAMESPACE" \
    >/dev/null \
    || fail "Namespace does not exist: $NAMESPACE"


}



validate_overlay() {

  log "Validating Kustomize overlay"


  [[ -d "$K8S_DIR" ]] \
    || fail "Missing overlay: $K8S_DIR"



  kubectl kustomize "$K8S_DIR" \
    >/dev/null


}



render_manifest() {

  log "Generating immutable manifest"


  mkdir -p "$BUILD_DIR"



  kubectl kustomize "$K8S_DIR" \
    > "$MANIFEST_FILE"



  log "Manifest created: $MANIFEST_FILE"

}



validate_manifest() {

  log "Running Kubernetes validation"


  kubectl apply \
    --dry-run=server \
    -f "$MANIFEST_FILE"



}



deploy_application() {

  log "Deploying release: $RELEASE_ID"



  kubectl apply \
    -f "$MANIFEST_FILE" \
    -n "$NAMESPACE"



}



verify_rollout() {

  log "Waiting for rollout"



  kubectl rollout status \
    deployment/"$APP_NAME" \
    -n "$NAMESPACE" \
    --timeout="$TIMEOUT"



}



health_check() {

  log "Running health verification"


  kubectl get pods \
    -n "$NAMESPACE" \
    -l app.kubernetes.io/name="$APP_NAME"



  kubectl rollout history \
    deployment/"$APP_NAME" \
    -n "$NAMESPACE"



}



summary() {

  echo ""
  echo "=============================="
  echo " Deployment Summary"
  echo "=============================="
  echo "Environment : $ENVIRONMENT"
  echo "Namespace   : $NAMESPACE"
  echo "Application : $APP_NAME"
  echo "Release     : $RELEASE_ID"
  echo "=============================="
  echo ""

}



main() {

  log "Starting production deployment"


  check_dependencies

  check_context

  validate_namespace

  validate_overlay

  render_manifest

  validate_manifest

  deploy_application

  verify_rollout

  health_check

  summary


  log "Deployment completed successfully 🚀"

}



main "$@"
