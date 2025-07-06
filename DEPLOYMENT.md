# 🚀 Deployment Guide

This guide covers multiple deployment options for your watermarking app, from simple local deployment to production-ready cloud solutions.

## 📋 Prerequisites

- Docker and Docker Compose installed
- Git repository set up
- Domain name (for production)

## 🐳 Option 1: Docker Compose (Recommended)

### Local Development
```bash
# Build and run both services
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Production with Docker Compose
```bash
# Create production docker-compose file
docker-compose -f docker-compose.prod.yml up -d

# Stop services
docker-compose down
```

## ☁️ Option 2: Cloud Deployment

### A. Railway (Easiest Cloud Option)

1. **Sign up** at [railway.app](https://railway.app)
2. **Connect your GitHub repository**
3. **Deploy automatically**:
   ```bash
   # Railway will detect your docker-compose.yml
   # and deploy both services automatically
   ```

### B. Render.com

1. **Create account** at [render.com](https://render.com)
2. **Create new Web Service**:
   - Connect your GitHub repo
   - Build Command: `docker build -t watermark-app .`
   - Start Command: `docker-compose up`
   - Environment Variables:
     ```
     DATABASE_URL=postgresql://...
     SECRET_KEY=your-production-secret
     ```

### C. Heroku

1. **Install Heroku CLI**
2. **Create Heroku app**:
   ```bash
   heroku create your-watermark-app
   heroku addons:create heroku-postgresql:hobby-dev
   ```

3. **Deploy**:
   ```bash
   git push heroku main
   ```

### D. DigitalOcean App Platform

1. **Create account** at [digitalocean.com](https://digitalocean.com)
2. **Create App**:
   - Connect GitHub repository
   - Select Docker deployment
   - Configure environment variables

## 🐳 Option 3: Kubernetes (Advanced)

### Create Kubernetes manifests:

```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: watermark-app

---
# k8s/backend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  namespace: watermark-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: watermark-app-backend:latest
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: database-url
        - name: SECRET_KEY
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: secret-key

---
# k8s/frontend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  namespace: watermark-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: watermark-app-frontend:latest
        ports:
        - containerPort: 3000
        env:
        - name: REACT_APP_API_URL
          value: "https://api.yourdomain.com"

---
# k8s/services.yaml
apiVersion: v1
kind: Service
metadata:
  name: backend-service
  namespace: watermark-app
spec:
  selector:
    app: backend
  ports:
  - port: 80
    targetPort: 8000
  type: ClusterIP

---
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
  namespace: watermark-app
spec:
  selector:
    app: frontend
  ports:
  - port: 80
    targetPort: 3000
  type: LoadBalancer
```

## 🔧 Production Configuration

### Environment Variables

Create a `.env` file for production:

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Security
SECRET_KEY=your-super-secret-key-here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# File Storage
UPLOAD_DIR=/app/uploads
MAX_FILE_SIZE=10485760  # 10MB

# API Configuration
API_V1_STR=/api/v1
PROJECT_NAME=Watermark App
```

### Production Docker Compose

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - SECRET_KEY=${SECRET_KEY}
      - ALLOWED_ORIGINS=${ALLOWED_ORIGINS}
    volumes:
      - uploads:/app/uploads
    restart: unless-stopped
    command: gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000

  frontend:
    build: 
      context: ./frontend
      dockerfile: Dockerfile.prod
    ports:
      - "80:80"
    environment:
      - REACT_APP_API_URL=${REACT_APP_API_URL}
    depends_on:
      - backend
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - backend
      - frontend
    restart: unless-stopped

volumes:
  uploads:
```

### Production Frontend Dockerfile

```dockerfile
# frontend/Dockerfile.prod
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🔒 Security Considerations

### 1. Environment Variables
- Never commit `.env` files
- Use secrets management in production
- Rotate keys regularly

### 2. Database Security
- Use strong passwords
- Enable SSL connections
- Regular backups

### 3. API Security
- Rate limiting
- Input validation
- CORS configuration
- HTTPS only

### 4. File Upload Security
- File type validation
- Size limits
- Virus scanning
- Secure storage

## 📊 Monitoring & Logging

### Health Checks
```yaml
# Add to docker-compose.yml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
  interval: 30s
  timeout: 10s
  retries: 3
```

### Logging
```yaml
# Add to docker-compose.yml
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

## 🚀 Quick Deploy Commands

### Local Development
```bash
# Start development
docker-compose up --build

# Stop services
docker-compose down

# View logs
docker-compose logs -f
```

### Production
```bash
# Deploy to production
docker-compose -f docker-compose.prod.yml up -d

# Update deployment
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d

# Backup database
docker-compose exec backend python -c "import sqlite3; conn = sqlite3.connect('watermark_app.db'); conn.backup('backup.db')"
```

## 🔧 Troubleshooting

### Common Issues

1. **Port conflicts**: Change ports in docker-compose.yml
2. **Database connection**: Check DATABASE_URL environment variable
3. **CORS errors**: Verify ALLOWED_ORIGINS configuration
4. **File uploads**: Check upload directory permissions

### Debug Commands
```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs backend
docker-compose logs frontend

# Access container shell
docker-compose exec backend bash
docker-compose exec frontend sh

# Check network connectivity
docker-compose exec backend ping frontend
```

## 📈 Scaling

### Horizontal Scaling
```bash
# Scale backend services
docker-compose up --scale backend=3

# Use load balancer
docker-compose up -d nginx
```

### Database Scaling
- Use PostgreSQL for production
- Implement connection pooling
- Consider read replicas for high traffic

## 🎯 Next Steps

1. **Choose deployment option** based on your needs
2. **Set up monitoring** and logging
3. **Configure SSL certificates**
4. **Set up CI/CD pipeline**
5. **Implement backup strategy**
6. **Monitor performance** and optimize

## 📞 Support

For deployment issues:
1. Check logs: `docker-compose logs`
2. Verify environment variables
3. Test locally first
4. Check network connectivity
5. Review security configuration 