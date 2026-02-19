# MedMicro Docker Run Script
# Usage: .\docker-run.ps1 [build|up|down|logs|clean]

param(
    [Parameter()]
    [ValidateSet("build", "up", "down", "logs", "clean", "status")]
    [string]$Command = "up"
)

$ProjectName = "medmicro"

function Write-Header($text) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  $text" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
}

switch ($Command) {
    "build" {
        Write-Header "Building MedMicro Docker Image"
        docker-compose build --no-cache
        Write-Host "✓ Build complete!" -ForegroundColor Green
    }
    
    "up" {
        Write-Header "Starting MedMicro Server"
        
        # Check if already running
        $running = docker ps -q -f name=medmicro-web
        if ($running) {
            Write-Host "MedMicro is already running!" -ForegroundColor Yellow
            Write-Host "Access it at: http://localhost:3000" -ForegroundColor Cyan
            return
        }
        
        # Build if needed and start
        docker-compose up --build -d
        
        Write-Host ""
        Write-Host "✓ MedMicro server started!" -ForegroundColor Green
        Write-Host ""
        Write-Host "  📱 Local:   http://localhost:3000" -ForegroundColor Cyan
        Write-Host "  🔧 Health:  http://localhost:3000/health" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Logs: .\docker-run.ps1 logs" -ForegroundColor Gray
        Write-Host "Stop: .\docker-run.ps1 down" -ForegroundColor Gray
    }
    
    "down" {
        Write-Header "Stopping MedMicro Server"
        docker-compose down
        Write-Host "✓ Server stopped!" -ForegroundColor Green
    }
    
    "logs" {
        Write-Header "MedMicro Server Logs"
        docker-compose logs -f
    }
    
    "clean" {
        Write-Header "Cleaning Up Docker Resources"
        docker-compose down -v
        docker rmi medmicro-web:latest 2>$null
        Write-Host "✓ Cleanup complete!" -ForegroundColor Green
    }
    
    "status" {
        Write-Header "MedMicro Status"
        $running = docker ps -q -f name=medmicro-web
        if ($running) {
            Write-Host "✓ MedMicro is RUNNING" -ForegroundColor Green
            Write-Host ""
            Write-Host "Container Info:" -ForegroundColor Cyan
            docker ps -f name=medmicro-web --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
            Write-Host ""
            Write-Host "Access URLs:" -ForegroundColor Cyan
            Write-Host "  http://localhost:3000"
            Write-Host "  http://127.0.0.1:3000"
        } else {
            Write-Host "✗ MedMicro is NOT running" -ForegroundColor Red
            Write-Host ""
            Write-Host "Start it with: .\docker-run.ps1 up" -ForegroundColor Yellow
        }
    }
}
