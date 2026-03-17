# 🎭 Real-Time Emotion Detection System

<div align="center">

![Python](https://img.shields.io/badge/Python-3.8%2B-blue?style=flat-square&logo=python)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.128-009688?style=flat-square&logo=fastapi)
![PyTorch](https://img.shields.io/badge/PyTorch-2.10-EE4C2C?style=flat-square&logo=pytorch)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

**A production-ready, real-time facial emotion detection web application with advanced deep learning capabilities.**

[Features](#-features) • [Demo](#-demo) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Deployment](#-deployment)

</div>

---

## 📖 Overview

A sophisticated emotion detection system built with modern web technologies that analyzes facial expressions in real-time using deep learning. Access from any device with a browser and webcam—no app installation required.

### 🎯 Key Highlights

- **7 Emotion Classes**: Angry, Disgust, Fear, Happy, Sad, Surprise, Neutral
- **Real-time Processing**: 8 FPS with WebSocket communication
- **Cross-Platform**: Works on desktop and mobile browsers
- **Privacy-First**: No data storage, all processing in-memory
- **Production-Ready**: Clean architecture, error handling, extensive logging
- **CPU-Optimized**: Efficient inference without GPU requirements

---

## ✨ Features

### Core Capabilities
- 🎥 **Live Webcam Detection** - Real-time facial emotion analysis
- 📊 **Confidence Scores** - Probability distribution for all emotions
- 📈 **Emotion Timeline** - Visual graph of emotion history
- 📸 **Screenshot Capture** - Save moments with detected emotions
- ⚙️ **Advanced Settings** - Customizable FPS, confidence threshold
- 🎨 **Professional UI** - Modern glassmorphism design with lucide-react icons

### Technical Features
- ⚡ **WebSocket Communication** - Low-latency bidirectional streaming
- 🔄 **Auto-Reconnection** - Resilient connection management
- 📱 **Responsive Design** - Adaptive UI for all screen sizes
- 🎯 **Face Detection** - OpenCV Haar Cascade integration
- 🧠 **CNN Architecture** - Custom EmotionCNN with 4 convolutional blocks
- 📉 **Performance Metrics** - Real-time FPS, latency, and status monitoring

---

## 🎬 Demo

<div align="center">

### System Interface

**Main Dashboard**
- Emotion display with confidence scores
- Live webcam feed with mirrored view
- Real-time emotion history graph
- Advanced controls and settings panel

**Key Features**
- Start/Stop detection with one click
- Capture and download screenshots
- Export session data as JSON
- Clear history and manage captures

</div>

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (Any Device)                     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  React Frontend (Port 3000)                            │ │
│  │  • Webcam Capture (8 FPS)                              │ │
│  │  • WebSocket Client                                     │ │
│  │  • Real-time UI Updates                                │ │
│  └──────────────────────┬─────────────────────────────────┘ │
└─────────────────────────┼─────────────────────────────────────┘
                          │ WebSocket (Base64 JPEG)
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  FastAPI Backend (Port 8000)                                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  1. Receive Frame → 2. Face Detection (Haar Cascade) │   │
│  │  3. Preprocessing → 4. CNN Inference (PyTorch)       │   │
│  │  5. Emotion Prediction → 6. Send Result              │   │
│  └──────────────────────────────────────────────────────┘   │
│  • Async Processing                                          │
│  • Connection Management                                     │
│  • Error Handling & Logging                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
emotion-detection/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI application entry
│   │   ├── config.py            # Configuration settings
│   │   ├── model.py             # CNN architecture & inference
│   │   ├── face_detection.py   # OpenCV face detection
│   │   ├── preprocessing.py    # Image preprocessing pipeline
│   │   └── websocket.py         # WebSocket handler
│   ├── models/
│   │   └── emotion_model.pth    # Trained PyTorch model (18MB)
│   ├── requirements.txt
│   └── venv/                    # Virtual environment
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdvancedControls.jsx
│   │   │   ├── EmotionDisplay.jsx
│   │   │   ├── EmotionHistory.jsx
│   │   │   ├── PerformanceMetrics.jsx
│   │   │   ├── QuickStats.jsx
│   │   │   ├── StatusIndicator.jsx
│   │   │   └── WebcamCapture.jsx
│   │   ├── hooks/
│   │   │   └── useWebSocket.js
│   │   ├── styles/
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── node_modules/
│
├── .gitignore
├── LICENSE
├── README.md
├── SETUP.md                     # Detailed setup guide
├── FEATURES.md                  # Feature documentation
├── MODEL_TRAINING.md            # Model training guide
├── PROJECT_STRUCTURE.md         # Architecture details
└── setup.sh                      # Automated setup script
```

---

## 🚀 Quick Start

### Prerequisites

| Requirement | Version | Purpose |
|------------|---------|---------|
| Python | 3.8+ | Backend runtime |
| Node.js | 16+ | Frontend build |
| npm | 8+ | Package management |
| Webcam | Any | Video capture |
| Browser | Modern | Chrome, Firefox, Edge, Safari |

### Installation

#### Option 1: Automated Setup (Recommended)

```bash
# Clone the repository
git clone https://github.com/yourusername/emotion-detection.git
cd emotion-detection

# Run automated setup
chmod +x setup.sh
./setup.sh
```

#### Option 2: Manual Setup

**Backend Setup**

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Start backend server
python -m app.main
```

Backend will start on **http://localhost:8000**

**Frontend Setup**

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend will start on **http://localhost:3000**

### Access the Application

1. Open **http://localhost:3000** in your browser
2. Click **"Start Detection"** button
3. Allow webcam access when prompted
4. Your emotion will be detected in real-time!

---

## 📚 Documentation

### API Endpoints

#### REST API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Welcome message |
| `/health` | GET | Health check with model status |
| `/model/info` | GET | Model architecture details |
| `/emotions` | GET | List of emotion classes |

#### WebSocket

| Endpoint | Protocol | Description |
|----------|----------|-------------|
| `/ws` | WebSocket | Real-time emotion detection stream |

**WebSocket Message Format**

```javascript
// Client → Server
{
  "type": "frame",
  "data": "base64_jpeg_image"
}

// Server → Client
{
  "type": "emotion",
  "data": {
    "emotion": "Happy",
    "confidence": 0.95,
    "probabilities": {
      "Happy": 0.95,
      "Neutral": 0.03,
      // ... other emotions
    },
    "processing_time": 0.045
  }
}
```

### Configuration

**Backend** (`backend/app/config.py`)
```python
MODEL_INPUT_SIZE = (48, 48)
MODEL_GRAYSCALE = True
EMOTION_LABELS = ["Angry", "Disgust", "Fear", "Happy", "Sad", "Surprise", "Neutral"]
```

**Frontend** (`frontend/src/hooks/useWebSocket.js`)
```javascript
const WS_URL = 'ws://localhost:8000/ws'
const CAPTURE_FPS = 8
const RECONNECT_DELAY = 3000
```

### Model Details

**Architecture**: Custom EmotionCNN
- **Input**: 48×48 grayscale images
- **Layers**: 4 convolutional blocks (64→128→256→512 channels)
- **Pooling**: MaxPool2d after each block
- **Classifier**: 3 fully connected layers (4608→256→512→7)
- **Activation**: ReLU + BatchNorm + Dropout
- **Output**: Softmax probabilities for 7 emotions

**Performance**
- Inference Time: ~45ms/frame (CPU)
- Throughput: 8 FPS
- Model Size: 18.43 MB
- Parameters: ~2.5M

---

## 🌐 Deployment

### Local Network Access

**Backend**
```bash
# Run on all network interfaces
python -m app.main --host 0.0.0.0 --port 8000
```

**Frontend**
```bash
# Update .env file
REACT_APP_WS_URL=ws://YOUR_LOCAL_IP:8000/ws

# Start frontend
npm start
```

Access from mobile: `http://YOUR_LOCAL_IP:3000`

### Production Deployment

#### Backend (FastAPI)

**Using Uvicorn**
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

**Using Docker**
```dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### Frontend (React)

**Build for production**
```bash
cd frontend
npm run build
```

**Deploy** to:
- Vercel / Netlify (Serverless)
- Nginx (Static hosting)
- AWS S3 + CloudFront
- GitHub Pages

**Important**: Update WebSocket URL to production backend URL

---

## 🔧 Troubleshooting

### Common Issues

**1. Webcam not working**
- Ensure HTTPS (browsers require secure context for webcam)
- Check browser permissions
- Try different browser
- Verify webcam is not used by another application

**2. WebSocket connection failed**
- Verify backend is running on port 8000
- Check CORS settings
- Ensure no firewall blocking
- Update WebSocket URL in frontend `.env`

**3. Model not found error**
```bash
# Check model file exists
ls -lh backend/models/emotion_model.pth

# If missing, download or train model
# See MODEL_TRAINING.md for details
```

**4. Low FPS / High latency**
- Reduce capture FPS in settings
- Check CPU usage
- Close other applications
- Optimize image resolution

**5. Port already in use**
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest tests/ -v
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Manual Testing
1. Start both servers
2. Open browser DevTools (F12)
3. Check Console for errors
4. Monitor Network tab for WebSocket messages
5. Test different emotions and lighting conditions

---

## 📊 Performance Benchmarks

| Metric | Value | Notes |
|--------|-------|-------|
| Inference Time | 45ms | Average per frame (CPU) |
| FPS | 8 | Configurable (5-15) |
| Latency | <100ms | End-to-end detection |
| Memory Usage | ~500MB | Backend process |
| Model Size | 18.43MB | Compressed .pth file |
| Accuracy | ~85%* | On test dataset |

*Accuracy depends on training data quality and lighting conditions

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
4. **Push to branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Follow PEP 8 (Python) and ESLint (JavaScript)
- Write unit tests for new features
- Update documentation
- Keep commits atomic and descriptive

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2026 Emotion Detection Project

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 🙏 Acknowledgments

- **FER2013 Dataset** - Facial expression recognition dataset
- **OpenCV** - Computer vision library
- **PyTorch** - Deep learning framework
- **FastAPI** - Modern Python web framework
- **React** - JavaScript UI library
- **Lucide React** - Beautiful icon library

---

## 📮 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/emotion-detection/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/emotion-detection/discussions)
- **Email**: your.email@example.com

---

## 🗺️ Roadmap

- [ ] Multi-face detection support
- [ ] Emotion intensity levels
- [ ] Historical data export (CSV/JSON)
- [ ] Cloud deployment guides
- [ ] Mobile app (React Native)
- [ ] GPU acceleration support
- [ ] Custom model training UI
- [ ] API rate limiting
- [ ] User authentication
- [ ] Real-time analytics dashboard

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

</div>
