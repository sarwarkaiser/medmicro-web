#!/bin/bash
################################################################################
#                                                                              #
#                  MedMicro PWA - Self-Extracting Bundle Script               #
#                                                                              #
#  Description:  Creates a complete medmicro-pwa project with all 52 files    #
#  Author:       MedMicro Team                                                 #
#  Created:      2026-02-12                                                    #
#  Size:         ~4900 lines (138 KB)                                          #
#                                                                              #
#  Usage:        bash create-medmicro-bundle.sh [target-directory]            #
#                Default target: medmicro-pwa                                  #
#                                                                              #
#  Features:                                                                   #
#    ✓ Creates all 51 project files with proper directory structure           #
#    ✓ Initializes git repository with initial commit                         #
#    ✓ Includes 11 medications with Canadian clinical guidelines              #
#    ✓ Includes 9 psychiatric treatment guidelines (APA, CANMAT, NICE)        #
#    ✓ Includes 5 DSM-5 diagnostic criteria                                   #
#    ✓ Includes clinical calculators (PHQ-9, GAD-7, BMI)                      #
#    ✓ Complete PWA with offline support and service worker                   #
#    ✓ Colored progress indicators and status messages                        #
#    ✓ Ready to npm install and deploy                                        #
#                                                                              #
#  What gets created:                                                          #
#    • Express.js server with REST API                                        #
#    • Progressive Web App frontend                                           #
#    • Service worker for offline functionality                               #
#    • Complete medical reference data (medications, guidelines, criteria)    #
#    • Deployment scripts for Oracle Cloud and generic VPS                    #
#    • Cloudflare HTTPS setup documentation                                   #
#    • Comprehensive README and documentation                                 #
#                                                                              #
#  After running this script:                                                 #
#    1. cd medmicro-pwa                                                        #
#    2. npm install                                                            #
#    3. npm start                                                              #
#    4. Visit http://localhost:3000                                            #
#                                                                              #
#  To deploy:                                                                  #
#    • Push to GitHub: git remote add origin <url> && git push -u origin main #
#    • Deploy to Oracle Cloud: See ORACLE_DEPLOY.md                           #
#    • Setup HTTPS with Cloudflare: See CLOUDFLARE.md                         #
#                                                                              #
################################################################################


################################################################################
# MedMicro PWA - Self-Extracting Bundle Script
# 
# This script creates a complete medmicro-pwa project with all files
# Usage: bash create-medmicro-bundle.sh [target-directory]
#
# Features:
# - Creates all 51 project files
# - Preserves directory structure
# - Initializes git repository
# - Creates initial commits
# - Ready to push to GitHub
#
# Created: 2026-02-12
################################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Progress tracking
TOTAL_FILES=52
CURRENT_FILE=0

# Functions
print_header() {
    echo -e "\n${BOLD}${BLUE}════════════════════════════════════════════════════════════════${NC}"
    echo -e "${BOLD}${BLUE}  $1${NC}"
    echo -e "${BOLD}${BLUE}════════════════════════════════════════════════════════════════${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${CYAN}ℹ${NC} $1"
}

print_progress() {
    CURRENT_FILE=$((CURRENT_FILE + 1))
    local percent=$((CURRENT_FILE * 100 / TOTAL_FILES))
    local bar_width=40
    local filled=$((percent * bar_width / 100))
    local empty=$((bar_width - filled))
    
    printf "${YELLOW}["
    printf "%${filled}s" | tr ' ' '='
    printf "%${empty}s" | tr ' ' ' '
    printf "] %3d%% ${NC}%s\n" "$percent" "$1"
}

create_file() {
    local filepath="$1"
    local filedir=$(dirname "$filepath")
    
    # Create directory if needed
    mkdir -p "$filedir"
    
    print_progress "$filepath"
}

# Main script
main() {
    clear
    
    echo -e "${BOLD}${MAGENTA}"
    cat << 'BANNER'
╔═══════════════════════════════════════════════════════════════════════╗
║                                                                       ║
║              🏥  MedMicro PWA - Project Bundle Creator  🏥             ║
║                                                                       ║
║              Self-Extracting Bundle with Git Integration             ║
║                                                                       ║
╚═══════════════════════════════════════════════════════════════════════╝
BANNER
    echo -e "${NC}\n"
    
    # Get target directory
    if [ -z "$1" ]; then
        TARGET_DIR="medmicro-pwa"
    else
        TARGET_DIR="$1"
    fi
    
    print_info "Target directory: ${BOLD}$(pwd)/$TARGET_DIR${NC}"
    
    # Check if directory exists
    if [ -d "$TARGET_DIR" ]; then
        echo -e "${YELLOW}⚠  Warning: Directory '$TARGET_DIR' already exists.${NC}"
        read -p "Remove it and continue? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_error "Aborted by user"
            exit 1
        fi
        rm -rf "$TARGET_DIR"
        print_success "Removed existing directory"
    fi
    
    # Create project directory
    mkdir -p "$TARGET_DIR"
    cd "$TARGET_DIR"
    
    print_header "📦 Creating Project Files ($TOTAL_FILES files)"
    
    # Create all files
    create_all_files
    
    print_header "🔧 Initializing Git Repository"
    
    # Initialize git
    git init -q
    git branch -M main
    print_success "Git repository initialized"
    
    # Create initial commit
    git add -A
    git -c commit.gpgsign=false commit -q -m "Initial commit: MedMicro PWA

- Express server with REST API
- Progressive Web App with offline support  
- 11 medications with Canadian clinical guidelines
- 9 psychiatric treatment guidelines (APA, CANMAT, NICE)
- 5 DSM-5 diagnostic criteria
- Clinical calculators (PHQ-9, GAD-7, BMI)
- Service worker for offline functionality
- Installable on Android, iOS, and desktop
- Oracle Cloud deployment automation
- Cloudflare HTTPS setup documentation

Complete PWA ready for deployment."
    
    print_success "Initial commit created"
    
    print_header "📊 Project Summary"
    
    echo -e "${GREEN}${BOLD}✓ Project created successfully!${NC}\n"
    
    echo -e "${BOLD}Project Statistics:${NC}"
    echo -e "  📁 Total files created: ${GREEN}${BOLD}51${NC}"
    echo -e "  📝 Total lines of code: ${GREEN}${BOLD}$(find . -type f \( -name '*.js' -o -name '*.css' -o -name '*.html' -o -name '*.json' -o -name '*.md' \) -not -path '*/node_modules/*' | xargs wc -l 2>/dev/null | tail -1 | awk '{print $1}')${NC}"
    echo -e "  💊 Medications: ${GREEN}${BOLD}11${NC}"
    echo -e "  📚 Guidelines: ${GREEN}${BOLD}9${NC}"
    echo -e "  📋 DSM-5 Criteria: ${GREEN}${BOLD}5${NC}"
    echo -e "  🧮 Calculators: ${GREEN}${BOLD}3${NC} (PHQ-9, GAD-7, BMI)"
    
    echo -e "\n${BOLD}Directory Structure:${NC}"
    if command -v tree &> /dev/null; then
        tree -L 3 -I 'node_modules|.git' --dirsfirst
    else
        find . -not -path '*/\.git/*' -not -path '*/node_modules/*' | head -30 | sort
    fi
    
    echo -e "\n${BOLD}${CYAN}Next Steps:${NC}"
    echo -e "  ${YELLOW}1.${NC} cd $TARGET_DIR"
    echo -e "  ${YELLOW}2.${NC} npm install"
    echo -e "  ${YELLOW}3.${NC} npm start"
    echo -e "  ${YELLOW}4.${NC} Open http://localhost:3000 in your browser"
    
    echo -e "\n${BOLD}${CYAN}Push to GitHub:${NC}"
    echo -e "  ${YELLOW}1.${NC} Create new repository at: ${BLUE}https://github.com/new${NC}"
    echo -e "  ${YELLOW}2.${NC} git remote add origin https://github.com/YOUR_USERNAME/medmicro-pwa.git"
    echo -e "  ${YELLOW}3.${NC} git push -u origin main"
    
    echo -e "\n${BOLD}${CYAN}Deploy to Production:${NC}"
    echo -e "  ${YELLOW}•${NC} Oracle Cloud: See ${BOLD}ORACLE_DEPLOY.md${NC}"
    echo -e "  ${YELLOW}•${NC} HTTPS Setup: See ${BOLD}CLOUDFLARE.md${NC}"
    echo -e "  ${YELLOW}•${NC} Full docs: See ${BOLD}README.md${NC}"
    
    echo -e "\n${GREEN}${BOLD}🎉 Your MedMicro PWA is ready to deploy! 🎉${NC}\n"
}

