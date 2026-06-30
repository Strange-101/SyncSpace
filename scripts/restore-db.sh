#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

if [ $# -ne 1 ]; then
    echo "Usage: ./restore-db.sh <backup-file>"
    exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "$BACKUP_FILE" ]; then
    echo "Error: Backup file does not exist."
    exit 1
fi

echo "WARNING!"
echo "This will overwrite the current database."
echo

read -p "Continue? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "Restore cancelled."
    exit 0
fi

echo
echo "Restoring database..."

docker compose exec -T postgres \
    psql -U syncspace syncspace < "$BACKUP_FILE"

echo
echo "Database restored successfully!"
