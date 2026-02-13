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
