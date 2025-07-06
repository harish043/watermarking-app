# 🎨 Render Deployment Preparation Script
# This script helps prepare your watermarking app for Render deployment

Write-Host "🎨 Preparing Watermark App for Render Deployment..." -ForegroundColor Green
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

Write-Host "✅ Git repository found!" -ForegroundColor Green
Write-Host ""

# Display Render deployment steps
Write-Host "🚀 Render Deployment Steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. 📝 Push your code to GitHub:" -ForegroundColor White
Write-Host "   git add ." -ForegroundColor Gray
Write-Host "   git commit -m 'Ready for Render deployment'" -ForegroundColor Gray
Write-Host "   git push origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "2. 🌐 Go to Render: https://render.com" -ForegroundColor White
Write-Host "   - Sign up/Login with GitHub" -ForegroundColor Gray
Write-Host ""
Write-Host "3. 🔧 Deploy Backend (Web Service):" -ForegroundColor White
Write-Host "   - Click 'New +' → 'Web Service'" -ForegroundColor Gray
Write-Host "   - Connect your GitHub repo: watermark-app" -ForegroundColor Gray
Write-Host "   - Name: watermark-backend" -ForegroundColor Gray
Write-Host "   - Root Directory: backend" -ForegroundColor Gray
Write-Host "   - Build Command: pip install -r requirements.txt" -ForegroundColor Gray
Write-Host "   - Start Command: uvicorn app.main:app --host 0.0.0.0 --port `$PORT" -ForegroundColor Gray
Write-Host ""
Write-Host "4. 🎨 Deploy Frontend (Static Site):" -ForegroundColor White
Write-Host "   - Click 'New +' → 'Static Site'" -ForegroundColor Gray
Write-Host "   - Connect same GitHub repo: watermark-app" -ForegroundColor Gray
Write-Host "   - Name: watermark-frontend" -ForegroundColor Gray
Write-Host "   - Root Directory: frontend" -ForegroundColor Gray
Write-Host "   - Build Command: npm install && npm run build" -ForegroundColor Gray
Write-Host "   - Publish Directory: build" -ForegroundColor Gray
Write-Host ""

# Check current git status
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "📝 You have uncommitted changes:" -ForegroundColor Yellow
    Write-Host $gitStatus -ForegroundColor Gray
    Write-Host ""
    Write-Host "💡 Recommended: Commit your changes before deploying" -ForegroundColor Cyan
    Write-Host "   git add ." -ForegroundColor Yellow
    Write-Host "   git commit -m 'Ready for Render deployment'" -ForegroundColor Yellow
    Write-Host "   git push origin main" -ForegroundColor Yellow
} else {
    Write-Host "✅ All changes are committed!" -ForegroundColor Green
}

Write-Host ""
Write-Host "🔑 Environment Variables for Render:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend Environment Variables:" -ForegroundColor White
Write-Host "SECRET_KEY=Kcq6u-ZWfH6VBkjEJduAKQ3cfLsheMwar2P3N3nCJjw" -ForegroundColor Gray
Write-Host "JWT_SECRET=uMU2IVYPe4bFvj4y3_oY6YWhkrgZf2qZawWVBd8Eipc" -ForegroundColor Gray
Write-Host "JWT_ALGORITHM=HS256" -ForegroundColor Gray
Write-Host "ACCESS_TOKEN_EXPIRE_MINUTES=30" -ForegroundColor Gray
Write-Host "DATABASE_URL=sqlite:///./watermark_app.db" -ForegroundColor Gray
Write-Host "UPLOAD_DIR=/opt/render/project/src/uploads" -ForegroundColor Gray
Write-Host "MAX_FILE_SIZE=10485760" -ForegroundColor Gray
Write-Host ""
Write-Host "Frontend Environment Variables:" -ForegroundColor White
Write-Host "REACT_APP_API_URL=https://your-backend-url.onrender.com" -ForegroundColor Gray
Write-Host ""

Write-Host "📖 For detailed instructions, see RENDER_DEPLOYMENT.md" -ForegroundColor Cyan
Write-Host ""

Write-Host "🎉 Ready to deploy on Render! Follow the steps above." -ForegroundColor Green
Write-Host ""

Write-Host "🔗 Quick Links:" -ForegroundColor Cyan
Write-Host "   Render Dashboard: https://dashboard.render.com" -ForegroundColor Blue
Write-Host "   Render Docs: https://render.com/docs" -ForegroundColor Blue 