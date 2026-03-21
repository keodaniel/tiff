#!/bin/bash

# keo_eatz — Claude Code sandbox launcher
# Usage: ./run-claude.sh

PROJECT_DIR="/mnt/c/WSD/Projects/Unorganized/tiff"
IMAGE_NAME="tiff-sandbox"

# Build image if it doesn't exist
if ! docker image inspect "$IMAGE_NAME" &>/dev/null; then
  echo "Building image..."
  docker build -t "$IMAGE_NAME" "$PROJECT_DIR"
fi

echo "Starting Claude Code in sandbox..."
docker run -it --rm \
  -v "$PROJECT_DIR":/mnt/c/WSD/Projects/Unorganized/tiff \
  -v ~/.claude:/home/keo_claude/.claude \
  -v ~/.claude.json:/home/keo_claude/.claude.json \
  "$IMAGE_NAME"
