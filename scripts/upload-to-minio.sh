#!/bin/bash
# upload-to-minio.sh
# Upload optimized frame assets to MinIO object storage
# Session: phase00-session03-asset-deployment

set -e

# Configuration
MINIO_ALIAS="local"
MINIO_ENDPOINT="http://localhost:9000"
MINIO_USER="minioadmin"
MINIO_PASS="minioadmin123"

ASSETS_DIR="docs/media-assets-optimized"
DESKTOP_BUCKET="frames-desktop"
MOBILE_BUCKET="frames-mobile"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Ensure mc is in PATH
export PATH="$HOME/.local/bin:$PATH"

echo "========================================"
echo " MinIO Frame Asset Upload Script"
echo "========================================"
echo ""

# Check if mc is available
if ! command -v mc &> /dev/null; then
    echo -e "${RED}Error: MinIO CLI (mc) not found in PATH${NC}"
    echo "Install: https://min.io/docs/minio/linux/reference/minio-mc.html"
    exit 1
fi

# Check if assets directory exists
if [ ! -d "$ASSETS_DIR" ]; then
    echo -e "${RED}Error: Assets directory not found: $ASSETS_DIR${NC}"
    exit 1
fi

# Configure mc alias if not already set
echo "Configuring MinIO alias..."
mc alias set $MINIO_ALIAS $MINIO_ENDPOINT $MINIO_USER $MINIO_PASS --quiet

# Verify connection
if ! mc ls $MINIO_ALIAS &> /dev/null; then
    echo -e "${RED}Error: Cannot connect to MinIO at $MINIO_ENDPOINT${NC}"
    echo "Ensure Docker stack is running: docker compose up -d"
    exit 1
fi

echo -e "${GREEN}Connected to MinIO successfully${NC}"
echo ""

# Function to upload frames with progress
upload_frames() {
    local src_dir=$1
    local bucket=$2
    local prefix=$3
    local description=$4

    if [ ! -d "$src_dir" ]; then
        echo -e "${RED}Error: Source directory not found: $src_dir${NC}"
        return 1
    fi

    local file_count=$(find "$src_dir" -name "*.webp" | wc -l)
    echo -e "${YELLOW}Uploading $description ($file_count files)...${NC}"
    echo "  Source: $src_dir"
    echo "  Target: $MINIO_ALIAS/$bucket/$prefix/"

    # Upload using mc cp with recursive flag
    mc cp --recursive "$src_dir/" "$MINIO_ALIAS/$bucket/$prefix/" --quiet

    echo -e "${GREEN}Completed: $description${NC}"
    echo ""
}

# Create buckets if they don't exist
echo "Ensuring buckets exist..."
mc mb $MINIO_ALIAS/$DESKTOP_BUCKET --ignore-existing --quiet
mc mb $MINIO_ALIAS/$MOBILE_BUCKET --ignore-existing --quiet

# Set anonymous read policy
echo "Setting anonymous download policy..."
mc anonymous set download $MINIO_ALIAS/$DESKTOP_BUCKET --quiet
mc anonymous set download $MINIO_ALIAS/$MOBILE_BUCKET --quiet
echo ""

# Upload hero frames - desktop (192 files)
upload_frames \
    "$ASSETS_DIR/hero-frames" \
    "$DESKTOP_BUCKET" \
    "hero" \
    "Hero Desktop Frames"

# Upload hero frames - mobile (192 files)
upload_frames \
    "$ASSETS_DIR/hero-frames-mobile" \
    "$MOBILE_BUCKET" \
    "hero" \
    "Hero Mobile Frames"

# Upload product frames - desktop (144 files)
upload_frames \
    "$ASSETS_DIR/product-frames" \
    "$DESKTOP_BUCKET" \
    "product" \
    "Product Desktop Frames"

# Upload product frames - mobile (144 files)
upload_frames \
    "$ASSETS_DIR/product-frames-mobile" \
    "$MOBILE_BUCKET" \
    "product" \
    "Product Mobile Frames"

# Verify upload counts
echo "========================================"
echo " Upload Summary"
echo "========================================"

desktop_hero=$(mc ls $MINIO_ALIAS/$DESKTOP_BUCKET/hero/ 2>/dev/null | wc -l)
desktop_product=$(mc ls $MINIO_ALIAS/$DESKTOP_BUCKET/product/ 2>/dev/null | wc -l)
mobile_hero=$(mc ls $MINIO_ALIAS/$MOBILE_BUCKET/hero/ 2>/dev/null | wc -l)
mobile_product=$(mc ls $MINIO_ALIAS/$MOBILE_BUCKET/product/ 2>/dev/null | wc -l)
total=$((desktop_hero + desktop_product + mobile_hero + mobile_product))

echo "  Desktop Hero:    $desktop_hero files (expected: 192)"
echo "  Desktop Product: $desktop_product files (expected: 144)"
echo "  Mobile Hero:     $mobile_hero files (expected: 192)"
echo "  Mobile Product:  $mobile_product files (expected: 144)"
echo "  --------------------------------"
echo "  Total:           $total files (expected: 672)"
echo ""

if [ "$total" -eq 672 ]; then
    echo -e "${GREEN}SUCCESS: All 672 frames uploaded!${NC}"
    echo ""
    echo "Asset URLs:"
    echo "  http://localhost:8089/assets/frames-desktop/hero/frame_0001.webp"
    echo "  http://localhost:8089/assets/frames-mobile/hero/frame_0001.webp"
    echo "  http://localhost:8089/assets/frames-desktop/product/frame_0001.webp"
    echo "  http://localhost:8089/assets/frames-mobile/product/frame_0001.webp"
    exit 0
else
    echo -e "${RED}WARNING: Expected 672 files, found $total${NC}"
    exit 1
fi
