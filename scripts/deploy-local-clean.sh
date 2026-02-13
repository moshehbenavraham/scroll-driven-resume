#!/usr/bin/env bash
#===============================================================================
#  MODERN RESUME SITE - CLEAN LOCAL DEPLOYMENT SCRIPT
#===============================================================================
#  This script performs a complete clean rebuild and deployment:
#    1. Stops all running processes (Docker, dev servers)
#    2. Cleans build artifacts (preserves data volumes!)
#    3. Reinstalls dependencies
#    4. Rebuilds the application
#    5. Restarts all services
#
#  PROTECTED DATA (will NOT be deleted):
#    - resume-minio-data   (uploaded assets)
#    - resume-postgres-data (metadata database)
#
#  Usage: ./scripts/deploy-local-clean.sh [--skip-docker] [--build-only]
#===============================================================================

set -euo pipefail

# -----------------------------------------------------------------------------
# Configuration
# -----------------------------------------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
DEV_PORT=3017
SKIP_DOCKER=false
START_DEV=true

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color
BOLD='\033[1m'
DIM='\033[2m'

# -----------------------------------------------------------------------------
# Parse Arguments
# -----------------------------------------------------------------------------
while [[ $# -gt 0 ]]; do
    case $1 in
        --skip-docker)
            SKIP_DOCKER=true
            shift
            ;;
        --build-only)
            START_DEV=false
            shift
            ;;
        -h|--help)
            echo "Usage: $0 [--skip-docker] [--build-only]"
            echo "  --skip-docker  Skip Docker operations"
            echo "  --build-only   Only build, don't start dev server"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# -----------------------------------------------------------------------------
# ASCII Art Functions
# -----------------------------------------------------------------------------
print_banner() {
    echo -e "${CYAN}"
    cat << 'EOF'

    ██████╗ ███████╗██████╗ ██╗      ██████╗ ██╗   ██╗
    ██╔══██╗██╔════╝██╔══██╗██║     ██╔═══██╗╚██╗ ██╔╝
    ██║  ██║█████╗  ██████╔╝██║     ██║   ██║ ╚████╔╝
    ██║  ██║██╔══╝  ██╔═══╝ ██║     ██║   ██║  ╚██╔╝
    ██████╔╝███████╗██║     ███████╗╚██████╔╝   ██║
    ╚═════╝ ╚══════╝╚═╝     ╚══════╝ ╚═════╝    ╚═╝

     ██████╗██╗     ███████╗ █████╗ ███╗   ██╗
    ██╔════╝██║     ██╔════╝██╔══██╗████╗  ██║
    ██║     ██║     █████╗  ███████║██╔██╗ ██║
    ██║     ██║     ██╔══╝  ██╔══██║██║╚██╗██║
    ╚██████╗███████╗███████╗██║  ██║██║ ╚████║
     ╚═════╝╚══════╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝

EOF
    echo -e "${NC}"
    echo -e "${DIM}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${WHITE}  Modern Resume Site • Clean Local Deployment${NC}"
    echo -e "${DIM}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo
}

print_phase() {
    local phase=$1
    local title=$2
    echo
    echo -e "${MAGENTA}┌─────────────────────────────────────────────────────────────┐${NC}"
    echo -e "${MAGENTA}│${NC} ${BOLD}${WHITE}PHASE ${phase}:${NC} ${CYAN}${title}${NC}"
    echo -e "${MAGENTA}└─────────────────────────────────────────────────────────────┘${NC}"
}

print_step() {
    echo -e "  ${BLUE}▶${NC} $1"
}