create_all_files() {

    # Create: .env.example
    create_file ".env.example"
    cat > ".env.example" << 'EOF_1__env_example'
# MedMicro PWA Environment Configuration

# Server Configuration
PORT=3000
NODE_ENV=production

# Optional: Add your domain if using Cloudflare
# DOMAIN=medmicro.yourdomain.com

EOF_1__env_example

    # Create: .gitignore
    create_file ".gitignore"
    cat > ".gitignore" << 'EOF_2__gitignore'
# Dependencies
node_modules/
package-lock.json
yarn.lock

# Environment
.env
.env.local
.env.*.local

# Logs
logs/
*.log
npm-debug.log*

# Runtime
pids/
*.pid
*.seed
*.pid.lock

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Build
dist/
build/

# PM2
.pm2/
ecosystem.config.js

# Temporary
tmp/
temp/

EOF_2__gitignore

    # Create: CLOUDFLARE.md
    create_file "CLOUDFLARE.md"
    cat > "CLOUDFLARE.md" << 'EOF_3_CLOUDFLARE_md'
# Cloudflare Setup for MedMicro PWA

This guide shows you how to set up Cloudflare for your MedMicro PWA to get:
- ✅ **Free HTTPS** (SSL certificate)
- ✅ **Custom domain** (medmicro.yourdomain.com)
- ✅ **CDN** (Fast global access)
- ✅ **DDoS protection**
- ✅ **Required for iOS PWA** (iOS requires HTTPS for install)

---

## Option 1: Cloudflare Tunnel (Recommended - Free HTTPS!)

Cloudflare Tunnel gives you HTTPS **without opening any ports** on your VPS.

### Step 1: Install Cloudflared on Your VPS

SSH into your VPS and run:

```bash
# Download cloudflared
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb

# Install
sudo dpkg -i cloudflared-linux-amd64.deb

# Verify installation
cloudflared --version
```

### Step 2: Authenticate with Cloudflare

```bash
cloudflared tunnel login
```

This will open a browser window. Log in to Cloudflare and select your domain.

### Step 3: Create a Tunnel

```bash
# Create tunnel
cloudflared tunnel create medmicro-pwa

# You'll see output like:
# Created tunnel medmicro-pwa with id: abc123-def456-ghi789
# Copy this tunnel ID!
```

### Step 4: Configure the Tunnel

Create a configuration file:

```bash
# Create config directory
mkdir -p ~/.cloudflared

# Create config file
nano ~/.cloudflared/config.yml
```

Add this content (replace `TUNNEL_ID` with your actual tunnel ID from step 3):

```yaml
tunnel: TUNNEL_ID
credentials-file: /home/YOUR_USERNAME/.cloudflared/TUNNEL_ID.json

ingress:
  - hostname: medmicro.yourdomain.com
    service: http://localhost:3000
  - service: http_status:404
```

**Replace:**
- `TUNNEL_ID` with your tunnel ID
- `YOUR_USERNAME` with your VPS username
- `medmicro.yourdomain.com` with your actual subdomain

### Step 5: Route DNS

```bash
cloudflared tunnel route dns medmicro-pwa medmicro.yourdomain.com
```

### Step 6: Run the Tunnel

```bash
# Test run first
cloudflared tunnel run medmicro-pwa

# If it works, press Ctrl+C and set it up as a service
sudo cloudflared service install
sudo systemctl enable cloudflared
sudo systemctl start cloudflared
```

### Step 7: Verify

Visit `https://medmicro.yourdomain.com` - Your PWA should load with HTTPS! 🎉

---

## Option 2: Cloudflare DNS + Proxy (Traditional Setup)

### Prerequisites

- A domain name (e.g., yourdomain.com from Namecheap, Google Domains, etc.)
- Cloudflare account (free)

### Step 1: Add Domain to Cloudflare

1. Go to https://dash.cloudflare.com
2. Click "Add a Site"
3. Enter your domain name
4. Select the Free plan
5. Cloudflare will scan your DNS records

### Step 2: Update Nameservers

1. Cloudflare will give you 2 nameservers:
   ```
   jim.ns.cloudflare.com
   vida.ns.cloudflare.com
   ```

2. Go to your domain registrar (Namecheap, Google Domains, etc.)
3. Change nameservers to Cloudflare's nameservers
4. Wait for propagation (can take up to 24 hours, usually much faster)

### Step 3: Add DNS Record

In Cloudflare DNS settings:

1. Click "Add record"
2. Type: **A**
3. Name: **medmicro** (or @ for root domain)
4. IPv4 address: **Your VPS IP**
5. Proxy status: **Proxied** (orange cloud)
6. TTL: **Auto**
7. Click "Save"

### Step 4: Configure SSL/TLS

1. Go to SSL/TLS in Cloudflare dashboard
2. Set SSL/TLS encryption mode to: **Flexible** or **Full**
   - **Flexible**: HTTP between Cloudflare and your server (easier)
   - **Full**: HTTPS between Cloudflare and your server (more secure)

### Step 5: Enable HTTPS Redirect

1. Go to SSL/TLS → Edge Certificates
2. Enable "Always Use HTTPS"
3. Enable "Automatic HTTPS Rewrites"

### Step 6: (Optional) Enable HTTP/2

1. Go to Speed → Optimization
2. Enable HTTP/2

### Step 7: Test Your Site

Visit:
- `http://medmicro.yourdomain.com` → Should redirect to HTTPS
- `https://medmicro.yourdomain.com` → Should load your PWA with padlock icon

---

## Option 3: Cloudflare SSL for Your VPS (Advanced)

If you want end-to-end encryption (Full SSL):

### Step 1: Generate Origin Certificate

1. In Cloudflare: SSL/TLS → Origin Server
2. Click "Create Certificate"
3. Leave defaults, click "Create"
4. Copy both the certificate and private key

### Step 2: Install Certificate on VPS

```bash
# Create SSL directory
sudo mkdir -p /etc/ssl/cloudflare

# Create certificate file
sudo nano /etc/ssl/cloudflare/cert.pem
# Paste the certificate

# Create private key file
sudo nano /etc/ssl/cloudflare/key.pem
# Paste the private key

# Secure the files
sudo chmod 600 /etc/ssl/cloudflare/key.pem
```

### Step 3: Configure Node.js for HTTPS

Update `server/index.js`:

```javascript
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('/etc/ssl/cloudflare/key.pem'),
  cert: fs.readFileSync('/etc/ssl/cloudflare/cert.pem')
};

// Instead of app.listen(), use:
https.createServer(options, app).listen(3000, () => {
  console.log('HTTPS Server running on port 3000');
});
```

### Step 4: Restart Your App

```bash
pm2 restart medmicro-pwa
```

### Step 5: Set Cloudflare to Full (Strict)

In Cloudflare: SSL/TLS → Set to **Full (strict)**

---

## Testing Your PWA

### Desktop

1. Visit your domain: `https://medmicro.yourdomain.com`
2. You should see a padlock icon (secure)
3. Chrome should show an install button in the address bar

### Mobile (Android)

1. Open Chrome on Android
2. Visit `https://medmicro.yourdomain.com`
3. Tap the install banner or "Add to Home Screen"
4. App icon appears on home screen!

### Mobile (iOS)

1. Open Safari on iPhone/iPad
2. Visit `https://medmicro.yourdomain.com`
3. Tap Share button
4. Tap "Add to Home Screen"
5. App icon appears on home screen!

**Note:** iOS requires HTTPS for PWA installation!

---

## Troubleshooting

### "Too many redirects" error

**Solution:** Set SSL/TLS mode to "Flexible" in Cloudflare

### Certificate error

**Solution:**
1. Make sure SSL/TLS is set to "Flexible" or "Full"
2. Wait a few minutes for SSL certificate to provision
3. Clear browser cache

### PWA not installing on iOS

**Solution:**
1. Verify HTTPS is working (padlock icon)
2. Check manifest.json is accessible
3. Check service worker is registered
4. iOS requires `display: "standalone"` in manifest

### Cloudflare showing "Error 522"

**Solution:**
1. Your VPS server is down - check `pm2 list`
2. Port 3000 not open - check firewall
3. App crashed - check `pm2 logs medmicro-pwa`

---

## Performance Optimization

### Enable Caching

In Cloudflare:
1. Go to Caching → Configuration
2. Set caching level to "Standard"
3. Add page rules:
   - `medmicro.yourdomain.com/icons/*` → Cache Everything
   - `medmicro.yourdomain.com/*.js` → Cache Everything
   - `medmicro.yourdomain.com/*.css` → Cache Everything

### Enable Brotli Compression

1. Go to Speed → Optimization
2. Enable Brotli compression

### Enable Rocket Loader

1. Go to Speed → Optimization
2. Enable Rocket Loader (optional - test first)

---

## Security Best Practices

1. **Enable Under Attack Mode** (if under DDoS):
   - Firewall → Settings → Under Attack Mode

2. **Add Firewall Rules**:
   - Block bad countries/IPs if needed
   - Firewall → Firewall Rules

3. **Enable Bot Fight Mode**:
   - Firewall → Bots → Enable

4. **Set Security Level**:
   - Firewall → Settings → Security Level: Medium

---

## Cost Breakdown

| Service | Cost |
|---------|------|
| Cloudflare (Free Plan) | $0/month |
| Cloudflare Tunnel | $0 (included) |
| SSL Certificate | $0 (auto-provided) |
| CDN & DDoS Protection | $0 (included) |
| **Total** | **$0/month** 🎉 |

---

## Summary

**Easiest Method:** Cloudflare Tunnel
- ✅ No port forwarding needed
- ✅ Automatic HTTPS
- ✅ Works behind NAT/firewall
- ✅ One command setup

**Traditional Method:** Cloudflare DNS + Proxy
- ✅ More control
- ✅ Standard setup
- ✅ Works with any hosting

**Both give you:**
- Free HTTPS certificate
- Global CDN
- DDoS protection
- Required for iOS PWA installation

---

## Need Help?

1. Check Cloudflare status: https://www.cloudflarestatus.com
2. Cloudflare Community: https://community.cloudflare.com
3. Test DNS propagation: https://dnschecker.org

Your PWA will now work worldwide with HTTPS! 🌍🔒

EOF_3_CLOUDFLARE_md

    # Create: GET_TO_MAC.md
    create_file "GET_TO_MAC.md"
    cat > "GET_TO_MAC.md" << 'EOF_4_GET_TO_MAC_md'
# How to Get MedMicro PWA to Your Mac

## Method 1: Via GitHub (Recommended - 2 minutes)

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `medmicro`
3. Description: "MedMicro Progressive Web App - Medical Reference"
4. Make it Public or Private (your choice)
5. **DO NOT** check "Initialize with README"
6. Click "Create repository"

### Step 2: Push from Claude Environment

GitHub will show you commands. You'll need to provide me:
- Your GitHub username
- Repository URL

Then I'll push the code to GitHub for you.

### Step 3: Clone to Your Mac

On your Mac Terminal:

```bash
# Navigate to where you want the project
cd ~/Projects  # or wherever you want

# Clone from GitHub (replace YOUR_USERNAME)
git clone https://github.com/YOUR_USERNAME/medmicro.git

# Enter the directory
cd medmicro

# Done! All files are now on your Mac
```

---

## Method 2: Manual Copy (If you prefer)

If you don't want to use GitHub yet, I can provide you with all the file contents and you can create them manually on your Mac.

### Step 1: Create Directory Structure on Your Mac

```bash
mkdir -p ~/Projects/medmicro
cd ~/Projects/medmicro

# Create subdirectories
mkdir -p public/icons
mkdir -p server/data/meds
mkdir -p server/data/guidelines
mkdir -p server/data/criteria
mkdir -p server/routes
```

### Step 2: Copy Files

I'll provide the contents of each file in the next message, and you can copy-paste them.

---

## Method 3: Download Archive (Alternative)

I can create a downloadable archive with all files, but this requires Claude Code file download feature.

---

## Which Method Do You Prefer?

**Reply with:**
- **"GitHub"** - I'll help you push to GitHub (fastest and cleanest)
- **"Manual"** - I'll give you all file contents to copy-paste
- **"Download"** - I'll create a downloadable package

**Recommended**: Use GitHub method - it's fastest and you'll have version control!

EOF_4_GET_TO_MAC_md

    # Create: LICENSE
    create_file "LICENSE"
    cat > "LICENSE" << 'EOF_5_LICENSE'
MIT License

Copyright (c) 2026 MedMicro Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

EOF_5_LICENSE

    # Create: ORACLE_DEPLOY.md
    create_file "ORACLE_DEPLOY.md"
    cat > "ORACLE_DEPLOY.md" << 'EOF_6_ORACLE_DEPLOY_md'
# Oracle Cloud Deployment Guide - MedMicro PWA

Complete guide for deploying MedMicro PWA to Oracle Cloud Infrastructure (OCI).

## Your Oracle Cloud VM Details

- **Public IP**: 40.233.116.192
- **OS**: Ubuntu 22.04
- **Username**: ubuntu
- **Shape**: VM.Standard.E2.1.Micro (1 OCPU, 1GB RAM)
- **Region**: ca-toronto-1
- **Cost**: FREE (Oracle Always Free Tier)

## Prerequisites

1. SSH private key that was used to create the instance
2. Telegram bot token from BotFather (if needed)
3. GitHub repository pushed to remote

## Quick Deploy (5 Minutes)

### Step 1: Connect to Your Oracle VM

```bash
# From your Mac
ssh -i /path/to/your-oracle-key.pem ubuntu@40.233.116.192
```

**Replace** `/path/to/your-oracle-key.pem` with your actual key path.

### Step 2: Install Node.js 20

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20 (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version   # Should show v10.x.x
```

### Step 3: Install PM2 Process Manager

```bash
# Install PM2 globally
sudo npm install -g pm2

# Verify installation
pm2 --version
```

### Step 4: Clone and Deploy

```bash
# Clone your repository (replace YOUR_USERNAME)
cd ~
git clone https://github.com/YOUR_USERNAME/medmicro-pwa.git
cd medmicro-pwa

# Install dependencies
npm install --production

# Configure environment (if needed)
cp .env.example .env
nano .env  # Edit if you have custom settings
```

### Step 5: Configure Oracle Firewall

```bash
# Allow port 3000 through Oracle firewall
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 3000 -j ACCEPT
sudo netfilter-persistent save

# Or use firewalld if available
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --reload
```

**Important**: Also add port 3000 in Oracle Cloud Console:
1. Go to Oracle Cloud Console
2. Networking → Virtual Cloud Networks
3. Click your VCN → Security Lists
4. Click "Default Security List"
5. Add Ingress Rule:
   - Source CIDR: `0.0.0.0/0`
   - Destination Port Range: `3000`
   - IP Protocol: TCP

### Step 6: Start with PM2

```bash
# Start the app
pm2 start server/index.js --name "medmicro-pwa"

# Save PM2 configuration
pm2 save

# Setup auto-start on reboot
pm2 startup systemd
# Copy and run the command that PM2 outputs

# Check status
pm2 status
pm2 logs medmicro-pwa
```

### Step 7: Test Your Deployment

```bash
# Test locally
curl http://localhost:3000/health

# Test from your Mac
curl http://40.233.116.192:3000/health
```

Open in browser: http://40.233.116.192:3000

## Setup HTTPS with Cloudflare

### Option 1: Cloudflare Tunnel (Recommended - No Port Forwarding)

```bash
# Install cloudflared
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb

# Login to Cloudflare
cloudflared tunnel login

# Create tunnel
cloudflared tunnel create medmicro

# Configure tunnel
mkdir -p ~/.cloudflared
nano ~/.cloudflared/config.yml
```

Add this configuration:

```yaml
tunnel: <TUNNEL_ID_FROM_PREVIOUS_COMMAND>
credentials-file: /home/ubuntu/.cloudflared/<TUNNEL_ID>.json

ingress:
  - hostname: medmicro.yourdomain.com
    service: http://localhost:3000
  - service: http_status:404
```

Start tunnel:

```bash
# Test tunnel
cloudflared tunnel run medmicro

# Install as service
sudo cloudflared service install
sudo systemctl enable cloudflared
sudo systemctl start cloudflared
```

Add DNS record in Cloudflare dashboard:
- Type: CNAME
- Name: medmicro (or your subdomain)
- Target: `<TUNNEL_ID>.cfargotunnel.com`

### Option 2: Traditional Cloudflare Proxy

1. Add DNS A record in Cloudflare:
   - Type: A
   - Name: medmicro
   - IPv4: 40.233.116.192
   - Proxy: ON (orange cloud)

2. Install Nginx as reverse proxy:

```bash
sudo apt install -y nginx

# Configure Nginx
sudo nano /etc/nginx/sites-available/medmicro
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name medmicro.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable and start:

```bash
sudo ln -s /etc/nginx/sites-available/medmicro /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Allow HTTP/HTTPS through firewall
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
sudo netfilter-persistent save
```

Also add ports 80 and 443 in Oracle Cloud Console Security List.

3. Configure Cloudflare SSL/TLS:
   - Go to SSL/TLS tab
   - Set mode to "Full" (not Full Strict)

## Memory Optimization (1GB RAM)

Your VM has only 1GB RAM. Add swap space:

```bash
# Create 2GB swap file
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Verify
free -h
```

Configure PM2 for low memory:

```bash
# Limit memory usage
pm2 start server/index.js --name "medmicro-pwa" --max-memory-restart 400M

# Save configuration
pm2 save
```

## PM2 Management Commands

```bash
# View logs
pm2 logs medmicro-pwa

# View logs in real-time
pm2 logs medmicro-pwa --lines 100

# Restart application
pm2 restart medmicro-pwa

# Stop application
pm2 stop medmicro-pwa

# Delete application from PM2
pm2 delete medmicro-pwa

# View status and resource usage
pm2 status
pm2 monit

# View detailed info
pm2 info medmicro-pwa
```

## Update Deployment

When you push changes to GitHub:

```bash
# SSH to Oracle VM
ssh -i /path/to/your-key.pem ubuntu@40.233.116.192

# Pull latest changes
cd ~/medmicro-pwa
git pull origin main

# Install any new dependencies
npm install --production

# Restart application
pm2 restart medmicro-pwa

# Clear PM2 logs if needed
pm2 flush
```

## Monitoring and Troubleshooting

### Check Application Status

```bash
# PM2 status
pm2 status

# View logs
pm2 logs medmicro-pwa --lines 50

# Check if port is listening
sudo netstat -tlnp | grep 3000

# Test health endpoint
curl http://localhost:3000/health
```

### Common Issues

**Issue**: Application not starting

```bash
# Check PM2 logs
pm2 logs medmicro-pwa --err

# Try starting manually to see errors
cd ~/medmicro-pwa
node server/index.js
```

**Issue**: Can't access from browser

```bash
# Check firewall
sudo iptables -L -n | grep 3000

# Check Oracle Cloud security list
# Go to OCI Console → VCN → Security Lists

# Test locally first
curl http://localhost:3000/health
```

**Issue**: Out of memory

```bash
# Check memory
free -h

# Add swap if not already added (see Memory Optimization section)

# Restart with memory limit
pm2 restart medmicro-pwa --max-memory-restart 400M
pm2 save
```

**Issue**: PM2 not starting on reboot

```bash
# Re-run startup command
pm2 startup systemd

# Copy and execute the command it outputs
# Then save PM2 list
pm2 save
```

## Security Best Practices

1. **Keep system updated**:
```bash
sudo apt update && sudo apt upgrade -y
```

2. **Enable automatic security updates**:
```bash
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

3. **Setup UFW firewall** (alternative to iptables):
```bash
sudo ufw allow ssh
sudo ufw allow 3000/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

4. **Disable password authentication** (SSH key only):
```bash
sudo nano /etc/ssh/sshd_config
# Set: PasswordAuthentication no
sudo systemctl restart sshd
```

## Performance Optimization

### Enable gzip compression (already in code via compression middleware)

### Configure PM2 cluster mode (if needed more performance):

```bash
# Stop current instance
pm2 delete medmicro-pwa

# Start in cluster mode (use all CPU cores)
pm2 start server/index.js -i max --name "medmicro-pwa"

# Save configuration
pm2 save
```

**Note**: For 1 OCPU VM, this won't provide much benefit. Better for multi-core systems.

## Backup Strategy

### Backup PM2 configuration:

```bash
# Save PM2 ecosystem
pm2 save

# Backup to GitHub
cd ~/medmicro-pwa
git add -A
git commit -m "Update configuration"
git push origin main
```

### Backup data files (if you add user data):

```bash
# Create backup script
mkdir -p ~/backups

# Manual backup
tar -czf ~/backups/medmicro-backup-$(date +%Y%m%d).tar.gz ~/medmicro-pwa/server/data/

# Automated daily backup (crontab)
crontab -e
# Add: 0 2 * * * tar -czf ~/backups/medmicro-backup-$(date +\%Y\%m\%d).tar.gz ~/medmicro-pwa/server/data/
```

## Cost Analysis

**Oracle Cloud Always Free Tier**:
- ✅ 2 VMs (VM.Standard.E2.1.Micro) - FREE FOREVER
- ✅ 1 OCPU, 1GB RAM each
- ✅ 100GB boot volume
- ✅ 10TB outbound data transfer/month
- ✅ No credit card expiration

**Your Current Usage**:
- 1 VM for MedMicro PWA: $0/month
- Perfect for this lightweight application

**Cloudflare**:
- Free plan includes:
  - Unlimited sites
  - Free SSL certificates
  - DDoS protection
  - CDN with caching
  - Cloudflare Tunnel (no port forwarding needed)

**Total Monthly Cost**: $0 🎉

## Next Steps

1. ✅ Deploy application to Oracle Cloud
2. ✅ Configure PM2 for auto-restart
3. ✅ Setup firewall rules
4. ✅ Add swap space for memory
5. ⏳ Setup Cloudflare for HTTPS
6. ⏳ Configure custom domain
7. ⏳ Setup monitoring and alerts
8. ⏳ Configure automated backups

## Support

If you encounter issues:

1. Check PM2 logs: `pm2 logs medmicro-pwa`
2. Check system logs: `sudo journalctl -xe`
3. Test health endpoint: `curl http://localhost:3000/health`
4. Verify firewall: `sudo iptables -L -n`
5. Check Oracle Cloud security list in OCI Console

## Summary

Your MedMicro PWA is now running 24/7 on Oracle Cloud at **NO COST**:

- 🌐 Access: http://40.233.116.192:3000
- 🔄 Auto-restart on failure
- 📊 Monitoring with PM2
- 🚀 Deploying updates: `git pull && pm2 restart medmicro-pwa`
- 💰 Cost: $0/month (Oracle Always Free)

Next: Setup Cloudflare for HTTPS and custom domain! 🎯

EOF_6_ORACLE_DEPLOY_md

    # Create: PUSH_TO_GITHUB.sh
    create_file "PUSH_TO_GITHUB.sh"
    cat > "PUSH_TO_GITHUB.sh" << 'EOF_7_PUSH_TO_GITHUB_sh'
#!/bin/bash

#####################################################################
# Push MedMicro PWA to GitHub from Your Mac
# Run this script on your Mac after copying the project files
#####################################################################

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     Push MedMicro PWA to GitHub                        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}\n"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: package.json not found. Are you in the medmicro directory?${NC}"
    exit 1
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}Initializing git repository...${NC}"
    git init
    git branch -M main
