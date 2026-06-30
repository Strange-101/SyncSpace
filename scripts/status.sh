#!/bin/bash

echo "======================================"
echo "      SyncSpace Service Status"
echo "======================================"

docker compose ps

echo
echo "Health Endpoint"

curl -s http://localhost:5001/health | jq . || echo "Backend is not responding"
