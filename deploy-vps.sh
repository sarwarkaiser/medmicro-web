#!/bin/bash

###############################################################################
# MedMicro PWA - VPS Deployment Script
# Automatically deploys the PWA to your VPS
###############################################################################

set -e

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║         MedMicro PWA - VPS Deployment                        ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Configuration
read -p "Enter VPS IP address: " VPS_IP
read -p "Enter VPS username (default: root): " VPS_USER
VPS_USER=${VPS_USER:-root}
read -p "Enter SSH key path (press Enter for default ~/.ssh/id_rsa): " SSH_KEY
SSH_KEY=${SSH_KEY:-~/.ssh/id_rsa}

echo ""
echo "→ VPS IP: $VPS_IP"
echo "→ User: $VPS_USER"
echo "→ SSH Key: $SSH_KEY"
echo ""

# Fix key permissions
chmod 600 "$SSH_KEY" 2>/dev/null || true

# Test connection
echo "→ Testing SSH connection..."
if ssh -i "$SSH_KEY" -o ConnectTimeout=10 -o StrictHostKeyChecking=no ${VPS_USER}@${VPS_IP} "echo 'Connected'" >/dev/null 2>&1; then
    echo "✓ SSH connection successful"
else
    echo "✗ Cannot connect to VPS"
    echo "  Please check:"
    echo "  1. VPS is running"
    echo "  2. IP address is correct"
    echo "  3. SSH key has access"
    exit 1
fi

echo ""
echo "→ Starting deployment..."
echo ""

# Deploy to VPS
ssh -i "$SSH_KEY" ${VPS_USER}@${VPS_IP} 'bash -s' << 'ENDSSH'

set -e

echo "✓ Connected to VPS"
echo ""

# Install Node.js if not present
if ! command -v node &> /dev/null; then
    echo "→ Installing Node.js 20.x..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
    echo "✓ Node.js installed: $(node --version)"
else
    echo "✓ Node.js already installed: $(node --version)"
fi
echo ""

# Install PM2 if not present
if ! command -v pm2 &> /dev/null; then
    echo "→ Installing PM2..."
    sudo npm install -g pm2
    echo "✓ PM2 installed"
else
    echo "✓ PM2 already installed"
fi
echo ""

# Create app directory
APP_DIR="/var/www/medmicro-pwa"
echo "→ Setting up application directory: $APP_DIR"
sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR
cd $APP_DIR

# Clone or update repository
if [ -d ".git" ]; then
    echo "→ Updating existing repository..."
    git pull origin main
else
    echo "→ Cloning repository..."
    # User will need to provide their GitHub repo URL
    read -p "Enter your GitHub repository URL (e.g., https://github.com/username/medmicro-pwa): " REPO_URL
    git clone $REPO_URL .
fi
echo ""

# Install dependencies
echo "→ Installing dependencies..."
npm install --production
echo ""

# Create .env if doesn't exist
if [ ! -f .env ]; then
    echo "→ Creating .env file..."
    cat > .env << EOF
PORT=3000
NODE_ENV=production
EOF
    echo "✓ .env created"
fi
echo ""

# Configure firewall
echo "→ Configuring firewall..."
if command -v ufw &> /dev/null; then
    sudo ufw allow 3000/tcp
    echo "✓ UFW: Port 3000 opened"
elif command -v iptables &> /dev/null; then
    sudo iptables -I INPUT -p tcp --dport 3000 -j ACCEPT
    sudo iptables-save | sudo tee /etc/iptables/rules.v4 >/dev/null 2>&1 || true
    echo "✓ iptables: Port 3000 opened"
fi
echo ""

# Stop old instance
if pm2 list | grep -q "medmicro-pwa"; then
    echo "→ Stopping old instance..."
    pm2 stop medmicro-pwa
    pm2 delete medmicro-pwa
fi

# Start with PM2
echo "→ Starting application with PM2..."
pm2 start server/index.js --name "medmicro-pwa" --env production
pm2 save
echo ""

# Setup PM2 startup
echo "→ Configuring PM2 to start on boot..."
pm2 startup systemd -u $USER --hp $HOME 2>&1 | grep -o "sudo.*" | bash || true
echo ""

# Show status
echo "→ Application status:"
pm2 list
echo ""

# Get public IP
PUBLIC_IP=$(curl -s ifconfig.me 2>/dev/null || curl -s icanhazip.com 2>/dev/null || echo "$VPS_IP")

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║              ✅  DEPLOYMENT SUCCESSFUL!  ✅                   ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "📱 Access your PWA at:"
echo "   http://${PUBLIC_IP}:3000"
echo ""
echo "🔧 Useful commands:"
echo "   pm2 list                    # Show status"
echo "   pm2 logs medmicro-pwa       # View logs"
echo "   pm2 restart medmicro-pwa    # Restart app"
echo "   pm2 stop medmicro-pwa       # Stop app"
echo ""
echo "📚 Next steps:"
echo "   1. Test PWA: Open http://${PUBLIC_IP}:3000"
echo "   2. Set up Cloudflare for HTTPS (see CLOUDFLARE.md)"
echo "   3. Configure your domain"
echo ""

ENDSSH

echo ""
echo "✓ Deployment completed!"
echo ""