fi

# Add all files
echo -e "${BLUE}Adding files to git...${NC}"
git add -A

# Create commit if needed
if git diff-index --quiet HEAD -- 2>/dev/null; then
    echo -e "${GREEN}✓ All files already committed${NC}"
else
    echo -e "${BLUE}Creating commit...${NC}"
    git commit -m "Initial commit: MedMicro PWA

- Express server with REST API
- Progressive Web App with offline support
- 11 medications, 9 clinical guidelines, 5 DSM-5 criteria
- Clinical calculators (PHQ-9, GAD-7, BMI)
- Oracle Cloud deployment automation
- Cloudflare HTTPS setup documentation
- Installable on Android, iOS, desktop

https://github.com/sarwarkaiser/medmicro-web"
    echo -e "${GREEN}✓ Commit created${NC}"
fi

# Add remote
echo -e "${BLUE}Adding GitHub remote...${NC}"
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/sarwarkaiser/medmicro-web.git
echo -e "${GREEN}✓ Remote added${NC}"

# Push to GitHub
echo -e "${BLUE}Pushing to GitHub...${NC}"
git push -u origin main

if [ $? -eq 0 ]; then
    echo -e "\n${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║     ✓ Successfully pushed to GitHub!                   ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}\n"

    echo -e "${BLUE}View your repository:${NC}"
    echo -e "${GREEN}https://github.com/sarwarkaiser/medmicro-web${NC}\n"
else
    echo -e "\n${YELLOW}If push failed, you may need to authenticate with GitHub.${NC}"
    echo -e "${YELLOW}Run: gh auth login${NC}"
    echo -e "${YELLOW}Or configure your GitHub credentials.${NC}\n"
fi

EOF_7_PUSH_TO_GITHUB_sh

    # Create: README.md
    create_file "README.md"
    cat > "README.md" << 'EOF_8_README_md'
# MedMicro PWA 🏥

> **Standalone Progressive Web App** for medical reference - medications, guidelines, DSM-5 criteria, and clinical calculators.

**Installable on any device** - Android, iOS, or desktop. Works offline!

---

## ✨ Features

### 📱 Progressive Web App
- ✅ Install on home screen (Android & iOS)
- ✅ Works offline after first load
- ✅ Fast loading with service worker caching
- ✅ Native app-like experience
- ✅ No app store required

### 💊 Clinical Content
- **Medications**: 11 medications with detailed dosing, Canadian clinical guidelines
- **Guidelines**: 9 psychiatry guidelines (APA, CANMAT, NICE)
- **DSM-5 Criteria**: 5 diagnostic criteria (MDD, Bipolar, Schizophrenia, GAD, Panic)
- **Calculators**: PHQ-9, GAD-7, BMI

### 🎯 User Experience
- Real-time search across medications and guidelines
- Category filters (SSRIs, SNRIs, Antipsychotics, Mood Stabilizers)
- Detailed modal views
- Mobile-first responsive design
- Dark mode support (auto-detects system preference)

---

## 🚀 Quick Start

### Local Development

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/medmicro-pwa.git
cd medmicro-pwa

# Install dependencies
npm install

# Start development server
npm run dev

# Or production mode
npm start
```

Visit `http://localhost:3000` to see your PWA!

---

## 📦 Deployment

### Option 1: Deploy to VPS (Automated)

```bash
# Make deployment script executable
chmod +x deploy-vps.sh

# Run deployment
./deploy-vps.sh
```

The script will:
- Install Node.js and PM2
- Clone/update repository
- Install dependencies
- Configure firewall
- Start app with PM2
- Set up auto-restart on reboot

### Option 2: Manual Deployment

```bash
# SSH to your VPS
ssh user@your-vps-ip

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repository
git clone https://github.com/YOUR_USERNAME/medmicro-pwa.git
cd medmicro-pwa

# Install dependencies
npm install --production

# Create .env file
cp .env.example .env

# Install PM2 globally
sudo npm install -g pm2

# Start application
pm2 start server/index.js --name "medmicro-pwa"
pm2 save
pm2 startup

# Open firewall
sudo ufw allow 3000/tcp
```

### Option 3: Docker (Coming Soon)

```bash
docker build -t medmicro-pwa .
docker run -p 3000:3000 medmicro-pwa
```

---

## 🌐 Cloudflare Setup (HTTPS)

For production deployment with HTTPS and custom domain:

**See [CLOUDFLARE.md](./CLOUDFLARE.md)** for detailed instructions.

Quick summary:
1. Add your domain to Cloudflare
2. Point DNS to your VPS
3. Enable SSL/TLS (Flexible or Full)
4. Or use Cloudflare Tunnel for easier setup

**Why Cloudflare?**
- ✅ Free HTTPS certificate
- ✅ Global CDN (faster loading)
- ✅ DDoS protection
- ✅ Required for iOS PWA installation

---

## 📂 Project Structure

```
medmicro-pwa/
├── server/
│   ├── index.js           # Express server
│   ├── routes/
│   │   └── api.js         # API endpoints
│   └── data/
│       ├── meds/          # Medication JSON files (11)
│       ├── guidelines/    # Guideline markdown files (9)
│       └── criteria/      # DSM-5 criteria JSON (5)
├── public/
│   ├── index.html         # Main PWA HTML
│   ├── app.js             # PWA JavaScript
│   ├── app.css            # Styles
│   ├── sw.js              # Service worker
│   ├── manifest.json      # PWA manifest
│   └── icons/             # App icons (8 sizes)
├── package.json
├── .env.example
├── .gitignore
├── README.md
├── CLOUDFLARE.md
└── deploy-vps.sh
```

---

## 🔧 API Endpoints

All endpoints return JSON: `{ success: boolean, data: any }`

### Medications
```
GET  /api/meds                    # Get all medications
GET  /api/meds/search?q=[query]   # Search medications
GET  /api/meds/class/[class]      # Get by class (ssri, snri, etc.)
```

### Guidelines
```
GET  /api/guidelines              # Get all guidelines
GET  /api/guidelines?q=[query]    # Search guidelines
```

### Criteria
```
GET  /api/criteria/[disorder]     # Get DSM-5 criteria
```

### Calculators
```
POST /api/calc/phq9               # Body: { score: number }
POST /api/calc/gad7               # Body: { score: number }
POST /api/calc/bmi                # Body: { weight: number, height: number }
```

---

## 🎨 Customization

### Change App Colors

Edit `public/manifest.json`:
```json
{
  "theme_color": "#3b82f6",      // Header/status bar color
  "background_color": "#ffffff"   // Loading screen color
}
```

Edit `public/app.css`:
```css
:root {
  --primary-color: #3b82f6;      // Main brand color
  --primary-dark: #2563eb;       // Darker shade
}
```

### Change App Name

Edit `public/manifest.json`:
```json
{
  "name": "Your App Name",
  "short_name": "YourApp"         // Home screen name
}
```

### Add Custom Icons

1. Create 512x512px icon
2. Use [PWA Builder](https://www.pwabuilder.com/imageGenerator)
3. Download generated icons
4. Replace files in `public/icons/`

### Add More Medications

1. Create JSON file in `server/data/meds/`
2. Follow the schema from existing files
3. Restart server: `pm2 restart medmicro-pwa`

### Add More Guidelines

1. Create Markdown file in `server/data/guidelines/`
2. Add frontmatter (title, organization, year)
3. Write content in markdown
4. Restart server

---

## 📱 Installing as PWA

### On Android (Chrome)
1. Visit your PWA URL
2. Tap install banner, or
3. Menu → "Add to Home Screen"
4. App appears on home screen!

### On iOS (Safari)
1. Visit your PWA URL
2. Tap Share button
3. Tap "Add to Home Screen"
4. App appears on home screen!

**Note:** iOS requires HTTPS for installation!

### On Desktop (Chrome/Edge)
1. Visit your PWA URL
2. Click install button in address bar
3. App opens in its own window

---

## 🛠️ Development

### Run Development Server

```bash
npm run dev
```

Auto-restarts on file changes.

### Add New Dependencies

```bash
npm install package-name
npm install --save-dev dev-package-name
```

### Debugging

```bash
# View logs
pm2 logs medmicro-pwa

# Check status
pm2 status

# Restart after changes
pm2 restart medmicro-pwa

# Stop
pm2 stop medmicro-pwa
```

---

## 🔒 Security

### HTTPS Required

For production and iOS installation, **HTTPS is required**. Use Cloudflare (see [CLOUDFLARE.md](./CLOUDFLARE.md)).

### Environment Variables

Never commit `.env` to Git. Use `.env.example` as template.

### Firewall

Only open necessary ports:
- Port 3000 for HTTP
- Port 22 for SSH
- Port 443 for HTTPS (if using Cloudflare Tunnel, not needed)

---

## 📊 Performance

### Service Worker Caching

The PWA caches:
- All static assets (HTML, CSS, JS)
- App icons
- API responses (for offline use)

### Offline Functionality

After first visit:
- ✅ Browse cached medications
- ✅ Browse cached guidelines
- ✅ Use calculators
- ❌ Cannot fetch new data (shows cached)

---

## 🐛 Troubleshooting

### PWA not installing

**Check:**
1. HTTPS is enabled (required for iOS)
2. manifest.json loads correctly
3. Service worker registers
4. Icons are accessible

### API returning 404

**Check:**
1. Server is running: `pm2 status`
2. Data files exist in `server/data/`
3. Port 3000 is open in firewall

### Changes not reflecting

**Solutions:**
```bash
# Clear service worker cache
# In browser DevTools → Application → Clear storage

# Restart server
pm2 restart medmicro-pwa

# Update service worker version
# Edit public/sw.js → Increment CACHE_NAME version
```

### Can't access from phone

**Check:**
1. Phone and server on same network (local testing)
2. Firewall allows port 3000
3. Use VPS public IP or domain, not localhost

---

## 🚢 Production Checklist

Before going live:

- [ ] Set `NODE_ENV=production` in `.env`
- [ ] Configure Cloudflare for HTTPS
- [ ] Set up custom domain
- [ ] Test PWA installation on Android & iOS
- [ ] Enable firewall (UFW or iptables)
- [ ] Set up PM2 to start on boot
- [ ] Configure automatic backups
- [ ] Test offline functionality
- [ ] Verify all API endpoints work
- [ ] Check service worker caching

---

## 📈 Monitoring

### Check Server Status

```bash
# PM2 status
pm2 status

# View logs
pm2 logs medmicro-pwa --lines 100

# Monitor in real-time
pm2 monit
```

### Health Check Endpoint

```bash
curl http://your-domain.com/health
```

Returns:
```json
{
  "status": "healthy",
  "uptime": 123456,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production"
}
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

---

## 📝 License

MIT License - See LICENSE file

---

## 🙏 Acknowledgments

- Medical content curated for psychiatry residents
- PWA best practices from web.dev
- Icons from public domain medical resources

---

## 📞 Support

- **Issues:** GitHub Issues
- **Documentation:** See markdown files in repository
- **Deployment Help:** See CLOUDFLARE.md for HTTPS setup

---

## 🎯 Roadmap

- [ ] User authentication
- [ ] Personal favorites
- [ ] Search history
- [ ] More medications and guidelines
- [ ] Drug interaction checker
- [ ] Docker support
- [ ] CI/CD pipeline
- [ ] Automated backups

---

**Made with ❤️ for medical residents**

Access your PWA at: `https://your-domain.com`

Install it on your phone for quick clinical reference! 📱

EOF_8_README_md

    # Create: deploy-oracle.sh
    create_file "deploy-oracle.sh"
    cat > "deploy-oracle.sh" << 'EOF_9_deploy_oracle_sh'
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

EOF_9_deploy_oracle_sh

    # Create: deploy-vps.sh
    create_file "deploy-vps.sh"
    cat > "deploy-vps.sh" << 'EOF_10_deploy_vps_sh'
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

EOF_10_deploy_vps_sh

    # Create: package.json
    create_file "package.json"
    cat > "package.json" << 'EOF_11_package_json'
{
  "name": "medmicro-pwa",
  "version": "1.0.0",
  "description": "MedMicro Progressive Web App - Medical reference for residents",
  "main": "server/index.js",
  "scripts": {
    "start": "node server/index.js",
    "dev": "nodemon server/index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [
    "medical",
    "pwa",
    "progressive-web-app",
    "psychiatry",
    "medications",
    "guidelines"
  ],
  "author": "MedMicro Team",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "compression": "^1.7.4",
    "helmet": "^7.1.0",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}

EOF_11_package_json

    # Create: public/app.css
    create_file "public/app.css"
    cat > "public/app.css" << 'EOF_12_public_app_css'
/* MedMicro PWA Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --primary-color: #3b82f6;
    --primary-dark: #2563eb;
    --secondary-color: #10b981;
    --danger-color: #ef4444;
    --text-color: #1f2937;
    --text-light: #6b7280;
    --bg-color: #f9fafb;
    --card-bg: #ffffff;
    --border-color: #e5e7eb;
    --shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.15);
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background-color: var(--bg-color);
    color: var(--text-color);
    line-height: 1.6;
    overflow-x: hidden;
}

#app {
    max-width: 100%;
    margin: 0 auto;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

/* Header */
.app-header {
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
    color: white;
    padding: 1.5rem 1rem 1rem;
    box-shadow: var(--shadow);
}

.header-content h1 {
    font-size: 1.75rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
}

.header-subtitle {
    font-size: 0.875rem;
    opacity: 0.9;
}

/* Search */
.search-container {
    padding: 1rem;
    background-color: white;
    box-shadow: var(--shadow);
}

.search-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 2px solid var(--border-color);
    border-radius: 12px;
    font-size: 1rem;
    transition: border-color 0.3s;
}

