#!/bin/bash
# verify-assets.sh
# Verify frame asset deployment through Nginx proxy
# Session: phase00-session03-asset-deployment

set -e

# Configuration
NGINX_BASE="http://localhost:8089"
ASSETS_PATH="/assets"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counters
TESTS_PASSED=0
TESTS_FAILED=0

echo "========================================"
echo " Asset Verification Script"
echo "========================================"
echo ""
echo "Base URL: $NGINX_BASE$ASSETS_PATH"
echo ""

# Function to check a single URL and its headers
check_asset() {
    local url=$1
    local description=$2

    echo -e "${BLUE}Testing: $description${NC}"
    echo "  URL: $url"

    # Get headers with curl
    local response=$(curl -sI "$url" 2>/dev/null)
    local http_code=$(echo "$response" | head -n1 | awk '{print $2}')

    if [ "$http_code" != "200" ]; then
        echo -e "  ${RED}FAIL: HTTP $http_code (expected 200)${NC}"
        ((TESTS_FAILED++))
        return 1
    fi

    echo -e "  ${GREEN}HTTP 200 OK${NC}"
    ((TESTS_PASSED++))

    return 0
}

# Function to verify HTTP headers
verify_headers() {
    local url=$1
    local description=$2

    echo -e "${BLUE}Verifying headers: $description${NC}"
    echo "  URL: $url"

    local response=$(curl -sI "$url" 2>/dev/null)

    # Check Content-Type
    local content_type=$(echo "$response" | grep -i "^Content-Type:" | tr -d '\r')
    if echo "$content_type" | grep -qi "image/webp"; then
        echo -e "  ${GREEN}Content-Type: image/webp${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "  ${RED}FAIL: Content-Type not image/webp${NC}"
        echo "  Got: $content_type"
        ((TESTS_FAILED++))
    fi

    # Check Cache-Control
    local cache_control=$(echo "$response" | grep -i "^Cache-Control:" | tr -d '\r')
    if echo "$cache_control" | grep -qi "public"; then
        echo -e "  ${GREEN}Cache-Control: public present${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "  ${YELLOW}WARN: Cache-Control public not found${NC}"
        echo "  Got: $cache_control"
    fi

    # Check X-Cache-Status (Nginx cache)
    local cache_status=$(echo "$response" | grep -i "^X-Cache-Status:" | tr -d '\r')
    if [ -n "$cache_status" ]; then
        echo -e "  ${GREEN}X-Cache-Status: present${NC}"
        echo "  $cache_status"
        ((TESTS_PASSED++))
    else
        echo -e "  ${YELLOW}WARN: X-Cache-Status header not found${NC}"
    fi

    # Check CORS headers
    local cors_origin=$(curl -sI -H "Origin: http://localhost:3017" "$url" 2>/dev/null | grep -i "^Access-Control-Allow-Origin:" | tr -d '\r')
    if [ -n "$cors_origin" ]; then
        echo -e "  ${GREEN}CORS: Access-Control-Allow-Origin present${NC}"
        echo "  $cors_origin"
        ((TESTS_PASSED++))
    else
        echo -e "  ${YELLOW}WARN: CORS header not found${NC}"
    fi

    echo ""
}

# Function to test cache behavior
test_cache_behavior() {
    local url=$1
    local description=$2

    echo -e "${BLUE}Testing cache behavior: $description${NC}"
    echo "  URL: $url"

    # First request (should be MISS or HIT depending on prior testing)
    local first_status=$(curl -sI "$url" 2>/dev/null | grep -i "^X-Cache-Status:" | awk '{print $2}' | tr -d '\r')
    echo "  First request: X-Cache-Status=$first_status"

    # Second request (should be HIT)
    sleep 0.1
    local second_status=$(curl -sI "$url" 2>/dev/null | grep -i "^X-Cache-Status:" | awk '{print $2}' | tr -d '\r')
    echo "  Second request: X-Cache-Status=$second_status"

    if [ "$second_status" = "HIT" ]; then
        echo -e "  ${GREEN}Cache working: HIT on second request${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "  ${YELLOW}Cache status: $second_status${NC}"
    fi

    echo ""
}

echo "----------------------------------------"
echo " 1. Sample Frame Accessibility"
echo "----------------------------------------"
echo ""

