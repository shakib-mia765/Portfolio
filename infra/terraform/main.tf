terraform {
  required_version = ">= 1.7.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.30"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.14"
    }
  }
}

provider "aws" {
  region = var.region

  default_tags {
    tags = {
      Environment = var.environment
      Project     = "ultrafaang-portfolio"
      ManagedBy   = "terraform"
    }
  }
}

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name = "${var.project}-vpc"
  cidr = var.vpc_cidr

  azs             = var.availability_zones
  private_subnets = var.private_subnets
  public_subnets  = var.public_subnets

  enable_nat_gateway   = true
  single_nat_gateway   = false
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Component = "network"
  }
}

module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.0"

  cluster_name    = "${var.project}-eks"
  cluster_version = var.kubernetes_version

  subnet_ids = module.vpc.private_subnets
  vpc_id     = module.vpc.vpc_id

  enable_irsa                    = true
  cluster_endpoint_public_access = false

  eks_managed_node_groups = {
    system = {
      desired_size = 3
      min_size     = 3
      max_size     = 10

      instance_types = ["t3.large"]

      labels = {
        role = "system"
      }
    }

    application = {
      desired_size = 5
      min_size     = 5
      max_size     = 20

      instance_types = ["m7i.large"]

      labels = {
        role = "application"
      }
    }
  }

  tags = {
    Component = "compute"
  }
}

resource "aws_ecr_repository" "app" {
  name = "${var.project}/application"

  image_scanning_configuration {
    scan_on_push = true
  }

  encryption_configuration {
    encryption_type = "AES256"
  }
}

resource "aws_db_subnet_group" "main" {
  name       = "${var.project}-db-subnet"
  subnet_ids = module.vpc.private_subnets
}

resource "aws_cloudwatch_log_group" "eks" {
  name              = "/aws/eks/${var.project}"
  retention_in_days = 30
}


