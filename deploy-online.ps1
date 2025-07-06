# 🚀 Online Deployment Preparation Script
# This script helps prepare your watermarking app for online deployment

Write-Host "🌐 Preparing Watermark App for Online Deployment..." -ForegroundColor Green
Write-Host ""

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "❌ Git repository not found. Please initialize git first:" -ForegroundColor Red
    Write-Host "   git init" -ForegroundColor Yellow
    Write-Host "   git add ." -ForegroundColor Yellow
    Write-Host "   git commit -m 'Initial commit'" -ForegroundColor Yellow
    Write-Host "   git remote add origin <your-github-repo-url>" -ForegroundColor Yellow
    Write-Host "   git push -u origin main" -ForegroundColor Yellow
    exit 1
}

# Check if .env is in .gitignore
$gitignoreContent = Get-Content ".gitignore" -ErrorAction SilentlyContinue
if ($gitignoreContent -notcontains ".env") {
    Write-Host "⚠️  Adding .env to .gitignore..." -ForegroundColor Yellow
    Add-Content ".gitignore" "`n# Environment files`n.env`n.env.local`n.env.production"
}

# Check if node_modules is in .gitignore
if ($gitignoreContent -notcontains "node_modules") {
    Write-Host "⚠️  Adding node_modules to .gitignore..." -ForegroundColor Yellow
    Add-Content ".gitignore" "`n# Dependencies`nnode_modules/"
}

# Check if uploads directory is in .gitignore
if ($gitignoreContent -notcontains "uploads/") {
    Write-Host "⚠️  Adding uploads/ to .gitignore..." -ForegroundColor Yellow
    Add-Content ".gitignore" "`n# Uploads`nuploads/"
}

# Check if database files are in .gitignore
if ($gitignoreContent -notcontains "*.db") {
    Write-Host "⚠️  Adding database files to .gitignore..." -ForegroundColor Yellow
    Add-Content ".gitignore" "`n# Database`n*.db`n*.sqlite3"
}

Write-Host "✅ Repository preparation completed!" -ForegroundColor Green
Write-Host ""

# Display deployment options
Write-Host "🎯 Choose your deployment platform:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. 🚂 Railway (Recommended - Easiest)" -ForegroundColor White
Write-Host "   - Perfect for full-stack apps" -ForegroundColor Gray
Write-Host "   - Free tier: $5 credit/month" -ForegroundColor Gray
Write-Host "   - Auto-detects frontend and backend" -ForegroundColor Gray
Write-Host ""
Write-Host "2. 🎨 Render" -ForegroundColor White
Write-Host "   - Great for static sites + APIs" -ForegroundColor Gray
Write-Host "   - Free tier: 750 hours/month" -ForegroundColor Gray
Write-Host "   - Separate services for frontend/backend" -ForegroundColor Gray
Write-Host ""
Write-Host "3. ⚡ Vercel + Railway (Hybrid)" -ForegroundColor White
Write-Host "   - Vercel for frontend (excellent React support)" -ForegroundColor Gray
Write-Host "   - Railway for backend" -ForegroundColor Gray
Write-Host "   - Both have generous free tiers" -ForegroundColor Gray
Write-Host ""

# Check current git status
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "📝 You have uncommitted changes:" -ForegroundColor Yellow
    Write-Host $gitStatus -ForegroundColor Gray
    Write-Host ""
    Write-Host "💡 Recommended: Commit your changes before deploying" -ForegroundColor Cyan
    Write-Host "   git add ." -ForegroundColor Yellow
    Write-Host "   git commit -m 'Ready for deployment'" -ForegroundColor Yellow
    Write-Host "   git push origin main" -ForegroundColor Yellow
} else {
    Write-Host "✅ All changes are committed!" -ForegroundColor Green
}

Write-Host ""
Write-Host "🔑 Your Environment Variables for deployment:" -ForegroundColor Cyan
Write-Host "SECRET_KEY=Kcq6u-ZWfH6VBkjEJduAKQ3cfLsheMwar2P3N3nCJjw" -ForegroundColor Gray
Write-Host "JWT_SECRET=uMU2IVYPe4bFvj4y3_oY6YWhkrgZf2qZawWVBd8Eipc" -ForegroundColor Gray
Write-Host "JWT_ALGORITHM=HS256" -ForegroundColor Gray
Write-Host "ACCESS_TOKEN_EXPIRE_MINUTES=30" -ForegroundColor Gray
Write-Host "DATABASE_URL=sqlite:///./watermark_app.db" -ForegroundColor Gray
Write-Host "UPLOAD_DIR=/app/uploads" -ForegroundColor Gray
Write-Host "MAX_FILE_SIZE=10485760" -ForegroundColor Gray
Write-Host ""

Write-Host "📖 For detailed deployment instructions, see HOSTING.md" -ForegroundColor Cyan
Write-Host ""

Write-Host "🎉 Ready to deploy! Choose your platform and follow the instructions." -ForegroundColor Green 