.search-input:focus {
    outline: none;
    border-color: var(--primary-color);
}

/* Tabs */
.tabs {
    display: flex;
    background-color: white;
    border-bottom: 1px solid var(--border-color);
    position: sticky;
    top: 0;
    z-index: 10;
}

.tab {
    flex: 1;
    padding: 0.75rem 0.5rem;
    border: none;
    background: none;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    color: var(--text-light);
    transition: all 0.3s;
    border-bottom: 3px solid transparent;
}

.tab.active {
    color: var(--primary-color);
    border-bottom-color: var(--primary-color);
}

.tab-icon {
    font-size: 1.5rem;
}

.tab-label {
    font-size: 0.75rem;
    font-weight: 500;
}

/* Content */
.content {
    flex: 1;
    padding: 1rem;
}

.tab-content {
    display: none;
    animation: fadeIn 0.3s;
}

.tab-content.active {
    display: block;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

/* Category Pills */
.category-pills {
    display: flex;
    gap: 0.5rem;
    overflow-x: auto;
    padding-bottom: 1rem;
    margin-bottom: 1rem;
    -webkit-overflow-scrolling: touch;
}

.category-pills::-webkit-scrollbar {
    display: none;
}

.pill {
    padding: 0.5rem 1rem;
    border: 2px solid var(--border-color);
    background-color: white;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.3s;
}

.pill.active {
    background-color: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

/* Card List */
.card-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.card, .criteria-card, .calc-card {
    background-color: var(--card-bg);
    border-radius: 12px;
    padding: 1rem;
    box-shadow: var(--shadow);
    cursor: pointer;
    transition: all 0.3s;
}

.card:active, .criteria-card:active {
    transform: scale(0.98);
    box-shadow: none;
}

.card h3, .criteria-card h3, .calc-card h3 {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--text-color);
}

.card-meta {
    font-size: 0.875rem;
    color: var(--text-light);
    margin-bottom: 0.5rem;
}

.card-tags {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-top: 0.5rem;
}

.tag {
    padding: 0.25rem 0.75rem;
    background-color: var(--bg-color);
    border-radius: 12px;
    font-size: 0.75rem;
    color: var(--text-light);
}

.card-dose {
    margin-top: 0.75rem;
    padding: 0.75rem;
    background-color: var(--bg-color);
    border-radius: 8px;
    font-size: 0.875rem;
}

.card-dose strong {
    color: var(--primary-color);
}

/* Calculator Cards */
.calc-card {
    cursor: default;
}

.calc-input {
    width: 100%;
    padding: 0.75rem;
    margin: 0.5rem 0;
    border: 2px solid var(--border-color);
    border-radius: 8px;
    font-size: 1rem;
}

.calc-input:focus {
    outline: none;
    border-color: var(--primary-color);
}

.btn-primary {
    width: 100%;
    padding: 0.75rem;
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s;
}

.btn-primary:active {
    background-color: var(--primary-dark);
}

.calc-result {
    margin-top: 1rem;
    padding: 1rem;
    background-color: var(--bg-color);
    border-radius: 8px;
    font-size: 0.875rem;
    display: none;
}

.calc-result.show {
    display: block;
}

.calc-result strong {
    color: var(--primary-color);
}

/* Modal */
.modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    animation: fadeIn 0.3s;
}

.modal.show {
    display: flex;
    align-items: flex-end;
}

.modal-content {
    background-color: white;
    width: 100%;
    max-height: 80vh;
    border-radius: 20px 20px 0 0;
    padding: 1.5rem;
    overflow-y: auto;
    position: relative;
    animation: slideUp 0.3s;
}

@keyframes slideUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
}

.modal-close {
    position: sticky;
    top: 0;
    right: 0;
    float: right;
    font-size: 2rem;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-light);
    line-height: 1;
}

#modal-body {
    clear: both;
    padding-top: 1rem;
}

#modal-body h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: var(--primary-color);
}

#modal-body h3 {
    font-size: 1.125rem;
    margin: 1.5rem 0 0.75rem;
    color: var(--text-color);
}

#modal-body ul, #modal-body ol {
    margin-left: 1.5rem;
    margin-bottom: 1rem;
}

#modal-body li {
    margin-bottom: 0.5rem;
}

/* Loading */
.loading {
    text-align: center;
    padding: 2rem;
    color: var(--text-light);
}

/* Install Prompt */
.install-prompt {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: var(--primary-color);
    color: white;
    padding: 1rem;
    box-shadow: var(--shadow-lg);
    z-index: 999;
    animation: slideUp 0.3s;
}

.install-prompt.hidden {
    display: none;
}

.install-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    max-width: 600px;
    margin: 0 auto;
}

.btn-install {
    padding: 0.5rem 1rem;
    background-color: white;
    color: var(--primary-color);
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
}

.btn-dismiss {
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Responsive */
@media (min-width: 768px) {
    #app {
        max-width: 600px;
    }

    .modal.show {
        align-items: center;
    }

    .modal-content {
        max-height: 90vh;
        border-radius: 20px;
    }
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
    :root {
        --text-color: #f3f4f6;
        --text-light: #9ca3af;
        --bg-color: #111827;
        --card-bg: #1f2937;
        --border-color: #374151;
    }

    .search-container, .tabs {
        background-color: var(--card-bg);
    }
}

EOF_12_public_app_css

    # Create: public/app.js
    create_file "public/app.js"
    cat > "public/app.js" << 'EOF_13_public_app_js'
// MedMicro PWA JavaScript

// State
let allMeds = [];
let allGuidelines = [];
let currentMedClass = 'all';
let currentGuidelineCategory = '';
let deferredPrompt = null;

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    console.log('MedMicro PWA initializing...');

    // Register service worker
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('Service Worker registered:', registration);
        } catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    }

    // Install prompt handler
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        showInstallPrompt();
    });

    // Tab switching
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });

    // Search
    document.getElementById('searchInput').addEventListener('input', handleSearch);

    // Med class filters
    document.querySelectorAll('#meds-tab .pill').forEach(pill => {
        pill.addEventListener('click', () => filterMeds(pill.dataset.class));
    });

    // Guideline category filters
    document.querySelectorAll('#guidelines-tab .pill').forEach(pill => {
        pill.addEventListener('click', () => filterGuidelines(pill.dataset.category));
    });

    // Criteria cards
    document.querySelectorAll('.criteria-card').forEach(card => {
        card.addEventListener('click', () => showCriteria(card.dataset.disorder));
    });

    // Load data
    await loadMeds();
    await loadGuidelines();
});

// Tab switching
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update content
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

// Search
function handleSearch(e) {
    const query = e.target.value.toLowerCase();

    // Search meds
    const medCards = document.querySelectorAll('#meds-list .card');
    medCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(query) ? 'block' : 'none';
    });

    // Search guidelines
    const guidelineCards = document.querySelectorAll('#guidelines-list .card');
    guidelineCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(query) ? 'block' : 'none';
    });
}

// Load medications
async function loadMeds() {
    try {
        const response = await fetch('/api/meds');
        const data = await response.json();

        if (data.success) {
            allMeds = data.data;
            renderMeds(allMeds);
        }
    } catch (error) {
        console.error('Failed to load meds:', error);
        document.getElementById('meds-list').innerHTML = '<div class="loading">Failed to load medications</div>';
    }
}

// Render medications
function renderMeds(meds) {
    const container = document.getElementById('meds-list');

    if (meds.length === 0) {
        container.innerHTML = '<div class="loading">No medications found</div>';
        return;
    }

    container.innerHTML = meds.map(med => `
        <div class="card" onclick="showMed('${med.name.toLowerCase()}')">
            <h3>${med.name}</h3>
            <p class="card-meta">${med.genericName}</p>
            <div class="card-tags">
                ${med.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <div class="card-dose">
                <strong>Maintenance:</strong> ${med.dosing.adult_maintenance}
            </div>
        </div>
    `).join('');
}

// Filter medications by class
function filterMeds(className) {
    // Update active pill
    document.querySelectorAll('#meds-tab .pill').forEach(p => p.classList.remove('active'));
    document.querySelector(`#meds-tab .pill[data-class="${className}"]`).classList.add('active');

    currentMedClass = className;

    if (className === 'all') {
        renderMeds(allMeds);
    } else {
        const filtered = allMeds.filter(med =>
            med.tags.some(tag => tag.toLowerCase().includes(className.toLowerCase()))
        );
        renderMeds(filtered);
    }
}

// Show medication details
async function showMed(medName) {
    try {
        const response = await fetch(`/api/meds/search?q=${medName}`);
        const data = await response.json();

        if (data.success && data.data) {
            const med = data.data;
            let html = `
                <h2>${med.name}</h2>
                <p style="color: #6b7280; margin-bottom: 1rem;">${med.genericName}</p>

                <h3>Class</h3>
                <p>${med.tags.join(', ')}</p>

                <h3>Dosing</h3>
                <ul>
                    <li><strong>Acute:</strong> ${med.dosing.adult_acute}</li>
                    <li><strong>Maintenance:</strong> ${med.dosing.adult_maintenance}</li>
                    ${med.dosing.notes ? `<li><strong>Notes:</strong> ${med.dosing.notes}</li>` : ''}
                </ul>
            `;

            if (med.dosing.canadian_clinical) {
                const can = med.dosing.canadian_clinical;
                html += `
                    <h3>🇨🇦 Canadian Clinical Guidelines</h3>
                    <ul>
                        <li><strong>Starting dose:</strong> ${can.starting_dose}</li>
                        <li><strong>Titration:</strong> ${can.titration_schedule}</li>
                        <li><strong>Max (Evidence):</strong> ${can.max_dose_evidence}</li>
                        <li><strong>Max (Practice):</strong> ${can.max_dose_practice}</li>
                        <li><strong>Inpatient:</strong> ${can.inpatient_strategy}</li>
                        <li><strong>Outpatient:</strong> ${can.outpatient_strategy}</li>
                    </ul>
                `;
            }

            html += `
                <h3>Warnings</h3>
                <ul>
                    ${med.warnings.map(w => `<li>${w}</li>`).join('')}
                </ul>

                <h3>Cautions</h3>
                <ul>
                    <li><strong>Renal:</strong> ${med.cautions.renal}</li>
                    <li><strong>Hepatic:</strong> ${med.cautions.hepatic}</li>
                    <li><strong>Pregnancy:</strong> ${med.cautions.pregnancy}</li>
                </ul>

                <h3>References</h3>
                <p style="font-size: 0.875rem; color: #6b7280;">${med.citations.join('; ')}</p>
            `;

            showModal(html);
        }
    } catch (error) {
        console.error('Failed to load medication:', error);
    }
}

// Load guidelines
async function loadGuidelines() {
    try {
        const response = await fetch('/api/guidelines');
        const data = await response.json();

        if (data.success) {
            allGuidelines = data.data;
            renderGuidelines(allGuidelines);
        }
    } catch (error) {
        console.error('Failed to load guidelines:', error);
        document.getElementById('guidelines-list').innerHTML = '<div class="loading">Failed to load guidelines</div>';
    }
}

// Render guidelines
function renderGuidelines(guidelines) {
    const container = document.getElementById('guidelines-list');

    if (guidelines.length === 0) {
        container.innerHTML = '<div class="loading">No guidelines found</div>';
        return;
    }

    container.innerHTML = guidelines.map(guideline => `
        <div class="card" onclick="showGuideline('${guideline.id}')">
            <h3>${guideline.title}</h3>
            <p class="card-meta">${guideline.organization} • ${guideline.year}</p>
            <p style="margin-top: 0.5rem; font-size: 0.875rem; color: #6b7280;">
                ${guideline.content.substring(0, 150)}...
            </p>
        </div>
    `).join('');
}

// Filter guidelines by category
function filterGuidelines(category) {
    // Update active pill
    document.querySelectorAll('#guidelines-tab .pill').forEach(p => p.classList.remove('active'));
    document.querySelector(`#guidelines-tab .pill[data-category="${category}"]`).classList.add('active');

    currentGuidelineCategory = category;

    if (!category) {
        renderGuidelines(allGuidelines);
    } else {
        const filtered = allGuidelines.filter(guideline =>
            guideline.title.toLowerCase().includes(category) ||
            guideline.content.toLowerCase().includes(category)
        );
        renderGuidelines(filtered);
    }
}

// Show guideline details
function showGuideline(guidelineId) {
    const guideline = allGuidelines.find(g => g.id === guidelineId);

    if (guideline) {
        const html = `
            <h2>${guideline.title}</h2>
            <p style="color: #6b7280; margin-bottom: 1rem;">${guideline.organization} • ${guideline.year}</p>
            <div style="white-space: pre-wrap; line-height: 1.8;">${guideline.content}</div>
        `;
        showModal(html);
    }
}

// Show diagnostic criteria
async function showCriteria(disorder) {
    try {
        const response = await fetch(`/api/criteria/${disorder}`);
        const data = await response.json();

        if (data.success && data.data) {
            const criteria = data.data;
            const html = `
                <h2>${criteria.disorder}</h2>
                <p style="color: #6b7280; margin-bottom: 1rem;">Code: ${criteria.code}</p>

                <h3>Diagnostic Criteria</h3>
                <ol>
                    ${criteria.criteria.map(c => `<li>${c}</li>`).join('')}
                </ol>

                ${criteria.specifiers.length > 0 ? `
                    <h3>Specifiers</h3>
                    <ul>
                        ${criteria.specifiers.map(s => `<li>${s}</li>`).join('')}
                    </ul>
                ` : ''}

                <p style="margin-top: 1.5rem; font-size: 0.875rem; color: #6b7280; font-style: italic;">
                    DSM-5 criteria for reference only. Not for diagnosis without clinical assessment.
                </p>
            `;
            showModal(html);
        }
    } catch (error) {
        console.error('Failed to load criteria:', error);
    }
}

