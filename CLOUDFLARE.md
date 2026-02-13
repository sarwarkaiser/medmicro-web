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
