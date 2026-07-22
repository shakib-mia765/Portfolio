terraform {
  backend "s3" {
    bucket = "ultrafaang-terraform-state"

    key = "envs/production/terraform.tfstate"

    region = "us-east-1"

    encrypt = true

    dynamodb_table = "ultrafaang-terraform-locks"

    kms_key_id = "alias/terraform-state-kms"
  }
}
