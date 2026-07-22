SHELL := /bin/bash

ENV ?= production
REGION ?= us-east-1

TF_DIR := ./terraform
K8S_DIR := ./k8s/overlays/$(ENV)

DEPLOYMENT := ultrafaang-ultragod-fullstack-core
NAMESPACE := production


.PHONY: help init validate plan apply render deploy security destroy


help:
	@echo ""
	@echo "Infrastructure Control Plane"
	@echo ""
	@echo "make init          Terraform initialization"
	@echo "make validate      Validate IaC manifests"
	@echo "make plan          Terraform execution plan"
	@echo "make apply         Provision infrastructure"
	@echo "make render        Render Kubernetes manifests"
	@echo "make deploy        Deploy to Kubernetes"
	@echo "make security      Run security validation"
	@echo "make destroy       Destroy infrastructure"
	@echo ""



init:
	@echo "Initializing Terraform backend..."
	cd $(TF_DIR) && terraform init -input=false



validate:
	@echo "Validating Terraform..."
	cd $(TF_DIR) && terraform validate

	@echo "Validating Kubernetes..."
	kubectl kustomize $(K8S_DIR) >/dev/null



plan:
	@echo "Generating Terraform plan..."
	cd $(TF_DIR) && \
	terraform plan \
		-out=tfplan.binary \
		-input=false



apply:
	@echo "Applying Terraform changes..."
	cd $(TF_DIR) && \
	terraform apply \
		-input=false \
		tfplan.binary

	rm -f $(TF_DIR)/tfplan.binary



render:
	@echo "Rendering Kubernetes manifests..."

	mkdir -p build

	kubectl kustomize $(K8S_DIR) \
		> build/$(ENV)-manifest.yaml



deploy: render

	@echo "Checking Kubernetes context..."

	kubectl config current-context


	@echo "Applying manifests..."

	kubectl apply \
		-f build/$(ENV)-manifest.yaml


	@echo "Waiting rollout..."

	kubectl rollout status \
		deployment/$(DEPLOYMENT) \
		-n $(NAMESPACE) \
		--timeout=180s



security:

	@echo "Running Terraform security scan..."

	@if command -v checkov >/dev/null; then \
		checkov \
		-d $(TF_DIR) \
		--framework terraform; \
	else \
		echo "Checkov unavailable"; \
	fi


	@echo "Running Kubernetes security scan..."

	@if command -v kubescape >/dev/null; then \
		kubescape scan $(K8S_DIR); \
	else \
		echo "Kubescape unavailable"; \
	fi



destroy:

	@echo "WARNING: Production destruction requested"

	@read -p "Type DESTROY to continue: " confirm && \
	if [ "$$confirm" = "DESTROY" ]; then \
		cd $(TF_DIR) && terraform destroy; \
	else \
		echo "Cancelled"; \
	fi
