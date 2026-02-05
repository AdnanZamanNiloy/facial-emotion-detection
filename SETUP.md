# Complete Setup Guide

This guide will walk you through setting up the Emotion Detection system from scratch.

## 📋 Prerequisites

### Required Software
- **Python 3.8+** ([Download](https://www.python.org/downloads/))
- **Node.js 16+** ([Download](https://nodejs.org/))
- **Git** (optional, for version control)

### Hardware Requirements
- **CPU**: Intel i5 or equivalent (GPU not required)
- **RAM**: Minimum 4GB
- **Webcam**: Any USB or built-in webcam
- **Storage**: ~1GB for dependencies

### Browser Requirements
- Modern browser with webcam support (Chrome, Firefox, Safari, Edge)
- HTTPS required for production deployment

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create dummy model (for testing)
python create_dummy_model.py

# Start backend server
python -m app.main
```

Backend should now be running at `http://localhost:8000`

### Step 2: Frontend Setup

Open a new terminal:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start frontend server
npm start
```

Frontend should open automatically at `http://localhost:3000`

### Step 3: Test the Application

1. Allow camera access when prompted
2. You should see your webcam feed
3. Emotion detection will start automatically
4. ⚠️ **Note**: The dummy model won't give accurate predictions

---

## 🎓 Detailed Setup Instructions

### Backend Setup (Detailed)

#### 1. Environment Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv

# Activate (Linux/Mac)
source venv/bin/activate

# Activate (Windows)
venv\Scripts\activate

# Upgrade pip
pip install --upgrade pip
```

#### 2. Install Dependencies

```bash
# Install all requirements
pip install -r requirements.txt

# Verify installation
python -c "import torch; import cv2; import mediapipe; print('All imports successful!')"
```

#### 3. Add Pretrained Model

**Option A: Use Dummy Model (Testing Only)**
```bash
python create_dummy_model.py
```

**Option B: Add Your Trained Model**

1. Train your model using the provided architecture (`app/model.py` - EmotionCNN class)
2. Save model:
   ```python
   torch.save(model.state_dict(), 'emotion_model.pth')
   ```
3. Place file in `backend/models/emotion_model.pth`

**Model Requirements:**
- Input: 48x48 grayscale images (or RGB if configured)
- Output: 7 classes (Angry, Disgust, Fear, Happy, Sad, Surprise, Neutral)
- Format: PyTorch `.pth` file

#### 4. Configure Settings (Optional)

Edit `app/config.py` or create `.env`:

```env
DEBUG=False
HOST=0.0.0.0
PORT=8000
MODEL_GRAYSCALE=True
FACE_DETECTION_CONFIDENCE=0.5
```

#### 5. Start Server

```bash
# Development mode
python -m app.main

# Production mode with Uvicorn
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 1
```

#### 6. Verify Backend

```bash
# Check health endpoint
curl http://localhost:8000/health

# Expected response:
# {"status":"healthy","model_loaded":true,...}
```

---

### Frontend Setup (Detailed)

#### 1. Install Node.js Dependencies

```bash
cd frontend

# Install packages
npm install

# This will install:
# - React
# - React Scripts
# - Other dependencies
```

#### 2. Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env file
nano .env  # or use any text editor
```

Set WebSocket URL:
```env
# For local development
REACT_APP_WS_URL=ws://localhost:8000/ws

# For production with HTTPS
REACT_APP_WS_URL=wss://your-domain.com/ws
```

#### 3. Start Development Server

```bash
npm start
```

This will:
- Start development server on port 3000
- Open browser automatically
- Enable hot reloading

#### 4. Build for Production

```bash
# Create optimized production build
npm run build

# Output will be in build/ directory
```

---

## 🧪 Testing the System

### Backend Tests

```bash
cd backend

# Test health endpoint
curl http://localhost:8000/health

# Test model info
curl http://localhost:8000/model-info

# Test emotions list
curl http://localhost:8000/emotions
```

### Frontend Tests

1. **Camera Access**: Allow permissions when prompted
2. **Connection Status**: Should show "Connected to Server" (green)
3. **Detection**: Should show emotion predictions (may be random with dummy model)

### WebSocket Test

Use browser console (F12):

```javascript
// Test WebSocket connection
const ws = new WebSocket('ws://localhost:8000/ws');

ws.onopen = () => console.log('Connected!');
ws.onmessage = (e) => console.log('Message:', JSON.parse(e.data));
ws.onerror = (e) => console.error('Error:', e);
```

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: `ModuleNotFoundError: No module named 'torch'`
```bash
# Solution: Reinstall requirements
pip install -r requirements.txt
```

**Problem**: `Model file not found`
```bash
# Solution: Create dummy model
python create_dummy_model.py
```

**Problem**: Port 8000 already in use
```bash
# Solution: Change port in config.py or .env
PORT=8001

# Or kill the process using port 8000
# Linux/Mac:
lsof -ti:8000 | xargs kill -9
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### Frontend Issues

**Problem**: `npm install` fails
```bash
# Solution: Clear cache and retry
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Problem**: WebSocket connection failed
- Ensure backend is running on port 8000
- Check REACT_APP_WS_URL in .env
- Verify no firewall blocking connections

**Problem**: Camera access denied
- Grant camera permissions in browser settings
- Use HTTPS in production
- Check if camera is in use by another app

---

## 📊 Performance Optimization

### Backend Optimization

1. **Reduce Frame Processing**:
   - Limit frontend FPS to 5-8
   
2. **CPU Optimization**:
   ```python
   # In model.py, use torch.set_num_threads()
   torch.set_num_threads(4)  # Adjust based on CPU cores
   ```

3. **Face Detection Settings**:
   ```python
   # In config.py
   FACE_DETECTION_CONFIDENCE = 0.6  # Higher = fewer false positives
   ```

### Frontend Optimization

1. **Adjust Frame Rate**:
   ```javascript
   // In WebcamCapture.jsx
   const CAPTURE_FPS = 5;  // Reduce to 5 FPS
   ```

2. **Image Quality**:
   ```javascript
   // In WebcamCapture.jsx
   const base64Image = canvas.toDataURL('image/jpeg', 0.7);  // Lower quality
   ```

---

## 🌐 Deployment

### Deploy Backend (Linux Server)

```bash
# Install Python and dependencies
sudo apt update
sudo apt install python3-pip python3-venv

# Clone and setup
cd /var/www
git clone <your-repo>
cd emotion-detection/backend

# Setup virtual environment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Add your trained model
scp emotion_model.pth user@server:/var/www/emotion-detection/backend/models/

# Run with systemd service (recommended)
sudo nano /etc/systemd/system/emotion-detection.service
```

Service file:
```ini
[Unit]
Description=Emotion Detection API
After=network.target

[Service]
User=www-data
WorkingDirectory=/var/www/emotion-detection/backend
Environment="PATH=/var/www/emotion-detection/backend/venv/bin"
ExecStart=/var/www/emotion-detection/backend/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000

[Install]
WantedBy=multi-user.target
```

```bash
# Start service
sudo systemctl start emotion-detection
sudo systemctl enable emotion-detection
```

### Deploy Frontend (Static Hosting)

**Option 1: Vercel**
```bash
npm install -g vercel
cd frontend
vercel
```

**Option 2: Netlify**
```bash
npm run build
# Upload build/ directory to Netlify
```

**Option 3: Nginx**
```bash
# Build
npm run build

# Copy to web root
sudo cp -r build/* /var/www/html/

# Configure Nginx
sudo nano /etc/nginx/sites-available/emotion-detection
```

Nginx config:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        root /var/www/html;
        try_files $uri /index.html;
    }
}
```

### HTTPS Setup (Required for Production)

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com
```

---

## 📚 Additional Resources

### Training Your Own Model

1. **Dataset**: Use FER2013 or similar emotion dataset
2. **Training**: Use Kaggle/Colab with GPU
3. **Architecture**: See `backend/app/model.py` (EmotionCNN class)
4. **Epochs**: Train for 50-100 epochs
5. **Export**: `torch.save(model.state_dict(), 'emotion_model.pth')`

### API Documentation

Visit `http://localhost:8000/docs` for interactive API documentation (FastAPI auto-generates Swagger UI).

### Monitoring

```bash
# Backend logs
tail -f backend/emotion_detection.log

# Frontend logs
# Check browser console (F12)
```

---

## 🆘 Getting Help

### Check Logs

**Backend**:
```bash
# Application logs
cat backend/emotion_detection.log

# System logs (if using systemd)
sudo journalctl -u emotion-detection -f
```

**Frontend**:
- Browser console (F12)
- Network tab for WebSocket messages

### Common Issues

See [Troubleshooting](#-troubleshooting) section above.

### Support

- GitHub Issues: Report bugs and request features
- Documentation: Check README files in each directory
- Logs: Always check logs before asking for help

---

## ✅ Verification Checklist

- [ ] Python 3.8+ installed
- [ ] Node.js 16+ installed
- [ ] Backend dependencies installed
- [ ] Model file in backend/models/
- [ ] Backend running on port 8000
- [ ] Backend health check passes
- [ ] Frontend dependencies installed
- [ ] Frontend .env configured
- [ ] Frontend running on port 3000
- [ ] Camera permissions granted
- [ ] WebSocket connection established
- [ ] Emotion detection working

---

## 🎉 You're Done!

Your emotion detection system should now be running!

**Next Steps**:
1. Train a real model for accurate predictions
2. Customize the UI to your liking
3. Deploy to production
4. Add authentication if needed
5. Monitor performance and optimize

Happy detecting! 🎭
