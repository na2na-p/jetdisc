group "default" {
    targets = ["app"]
}

target "app" {
    dockerfile = "infra/docker/Dockerfile"
    platforms = ["linux/amd64", "linux/arm64"]
    cache-to = ["type=gha,dest=/tmp/.buildx-cache"]
    cache-from = ["type=gha,src=/tmp/.buildx-cache"]
}
