@echo off
:: MedMicro Docker Run Script for Windows CMD
:: Usage: docker-run.bat [build|up|down|logs|clean|status]

set COMMAND=%1
if "%COMMAND%"=="" set COMMAND=up

echo.
echo ========================================
echo   MedMicro Docker Manager
echo ========================================
echo.

if "%COMMAND%"=="build" (
    echo Building MedMicro Docker Image...
    docker-compose build --no-cache
    echo Build complete!
    goto :end
)

if "%COMMAND%"=="up" (
    echo Starting MedMicro Server...
    docker-compose up --build -d
    echo.
    echo MedMicro server started!
    echo.
    echo   Local:   http://localhost:3000
    echo   Health:  http://localhost:3000/health
    echo.
    goto :end
)

if "%COMMAND%"=="down" (
    echo Stopping MedMicro Server...
    docker-compose down
    echo Server stopped!
    goto :end
)

if "%COMMAND%"=="logs" (
    echo Showing MedMicro logs (Ctrl+C to exit)...
    docker-compose logs -f
    goto :end
)

if "%COMMAND%"=="clean" (
    echo Cleaning up Docker resources...
    docker-compose down -v
    docker rmi medmicro-web:latest 2>nul
    echo Cleanup complete!
    goto :end
)

if "%COMMAND%"=="status" (
    echo Checking MedMicro status...
    docker ps -f name=medmicro-web --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    goto :end
)

echo Unknown command: %COMMAND%
echo.
echo Usage: docker-run.bat [build^|up^|down^|logs^|clean^|status]
echo.
echo Commands:
echo   build   - Build the Docker image
echo   up      - Start the server (default)
echo   down    - Stop the server
echo   logs    - View server logs
echo   clean   - Remove containers and images
echo   status  - Check if server is running

:end
