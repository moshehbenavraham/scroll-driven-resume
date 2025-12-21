#!/bin/bash
# Frame Optimization Script for Modern Resume Site
# Optimizes hero and product frame sequences for web delivery

set -e

# Configuration
# Quality settings determined through testing to meet size targets
HERO_DESKTOP_QUALITY=32
HERO_MOBILE_QUALITY=32
PRODUCT_DESKTOP_QUALITY=32
PRODUCT_MOBILE_QUALITY=22

HERO_MOBILE_WIDTH=1280
HERO_MOBILE_HEIGHT=725
PRODUCT_MOBILE_WIDTH=1280
PRODUCT_MOBILE_HEIGHT=720

# Directories
SOURCE_DIR="docs/media-assets"
OUTPUT_DIR="docs/media-assets-optimized"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Progress function
show_progress() {
    local current=$1
    local total=$2
    local desc=$3
    local percent=$((current * 100 / total))
    printf "\r[%3d%%] %s: %d/%d" "$percent" "$desc" "$current" "$total"
}

# Encode desktop frames (re-encode at specified quality)
encode_desktop() {
    local src_dir=$1
    local out_dir=$2
    local quality=$3
    local desc=$4

    local files=("$src_dir"/*.webp)
    local total=${#files[@]}
    local count=0

    echo -e "${YELLOW}Processing $desc ($total frames at Q$quality)${NC}"

    for file in "${files[@]}"; do
        ((count++))
        local basename=$(basename "$file")
        cwebp -q "$quality" "$file" -o "$out_dir/$basename" 2>/dev/null
        show_progress $count $total "$desc"
    done
    echo ""
}

# Resize and encode mobile frames
encode_mobile() {
    local src_dir=$1
    local out_dir=$2
    local quality=$3
    local width=$4
    local height=$5
    local desc=$6

    local files=("$src_dir"/*.webp)
    local total=${#files[@]}
    local count=0

    echo -e "${YELLOW}Processing $desc ($total frames at ${width}x${height} Q$quality)${NC}"

    for file in "${files[@]}"; do
        ((count++))
        local basename=$(basename "$file")
        local tempfile="/tmp/resize_temp_$$.png"
        convert "$file" -resize "${width}x${height}" "$tempfile"
        cwebp -q "$quality" "$tempfile" -o "$out_dir/$basename" 2>/dev/null
        rm -f "$tempfile"
        show_progress $count $total "$desc"
    done
    echo ""
}

# Verify output
verify_output() {
    local dir=$1
    local expected=$2
    local target_mb=$3
    local desc=$4

    local count=$(ls "$dir"/*.webp 2>/dev/null | wc -l)
    local size=$(du -sm "$dir" | cut -f1)

    echo -n "$desc: "
    if [ "$count" -eq "$expected" ] && [ "$size" -lt "$target_mb" ]; then
        echo -e "${GREEN}PASS${NC} ($count files, ${size}MB)"
        return 0
    else
        echo -e "${RED}FAIL${NC} ($count files expected $expected, ${size}MB target <${target_mb}MB)"
        return 1
    fi
}

# Main execution
main() {
    echo "========================================"
    echo "Frame Optimization Script"
    echo "========================================"
    echo ""

    # Create output directories
    mkdir -p "$OUTPUT_DIR/hero-frames"
    mkdir -p "$OUTPUT_DIR/hero-frames-mobile"
    mkdir -p "$OUTPUT_DIR/product-frames"
    mkdir -p "$OUTPUT_DIR/product-frames-mobile"

    local start_time=$(date +%s)

    # Process based on argument
    case "${1:-all}" in
        hero-desktop)
            encode_desktop "$SOURCE_DIR/hero-frames" "$OUTPUT_DIR/hero-frames" $HERO_DESKTOP_QUALITY "Hero Desktop"
            ;;
        hero-mobile)
            encode_mobile "$SOURCE_DIR/hero-frames" "$OUTPUT_DIR/hero-frames-mobile" $HERO_MOBILE_QUALITY $HERO_MOBILE_WIDTH $HERO_MOBILE_HEIGHT "Hero Mobile"
            ;;
        product-desktop)
            encode_desktop "$SOURCE_DIR/product-frames" "$OUTPUT_DIR/product-frames" $PRODUCT_DESKTOP_QUALITY "Product Desktop"
            ;;
        product-mobile)
            encode_mobile "$SOURCE_DIR/product-frames" "$OUTPUT_DIR/product-frames-mobile" $PRODUCT_MOBILE_QUALITY $PRODUCT_MOBILE_WIDTH $PRODUCT_MOBILE_HEIGHT "Product Mobile"
            ;;
        hero)
            encode_desktop "$SOURCE_DIR/hero-frames" "$OUTPUT_DIR/hero-frames" $HERO_DESKTOP_QUALITY "Hero Desktop"
            encode_mobile "$SOURCE_DIR/hero-frames" "$OUTPUT_DIR/hero-frames-mobile" $HERO_MOBILE_QUALITY $HERO_MOBILE_WIDTH $HERO_MOBILE_HEIGHT "Hero Mobile"
            ;;
        product)
            encode_desktop "$SOURCE_DIR/product-frames" "$OUTPUT_DIR/product-frames" $PRODUCT_DESKTOP_QUALITY "Product Desktop"
            encode_mobile "$SOURCE_DIR/product-frames" "$OUTPUT_DIR/product-frames-mobile" $PRODUCT_MOBILE_QUALITY $PRODUCT_MOBILE_WIDTH $PRODUCT_MOBILE_HEIGHT "Product Mobile"
            ;;
        all)
            encode_desktop "$SOURCE_DIR/hero-frames" "$OUTPUT_DIR/hero-frames" $HERO_DESKTOP_QUALITY "Hero Desktop"
            encode_mobile "$SOURCE_DIR/hero-frames" "$OUTPUT_DIR/hero-frames-mobile" $HERO_MOBILE_QUALITY $HERO_MOBILE_WIDTH $HERO_MOBILE_HEIGHT "Hero Mobile"
            encode_desktop "$SOURCE_DIR/product-frames" "$OUTPUT_DIR/product-frames" $PRODUCT_DESKTOP_QUALITY "Product Desktop"
            encode_mobile "$SOURCE_DIR/product-frames" "$OUTPUT_DIR/product-frames-mobile" $PRODUCT_MOBILE_QUALITY $PRODUCT_MOBILE_WIDTH $PRODUCT_MOBILE_HEIGHT "Product Mobile"
            ;;
        verify)
            echo "Verifying outputs..."
            echo ""
            verify_output "$OUTPUT_DIR/hero-frames" 192 10 "Hero Desktop"
            verify_output "$OUTPUT_DIR/hero-frames-mobile" 192 5 "Hero Mobile"
            verify_output "$OUTPUT_DIR/product-frames" 144 10 "Product Desktop"
            verify_output "$OUTPUT_DIR/product-frames-mobile" 144 5 "Product Mobile"
            ;;
        *)
            echo "Usage: $0 [hero-desktop|hero-mobile|product-desktop|product-mobile|hero|product|all|verify]"
            exit 1
            ;;
    esac

    local end_time=$(date +%s)
    local duration=$((end_time - start_time))

    echo ""
    echo "========================================"
    echo "Completed in ${duration} seconds"
    echo "========================================"
}

main "$@"
