#!/bin/bash

# 🚀 Watermark App Deployment Script
# This script helps you deploy your watermarking app

set -e  # Exit on any error

echo "🚀 Starting Watermark App Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_success "Docker and Docker Compose are installed"
}

# Check if .env file exists
check_env() {
    if [ ! -f .env ]; then
        print_warning ".env file not found. Creating from example..."
        if [ -f env.example ]; then
            cp env.example .env
            print_success "Created .env file from env.example"
            print_warning "Please edit .env file with your production values"
        else
            print_error "env.example file not found. Please create a .env file manually."
            exit 1
        fi
    else
        print_success ".env file found"
    fi
}

# Build and deploy
deploy() {
    local mode=$1
    
    print_status "Building and deploying in $mode mode..."
    
    if [ "$mode" = "production" ]; then
        docker-compose -f docker-compose.prod.yml up --build -d
        print_success "Production deployment completed!"
        print_status "Frontend: http://localhost:80"
        print_status "Backend: http://localhost:8000"
        print_status "API Docs: http://localhost:8000/docs"
    else
        docker-compose up --build -d
        print_success "Development deployment completed!"
        print_status "Frontend: http://localhost:3000"
        print_status "Backend: http://localhost:8000"
        print_status "API Docs: http://localhost:8000/docs"
    fi
}

# Stop services
stop() {
    local mode=$1
    
    print_status "Stopping services..."
    
    if [ "$mode" = "production" ]; then
        docker-compose -f docker-compose.prod.yml down
    else
        docker-compose down
    fi
    
    print_success "Services stopped"
}

# Show logs
logs() {
    local mode=$1
    
    if [ "$mode" = "production" ]; then
        docker-compose -f docker-compose.prod.yml logs -f
    else
        docker-compose logs -f
    fi
}

# Show status
status() {
    local mode=$1
    
    print_status "Container status:"
    
    if [ "$mode" = "production" ]; then
        docker-compose -f docker-compose.prod.yml ps
    else
        docker-compose ps
    fi
}

# Clean up
cleanup() {
    print_status "Cleaning up Docker resources..."
    docker system prune -f
    docker volume prune -f
    print_success "Cleanup completed"
}

# Show help
show_help() {
    echo "Usage: $0 [COMMAND] [MODE]"
    echo ""
    echo "Commands:"
    echo "  deploy     Deploy the application"
    echo "  stop       Stop the application"
    echo "  logs       Show application logs"
    echo "  status     Show container status"
    echo "  cleanup    Clean up Docker resources"
    echo "  help       Show this help message"
    echo ""
    echo "Modes:"
    echo "  dev        Development mode (default)"
    echo "  prod       Production mode"
    echo ""
    echo "Examples:"
    echo "  $0 deploy dev      # Deploy in development mode"
    echo "  $0 deploy prod     # Deploy in production mode"
    echo "  $0 stop prod       # Stop production services"
    echo "  $0 logs dev        # Show development logs"
}

# Main script logic
main() {
    local command=$1
    local mode=${2:-dev}
    
    # Validate mode
    if [ "$mode" != "dev" ] && [ "$mode" != "prod" ]; then
        print_error "Invalid mode: $mode. Use 'dev' or 'prod'"
        exit 1
    fi
    
    case $command in
        "deploy")
            check_docker
            check_env
            deploy $mode
            ;;
        "stop")
            check_docker
            stop $mode
            ;;
        "logs")
            check_docker
            logs $mode
            ;;
        "status")
            check_docker
            status $mode
            ;;
        "cleanup")
            check_docker
            cleanup
            ;;
        "help"|"--help"|"-h")
            show_help
            ;;
        *)
            print_error "Unknown command: $command"
            show_help
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@" 