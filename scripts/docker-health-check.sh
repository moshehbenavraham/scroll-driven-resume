#!/bin/bash
# Docker Health Check Script for Modern Resume Site
# Validates all services are running and responding correctly

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Load environment variables
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

# Default ports
MINIO_API_PORT=${MINIO_API_PORT:-9000}
MINIO_CONSOLE_PORT=${MINIO_CONSOLE_PORT:-9001}
POSTGRES_PORT=${POSTGRES_PORT:-5442}
NGINX_PORT=${NGINX_PORT:-8089}

# Counters
PASSED=0
FAILED=0

echo "========================================"
echo "Docker Infrastructure Health Check"
echo "========================================"
echo ""

# Function to check service
check_service() {
    local name=$1
    local url=$2
    local expected=$3

    printf "Checking %-20s ... " "$name"

    response=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "$url" 2>/dev/null || echo "000")

    if [ "$response" = "$expected" ]; then
        echo -e "${GREEN}PASS${NC} (HTTP $response)"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}FAIL${NC} (HTTP $response, expected $expected)"
        ((FAILED++))
        return 1
    fi
}

# Function to check PostgreSQL
check_postgres() {
    printf "Checking %-20s ... " "PostgreSQL"

    if docker exec resume-postgres pg_isready -U "${POSTGRES_USER:-resume_admin}" -d "${POSTGRES_DB:-resume_metadata}" >/dev/null 2>&1; then
        echo -e "${GREEN}PASS${NC}"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}FAIL${NC}"
        ((FAILED++))
        return 1
    fi
}

# Function to check CORS headers
check_cors() {
    printf "Checking %-20s ... " "CORS Headers"

    cors_header=$(curl -s -I -H "Origin: http://localhost:3017" "http://localhost:${NGINX_PORT}/health" 2>/dev/null | grep -i "access-control-allow-origin" || true)

    if [ -n "$cors_header" ]; then
        echo -e "${GREEN}PASS${NC}"
        ((PASSED++))
        return 0
    else
        echo -e "${YELLOW}WARN${NC} (CORS not on health endpoint, check /assets/)"
        return 0
    fi
}

# Function to check cache headers
check_cache() {
    printf "Checking %-20s ... " "Cache Headers"

    # Note: This will only work after assets are uploaded
    cache_header=$(curl -s -I "http://localhost:${NGINX_PORT}/health" 2>/dev/null | grep -i "cache-control" || true)

    if [ -n "$cache_header" ]; then
        echo -e "${GREEN}PASS${NC}"
        ((PASSED++))
        return 0
    else
        echo -e "${YELLOW}INFO${NC} (Cache headers on asset paths only)"
        return 0
    fi
}

# Run checks
echo "Service Connectivity"
echo "----------------------------------------"

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo -e "${RED}ERROR: Docker is not running${NC}"
    exit 1
fi

# Check container status
echo ""
echo "Container Status:"
docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || docker-compose ps 2>/dev/null || echo "Could not get container status"
echo ""

# MinIO checks
check_service "MinIO API" "http://localhost:${MINIO_API_PORT}/minio/health/live" "200"
check_service "MinIO Console" "http://localhost:${MINIO_CONSOLE_PORT}/" "200"

# PostgreSQL check
check_postgres

# Nginx checks
check_service "Nginx Health" "http://localhost:${NGINX_PORT}/health" "200"
check_service "Nginx->MinIO Proxy" "http://localhost:${NGINX_PORT}/minio/health/live" "200"

echo ""
echo "Header Validation"
echo "----------------------------------------"
check_cors
check_cache

# Summary
echo ""
echo "========================================"
echo "Summary"
echo "========================================"
echo -e "Passed: ${GREEN}${PASSED}${NC}"
echo -e "Failed: ${RED}${FAILED}${NC}"
echo ""

if [ $FAILED -gt 0 ]; then
    echo -e "${RED}Some checks failed. Please review the output above.${NC}"
    exit 1
else
    echo -e "${GREEN}All health checks passed!${NC}"
    exit 0
fi
