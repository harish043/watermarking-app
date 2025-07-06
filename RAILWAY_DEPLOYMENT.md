# 🚂 Railway Deployment Guide for Monorepo

## 🎯 **Railway Deployment Steps**

Since your app is a monorepo (frontend + backend), you'll need to deploy them as separate services on Railway.

### **Step 1: Deploy Backend First**

1. **Go to Railway Dashboard**: [railway.app](https://railway.app)
2. **Create New Project** → "Deploy from GitHub repo"
3. **Select your repository**: `watermark-app`
4. **Railway will detect** the backend automatically due to `backend/railway.json`
5. **Configure Environment Variables**:

```
SECRET_KEY=Kcq6u-ZWfH6VBkjEJduAKQ3cfLsheMwar2P3N3nCJjw
JWT_SECRET=uMU2IVYPe4bFvj4y3_oY6YWhkrgZf2qZawWVBd8Eipc
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DATABASE_URL=sqlite:///./watermark_app.db
UPLOAD_DIR=/app/uploads
MAX_FILE_SIZE=10485760
```

6. **Deploy** - Railway will build and deploy your backend
7. **Note the backend URL** (e.g., `https://watermark-backend.railway.app`)

### **Step 2: Deploy Frontend**

1. **In the same Railway project**, click "New Service"
2. **Select "Deploy from GitHub repo"** (same repository)
3. **Railway will detect** the frontend automatically due to `frontend/railway.json`
4. **Configure Environment Variables**:

```
REACT_APP_API_URL=https://your-backend-url.railway.app
```

5. **Deploy** - Railway will build and deploy your frontend
6. **Note the frontend URL** (e.g., `https://watermark-frontend.railway.app`)

### **Step 3: Update Backend CORS**

1. **Go back to your backend service** in Railway
2. **Add/Update Environment Variable**:

```
ALLOWED_ORIGINS=https://your-frontend-url.railway.app
```

3. **Redeploy** the backend service

---

## 🔧 **Alternative: Manual Service Creation**

If Railway doesn't auto-detect the services, create them manually:

### **Backend Service**
- **Repository**: `watermark-app`
- **Root Directory**: `backend`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### **Frontend Service**
- **Repository**: `watermark-app`
- **Root Directory**: `frontend`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

---

## 🌐 **Final URLs**

After deployment, you'll have:
- **Frontend**: `https://watermark-frontend.railway.app`
- **Backend API**: `https://watermark-backend.railway.app`
- **API Docs**: `https://watermark-backend.railway.app/docs`

---

## 🚨 **Troubleshooting**

### **Build Failures**
1. **Check build logs** in Railway dashboard
2. **Verify dependencies** are in requirements.txt/package.json
3. **Check file paths** are correct

### **Environment Variables**
1. **Ensure all variables** are set correctly
2. **Check CORS origins** match your frontend URL
3. **Verify API URL** in frontend environment

### **Service Communication**
1. **Test backend health**: `https://your-backend.railway.app/health`
2. **Check API docs**: `https://your-backend.railway.app/docs`
3. **Verify frontend can reach backend**

---

## 📊 **Monitoring**

- **Railway Dashboard**: Monitor logs, metrics, and deployments
- **Health Checks**: Automatic health monitoring
- **Logs**: Real-time application logs
- **Metrics**: Performance and usage statistics

---

## 💰 **Costs**

- **Free Tier**: $5 credit/month
- **Backend**: ~$2-3/month for small usage
- **Frontend**: ~$1-2/month for static hosting
- **Total**: ~$3-5/month for both services

---

## 🎉 **Success!**

Your watermarking app is now live and accessible worldwide! 🌍 