# 🕵️‍♂️ Full-Stack Invisible Watermarking App

A modern full-stack web application for **embedding and extracting invisible watermarks** in academic documents using **Discrete Wavelet Transform (DWT)** and **OCR with EasyOCR**.

## 🏗️ Architecture

This is a **full-stack application** with:

- **Backend**: FastAPI (Python) with SQLAlchemy ORM
- **Frontend**: React.js with Tailwind CSS
- **Database**: SQLite (can be upgraded to PostgreSQL)
- **Authentication**: JWT-based authentication
- **File Storage**: Local file system

## 🚀 Features

### Core Functionality
- 🎯 **Invisible Watermarking** using DWT (Haar Wavelet)
- 🧠 **OCR Integration** using EasyOCR to read extracted text
- 🖼️ Upload & process PNG/JPEG images
- 📉 Displays embedding metrics (PSNR, SSIM, MSE)

### Full-Stack Features
- 👤 **User Authentication** (Register/Login)
- 📊 **Operation History** tracking
- 🎨 **Modern UI** with responsive design
- 🔒 **Protected Routes** and JWT tokens
- 📁 **File Management** with download capabilities

## 📁 Project Structure

```
watermark-app/
├── backend/                 # FastAPI Backend
│   ├── app/
│   │   ├── core/           # Configuration & Database
│   │   ├── routers/        # API Routes
│   │   ├── services/       # Business Logic
│   │   ├── models.py       # Database Models
│   │   └── schemas.py      # Pydantic Schemas
│   ├── requirements.txt    # Python Dependencies
│   └── uploads/           # File Storage
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── components/     # React Components
│   │   ├── contexts/       # React Contexts
│   │   ├── pages/          # Page Components
│   │   └── App.js          # Main App
│   ├── package.json        # Node Dependencies
│   └── public/            # Static Files
└── README.md              # This file
```

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - Database ORM
- **OpenCV** - Image processing
- **PyWavelets** - DWT implementation
- **EasyOCR** - Text recognition
- **JWT** - Authentication
- **Pydantic** - Data validation

### Frontend
- **React 18** - UI framework
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Dropzone** - File uploads
- **Lucide React** - Icons

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### 1. Clone and Setup
```bash
git clone <your-repo-url>
cd watermark-app
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 📖 Usage

### 1. Register/Login
- Create an account or login with existing credentials
- JWT tokens are automatically managed

### 2. Embed Watermark
- Navigate to "Embed" page
- Upload an image (PNG/JPG/JPEG)
- Enter watermark text (e.g., registration number)
- Download the watermarked image
- View quality metrics (PSNR, SSIM, MSE)

### 3. Extract Watermark
- Navigate to "Extract" page
- Upload both watermarked and original images
- View extracted text using OCR
- Check operation history

### 4. View History
- Track all watermarking operations
- Download previous watermarked images
- View operation metrics and timestamps

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/token` - User login
- `GET /api/auth/me` - Get current user

### Watermarking
- `POST /api/watermark/embed` - Embed watermark
- `POST /api/watermark/extract` - Extract watermark
- `GET /api/watermark/download/{filename}` - Download file
- `GET /api/watermark/history` - Get operation history

## 🗄️ Database Schema

### Users Table
- `id` - Primary key
- `email` - Unique email
- `username` - Unique username
- `hashed_password` - Encrypted password
- `created_at` - Registration timestamp
- `is_active` - Account status

### Watermark Operations Table
- `id` - Primary key
- `user_id` - Foreign key to users
- `operation_type` - "embed" or "extract"
- `original_filename` - Original file name
- `watermarked_filename` - Processed file name
- `watermark_text` - Embedded text
- `psnr`, `ssim`, `mse` - Quality metrics
- `created_at` - Operation timestamp

## 🔒 Security Features

- **JWT Authentication** with token expiration
- **Password Hashing** using bcrypt
- **Protected Routes** requiring authentication
- **CORS Configuration** for frontend-backend communication
- **Input Validation** using Pydantic schemas

## 🚀 Deployment

### Quick Start (Docker)

The easiest way to deploy your watermarking app is using Docker:

```bash
# Development deployment
./deploy.bat deploy dev    # Windows
./deploy.sh deploy dev     # Linux/Mac

# Production deployment
./deploy.bat deploy prod   # Windows
./deploy.sh deploy prod    # Linux/Mac
```

### Manual Docker Deployment

```bash
# Development
docker-compose up --build

# Production
docker-compose -f docker-compose.prod.yml up --build -d
```

### Cloud Deployment Options

#### 1. Railway (Recommended - Easiest)
1. Sign up at [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Railway will automatically detect and deploy your app

#### 2. Render.com
1. Create account at [render.com](https://render.com)
2. Create new Web Service
3. Connect your GitHub repo
4. Set environment variables

#### 3. Heroku
```bash
# Install Heroku CLI
heroku create your-watermark-app
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
```

#### 4. DigitalOcean App Platform
1. Create account at [digitalocean.com](https://digitalocean.com)
2. Create App from GitHub repository
3. Select Docker deployment

### Environment Configuration

Copy the example environment file and configure it:

```bash
cp env.example .env
# Edit .env with your production values
```

### Production Considerations

- **Database**: Use PostgreSQL for production
- **Security**: Change default SECRET_KEY
- **SSL**: Configure HTTPS certificates
- **Monitoring**: Set up health checks and logging
- **Backups**: Implement regular database backups

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **DWT Algorithm** - Discrete Wavelet Transform for watermarking
- **EasyOCR** - Text recognition capabilities
- **FastAPI** - Modern Python web framework
- **React** - Frontend framework

---

## 📦 Tech Stack

- `FastAPI` - Backend API framework
- `React` - Frontend framework
- `SQLAlchemy` - Database ORM
- `OpenCV` - Image processing
- `EasyOCR` - Text recognition
- `Tailwind CSS` - Styling
- `JWT` - Authentication