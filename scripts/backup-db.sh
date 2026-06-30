#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

BACKUP_DIR="$PROJECT_ROOT/backups"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")

mkdir -p "$BACKUP_DIR"

BACKUP_FILE="$BACKUP_DIR/syncspace_$TIMESTAMP.sql"

echo "Creating PostgreSQL backup..."
echo

docker compose exec -T postgres \
    pg_dump -U syncspace syncspace > "$BACKUP_FILE"

echo "Backup completed successfully!"
echo "Location: $BACKUP_FILE"