// Calculator functions
async function calculatePHQ9() {
    const score = parseInt(document.getElementById('phq9-input').value);
    const resultDiv = document.getElementById('phq9-result');

    if (isNaN(score) || score < 0 || score > 27) {
        resultDiv.innerHTML = '<span style="color: #ef4444;">Please enter a valid score (0-27)</span>';
        resultDiv.classList.add('show');
        return;
    }

    try {
        const response = await fetch('/api/calc/phq9', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ score })
        });
        const data = await response.json();

        if (data.success) {
            resultDiv.innerHTML = `
                <strong>Score:</strong> ${data.data.score}/27<br>
                <strong>Severity:</strong> ${data.data.interpretation}<br><br>
                <div style="font-size: 0.75rem; color: #6b7280;">
                    <strong>Ranges:</strong><br>
                    0-4: None-minimal • 5-9: Mild<br>
                    10-14: Moderate • 15-19: Moderately severe<br>
                    20-27: Severe
                </div>
            `;
            resultDiv.classList.add('show');
        }
    } catch (error) {
        console.error('PHQ-9 calculation failed:', error);
    }
}

async function calculateGAD7() {
    const score = parseInt(document.getElementById('gad7-input').value);
    const resultDiv = document.getElementById('gad7-result');

    if (isNaN(score) || score < 0 || score > 21) {
        resultDiv.innerHTML = '<span style="color: #ef4444;">Please enter a valid score (0-21)</span>';
        resultDiv.classList.add('show');
        return;
    }

    try {
        const response = await fetch('/api/calc/gad7', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ score })
        });
        const data = await response.json();

        if (data.success) {
            resultDiv.innerHTML = `
                <strong>Score:</strong> ${data.data.score}/21<br>
                <strong>Severity:</strong> ${data.data.interpretation}<br><br>
                <div style="font-size: 0.75rem; color: #6b7280;">
                    <strong>Ranges:</strong><br>
                    0-4: Minimal • 5-9: Mild<br>
                    10-14: Moderate • 15-21: Severe
                </div>
            `;
            resultDiv.classList.add('show');
        }
    } catch (error) {
        console.error('GAD-7 calculation failed:', error);
    }
}

async function calculateBMI() {
    const weight = parseFloat(document.getElementById('bmi-weight').value);
    const height = parseFloat(document.getElementById('bmi-height').value);
    const resultDiv = document.getElementById('bmi-result');

    if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
        resultDiv.innerHTML = '<span style="color: #ef4444;">Please enter valid weight and height</span>';
        resultDiv.classList.add('show');
        return;
    }

    try {
        const response = await fetch('/api/calc/bmi', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ weight, height })
        });
        const data = await response.json();

        if (data.success) {
            resultDiv.innerHTML = `
                <strong>Weight:</strong> ${weight} kg<br>
                <strong>Height:</strong> ${height} cm<br>
                <strong>BMI:</strong> ${data.data.bmi}<br>
                <strong>Category:</strong> ${data.data.interpretation}<br><br>
                <div style="font-size: 0.75rem; color: #6b7280;">
                    <strong>Categories:</strong><br>
                    &lt;18.5: Underweight • 18.5-24.9: Normal<br>
                    25-29.9: Overweight • ≥30: Obese
                </div>
            `;
            resultDiv.classList.add('show');
        }
    } catch (error) {
        console.error('BMI calculation failed:', error);
    }
}

// Modal functions
function showModal(html) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');

    modalBody.innerHTML = html;
    modal.classList.add('show');

    // Close on backdrop click
    modal.onclick = (e) => {
        if (e.target === modal) closeModal();
    };
}

function closeModal() {
    document.getElementById('modal').classList.remove('show');
}

// Install prompt functions
function showInstallPrompt() {
    document.getElementById('install-prompt').classList.remove('hidden');

    document.getElementById('install-button').addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`Install prompt outcome: ${outcome}`);
            deferredPrompt = null;
            dismissInstall();
        }
    });
}

function dismissInstall() {
    document.getElementById('install-prompt').classList.add('hidden');
}

EOF_13_public_app_js

    # Create: public/icons/README.md
    create_file "public/icons/README.md"
    cat > "public/icons/README.md" << 'EOF_14_public_icons_README_md'
# App Icons

## Quick Setup (Automatic)

Run this command to generate all required icon sizes:

```bash
npm run generate-icons
```

This will create all icons from the base icon.svg file.

## Manual Setup (If you have a logo image)

If you have your own logo image (PNG or SVG), use an online PWA icon generator:

1. Go to https://www.pwabuilder.com/imageGenerator
2. Upload your logo image
3. Download the generated icons
4. Extract them to this `icons/` directory

## Required Icon Sizes

- 72x72px
- 96x96px
- 128x128px
- 144x144px
- 152x152px
- 192x192px
- 384x384px
- 512x512px

## Temporary Placeholder

For development, we'll use a simple placeholder icon. Replace these with your actual brand icons before production deployment.

EOF_14_public_icons_README_md

    # Create: public/icons/icon-128x128.svg
    create_file "public/icons/icon-128x128.svg"
    cat > "public/icons/icon-128x128.svg" << 'EOF_15_public_icons_icon_128x128_svg'
<?xml version="1.0" encoding="UTF-8"?>
<svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
  <rect width="128" height="128" fill="#3b82f6"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="51.2" fill="white" text-anchor="middle" dominant-baseline="central">
    🏥
  </text>
</svg>
EOF_15_public_icons_icon_128x128_svg

    # Create: public/icons/icon-144x144.svg
    create_file "public/icons/icon-144x144.svg"
    cat > "public/icons/icon-144x144.svg" << 'EOF_16_public_icons_icon_144x144_svg'
<?xml version="1.0" encoding="UTF-8"?>
<svg width="144" height="144" xmlns="http://www.w3.org/2000/svg">
  <rect width="144" height="144" fill="#3b82f6"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="57.6" fill="white" text-anchor="middle" dominant-baseline="central">
    🏥
  </text>
</svg>
EOF_16_public_icons_icon_144x144_svg

    # Create: public/icons/icon-152x152.svg
    create_file "public/icons/icon-152x152.svg"
    cat > "public/icons/icon-152x152.svg" << 'EOF_17_public_icons_icon_152x152_svg'
<?xml version="1.0" encoding="UTF-8"?>
<svg width="152" height="152" xmlns="http://www.w3.org/2000/svg">
  <rect width="152" height="152" fill="#3b82f6"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="60.800000000000004" fill="white" text-anchor="middle" dominant-baseline="central">
    🏥
  </text>
</svg>
EOF_17_public_icons_icon_152x152_svg

    # Create: public/icons/icon-192x192.svg
    create_file "public/icons/icon-192x192.svg"
    cat > "public/icons/icon-192x192.svg" << 'EOF_18_public_icons_icon_192x192_svg'
<?xml version="1.0" encoding="UTF-8"?>
<svg width="192" height="192" xmlns="http://www.w3.org/2000/svg">
  <rect width="192" height="192" fill="#3b82f6"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="76.80000000000001" fill="white" text-anchor="middle" dominant-baseline="central">
    🏥
  </text>
</svg>
EOF_18_public_icons_icon_192x192_svg

    # Create: public/icons/icon-384x384.svg
    create_file "public/icons/icon-384x384.svg"
    cat > "public/icons/icon-384x384.svg" << 'EOF_19_public_icons_icon_384x384_svg'
<?xml version="1.0" encoding="UTF-8"?>
<svg width="384" height="384" xmlns="http://www.w3.org/2000/svg">
  <rect width="384" height="384" fill="#3b82f6"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="153.60000000000002" fill="white" text-anchor="middle" dominant-baseline="central">
    🏥
  </text>
</svg>
EOF_19_public_icons_icon_384x384_svg

    # Create: public/icons/icon-512x512.svg
    create_file "public/icons/icon-512x512.svg"
    cat > "public/icons/icon-512x512.svg" << 'EOF_20_public_icons_icon_512x512_svg'
<?xml version="1.0" encoding="UTF-8"?>
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#3b82f6"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="204.8" fill="white" text-anchor="middle" dominant-baseline="central">
    🏥
  </text>
</svg>
EOF_20_public_icons_icon_512x512_svg

    # Create: public/icons/icon-72x72.svg
    create_file "public/icons/icon-72x72.svg"
    cat > "public/icons/icon-72x72.svg" << 'EOF_21_public_icons_icon_72x72_svg'
<?xml version="1.0" encoding="UTF-8"?>
<svg width="72" height="72" xmlns="http://www.w3.org/2000/svg">
  <rect width="72" height="72" fill="#3b82f6"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="28.8" fill="white" text-anchor="middle" dominant-baseline="central">
    🏥
  </text>
</svg>
EOF_21_public_icons_icon_72x72_svg

    # Create: public/icons/icon-96x96.svg
    create_file "public/icons/icon-96x96.svg"
    cat > "public/icons/icon-96x96.svg" << 'EOF_22_public_icons_icon_96x96_svg'
<?xml version="1.0" encoding="UTF-8"?>
<svg width="96" height="96" xmlns="http://www.w3.org/2000/svg">
  <rect width="96" height="96" fill="#3b82f6"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="38.400000000000006" fill="white" text-anchor="middle" dominant-baseline="central">
    🏥
  </text>
</svg>
EOF_22_public_icons_icon_96x96_svg

    # Create: public/index.html
    create_file "public/index.html"
    cat > "public/index.html" << 'EOF_23_public_index_html'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="theme-color" content="#3b82f6">
    <meta name="description" content="High-trust, low-noise medical utilities for residents">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="MedMicro">

    <title>MedMicro - Medical Reference</title>

    <!-- PWA Manifest -->
    <link rel="manifest" href="/manifest.json">

    <!-- iOS Safari -->
    <link rel="apple-touch-icon" href="/icons/icon-192x192.png">

    <!-- Styles -->
    <link rel="stylesheet" href="/app.css">
</head>
<body>
    <!-- App Container -->
    <div id="app">
        <!-- Header -->
        <header class="app-header">
            <div class="header-content">
                <h1>🏥 MedMicro</h1>
                <p class="header-subtitle">Medical Reference for Residents</p>
            </div>
        </header>

        <!-- Search Bar -->
        <div class="search-container">
            <input type="text" id="searchInput" placeholder="Search medications or guidelines..." class="search-input">
        </div>

        <!-- Navigation Tabs -->
        <nav class="tabs">
            <button class="tab active" data-tab="meds">
                <span class="tab-icon">💊</span>
                <span class="tab-label">Meds</span>
            </button>
            <button class="tab" data-tab="guidelines">
                <span class="tab-icon">📚</span>
                <span class="tab-label">Guidelines</span>
            </button>
            <button class="tab" data-tab="criteria">
                <span class="tab-icon">📋</span>
                <span class="tab-label">Criteria</span>
            </button>
            <button class="tab" data-tab="calc">
                <span class="tab-icon">🧮</span>
                <span class="tab-label">Calc</span>
            </button>
        </nav>

        <!-- Content Area -->
        <main class="content">
            <!-- Medications Tab -->
            <div id="meds-tab" class="tab-content active">
                <div class="category-pills">
                    <button class="pill active" data-class="all">All</button>
                    <button class="pill" data-class="SSRI">SSRIs</button>
                    <button class="pill" data-class="SNRI">SNRIs</button>
                    <button class="pill" data-class="Antipsychotic">Antipsychotics</button>
                    <button class="pill" data-class="Mood Stabilizer">Mood Stabilizers</button>
                </div>
                <div id="meds-list" class="card-list">
                    <div class="loading">Loading medications...</div>
                </div>
            </div>

            <!-- Guidelines Tab -->
            <div id="guidelines-tab" class="tab-content">
                <div class="category-pills">
                    <button class="pill active" data-category="">All</button>
                    <button class="pill" data-category="depression">Depression</button>
                    <button class="pill" data-category="bipolar">Bipolar</button>
                    <button class="pill" data-category="schizophrenia">Schizophrenia</button>
                    <button class="pill" data-category="anxiety">Anxiety</button>
                </div>
                <div id="guidelines-list" class="card-list">
                    <div class="loading">Loading guidelines...</div>
                </div>
            </div>

            <!-- Criteria Tab -->
            <div id="criteria-tab" class="tab-content">
                <div class="card-list">
                    <div class="criteria-card" data-disorder="Major Depressive Disorder">
                        <h3>Major Depressive Disorder</h3>
                        <p class="card-meta">DSM-5 Diagnostic Criteria</p>
                    </div>
                    <div class="criteria-card" data-disorder="Bipolar I Disorder">
                        <h3>Bipolar I Disorder</h3>
                        <p class="card-meta">DSM-5 Diagnostic Criteria</p>
                    </div>
                    <div class="criteria-card" data-disorder="Schizophrenia">
                        <h3>Schizophrenia</h3>
                        <p class="card-meta">DSM-5 Diagnostic Criteria</p>
                    </div>
                    <div class="criteria-card" data-disorder="Generalized Anxiety Disorder">
                        <h3>Generalized Anxiety Disorder</h3>
                        <p class="card-meta">DSM-5 Diagnostic Criteria</p>
                    </div>
                    <div class="criteria-card" data-disorder="Panic Disorder">
                        <h3>Panic Disorder</h3>
                        <p class="card-meta">DSM-5 Diagnostic Criteria</p>
                    </div>
                </div>
            </div>

            <!-- Calculators Tab -->
            <div id="calc-tab" class="tab-content">
                <div class="card-list">
                    <!-- PHQ-9 -->
                    <div class="calc-card">
                        <h3>PHQ-9 Depression Screener</h3>
                        <p class="card-meta">Total score: 0-27</p>
                        <input type="number" class="calc-input" id="phq9-input" placeholder="Enter score (0-27)" min="0" max="27">
                        <button class="btn-primary" onclick="calculatePHQ9()">Calculate</button>
                        <div id="phq9-result" class="calc-result"></div>
                    </div>

                    <!-- GAD-7 -->
                    <div class="calc-card">
                        <h3>GAD-7 Anxiety Screener</h3>
                        <p class="card-meta">Total score: 0-21</p>
                        <input type="number" class="calc-input" id="gad7-input" placeholder="Enter score (0-21)" min="0" max="21">
                        <button class="btn-primary" onclick="calculateGAD7()">Calculate</button>
                        <div id="gad7-result" class="calc-result"></div>
                    </div>

                    <!-- BMI -->
                    <div class="calc-card">
                        <h3>BMI Calculator</h3>
                        <p class="card-meta">Weight (kg) and Height (cm)</p>
                        <input type="number" class="calc-input" id="bmi-weight" placeholder="Weight (kg)" step="0.1">
                        <input type="number" class="calc-input" id="bmi-height" placeholder="Height (cm)">
                        <button class="btn-primary" onclick="calculateBMI()">Calculate</button>
                        <div id="bmi-result" class="calc-result"></div>
                    </div>
                </div>
            </div>
        </main>

        <!-- Detail Modal -->
        <div id="modal" class="modal">
            <div class="modal-content">
                <button class="modal-close" onclick="closeModal()">&times;</button>
                <div id="modal-body"></div>
            </div>
        </div>

        <!-- Install Prompt -->
        <div id="install-prompt" class="install-prompt hidden">
            <div class="install-content">
                <span>📱 Install MedMicro for offline access</span>
                <button class="btn-install" id="install-button">Install</button>
                <button class="btn-dismiss" onclick="dismissInstall()">×</button>
            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script src="/app.js"></script>
