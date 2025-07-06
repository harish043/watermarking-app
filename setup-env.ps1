# 🚀 Watermark App Environment Setup Script
# This script creates a .env file with secure keys

Write-Host "🔐 Setting up environment variables for Watermark App..." -ForegroundColor Green

# Check if .env already exists
if (Test-Path ".env") {
    Write-Host "⚠️  .env file already exists. Creating backup..." -ForegroundColor Yellow
    Copy-Item ".env" ".env.backup.$(Get-Date -Format 'yyyyMMdd-HHmmss')"
}

# Generate secure keys
$secretKey = python -c "import secrets; print(secrets.token_urlsafe(32))"
$jwtSecret = python -c "import secrets; print(secrets.token_urlsafe(32))"

# Create .env content
$envContent = @"
# 🔐 SECURITY KEYS (Generated securely)
SECRET_KEY=$secretKey
JWT_SECRET=$jwtSecret
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# 🗄️ DATABASE CONFIGURATION
DATABASE_URL=sqlite:///./watermark_app.db
# For PostgreSQL production: DATABASE_URL=postgresql://user:password@host:port/database

# 🌐 CORS & NETWORK CONFIGURATION
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:80,http://localhost:8000
REACT_APP_API_URL=http://localhost:8000

# 📁 FILE UPLOAD CONFIGURATION
UPLOAD_DIR=/app/uploads
MAX_FILE_SIZE=10485760

# 🔧 API CONFIGURATION
API_V1_STR=/api/v1
PROJECT_NAME=Watermark App

# 🚀 DEPLOYMENT CONFIGURATION
# Change these for production:
# ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
# REACT_APP_API_URL=https://api.yourdomain.com
# DATABASE_URL=postgresql://user:password@host:port/database
"@

# Write to .env file
$envContent | Out-File -FilePath ".env" -Encoding UTF8

Write-Host "✅ .env file created successfully!" -ForegroundColor Green
Write-Host "🔑 Generated SECRET_KEY: $secretKey" -ForegroundColor Cyan
Write-Host "🔑 Generated JWT_SECRET: $jwtSecret" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Yellow
Write-Host "1. Review the .env file configuration" -ForegroundColor White
Write-Host "2. Update URLs for production deployment" -ForegroundColor White
Write-Host "3. Run: .\deploy.bat deploy dev" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Remember: Never commit .env files to version control!" -ForegroundColor Red 