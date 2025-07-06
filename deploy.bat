@echo off
REM 🚀 Watermark App Deployment Script for Windows
REM This script helps you deploy your watermarking app on Windows

echo 🚀 Starting Watermark App Deployment...

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

echo [SUCCESS] Docker and Docker Compose are installed

REM Check if .env file exists
if not exist .env (
    echo [WARNING] .env file not found. Creating from example...
    if exist env.example (
        copy env.example .env >nul
        echo [SUCCESS] Created .env file from env.example
        echo [WARNING] Please edit .env file with your production values
    ) else (
        echo [ERROR] env.example file not found. Please create a .env file manually.
        pause
        exit /b 1
    )
) else (
    echo [SUCCESS] .env file found
)

REM Parse command line arguments
set COMMAND=%1
set MODE=%2

if "%COMMAND%"=="" set COMMAND=deploy
if "%MODE%"=="" set MODE=dev

REM Validate mode
if not "%MODE%"=="dev" if not "%MODE%"=="prod" (
    echo [ERROR] Invalid mode: %MODE%. Use 'dev' or 'prod'
    goto :help
)

REM Execute commands
if "%COMMAND%"=="deploy" goto :deploy
if "%COMMAND%"=="stop" goto :stop
if "%COMMAND%"=="logs" goto :logs
if "%COMMAND%"=="status" goto :status
if "%COMMAND%"=="cleanup" goto :cleanup
if "%COMMAND%"=="help" goto :help
goto :help

:deploy
echo [INFO] Building and deploying in %MODE% mode...
if "%MODE%"=="prod" (
    docker-compose -f docker-compose.prod.yml up --build -d
    echo [SUCCESS] Production deployment completed!
    echo [INFO] Frontend: http://localhost:80
    echo [INFO] Backend: http://localhost:8000
    echo [INFO] API Docs: http://localhost:8000/docs
) else (
    docker-compose up --build -d
    echo [SUCCESS] Development deployment completed!
    echo [INFO] Frontend: http://localhost:3000
    echo [INFO] Backend: http://localhost:8000
    echo [INFO] API Docs: http://localhost:8000/docs
)
goto :end

:stop
echo [INFO] Stopping services...
if "%MODE%"=="prod" (
    docker-compose -f docker-compose.prod.yml down
) else (
    docker-compose down
)
echo [SUCCESS] Services stopped
goto :end

:logs
echo [INFO] Showing logs...
if "%MODE%"=="prod" (
    docker-compose -f docker-compose.prod.yml logs -f
) else (
    docker-compose logs -f
)
goto :end

:status
echo [INFO] Container status:
if "%MODE%"=="prod" (
    docker-compose -f docker-compose.prod.yml ps
) else (
    docker-compose ps
)
goto :end

:cleanup
echo [INFO] Cleaning up Docker resources...
docker system prune -f
docker volume prune -f
echo [SUCCESS] Cleanup completed
goto :end

:help
echo Usage: %0 [COMMAND] [MODE]
echo.
echo Commands:
echo   deploy     Deploy the application
echo   stop       Stop the application
echo   logs       Show application logs
echo   status     Show container status
echo   cleanup    Clean up Docker resources
echo   help       Show this help message
echo.
echo Modes:
echo   dev        Development mode ^(default^)
echo   prod       Production mode
echo.
echo Examples:
echo   %0 deploy dev      # Deploy in development mode
echo   %0 deploy prod     # Deploy in production mode
echo   %0 stop prod       # Stop production services
echo   %0 logs dev        # Show development logs
goto :end

:end
pause 