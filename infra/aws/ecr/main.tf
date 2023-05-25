terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region = "ap-northeast-1"
}

locals {
  ecr-lifecycle-policy = {
    rules = [
      {
        action = {
          type = "expire"
        }
        description  = "最新のイメージのみを残す"
        rulePriority = 1
        selection = {
          countNumber = 1
          countType   = "imageCountMoreThan"
          tagStatus   = "any"
        },
        action = {
          type = "expire"
        }
      },
    ]
  }
}

resource "aws_ecr_repository" "na2na-discord-bot" {
  encryption_configuration {
    encryption_type = "AES256"
  }

  image_scanning_configuration {
    scan_on_push = "true"
  }

  image_tag_mutability = "MUTABLE"
  name                 = "na2na-discord-bot"
}

resource "aws_ecr_lifecycle_policy" "na2na-discord-bot" {
  repository = aws_ecr_repository.na2na-discord-bot.name
  policy     = jsonencode(local.ecr-lifecycle-policy)
}
