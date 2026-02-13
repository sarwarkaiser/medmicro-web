#!/bin/bash

#####################################################################
# MedMicro PWA - Oracle Cloud Deployment Script
# Automated deployment to Oracle Cloud Infrastructure (OCI)
#####################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ORACLE_IP="40.233.116.192"
ORACLE_USER="ubuntu"
SSH_KEY=""  # Will be set by user
REPO_URL=""  # Will be set by user
APP_NAME="medmicro-pwa"
APP_PORT="3000"

#####################################################################
# Helper Functions
#####################################################################

print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

#####################################################################
# Check Prerequisites
#####################################################################

check_prerequisites() {
    print_header "Checking Prerequisites"

    # Check if running on Mac/Linux
    if [[ "$OSTYPE" != "linux-gnu"* && "$OSTYPE" != "darwin"* ]]; then
        print_error "This script requires Linux or macOS"
        exit 1
    fi

    # Check for SSH
    if ! command -v ssh &> /dev/null; then
        print_error "SSH client not found. Please install OpenSSH."
        exit 1
    fi

    print_success "Prerequisites check passed"
}

#####################################################################
# Get User Input
#####################################################################

get_user_input() {
    print_header "Configuration"

    # SSH Key
    echo -e "${YELLOW}Enter path to your Oracle SSH private key:${NC}"
    read -r SSH_KEY

    # Expand tilde to home directory
    SSH_KEY="${SSH_KEY/#\~/$HOME}"

    # Verify SSH key exists
    if [ ! -f "$SSH_KEY" ]; then
        print_error "SSH key not found at: $SSH_KEY"
        exit 1
    fi

    # Check key permissions
    KEY_PERMS=$(stat -f "%A" "$SSH_KEY" 2>/dev/null || stat -c "%a" "$SSH_KEY" 2>/dev/null)
    if [ "$KEY_PERMS" != "600" ] && [ "$KEY_PERMS" != "400" ]; then
        print_warning "SSH key permissions should be 600 or 400"
        chmod 600 "$SSH_KEY"
        print_success "Fixed SSH key permissions to 600"
    fi

    # Repository URL
    echo -e "\n${YELLOW}Enter GitHub repository URL (e.g., https://github.com/username/medmicro-pwa.git):${NC}"
    read -r REPO_URL

    # Confirm settings
    echo -e "\n${BLUE}Deployment Configuration:${NC}"
    echo "  Oracle IP: $ORACLE_IP"
    echo "  Username: $ORACLE_USER"
    echo "  SSH Key: $SSH_KEY"
    echo "  Repository: $REPO_URL"
    echo "  App Port: $APP_PORT"

    echo -e "\n${YELLOW}Proceed with deployment? (y/n):${NC}"
    read -r CONFIRM

    if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
        print_error "Deployment cancelled"
        exit 0
    fi
}

#####################################################################
# Test SSH Connection
#####################################################################

test_ssh_connection() {
    print_header "Testing SSH Connection"

    if ssh -i "$SSH_KEY" -o ConnectTimeout=10 -o StrictHostKeyChecking=no "${ORACLE_USER}@${ORACLE_IP}" "echo 'Connection successful'" &> /dev/null; then
        print_success "SSH connection successful"
    else
        print_error "Cannot connect to Oracle VM"
        print_info "Please check:"
        print_info "  1. SSH key is correct"
        print_info "  2. Oracle VM is running"
        print_info "  3. Security list allows SSH (port 22)"
        exit 1
    fi
}

#####################################################################
# Deploy Application
#####################################################################

deploy_application() {
    print_header "Deploying Application"

    # Execute deployment commands on Oracle VM
    ssh -i "$SSH_KEY" "${ORACLE_USER}@${ORACLE_IP}" "bash -s" <<ENDSSH
        set -e

        echo "📦 Updating system packages..."
        sudo apt update && sudo apt upgrade -y

        echo "📥 Installing Node.js 20..."
        if ! command -v node &> /dev/null; then
            curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
            sudo apt-get install -y nodejs
        else
            echo "Node.js already installed: \$(node --version)"
        fi

        echo "📥 Installing PM2..."
        if ! command -v pm2 &> /dev/null; then
            sudo npm install -g pm2
        else
            echo "PM2 already installed: \$(pm2 --version)"
        fi

        echo "🔥 Configuring firewall..."
        sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport $APP_PORT -j ACCEPT || true
        if command -v netfilter-persistent &> /dev/null; then
            sudo netfilter-persistent save
        fi

        echo "📂 Cloning repository..."
        cd ~
        if [ -d "$APP_NAME" ]; then
            echo "Directory exists, pulling latest changes..."
            cd $APP_NAME
            git pull origin main
        else
            git clone $REPO_URL $APP_NAME
            cd $APP_NAME
        fi

        echo "📦 Installing dependencies..."
        npm install --production

        echo "💾 Adding swap space (if needed)..."
        if ! swapon --show | grep -q '/swapfile'; then
            sudo fallocate -l 2G /swapfile || sudo dd if=/dev/zero of=/swapfile bs=1M count=2048
            sudo chmod 600 /swapfile
            sudo mkswap /swapfile
            sudo swapon /swapfile
            echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
            echo "Swap space added"
        else
            echo "Swap space already configured"
        fi

        echo "🚀 Starting application with PM2..."
        pm2 delete $APP_NAME 2>/dev/null || true
        pm2 start server/index.js --name "$APP_NAME" --max-memory-restart 400M
        pm2 save

        echo "🔄 Configuring PM2 startup..."
        pm2 startup systemd -u $ORACLE_USER --hp /home/$ORACLE_USER

        echo "✅ Deployment complete!"
        echo ""
        echo "Application Status:"
        pm2 status
        echo ""
        echo "Application Logs:"
        pm2 logs $APP_NAME --lines 10 --nostream
ENDSSH

    print_success "Application deployed successfully!"
}