print_success() {
    echo -e "  ${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "  ${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "  ${RED}✗${NC} $1"
}

print_protected() {
    echo -e "  ${GREEN}🛡${NC} ${GREEN}PROTECTED:${NC} $1"
}

print_rocket() {
    echo -e "${GREEN}"
    cat << 'EOF'

                     ▄▄▄▄▄
                    ▐█████▌
                    ▐█████▌
                   ▄███████▄
                  ▐█████████▌
                  █████████████
                 ▐█████████████▌
                 ███████████████
                ▐███████████████▌
                █████████████████
               ▐█████████████████▌
              ▄███████████████████▄
             ▐█████████████████████▌
            ▄███████████████████████▄
           ▐█████████████████████████▌
          ▀▀▀▀▀▀▀█████████████▀▀▀▀▀▀▀
                 ▐███████████▌
                  ▀█████████▀
                   ▀███████▀
                    ▀█████▀
                  ▄▄▄█████▄▄▄
                 ▀▀▀▀▀▀▀▀▀▀▀▀▀

        🚀 DEPLOYMENT SUCCESSFUL! 🚀

EOF
    echo -e "${NC}"
}

print_skull() {
    echo -e "${RED}"
    cat << 'EOF'

           ____
          /    \
         | STOP |
         | !!!! |
          \____/
            ||

EOF
    echo -e "${NC}"
}

print_cleaning() {
    echo -e "${YELLOW}"
    cat << 'EOF'

        ╔═══════════════════════════════╗
        ║   🧹 CLEANING IN PROGRESS 🧹  ║
        ║                               ║
        ║    Sweeping away the old...   ║
        ║    Making room for the new!   ║
        ╚═══════════════════════════════╝

EOF
    echo -e "${NC}"
}

print_building() {
    echo -e "${CYAN}"
    cat << 'EOF'

        ╔═══════════════════════════════╗
        ║   🔨 BUILDING APPLICATION 🔨  ║
        ║                               ║
        ║      ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓     ║
        ║      Compiling Next.js...     ║
        ╚═══════════════════════════════╝

EOF
    echo -e "${NC}"
}

# -----------------------------------------------------------------------------
# Utility Functions
# -----------------------------------------------------------------------------
cd_project() {
    cd "$PROJECT_ROOT" || {
        print_error "Failed to change to project directory: $PROJECT_ROOT"
        exit 1
    }
}

check_requirements() {
    local missing=()

    command -v node >/dev/null 2>&1 || missing+=("node")
    command -v npm >/dev/null 2>&1 || missing+=("npm")

    if [[ "$SKIP_DOCKER" == "false" ]]; then
        command -v docker >/dev/null 2>&1 || missing+=("docker")
        command -v docker-compose >/dev/null 2>&1 && true || {
            docker compose version >/dev/null 2>&1 || missing+=("docker-compose")
        }
    fi

    if [[ ${#missing[@]} -gt 0 ]]; then
        print_error "Missing required tools: ${missing[*]}"
        exit 1
    fi

    print_success "All required tools available"
}

get_docker_compose_cmd() {
    if docker compose version >/dev/null 2>&1; then
        echo "docker compose"
    else
        echo "docker-compose"
    fi
}

# -----------------------------------------------------------------------------
# Phase 1: Stop Everything
# -----------------------------------------------------------------------------
phase_stop() {
    print_phase "1" "STOPPING ALL PROCESSES"
    print_skull

    # Kill dev server on port
    print_step "Checking for dev server on port ${DEV_PORT}..."
    local pids
    pids=$(lsof -ti :${DEV_PORT} 2>/dev/null || true)
    if [[ -n "$pids" ]]; then
        print_step "Killing processes on port ${DEV_PORT}: $pids"
        echo "$pids" | xargs kill -9 2>/dev/null || true
        sleep 1
        print_success "Dev server stopped"
    else
        print_success "No dev server running on port ${DEV_PORT}"
    fi

    # Kill any node processes related to this project
    print_step "Checking for orphan Node processes..."
    pkill -f "next dev.*${DEV_PORT}" 2>/dev/null || true
    pkill -f "node.*scroll-driven-resume" 2>/dev/null || true
    print_success "Orphan processes cleaned"

    # Stop Docker containers
    if [[ "$SKIP_DOCKER" == "false" ]]; then
        print_step "Stopping Docker containers..."
        local compose_cmd
        compose_cmd=$(get_docker_compose_cmd)

        cd_project
        if [[ -f "docker-compose.yml" ]]; then
            $compose_cmd down --remove-orphans 2>/dev/null || true
            print_success "Docker containers stopped"
        else
            print_warning "No docker-compose.yml found"
        fi
    else
        print_warning "Skipping Docker operations (--skip-docker)"
    fi
}

# -----------------------------------------------------------------------------
# Phase 2: Clean Build Artifacts
# -----------------------------------------------------------------------------
phase_clean() {
    print_phase "2" "CLEANING BUILD ARTIFACTS"
    print_cleaning

    cd_project

    # Show what we're protecting
    echo -e "\n  ${GREEN}${BOLD}Protected Data Volumes:${NC}"
    print_protected "resume-minio-data (uploaded assets)"
    print_protected "resume-postgres-data (metadata database)"
    echo

    # Clean node_modules
    print_step "Removing node_modules..."
    if [[ -d "node_modules" ]]; then
        rm -rf node_modules
        print_success "node_modules removed"
    else
        print_success "node_modules already clean"
    fi

    # Clean .next build directory
    print_step "Removing .next build directory..."
    if [[ -d ".next" ]]; then
        rm -rf .next
        print_success ".next removed"
    else
        print_success ".next already clean"
    fi

    # Clean other build artifacts
    print_step "Cleaning additional artifacts..."
    rm -rf .turbo 2>/dev/null || true
    rm -rf out 2>/dev/null || true
    rm -rf coverage 2>/dev/null || true
    rm -rf playwright-report 2>/dev/null || true
    rm -rf test-results 2>/dev/null || true
    print_success "Build artifacts cleaned"

    # Clean npm cache (optional, helps with corruption)
    print_step "Verifying npm cache..."
    npm cache verify >/dev/null 2>&1 || true
    print_success "npm cache verified"

    # Clean Docker cache volume (safe to remove)
    if [[ "$SKIP_DOCKER" == "false" ]]; then
        print_step "Cleaning nginx cache volume..."
        docker volume rm resume-nginx-cache 2>/dev/null || true
        print_success "Nginx cache cleaned"
    fi
}

# -----------------------------------------------------------------------------
# Phase 3: Rebuild Everything
# -----------------------------------------------------------------------------
phase_rebuild() {
    print_phase "3" "REBUILDING APPLICATION"
    print_building

    cd_project

    # Install dependencies
    print_step "Installing dependencies (npm ci)..."
    npm ci --loglevel=error
    print_success "Dependencies installed"

    # Run type check
    print_step "Running TypeScript type check..."
    if npm run type-check; then
        print_success "Type check passed"
    else
        print_warning "Type check had warnings (continuing anyway)"
    fi

    # Run linting
    print_step "Running ESLint..."
    if npm run lint 2>/dev/null; then
        print_success "Linting passed"
    else
        print_warning "Linting had warnings (continuing anyway)"
    fi

    # Build the application
    print_step "Building Next.js application..."
    if npm run build; then
        print_success "Application built successfully"
    else
        print_error "Build failed!"
        exit 1
    fi
}

# -----------------------------------------------------------------------------
# Phase 4: Start Services
# -----------------------------------------------------------------------------
phase_start() {
    print_phase "4" "STARTING SERVICES"

    cd_project

    # Start Docker services
    if [[ "$SKIP_DOCKER" == "false" ]]; then
        print_step "Starting Docker services..."
        local compose_cmd
        compose_cmd=$(get_docker_compose_cmd)

        $compose_cmd up -d

        # Wait for services to be healthy
        print_step "Waiting for services to be healthy..."
        local max_attempts=30
        local attempt=0

        while [[ $attempt -lt $max_attempts ]]; do
            local unhealthy
            unhealthy=$(docker ps --filter "name=resume-" --format "{{.Names}}: {{.Status}}" | grep -v healthy | grep -v "Up" || true)

            if [[ -z "$unhealthy" ]]; then
                break
            fi

            sleep 2
            ((attempt++))
            echo -ne "\r  ${BLUE}▶${NC} Waiting for services... (${attempt}/${max_attempts})"
        done
        echo

        if [[ $attempt -lt $max_attempts ]]; then
            print_success "All Docker services healthy"
        else
            print_warning "Some services may still be starting"
        fi

        # Show Docker status
        echo
        echo -e "  ${CYAN}Docker Service Status:${NC}"
        docker ps --filter "name=resume-" --format "    {{.Names}}: {{.Status}}" 2>/dev/null || true
        echo
    fi

    # Start dev server (default) or show start commands (--build-only)
    if [[ "$START_DEV" == "true" ]]; then
        echo
        echo -e "${GREEN}"
        cat << 'EOF'

        ╔═══════════════════════════════════════════════════════════╗
        ║                                                           ║
        ║   🚀 LAUNCHING DEV SERVER ON PORT 3017 🚀                 ║
        ║                                                           ║
        ║      ███╗   ██╗███████╗██╗  ██╗████████╗   ▄▄▄██╗▄▄▄      ║
        ║      ████╗  ██║██╔════╝╚██╗██╔╝╚══██╔══╝    ▀█   █▀       ║
        ║      ██╔██╗ ██║█████╗   ╚███╔╝    ██║        █   █        ║
        ║      ██║╚██╗██║██╔══╝   ██╔██╗    ██║        █   █        ║
        ║      ██║ ╚████║███████╗██╔╝ ██╗   ██║     ▀▄▄█   █▄▄▀     ║
        ║      ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝   ╚═╝       ▀▀▀▀▀▀▀       ║
        ║                                                           ║
        ╚═══════════════════════════════════════════════════════════╝

EOF
        echo -e "${NC}"
        echo -e "  ${CYAN}Access your app at:${NC} ${WHITE}http://localhost:${DEV_PORT}${NC}"
        echo -e "  ${DIM}Press Ctrl+C to stop the server${NC}"
        echo
        echo -e "${DIM}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo
        npm run dev
    else
        print_success "Build complete! Application ready."
        echo
        echo -e "  ${CYAN}To start the application:${NC}"
        echo -e "    ${WHITE}Development:${NC}  npm run dev"
        echo -e "    ${WHITE}Production:${NC}   npm run start"
        echo
    fi
}

# -----------------------------------------------------------------------------
# Phase 5: Summary
# -----------------------------------------------------------------------------
phase_summary() {
    print_rocket

    echo -e "${DIM}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${WHITE}  DEPLOYMENT SUMMARY${NC}"
    echo -e "${DIM}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo
    echo -e "  ${GREEN}✓${NC} All processes stopped and cleaned"
    echo -e "  ${GREEN}✓${NC} Dependencies freshly installed"
    echo -e "  ${GREEN}✓${NC} Application rebuilt from scratch"
    if [[ "$SKIP_DOCKER" == "false" ]]; then
        echo -e "  ${GREEN}✓${NC} Docker services running"
    fi
    echo
    echo -e "  ${GREEN}🛡${NC} ${GREEN}Data volumes preserved:${NC}"
    echo -e "      • resume-minio-data"
    echo -e "      • resume-postgres-data"
    echo
    echo -e "  ${CYAN}Service URLs:${NC}"
    echo -e "    ${WHITE}App:${NC}          http://localhost:${DEV_PORT}"
    if [[ "$SKIP_DOCKER" == "false" ]]; then
        echo -e "    ${WHITE}MinIO API:${NC}    http://localhost:9000"
        echo -e "    ${WHITE}MinIO Console:${NC} http://localhost:9001"
        echo -e "    ${WHITE}PostgreSQL:${NC}   localhost:5442"
    fi
    echo
    echo -e "${DIM}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo
}

# -----------------------------------------------------------------------------
# Main Execution
# -----------------------------------------------------------------------------
main() {
    print_banner

    echo -e "${BOLD}Starting clean deployment at $(date)${NC}"
    echo

    check_requirements

    phase_stop
    phase_clean
    phase_rebuild

    if [[ "$START_DEV" == "false" ]]; then
        phase_start
        phase_summary
    else
        phase_start
    fi
}

# Run main function
main "$@"
