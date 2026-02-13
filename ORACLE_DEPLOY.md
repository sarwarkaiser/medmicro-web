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