# Test sample frames from each category
check_asset "$NGINX_BASE$ASSETS_PATH/frames-desktop/hero/frame_0001.webp" "Desktop Hero First Frame"
check_asset "$NGINX_BASE$ASSETS_PATH/frames-desktop/hero/frame_0192.webp" "Desktop Hero Last Frame"
check_asset "$NGINX_BASE$ASSETS_PATH/frames-desktop/product/frame_0001.webp" "Desktop Product First Frame"
check_asset "$NGINX_BASE$ASSETS_PATH/frames-desktop/product/frame_0144.webp" "Desktop Product Last Frame"
check_asset "$NGINX_BASE$ASSETS_PATH/frames-mobile/hero/frame_0001.webp" "Mobile Hero First Frame"
check_asset "$NGINX_BASE$ASSETS_PATH/frames-mobile/hero/frame_0192.webp" "Mobile Hero Last Frame"
check_asset "$NGINX_BASE$ASSETS_PATH/frames-mobile/product/frame_0001.webp" "Mobile Product First Frame"
check_asset "$NGINX_BASE$ASSETS_PATH/frames-mobile/product/frame_0144.webp" "Mobile Product Last Frame"

echo ""
echo "----------------------------------------"
echo " 2. Header Verification"
echo "----------------------------------------"
echo ""

verify_headers "$NGINX_BASE$ASSETS_PATH/frames-desktop/hero/frame_0001.webp" "Desktop Hero Frame Headers"
verify_headers "$NGINX_BASE$ASSETS_PATH/frames-mobile/product/frame_0072.webp" "Mobile Product Frame Headers"

echo "----------------------------------------"
echo " 3. Cache Behavior"
echo "----------------------------------------"
echo ""

test_cache_behavior "$NGINX_BASE$ASSETS_PATH/frames-desktop/product/frame_0050.webp" "Cache Test"

echo "----------------------------------------"
echo " 4. Full Sequence Accessibility"
echo "----------------------------------------"
echo ""

# Test all hero desktop frames (quick count check)
echo -e "${BLUE}Checking all 192 hero desktop frames...${NC}"
hero_errors=0
for i in $(seq -f "%04g" 1 192); do
    http_code=$(curl -sI "$NGINX_BASE$ASSETS_PATH/frames-desktop/hero/frame_$i.webp" 2>/dev/null | head -n1 | awk '{print $2}')
    if [ "$http_code" != "200" ]; then
        echo -e "${RED}  frame_$i.webp: HTTP $http_code${NC}"
        ((hero_errors++))
    fi
done

if [ $hero_errors -eq 0 ]; then
    echo -e "${GREEN}  All 192 hero desktop frames accessible${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}  $hero_errors frames failed${NC}"
    ((TESTS_FAILED++))
fi

# Test all product desktop frames
echo -e "${BLUE}Checking all 144 product desktop frames...${NC}"
product_errors=0
for i in $(seq -f "%04g" 1 144); do
    http_code=$(curl -sI "$NGINX_BASE$ASSETS_PATH/frames-desktop/product/frame_$i.webp" 2>/dev/null | head -n1 | awk '{print $2}')
    if [ "$http_code" != "200" ]; then
        echo -e "${RED}  frame_$i.webp: HTTP $http_code${NC}"
        ((product_errors++))
    fi
done

if [ $product_errors -eq 0 ]; then
    echo -e "${GREEN}  All 144 product desktop frames accessible${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}  $product_errors frames failed${NC}"
    ((TESTS_FAILED++))
fi

echo ""
echo "========================================"
echo " Verification Summary"
echo "========================================"
echo ""
echo "  Tests Passed: $TESTS_PASSED"
echo "  Tests Failed: $TESTS_FAILED"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}SUCCESS: All verification checks passed!${NC}"
    echo ""
    echo "Asset URLs are ready for frontend consumption:"
    echo "  Desktop Hero:    $NGINX_BASE$ASSETS_PATH/frames-desktop/hero/frame_NNNN.webp"
    echo "  Desktop Product: $NGINX_BASE$ASSETS_PATH/frames-desktop/product/frame_NNNN.webp"
    echo "  Mobile Hero:     $NGINX_BASE$ASSETS_PATH/frames-mobile/hero/frame_NNNN.webp"
    echo "  Mobile Product:  $NGINX_BASE$ASSETS_PATH/frames-mobile/product/frame_NNNN.webp"
    exit 0
else
    echo -e "${RED}FAILED: $TESTS_FAILED checks failed${NC}"
    exit 1
fi
