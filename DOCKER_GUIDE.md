# MedMicro Docker Guide

## 🚀 Quick Start

### Start the server
```powershell
# Using PowerShell script
.\docker-run.ps1 up

# Or using batch file (CMD)
docker-run.bat up

# Or directly with docker-compose
docker-compose up -d
```

### Access the application
- **Local**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## 📋 Available Commands

| Command | Description |
|---------|-------------|
| `.\docker-run.ps1 up` | Build and start the server |
| `.\docker-run.ps1 down` | Stop the server |
| `.\docker-run.ps1 logs` | View server logs |
| `.\docker-run.ps1 status` | Check if server is running |
| `.\docker-run.ps1 build` | Rebuild the Docker image |
| `.\docker-run.ps1 clean` | Remove containers and images |

## 🔧 Manual Docker Commands

```bash
# Build the image
docker-compose build

# Start the container
docker-compose up -d

# Stop the container
docker-compose down

# View logs
docker-compose logs -f

# Restart
docker-compose restart

# Check status
docker ps -f name=medmicro-web
```

## 🏥 What's Running

The Docker container includes:

- **Frontend**: React + TypeScript + Vite app (built and served statically)
- **Backend**: Express.js server with API endpoints
- **Data**: 46 medications, 18 guidelines, 11 DSM-5 criteria

## 🌐 API Endpoints

- `GET /health` - Health check
- `GET /api/meds` - All medications
- `GET /api/guidelines` - All guidelines
- `POST /api/calc/phq9` - PHQ-9 calculator
- `POST /api/calc/gad7` - GAD-7 calculator
- `POST /api/calc/bmi` - BMI calculator

## 🔒 Security Features

- Runs as non-root user (`nodejs`)
- Helmet.js for security headers
- Rate limiting on API routes (300 requests/15 min)
- CORS configured
- Health check endpoint

## 📊 Resource Usage

- **Port**: 3001 (host) → 3000 (container)
- **Memory**: ~100MB
- **Image Size**: ~150MB

## 🐛 Troubleshooting

### Port already in use
If port 3001 is taken, change it in `docker-compose.yml`:
```yaml
ports:
  - "3002:3000"  # Use 3002 instead
```

### Container won't start
```bash
# Check logs
docker logs medmicro-web

# Rebuild from scratch
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Reset everything
```bash
docker-compose down -v
docker rmi medmicro-web-medmicro:latest
docker-compose up --build -d
```

## 📁 Files Created

- `Dockerfile` - Multi-stage build configuration
- `docker-compose.yml` - Container orchestration
- `docker-run.ps1` - PowerShell helper script
- `docker-run.bat` - Windows CMD helper script
- `server/package.json` - Server dependencies

## 🆕 New Features Implemented

1. **Skeleton Loading** - Better loading states
2. **Keyboard Shortcuts** - Press 1-5 for quick navigation
3. **Treatment Algorithms** - Interactive decision trees
4. **Drug Comparison** - Side-by-side medication comparison
5. **Tabbed Detail Pages** - Organized medication info
6. **Quick Start Button** - Generate dosing plans
7. **Quick Filters** - One-click filtering
8. **Personal Notes** - Save notes per medication