</body>
</html>

EOF_23_public_index_html

    # Create: public/manifest.json
    create_file "public/manifest.json"
    cat > "public/manifest.json" << 'EOF_24_public_manifest_json'
{
  "name": "MedMicro - Medical Reference",
  "short_name": "MedMicro",
  "description": "High-trust, low-noise medical utilities for residents",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-192x192.svg",
      "sizes": "192x192",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.svg",
      "sizes": "512x512",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    }
  ],
  "categories": ["medical", "health", "education"],
  "screenshots": []
}

EOF_24_public_manifest_json

    # Create: public/sw.js
    create_file "public/sw.js"
    cat > "public/sw.js" << 'EOF_25_public_sw_js'
// Service Worker for MedMicro PWA
const CACHE_NAME = 'medmicro-v1';
const urlsToCache = [
  '/',
  '/app.css',
  '/app.js',
  '/manifest.json'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then((response) => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone response to cache it
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
  );
});

EOF_25_public_sw_js

    # Create: server/data/criteria/bipolar.json
    create_file "server/data/criteria/bipolar.json"
    cat > "server/data/criteria/bipolar.json" << 'EOF_26_server_data_criteria_bipolar_json'
{
    "disorder": "Bipolar I Disorder (Manic Episode)",
    "code": "F31.x",
    "criteria": [
        "A. Distinct period of abnormally and persistently elevated, expansive, or irritable mood AND increased goal-directed activity/energy, lasting ≥1 week (or any duration if hospitalization needed)",
        "",
        "B. During the mood disturbance, 3+ of the following (4 if mood only irritable):",
        "  1. Inflated self-esteem or grandiosity",
        "  2. Decreased need for sleep",
        "  3. More talkative than usual or pressure to keep talking",
        "  4. Flight of ideas or racing thoughts",
        "  5. Distractibility",
        "  6. Increase in goal-directed activity or psychomotor agitation",
        "  7. Excessive involvement in activities with high potential for painful consequences",
        "",
        "C. Mood disturbance severe enough to cause marked impairment OR necessitate hospitalization OR psychotic features",
        "",
        "D. Not attributable to substances or another medical condition"
    ],
    "specifiers": [
        "With anxious distress",
        "With mixed features",
        "With rapid cycling",
        "With psychotic features (mood-congruent vs incongruent)",
        "With peripartum onset"
    ]
}
EOF_26_server_data_criteria_bipolar_json

    # Create: server/data/criteria/gad.json
    create_file "server/data/criteria/gad.json"
    cat > "server/data/criteria/gad.json" << 'EOF_27_server_data_criteria_gad_json'
{
    "disorder": "Generalized Anxiety Disorder",
    "code": "F41.1",
    "criteria": [
        "A. Excessive anxiety and worry about various events/activities, occurring more days than not for at least 6 months",
        "",
        "B. Difficult to control the worry",
        "",
        "C. Anxiety/worry associated with 3+ of the following:",
        "  1. Restlessness or feeling keyed up/on edge",
        "  2. Being easily fatigued",
        "  3. Difficulty concentrating or mind going blank",
        "  4. Irritability",
        "  5. Muscle tension",
        "  6. Sleep disturbance",
        "",
        "D. Causes clinically significant distress or impairment",
        "",
        "E. Not attributable to substances or another medical condition",
        "",
        "F. Not better explained by another mental disorder"
    ],
    "specifiers": [
        "With excessive worry about minor matters",
        "Duration: at least 6 months required"
    ]
}
EOF_27_server_data_criteria_gad_json

    # Create: server/data/criteria/mdd.json
    create_file "server/data/criteria/mdd.json"
    cat > "server/data/criteria/mdd.json" << 'EOF_28_server_data_criteria_mdd_json'
{
    "disorder": "Major Depressive Disorder",
    "code": "F32.x / F33.x",
    "criteria": [
        "A. Five (or more) of the following during the same 2-week period (at least one is depressed mood or loss of interest/pleasure):",
        "  1. Depressed mood most of the day, nearly every day",
        "  2. Markedly diminished interest or pleasure in all/almost all activities",
        "  3. Significant weight loss/gain or appetite change",
        "  4. Insomnia or hypersomnia nearly every day",
        "  5. Psychomotor agitation or retardation",
        "  6. Fatigue or loss of energy",
        "  7. Feelings of worthlessness or excessive/inappropriate guilt",
        "  8. Diminished ability to think or concentrate, indecisiveness",
        "  9. Recurrent thoughts of death, suicidal ideation",
        "",
        "B. Symptoms cause clinically significant distress or impairment",
        "",
        "C. Not attributable to substances or another medical condition",
        "",
        "D. Not better explained by schizoaffective, schizophrenia, or other psychotic disorder",
        "",
        "E. Never been a manic or hypomanic episode"
    ],
    "specifiers": [
        "Severity: Mild, Moderate, Severe",
        "With anxious distress",
        "With melancholic features",
        "With atypical features",
        "With psychotic features",
        "With peripartum onset",
        "With seasonal pattern"
    ]
}
EOF_28_server_data_criteria_mdd_json

    # Create: server/data/criteria/panic.json
    create_file "server/data/criteria/panic.json"
    cat > "server/data/criteria/panic.json" << 'EOF_29_server_data_criteria_panic_json'
{
    "disorder": "Panic Disorder",
    "code": "F41.0",
    "criteria": [
        "A. Recurrent unexpected panic attacks (abrupt surge of intense fear/discomfort, peaks within minutes, with 4+ of the following):",
        "  1. Palpitations, pounding heart, accelerated heart rate",
        "  2. Sweating",
        "  3. Trembling or shaking",
        "  4. Sensations of shortness of breath or smothering",
        "  5. Feelings of choking",
        "  6. Chest pain or discomfort",
        "  7. Nausea or abdominal distress",
        "  8. Feeling dizzy, unsteady, lightheaded, or faint",
        "  9. Chills or heat sensations",
        "  10. Paresthesias",
        "  11. Derealization or depersonalization",
        "  12. Fear of losing control or 'going crazy'",
        "  13. Fear of dying",
        "",
        "B. At least one attack followed by 1 month+ of one or both:",
        "  1. Persistent concern/worry about additional attacks or their consequences",
        "  2. Significant maladaptive change in behavior related to the attacks",
        "",
        "C. Not attributable to substances or another medical condition",
        "",
        "D. Not better explained by another mental disorder"
    ],
    "specifiers": []
}
EOF_29_server_data_criteria_panic_json

    # Create: server/data/criteria/schizophrenia.json
    create_file "server/data/criteria/schizophrenia.json"
    cat > "server/data/criteria/schizophrenia.json" << 'EOF_30_server_data_criteria_schizophrenia_json'
{
    "disorder": "Schizophrenia",
    "code": "F20.x",
    "criteria": [
        "A. Two (or more) of the following, each present for significant portion of time during 1-month period (at least one must be 1, 2, or 3):",
        "  1. Delusions",
        "  2. Hallucinations",
        "  3. Disorganized speech",
        "  4. Grossly disorganized or catatonic behavior",
        "  5. Negative symptoms (diminished emotional expression, avolition)",
        "",
        "B. Level of functioning markedly below prior level (or failure to achieve expected level if onset in childhood/adolescence)",
        "",
        "C. Continuous signs of disturbance persist for at least 6 months (must include at least 1 month of Criterion A symptoms)",
        "",
        "D. Schizoaffective disorder and depressive/bipolar with psychotic features ruled out",
        "",
        "E. Not attributable to substances or another medical condition",
        "",
        "F. If autism or communication disorder present, prominent delusions/hallucinations must also be present for at least 1 month"
    ],
    "specifiers": [
        "First episode vs Multiple episodes",
        "With catatonia",
        "Current severity rating"
    ]
}
EOF_30_server_data_criteria_schizophrenia_json

    # Create: server/data/guidelines/apa-schizophrenia.md
    create_file "server/data/guidelines/apa-schizophrenia.md"
    cat > "server/data/guidelines/apa-schizophrenia.md" << 'EOF_31_server_data_guidelines_apa_schizophrenia_md'
---
title: "APA Schizophrenia"
organization: "American Psychiatric Association"
year: 2020
---

# APA Practice Guideline for the Treatment of Patients With Schizophrenia (2020)

## Pharmacotherapy
- **First-line**: Treat with an antipsychotic medication. 
- Selection should depend on side effect profile and patient preference.
- Clozapine is recommended for treatment-resistant schizophrenia (failure of 2 adequate trials).

## Long-Acting Injectables (LAIs)
- recommended for patients with poor adherence.
- Should be offered to all patients.

## Psychosocial Interventions
- CBT for psychosis (CBT-p)
- Family intervention
- Supported employment services
- Assertive Community Treatment (ACT) for high service users.

## Metabolic Monitoring
- Baseline: Weight, BMI, Waist Circumference, BP, Fasting Glucose, Lipid Profile.
- Monitor weight/BMI at every visit for 6 months, then quarterly.
- Monitor metabolic labs at 12 weeks, then annually.

## Citations
- Keepers GA, et al. Am J Psychiatry. 2020;177(9):868-872.

EOF_31_server_data_guidelines_apa_schizophrenia_md

    # Create: server/data/guidelines/apa_depression.md
    create_file "server/data/guidelines/apa_depression.md"
    cat > "server/data/guidelines/apa_depression.md" << 'EOF_32_server_data_guidelines_apa_depression_md'
---
title: "APA Depression Guidelines 2010"
organization: "APA"
year: 2010
version: "1.0"
citation_key: "APA2010"
url: "https://www.psychiatry.org"
---

# Major Depressive Disorder Treatment

## First-line Pharmacotherapy
- SSRIs (Fluoxetine, Sertraline, Escitalopram, Paroxetine, Citalopram)
- SNRIs (Venlafaxine, Duloxetine)
- Bupropion
- Mirtazapine

## Second-line Options
- TCAs (for non-cardiac patients)
- MAOIs (with dietary restrictions)
- Augmentation strategies (Lithium, T3, Antipsychotics)

## Psychotherapy
- Cognitive Behavioral Therapy (CBT)
- Interpersonal Therapy (IPT)
- Behavioral Activation

EOF_32_server_data_guidelines_apa_depression_md

    # Create: server/data/guidelines/apa_schizophrenia.md
    create_file "server/data/guidelines/apa_schizophrenia.md"
    cat > "server/data/guidelines/apa_schizophrenia.md" << 'EOF_33_server_data_guidelines_apa_schizophrenia_md'
---
title: "Schizophrenia - APA Practice Guidelines 2020"
organization: "APA"
year: 2020
version: "3.0"
citation_key: "APA_SCZ_2020"
url: "https://www.psychiatry.org"
---

# Schizophrenia Treatment Guidelines

## First Episode Psychosis

### Antipsychotic Selection
**Preferred:**
- Aripiprazole
- Risperidone
- Olanzapine
- Quetiapine

**Consider avoiding:**
- Haloperidol (except emergencies)
- Clozapine (reserve for treatment resistance)

### Dosing Principles
- Start low, go slow
- Use minimum effective dose
- Reassess after 2-4 weeks

## Treatment-Resistant Schizophrenia

**Definition:**
- Failed 2+ adequate trials of different antipsychotics
- Each trial: adequate dose × 4-6 weeks

**Treatment:**
- Clozapine is gold standard
- Requires monitoring: ANC, metabolic parameters

## Long-acting Injectables (LAI)
**Consider for:**
- Non-adherence history
- Patient preference
- Relapse prevention

**Options:**
- Paliperidone palmitate
- Aripiprazole monohydrate
- Risperidone microspheres

## Monitoring Requirements
- Metabolic: Weight, glucose, lipids (baseline, 3 mo, annually)
- EPS: AIMS quarterly
- Prolactin: If symptomatic

EOF_33_server_data_guidelines_apa_schizophrenia_md

    # Create: server/data/guidelines/canmat_bipolar.md
    create_file "server/data/guidelines/canmat_bipolar.md"
    cat > "server/data/guidelines/canmat_bipolar.md" << 'EOF_34_server_data_guidelines_canmat_bipolar_md'
---
title: "CANMAT Bipolar Guidelines 2018"
organization: "CANMAT"
year: 2018
version: "1.0"
citation_key: "CANMAT2018"
url: "https://www.canmat.org"
---

# Management of Acute Mania

## First-line Agents
- Lithium
- Quetiapine
- Divalproex
- Asenapine
- Aripiprazole
- Paliperidone
- Risperidone
- Cariprazine

## Second-line Agents
- Olanzapine
- Carbamazepine
- Ziprasidone
- Haloperidol

# Management of Bipolar Depression

## First-line Agents
- Quetiapine
- Lurasidone + Lithium/Divalproex
- Lithium (monotherapy)
- Lamotrigine (maintenance/adjunct)

## Second-line Agents
- Divalproex
- SSRIs (adjunct ONLY)

EOF_34_server_data_guidelines_canmat_bipolar_md

    # Create: server/data/guidelines/canmat_bipolar_depression.md
    create_file "server/data/guidelines/canmat_bipolar_depression.md"
    cat > "server/data/guidelines/canmat_bipolar_depression.md" << 'EOF_35_server_data_guidelines_canmat_bipolar_depression_md'
---
title: "Bipolar Depression - CANMAT Guidelines 2018"
organization: "CANMAT"
year: 2018
version: "1.0"
citation_key: "CANMAT_BD_DEP_2018"
url: "https://www.canmat.org"
---

# Bipolar Depression Treatment

## First-line Monotherapy
- Quetiapine (immediate or XR)
- Lurasidone (with lithium or valproate)
- Lithium
- Lamotrigine

## First-line Adjunctive Therapy
- Lurasidone + (lithium OR valproate)
- Lamotrigine + (lithium OR valproate OR SGA)

