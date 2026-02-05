# Emotion Detection Backend

FastAPI-based backend server for real-time emotion detection using deep learning.

## 📋 Features

- **WebSocket Communication**: Real-time bidirectional communication
- **Face Detection**: MediaPipe-based face detection
- **Emotion Recognition**: CNN-based emotion classification (7 emotions)
- **CPU Optimized**: Runs efficiently on CPU-only servers
- **Async Operations**: Non-blocking request handling
- **Production Ready**: Logging, error handling, health checks

## 🏗️ Architecture

```
app/
├── main.py              # FastAPI application & endpoints
├── websocket.py         # WebSocket handler
├── model.py            # CNN model definition & inference
├── face_detection.py   # MediaPipe face detection
├── preprocessing.py    # Image preprocessing pipeline
└── config.py           # Configuration settings
```

## 🚀 Installation

### 1. Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate     # Windows
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Add Pretrained Model

Place your pretrained PyTorch model in the `models/` directory:

```bash
models/
└── emotion_model.pth
```

**Model Requirements:**
- Input size: 48x48 pixels
- Input channels: 1 (grayscale) or 3 (RGB) - configure in config.py
- Output: 7 classes (Angry, Disgust, Fear, Happy, Sad, Surprise, Neutral)
- Format: PyTorch .pth or .pt file

## ▶️ Running the Server

### Development Mode

```bash
python -m app.main
```

### Production Mode with Uvicorn

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 1
```

Server will start on `http://0.0.0.0:8000`

## 📡 API Endpoints

### REST Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | API information |
| `/health` | GET | Health check |
| `/model-info` | GET | Model details |
| `/stats` | GET | Processing statistics |
| `/emotions` | GET | Supported emotion labels |

### WebSocket Endpoint

**Endpoint:** `/ws`

**Client Message Format:**
```json
{
  "type": "frame",
  "data": "base64-encoded-image-data"
}
```

**Server Response Format:**
```json
{
  "type": "prediction",
  "data": {
    "emotion": "Happy",
    "confidence": 0.95,
    "probabilities": {
      "Angry": 0.01,
      "Disgust": 0.00,
      "Fear": 0.01,
      "Happy": 0.95,
      "Sad": 0.01,
      "Surprise": 0.01,
      "Neutral": 0.01
    },
    "processing_time": 0.123
  }
}
```

## 🧪 Testing

### Test Health Endpoint

```bash
curl http://localhost:8000/health
```

### Test Model Info

```bash
curl http://localhost:8000/model-info
```

### WebSocket Testing

Use a WebSocket client or the provided React frontend.

## ⚙️ Configuration

Edit `app/config.py` or create a `.env` file:

```env
DEBUG=False
HOST=0.0.0.0
PORT=8000
MODEL_PATH=models/emotion_model.pth
MODEL_GRAYSCALE=True
FACE_DETECTION_CONFIDENCE=0.5
```

## 🔧 Model Training

**Note:** This backend is for inference only. Train your model separately:

1. Use FER2013 or similar emotion dataset
2. Train a CNN on Kaggle/Colab with GPU
3. Export model: `torch.save(model.state_dict(), 'emotion_model.pth')`
4. Place in `models/` directory

**Model Architecture:** See `model.py` for the CNN architecture (EmotionCNN class).

## 📊 Performance

- **Face Detection**: ~10-20ms per frame (MediaPipe)
- **Preprocessing**: ~2-5ms per frame
- **Inference**: ~20-50ms per frame (CPU, Intel i5)
- **Total**: ~50-100ms per frame (10-20 FPS)

## 🐛 Troubleshooting

### "Model file not found"
Place your pretrained model in `backend/models/emotion_model.pth`

### "No face detected"
- Ensure good lighting
- Face the camera directly
- Check FACE_DETECTION_CONFIDENCE setting

### Slow performance
- Reduce frame rate from frontend
- Ensure CPU is not throttled
- Close other resource-intensive applications

## 📝 Logging

Logs are written to:
- Console (stdout)
- File: `emotion_detection.log`

## 🔒 Security Notes

- Enable HTTPS in production (required for webcam access)
- Configure CORS for your frontend domain
- Add authentication if deploying publicly
- Validate and sanitize all inputs

## 📚 Dependencies

- **FastAPI**: Web framework
- **Uvicorn**: ASGI server
- **PyTorch**: Deep learning framework
- **OpenCV**: Image processing
- **MediaPipe**: Face detection
- **NumPy**: Numerical operations

## 📄 License

MIT License