#####################################################################
# Verify Deployment
#####################################################################

verify_deployment() {
    print_header "Verifying Deployment"

    sleep 3  # Give app time to start

    # Test health endpoint
    if curl -f -s -o /dev/null "http://${ORACLE_IP}:${APP_PORT}/health"; then
        print_success "Health check passed"
    else
        print_warning "Health check failed - app may still be starting"
    fi

    # Test API endpoint
    if curl -f -s -o /dev/null "http://${ORACLE_IP}:${APP_PORT}/api/meds"; then
        print_success "API endpoint accessible"
    else
        print_warning "API endpoint not accessible yet"
    fi
}

#####################################################################
# Display Summary
#####################################################################

display_summary() {
    print_header "Deployment Summary"

    echo -e "${GREEN}✓ MedMicro PWA deployed successfully!${NC}\n"

    echo -e "${BLUE}Access your application:${NC}"
    echo -e "  Web Interface: ${GREEN}http://${ORACLE_IP}:${APP_PORT}${NC}"
    echo -e "  Health Check:  ${GREEN}http://${ORACLE_IP}:${APP_PORT}/health${NC}"
    echo -e "  API Endpoint:  ${GREEN}http://${ORACLE_IP}:${APP_PORT}/api/meds${NC}"

    echo -e "\n${BLUE}Manage your application:${NC}"
    echo -e "  SSH to server:   ${YELLOW}ssh -i $SSH_KEY ${ORACLE_USER}@${ORACLE_IP}${NC}"
    echo -e "  View logs:       ${YELLOW}pm2 logs $APP_NAME${NC}"
    echo -e "  Restart app:     ${YELLOW}pm2 restart $APP_NAME${NC}"
    echo -e "  Stop app:        ${YELLOW}pm2 stop $APP_NAME${NC}"
    echo -e "  App status:      ${YELLOW}pm2 status${NC}"

    echo -e "\n${BLUE}Next Steps:${NC}"
    echo -e "  1. Configure Oracle Cloud Security List to allow port $APP_PORT"
    echo -e "     ${YELLOW}OCI Console → VCN → Security Lists → Add Ingress Rule${NC}"
    echo -e "  2. Setup Cloudflare for HTTPS (see CLOUDFLARE.md)"
    echo -e "  3. Configure custom domain"
    echo -e "  4. Test PWA installation on mobile device"

    echo -e "\n${BLUE}Troubleshooting:${NC}"
    echo -e "  If app not accessible from browser:"
    echo -e "  1. SSH: ${YELLOW}ssh -i $SSH_KEY ${ORACLE_USER}@${ORACLE_IP}${NC}"
    echo -e "  2. Check logs: ${YELLOW}pm2 logs $APP_NAME${NC}"
    echo -e "  3. Test locally: ${YELLOW}curl http://localhost:$APP_PORT/health${NC}"
    echo -e "  4. Check firewall: ${YELLOW}sudo iptables -L -n | grep $APP_PORT${NC}"
    echo -e "  5. Verify Oracle Cloud Security List in OCI Console"

    echo -e "\n${GREEN}🎉 Deployment Complete!${NC}\n"
}

#####################################################################
# Main Execution
#####################################################################

main() {
    clear

    echo -e "${BLUE}"
    echo "╔════════════════════════════════════════════════════════╗"
    echo "║                                                        ║"
    echo "║         MedMicro PWA - Oracle Cloud Deployer          ║"
    echo "║                                                        ║"
    echo "╚════════════════════════════════════════════════════════╝"
    echo -e "${NC}\n"

    check_prerequisites
    get_user_input
    test_ssh_connection
    deploy_application
    verify_deployment
    display_summary
}

# Run main function
main "$@"