## Second-line Options
- Valproate
- Lurasidone monotherapy
- Carbamazepine
- Olanzapine (± fluoxetine)
- SSRIs (with mood stabilizer, short-term only)

## Third-line
- Venlafaxine + mood stabilizer
- Modafinil (adjunctive)
- Pramipexole (adjunctive)

## Important Cautions
- **Avoid antidepressant monotherapy** - risk of switch to mania
- SSRIs/SNRIs should always be combined with mood stabilizer
- Monitor closely for mood elevation/mixed features

EOF_35_server_data_guidelines_canmat_bipolar_depression_md

    # Create: server/data/guidelines/canmat_depression.md
    create_file "server/data/guidelines/canmat_depression.md"
    cat > "server/data/guidelines/canmat_depression.md" << 'EOF_36_server_data_guidelines_canmat_depression_md'
---
title: "Major Depression - CANMAT Guidelines 2016"
organization: "CANMAT"
year: 2016
version: "2.0"
citation_key: "CANMAT_MDD_2016"
url: "https://www.canmat.org"
---

# Major Depressive Disorder

## First-line Pharmacotherapy

### SSRIs
- Escitalopram
- Sertraline
- Fluoxetine
- Paroxetine
- Citalopram

### SNRIs
- Venlafaxine XR
- Duloxetine

### Others
- Bupropion XR
- Mirtazapine
- Agomelatine

## Second-line Options
- Quetiapine XR (monotherapy)
- TCAs (amitriptyline, nortriptyline)
- MAOIs (phenelzine, tranylcypromine)

## Augmentation Strategies (Inadequate Response)

**First-line augmentation:**
- Aripiprazole
- Quetiapine XR
- Risperidone
- Lithium

**Second-line:**
- Bupropion
- Thyroid hormone (T3)
- Second antidepressant

## Treatment Duration
- Continue for minimum 6-9 months after remission
- Recurrent depression: Consider long-term maintenance

EOF_36_server_data_guidelines_canmat_depression_md

    # Create: server/data/guidelines/nice_gad.md
    create_file "server/data/guidelines/nice_gad.md"
    cat > "server/data/guidelines/nice_gad.md" << 'EOF_37_server_data_guidelines_nice_gad_md'
---
title: "Generalized Anxiety Disorder - NICE Guidelines 2011"
organization: "NICE"
year: 2011
version: "1.0"
citation_key: "NICE_GAD_2011"
url: "https://www.nice.org.uk/guidance/cg113"
---

# Generalized Anxiety Disorder (GAD)

## Stepped Care Approach

### Step 1: Identification and Assessment
- Screen with GAD-7
- Rule out physical causes
- Assess for comorbidities

### Step 2: Low-Intensity Interventions
- Individual guided self-help
- Psychoeducational groups

### Step 3: High-Intensity Interventions

**Psychological:**
- Cognitive Behavioral Therapy (CBT)
- Applied Relaxation

**Pharmacological First-line:**
- Sertraline (SSRI)
- Escitalopram, Paroxetine (alternative SSRIs)
- Venlafaxine, Duloxetine (SNRIs)

**If inadequate response:**
- Consider pregabalin
- Consider alternative SSRI/SNRI

### Step 4: Specialist Treatment
- Combined therapy
- Crisis intervention

EOF_37_server_data_guidelines_nice_gad_md

    # Create: server/data/guidelines/nice_panic.md
    create_file "server/data/guidelines/nice_panic.md"
    cat > "server/data/guidelines/nice_panic.md" << 'EOF_38_server_data_guidelines_nice_panic_md'
---
title: "Panic Disorder - NICE Guidelines 2011"
organization: "NICE"
year: 2011
version: "1.0"
citation_key: "NICE_PANIC_2011"
url: "https://www.nice.org.uk/guidance/cg113"
---

# Panic Disorder

## Treatment Recommendations

### Psychological Interventions (First-line)
- Cognitive Behavioral Therapy (CBT)
- Applied relaxation

### Pharmacological Treatment

**First-line (if CBT declined/not effective):**
- SSRIs:
  - Sertraline
  - Escitalopram
  - Paroxetine
  - Fluoxetine
  - Citalopram

**Second-line:**
- Imipramine (TCA)
- Clomipramine (TCA)

**Note:** Avoid benzodiazepines for long-term use

### Management Principles
- Start at lower dose, titrate gradually
- Continue for 6 months after remission
- Taper slowly when discontinuing

EOF_38_server_data_guidelines_nice_panic_md

    # Create: server/data/guidelines/nice_psychosis.md
    create_file "server/data/guidelines/nice_psychosis.md"
    cat > "server/data/guidelines/nice_psychosis.md" << 'EOF_39_server_data_guidelines_nice_psychosis_md'
---
title: "NICE Psychosis and Schizophrenia Guidelines 2014"
organization: "NICE"
year: 2014
version: "1.0"
citation_key: "NICE2014"
url: "https://www.nice.org.uk"
---

# First Episode Psychosis

## Antipsychotic Choice
- Offer oral antipsychotic medication
- Consider patient preference for side effect profile
- Start at lower end of licensed range

## First-line Agents
- Aripiprazole
- Olanzapine
- Risperidone
- Quetiapine

## Avoid
- Haloperidol (except in emergencies)
- Depot formulations in first episode

## Monitoring
- Weight, waist circumference, blood pressure
- Fasting glucose and lipids
- Prolactin (if clinically indicated)

EOF_39_server_data_guidelines_nice_psychosis_md

    # Create: server/data/meds/aripiprazole.json
    create_file "server/data/meds/aripiprazole.json"
    cat > "server/data/meds/aripiprazole.json" << 'EOF_40_server_data_meds_aripiprazole_json'
{
    "name": "Aripiprazole",
    "genericName": "Aripiprazole (Abilify)",
    "tags": [
        "Antipsychotic",
        "SGA",
        "Augmentation"
    ],
    "dosing": {
        "adult_acute": "Schizophrenia: 10-15 mg/day. Bipolar mania: 15 mg/day. Augmentation: 2-15 mg/day",
        "adult_maintenance": "10-30 mg/day for psychosis. 2-10 mg/day for augmentation",
        "notes": "Partial D2 agonist. Can be activating. LAI available."
    },
    "cautions": {
        "renal": "No adjustment needed",
        "hepatic": "No adjustment needed",
        "pregnancy": "Cat C - Consider alternatives"
    },
    "warnings": [
        "Akathisia (most common SE)",
        "Lower metabolic risk vs other SGAs",
        "Compulsive behaviors (rare - gambling, eating)",
        "Can cause insomnia or activation"
    ],
    "citations": [
        "CANMAT Depression 2016 (augmentation)",
        "APA Schizophrenia 2020"
    ]
}
EOF_40_server_data_meds_aripiprazole_json

    # Create: server/data/meds/duloxetine.json
    create_file "server/data/meds/duloxetine.json"
    cat > "server/data/meds/duloxetine.json" << 'EOF_41_server_data_meds_duloxetine_json'
{
    "name": "Duloxetine",
    "genericName": "Duloxetine (Cymbalta)",
    "tags": [
        "SNRI",
        "Antidepressant",
        "Pain"
    ],
    "dosing": {
        "adult_acute": "Depression/Anxiety: 60 mg daily. Pain: 30-60 mg daily",
        "adult_maintenance": "60 mg/day (can go up to 120 mg/day)",
        "notes": "Take with food. Do not open capsules. Caps: 20, 30, 60 mg."
    },
    "cautions": {
        "renal": "Avoid in CrCl <30. Use caution in CrCl 30-80.",
        "hepatic": "CONTRAINDICATED in hepatic impairment",
        "pregnancy": "Cat C - Limited data, neonatal effects possible"
    },
    "warnings": [
        "Hepatotoxicity - monitor LFTs, avoid in liver disease",
        "Discontinuation syndrome - must taper",
        "May increase BP and HR",
        "Urinary hesitancy/retention possible",
        "Helpful for chronic pain, fibromyalgia"
    ],
    "citations": [
        "CANMAT Depression 2016",
        "NICE GAD 2011"
    ]
}
EOF_41_server_data_meds_duloxetine_json

    # Create: server/data/meds/escitalopram.json
    create_file "server/data/meds/escitalopram.json"
    cat > "server/data/meds/escitalopram.json" << 'EOF_42_server_data_meds_escitalopram_json'
{
    "name": "Escitalopram",
    "genericName": "Escitalopram (Lexapro)",
    "tags": [
        "SSRI",
        "Antidepressant",
        "Anxiety"
    ],
    "dosing": {
        "adult_acute": "10 mg daily, may increase to 20 mg/day",
        "adult_maintenance": "10-20 mg/day",
        "notes": "Max 20 mg/day. 10 mg often sufficient. Can take AM or PM."
    },
    "cautions": {
        "renal": "No adjustment for mild-moderate. Use caution in severe.",
        "hepatic": "10 mg max in hepatic impairment",
        "pregnancy": "Cat C - Consider risks/benefits"
    },
    "warnings": [
        "Suicidality in young adults",
        "QT prolongation (dose-related)",
        "Avoid with MAOIs (14-day washout)",
        "Insomnia or somnolence possible"
    ],
    "citations": [
        "NICE GAD 2011",
        "CANMAT Depression 2016"
    ]
}
EOF_42_server_data_meds_escitalopram_json

    # Create: server/data/meds/lamotrigine.json
    create_file "server/data/meds/lamotrigine.json"
    cat > "server/data/meds/lamotrigine.json" << 'EOF_43_server_data_meds_lamotrigine_json'
{
    "name": "Lamotrigine",
    "genericName": "Lamictal",
    "tags": [
        "mood stabilizer",
        "bipolar depression",
        "anticonvulsant"
    ],
    "dosing": {
        "adult_acute": "Not for acute mania (slow titration)",
        "adult_maintenance": "100-200 mg/day",
        "notes": "Slow titration mandatory to prevent SJS.",
        "canadian_clinical": {
            "starting_dose": "25 mg/day",
            "titration_schedule": "Weeks 1-2: 25mg/day. Weeks 3-4: 50mg/day. Week 5: 100mg/day. Week 6: 200mg/day.",
            "inpatient_strategy": "Same as outpatient. Cannot rush due to SJS risk.",
            "outpatient_strategy": "Strict adherence to 25mg increments. Educate on rash.",
            "max_dose_evidence": "400 mg/day (rare)",
            "max_dose_practice": "200 mg is standard target. Some patients need 300-400mg."
        }
    },
    "cautions": {
        "renal": "Caution if CrCl < 30.",
        "hepatic": "Reduce dose by 50% in moderate, 75% in severe impairment.",
        "pregnancy": "Generally considered safer than Valproate/Lithium, but cleft lip risk debate."
    },
    "warnings": [
        "Stevens-Johnson Syndrome (Rash)",
        "Interaction with Valproate (doubles levels)",
        "Interaction with Oral Contraceptives (lowers levels)"
    ],
    "citations": [
        "CANMAT Bipolar Guidelines 2018",
        "Stahl"
    ]
}
EOF_43_server_data_meds_lamotrigine_json

    # Create: server/data/meds/lithium.json
    create_file "server/data/meds/lithium.json"
    cat > "server/data/meds/lithium.json" << 'EOF_44_server_data_meds_lithium_json'
{
    "name": "Lithium",
    "genericName": "Lithium Carbonate",
    "tags": [
        "mood stabilizer",
        "mania",
        "bipolar maintenance",
        "suicide prevention"
    ],
    "dosing": {
        "adult_acute": "600-1800 mg/day (target level 0.8-1.2 mEq/L)",
        "adult_maintenance": "600-1200 mg/day (target level 0.6-0.8 mEq/L)",
        "notes": "Narrow therapeutic index. Monitor serum levels.",
        "canadian_clinical": {
            "starting_dose": "300mg BID or 600mg QHS (use ER for better renal profile/tolerability)",
            "titration_schedule": "Increase by 300mg every 3-5 days. Check trough level (12 hr post-dose) after 5 days of steady dosing. Aim for >0.6.",
            "inpatient_strategy": "Can start 300mg TID or 450mg BID. Check levels on day 4/5. Adjust rapidly.",
            "outpatient_strategy": "Start 300mg BID. Recheck level in 5-7 days. Titrate to 0.6-0.8.",
            "max_dose_evidence": "Dependent on serum level (usually 1.2 mEq/L acute)",
            "max_dose_practice": "Doses >1200mg/day often required for acute mania. Clinical max determined by toxicity (>1.5 mEq/L)."
        }
    },
    "cautions": {
        "renal": "Renally cleared. Adjust dose based on GFR. Contraindicated in severe failure.",
        "hepatic": "Minimal concern.",
        "pregnancy": "Ebsteins Anomaly (first trimester risk). Monitor levels closely."
    },
    "warnings": [
        "Lithium Toxicity (Tremor, Ataxia, Confusion)",
        "Hypothyroidism",
        "Diabetes Insipidus (Polyuria)",
        "Renal Impairment (Long term)"
    ],
    "citations": [
        "CANMAT Bipolar Guidelines 2018",
        "Product Monograph"
    ]
}
EOF_44_server_data_meds_lithium_json

    # Create: server/data/meds/olanzapine.json
    create_file "server/data/meds/olanzapine.json"
    cat > "server/data/meds/olanzapine.json" << 'EOF_45_server_data_meds_olanzapine_json'
{
    "name": "Olanzapine",
    "genericName": "Zyprexa",
    "tags": [
        "antipsychotic",
        "atypical",
        "mania",
        "schizophrenia"
    ],
    "dosing": {
        "adult_acute": "10-20 mg/day",
        "adult_maintenance": "5-20 mg/day",
        "notes": "High metabolic risk.",
        "canadian_clinical": {
            "starting_dose": "5-10 mg/day (2.5-5 mg for elderly)",
            "titration_schedule": "Increase by 5mg every 1-3 days if tolerated.",
            "inpatient_strategy": "Acute agitation: 5-10mg PO/IM stat. Can load rapidly to 20mg if needed.",
            "outpatient_strategy": "Start 5mg QHS for tolerability (sedation). Increase to 10mg after 1 week.",
            "max_dose_evidence": "20 mg/day",
            "max_dose_practice": "30-40 mg/day seen in refractory cases (off-label)."
        }
    },
    "cautions": {
        "renal": "Caution.",
        "hepatic": "Caution.",
        "pregnancy": "Risk of metabolic sequelae in newborn."
    },
    "warnings": [
        "Weight Gain / Metabolic Syndrome (Highest risk)",
        "Sedation",
        "Anticholinergic effects"
    ],
    "citations": [
        "APA Schizophrenia Guidelines",
        "CANMAT"
    ]
}
EOF_45_server_data_meds_olanzapine_json

    # Create: server/data/meds/quetiapine.json
    create_file "server/data/meds/quetiapine.json"
    cat > "server/data/meds/quetiapine.json" << 'EOF_46_server_data_meds_quetiapine_json'
{
    "name": "Quetiapine",
    "genericName": "Seroquel",
    "tags": [
        "antipsychotic",
        "atypical",
        "mania",
        "depression",
        "schizophrenia"
    ],
    "dosing": {
        "adult_acute": "300-800 mg/day (titrate up related to indication)",
        "adult_maintenance": "400-800 mg/day (XR preferred for compliance)",
        "notes": "XR needs to be taken on empty stomach or light meal.",
        "canadian_clinical": {
            "starting_dose": "50mg (IR) or 300mg (XR) depending on urgency/indication. Low dose (25mg) for sleep is off-label.",
            "titration_schedule": "Schizophrenia/Mania: Day 1: 50mg BID, D2: 100mg BID, D3: 150mg BID, D4: 200mg BID. XR can be titrated faster (Day 1: 300mg, Day 2: 600mg).",
            "inpatient_strategy": "Aggressive titration (XR strategy) usually tolerated well under observation. Day 1: 300mg, Day 2: 600mg.",
            "outpatient_strategy": "Slower IR titration may be preferred if sedation is a concern (e.g., start 25-50mg QHS).",
            "max_dose_evidence": "800 mg/day (Schizophrenia/Mania)",
            "max_dose_practice": "Certain refractory cases may see up to 1000mg-1200mg (rare, off-label with monitoring)."
        }
    },
    "cautions": {
        "renal": "Start lower dose (25mg/day), increase by 25-50mg daily.",
        "hepatic": "Start lower dose (25mg/day), slow titration.",
        "pregnancy": "Risk/Benefit analysis (Category C). Risk of EPS in neonate."
    },
    "warnings": [
        "Metabolic Syndrome (Weight gain, lipids, glucose)",
        "Sedation/Somnolence",
        "Orthostatic Hypotension",
        "QTc Prolongation"
    ],
    "citations": [
        "APA Schizophrenia Guidelines 2020",
        "Product Monograph",
        "Maudsley Prescribing Guidelines"
    ]
}
EOF_46_server_data_meds_quetiapine_json

    # Create: server/data/meds/risperidone.json
    create_file "server/data/meds/risperidone.json"
    cat > "server/data/meds/risperidone.json" << 'EOF_47_server_data_meds_risperidone_json'
{
    "name": "Risperidone",
    "genericName": "Risperdal",
    "tags": [
        "antipsychotic",
        "atypical",
        "schizophrenia",
        "irritability"
    ],
    "dosing": {
        "adult_acute": "2-6 mg/day",
        "adult_maintenance": "2-4 mg/day",
        "notes": "Dose dependent EPS above 6mg.",
        "canadian_clinical": {
            "starting_dose": "1-2 mg/day (0.25-0.5 mg for elderly)",
            "titration_schedule": "Increase by 1mg every 24-48 hours.",
            "inpatient_strategy": "Start 2mg. Titrate to 4mg within 2-3 days.",
            "outpatient_strategy": "Start 1mg QHS. Increase to 2mg after 3-4 days.",
            "max_dose_evidence": "16 mg/day (very rare)",
            "max_dose_practice": "6-8 mg/day. Above 6mg acts like typical antipsychotic (high prolactin/EPS)."
        }
    },
    "cautions": {
        "renal": "Start 0.5mg BID, increase by 0.5mg.",
        "hepatic": "Start lower.",
        "pregnancy": "Category C."
    },
    "warnings": [
        "Hyperprolactinemia (Galactorrhea/Gynecomastia)",
        "EPS at higher doses",
        "Orthostatic Hypotension"
    ],
    "citations": [
        "Product Monograph",
        "Maudsley"
    ]
}
EOF_47_server_data_meds_risperidone_json

    # Create: server/data/meds/sertraline.json
    create_file "server/data/meds/sertraline.json"
    cat > "server/data/meds/sertraline.json" << 'EOF_48_server_data_meds_sertraline_json'
{
    "name": "Sertraline",
    "genericName": "Zoloft",
    "tags": [
        "SSRI",
        "depression",
        "anxiety",
        "ocd"
    ],
    "dosing": {
        "adult_acute": "50-200 mg/day",
        "adult_maintenance": "50-200 mg/day",
        "notes": "Take with food.",
        "canadian_clinical": {
            "starting_dose": "25-50 mg/day (start 25mg for anxiety/panic)",
            "titration_schedule": "Increase by 25-50mg every 1-2 weeks.",
            "inpatient_strategy": "Start 50mg. Increase to 100mg after 5 days if tolerated.",
            "outpatient_strategy": "Start 25mg x 1 week, then 50mg. Review in 4 weeks.",
            "max_dose_evidence": "200 mg/day",
            "max_dose_practice": "250-300 mg/day (OCD cases, off-label)."
        }
    },
    "cautions": {
        "renal": "No adjustment.",
        "hepatic": "Reduce dose or frequency.",
        "pregnancy": "Generally considered first-line SSRI for pregnancy/breastfeeding."
    },
    "warnings": [
        "GI Upset (Nausea/Diarrhea)",
        "Sexual Dysfunction",
        "Initial anxiety increase"
    ],
    "citations": [
        "CANMAT Depression 2016",
        "CIPRA"
    ]
}
EOF_48_server_data_meds_sertraline_json

    # Create: server/data/meds/valproate.json
    create_file "server/data/meds/valproate.json"
    cat > "server/data/meds/valproate.json" << 'EOF_49_server_data_meds_valproate_json'
{
    "name": "Valproate",
    "genericName": "Divalproex Sodium",
    "tags": [
        "mood stabilizer",
        "mania",
        "seizures"
    ],
    "dosing": {
        "adult_acute": "750-1000 mg/day (loading dose 20mg/kg in mania)",
        "adult_maintenance": "1000-2000 mg/day",
        "notes": "Monitor VPA levels.",
        "canadian_clinical": {
            "starting_dose": "250mg TID or 500mg BID (or 20mg/kg loading for acute mania)",
            "titration_schedule": "Increase by 250-500mg every 3 days based on tolerability using monitoring levels.",
            "inpatient_strategy": "Rapid loading: 20-30mg/kg/day can be used to reach therapeutic levels within 24 hours.",
            "outpatient_strategy": "Start 250mg TID, increase by 250-500mg weekly to minimize GI side effects.",
            "max_dose_evidence": "60 mg/kg/day (Product Monograph)",
            "max_dose_practice": "Often capped around 2500-3000mg/day depending on levels/side effects."
        }
    },
    "cautions": {
        "renal": "No adjustment needed.",
        "hepatic": "Contraindicated in severe hepatic impairment. Monitor LFTs.",
        "pregnancy": "Teratogenic (Neural Tube Defects). Avoid if possible in women of childbearing potential."
    },
    "warnings": [
        "Hepatotoxicity",
        "Pancreatitis",
        "Teratogenicity",
        "Thrombocytopenia"
    ],
    "citations": [
        "CANMAT Bipolar Guidelines 2018",
        "Stahl's Essential Psychopharmacology"
    ]
}
EOF_49_server_data_meds_valproate_json

    # Create: server/data/meds/venlafaxine.json
    create_file "server/data/meds/venlafaxine.json"
    cat > "server/data/meds/venlafaxine.json" << 'EOF_50_server_data_meds_venlafaxine_json'
{
    "name": "Venlafaxine",
    "genericName": "Venlafaxine XR (Effexor XR)",
    "tags": [
        "SNRI",
        "Antidepressant",
        "Anxiety"
    ],
    "dosing": {
        "adult_acute": "Depression: 75 mg XR daily, may increase to 225 mg/day. Anxiety: 75-225 mg/day",
        "adult_maintenance": "75-225 mg/day XR",
        "notes": "Take with food. XR preferred. Avoid IR formulation. Max 375 mg/day."
    },
    "cautions": {
        "renal": "Reduce dose 25-50% in moderate-severe renal impairment",
        "hepatic": "Reduce dose 50% in hepatic impairment",
        "pregnancy": "Cat C - Neonatal complications reported"
    },
    "warnings": [
        "Dose-dependent BP elevation (monitor BP)",
        "Higher discontinuation syndrome vs SSRIs - MUST taper",
        "Suicidality risk in young adults",
        "Avoid with MAOIs",
        "More activating than SSRIs"
    ],
    "citations": [
        "CANMAT Depression 2016",
        "NICE GAD 2011"
    ]
}
EOF_50_server_data_meds_venlafaxine_json

    # Create: server/index.js
    create_file "server/index.js"
    cat > "server/index.js" << 'EOF_51_server_index_js'
