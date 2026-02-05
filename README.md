# Emotion Detection – Real-Time Web-Based System

A production-ready, real-time emotion detection web application that allows users to access the system from any device (mobile or laptop) via a browser with live webcam-based emotion predictions.

## 🎯 Features

- **Real-time emotion detection** using deep learning (7 emotions: Angry, Disgust, Fear, Happy, Sad, Surprise, Neutral)
- **Cross-platform**: Works on any device with a browser and webcam
- **Privacy-first**: No storage of user images or video data
- **CPU-optimized**: Runs efficiently on CPU-only servers
- **Production-ready**: Clean architecture, WebSocket communication, async operations

## 🏗️ Architecture

```
Browser (Phone/Laptop)
  ↓
React Frontend (Webcam + WebSocket Client)
  ↓
FastAPI Backend (WebSocket Server)
  ↓
PyTorch Model + MediaPipe Face Detection
  ↓
Emotion Prediction (CPU Inference)
```

## 📁 Project Structure

```
emotion-detection/
├── backend/           # FastAPI backend server
│   ├── app/          # Application code
│   └── models/       # Pretrained ML models
├── frontend/         # React web application
└── README.md         # This file
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- Webcam-enabled device
- Modern browser (Chrome, Firefox, Edge, Safari)

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m app.main
```

Backend will run on `http://localhost:8000`

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend will run on `http://localhost:3000`

### Access the Application

Open `http://localhost:3000` in your browser and allow webcam access.

## 🔧 Tech Stack

- **Backend**: Python, FastAPI, WebSockets
- **ML/DL**: PyTorch, MediaPipe (face detection)
- **Frontend**: React, WebSocket API
- **Deployment**: CPU-only inference (no GPU required)

## 📊 Emotion Classes

1. Angry
2. Disgust
3. Fear
4. Happy
5. Sad
6. Surprise
7. Neutral

## 🔒 Privacy & Security

- **No data storage**: Video frames are processed in real-time and immediately discarded
- **HTTPS required**: For production deployment (browser webcam access requirement)
- **Client-side processing**: Frame rate limited to reduce bandwidth and server load

## 📝 Development Notes

- Model training is done externally (Kaggle/Colab with GPU)
- This project focuses on inference only
- Optimized for low latency and CPU usage
- Frame rate: 5-10 FPS for optimal performance

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please read the contributing guidelines first.

## 📧 Contact

For questions or support, please open an issue on GitHub.
# FacialEmotionDetection
