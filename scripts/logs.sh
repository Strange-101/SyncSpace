#!/bin/bash

if [ $# -eq 0 ]; then
    echo "Usage: ./logs.sh <service>"
    echo
    echo "Available services:"
    echo "  backend"
    echo "  frontend"
    echo "  postgres"
    exit 1
fi

docker compose logs -f "$1"