/**
 * MedMicro PWA - Standalone Server
 * A Progressive Web App for medical reference
 */

const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const apiRouter = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for PWA to work properly
  crossOriginEmbedderPolicy: false
}));

// Compression
app.use(compression());

// CORS
app.use(cors());

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, '../public'), {
  maxAge: NODE_ENV === 'production' ? '1y' : 0,
  etag: true
}));

// API routes
app.use('/api', apiRouter);

// PWA manifest with correct MIME type
app.get('/manifest.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.sendFile(path.join(__dirname, '../public/manifest.json'));
});

// Service worker with correct MIME type
app.get('/sw.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, '../public/sw.js'));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: NODE_ENV
  });
});

// SPA fallback - serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║         🏥  MedMicro PWA Server Running  🏥                  ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`  📱 Local:    http://localhost:${PORT}`);
  console.log(`  🌐 Network:  http://[your-ip]:${PORT}`);
  console.log(`  🔧 Mode:     ${NODE_ENV}`);
  console.log('');
  console.log('  Press Ctrl+C to stop');
  console.log('');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received, shutting down gracefully...');
  process.exit(0);
});

EOF_51_server_index_js

    # Create: server/routes/api.js
    create_file "server/routes/api.js"
    cat > "server/routes/api.js" << 'EOF_52_server_routes_api_js'
/**
 * API Routes for MedMicro PWA
 */

const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();

// Data caches
let medsCache = [];
let guidelinesCache = [];
let criteriaCache = [];

// Load data on startup
async function loadData() {
  try {
    // Load medications
    const medsDir = path.join(__dirname, '../data/meds');
    const medFiles = await fs.readdir(medsDir);
    medsCache = await Promise.all(
      medFiles
        .filter(f => f.endsWith('.json'))
        .map(async (file) => {
          const content = await fs.readFile(path.join(medsDir, file), 'utf-8');
          return JSON.parse(content);
        })
    );

    // Load guidelines
    const guidelinesDir = path.join(__dirname, '../data/guidelines');
    const guidelineFiles = await fs.readdir(guidelinesDir);
    guidelinesCache = await Promise.all(
      guidelineFiles
        .filter(f => f.endsWith('.md'))
        .map(async (file) => {
          const content = await fs.readFile(path.join(guidelinesDir, file), 'utf-8');

          // Parse frontmatter
          const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
          if (!match) return null;

          const fmText = match[1];
          const body = match[2];

          const titleMatch = fmText.match(/title:\s*"(.*)"/);
          const orgMatch = fmText.match(/organization:\s*"(.*)"/);
          const yearMatch = fmText.match(/year:\s*(\d+)/);

          return {
            id: file,
            title: titleMatch ? titleMatch[1] : file,
            organization: orgMatch ? orgMatch[1] : '',
            year: yearMatch ? parseInt(yearMatch[1]) : 0,
            content: body
          };
        })
    );
    guidelinesCache = guidelinesCache.filter(Boolean);

    // Load criteria
    const criteriaDir = path.join(__dirname, '../data/criteria');
    const criteriaFiles = await fs.readdir(criteriaDir);
    criteriaCache = await Promise.all(
      criteriaFiles
        .filter(f => f.endsWith('.json'))
        .map(async (file) => {
          const content = await fs.readFile(path.join(criteriaDir, file), 'utf-8');
          return JSON.parse(content);
        })
    );

    console.log(`✓ Loaded ${medsCache.length} medications`);
    console.log(`✓ Loaded ${guidelinesCache.length} guidelines`);
    console.log(`✓ Loaded ${criteriaCache.length} criteria`);
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

// Load data on module initialization
loadData();

// Medications endpoints
router.get('/meds', (req, res) => {
  res.json({ success: true, data: medsCache });
});

router.get('/meds/search', (req, res) => {
  const query = (req.query.q || '').toLowerCase();
  const med = medsCache.find(m => m.name.toLowerCase().includes(query));
  res.json({ success: true, data: med || null });
});

router.get('/meds/class/:class', (req, res) => {
  const className = req.params.class.toLowerCase();
  const meds = medsCache.filter(m =>
    m.tags.some(tag => tag.toLowerCase().includes(className))
  );
  res.json({ success: true, data: meds });
});

// Guidelines endpoints
router.get('/guidelines', (req, res) => {
  const query = (req.query.q || '').toLowerCase();

  if (!query) {
    return res.json({ success: true, data: guidelinesCache });
  }

  const filtered = guidelinesCache.filter(g =>
    g.title.toLowerCase().includes(query) ||
    g.content.toLowerCase().includes(query)
  );
  res.json({ success: true, data: filtered });
});

// Criteria endpoints
router.get('/criteria/:disorder', (req, res) => {
  const disorder = req.params.disorder.toLowerCase();
  const criteria = criteriaCache.find(c =>
    c.disorder.toLowerCase().includes(disorder)
  );
  res.json({ success: true, data: criteria || null });
});

// Calculator endpoints
router.post('/calc/phq9', (req, res) => {
  const { score } = req.body;
  const s = parseInt(score);

  let interpretation;
  if (s <= 4) interpretation = 'None-minimal';
  else if (s <= 9) interpretation = 'Mild';
  else if (s <= 14) interpretation = 'Moderate';
  else if (s <= 19) interpretation = 'Moderately severe';
  else interpretation = 'Severe';

  res.json({ success: true, data: { score: s, interpretation } });
});

router.post('/calc/gad7', (req, res) => {
  const { score } = req.body;
  const s = parseInt(score);

  let interpretation;
  if (s <= 4) interpretation = 'Minimal';
  else if (s <= 9) interpretation = 'Mild';
  else if (s <= 14) interpretation = 'Moderate';
  else interpretation = 'Severe';

  res.json({ success: true, data: { score: s, interpretation } });
});

router.post('/calc/bmi', (req, res) => {
  const { weight, height } = req.body;
  const bmi = (parseFloat(weight) / Math.pow(parseFloat(height) / 100, 2));

  let interpretation;
  if (bmi < 18.5) interpretation = 'Underweight';
  else if (bmi < 25) interpretation = 'Normal weight';
  else if (bmi < 30) interpretation = 'Overweight';
  else interpretation = 'Obese';

  res.json({ success: true, data: { bmi: bmi.toFixed(1), interpretation } });
});

module.exports = router;

EOF_52_server_routes_api_js
}

# Execute main function
main "$@"
