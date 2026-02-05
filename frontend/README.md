# Emotion Detection Frontend

React-based web application for real-time emotion detection using webcam.

## 📋 Features

- **Webcam Access**: Browser-based camera access using getUserMedia API
- **Real-time Detection**: Live emotion detection at 8 FPS
- **WebSocket Communication**: Real-time bidirectional communication with backend
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Clean, animated interface with emotion visualizations
- **Privacy-Focused**: No data storage, real-time processing only

## 🚀 Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and set your backend WebSocket URL:

```env
REACT_APP_WS_URL=ws://localhost:8000/ws
```

### 3. Start Development Server

```bash
npm start
```

Application will open at `http://localhost:3000`

## 📦 Build for Production

```bash
npm run build
```

Build output will be in the `build/` directory.

## 🏗️ Project Structure

```
src/
├── components/
│   ├── WebcamCapture.jsx      # Webcam access and frame capture
│   ├── EmotionDisplay.jsx     # Emotion results display
│   └── StatusIndicator.jsx    # Connection status
├── hooks/
│   └── useWebSocket.js        # WebSocket connection hook
├── styles/
│   ├── WebcamCapture.css
│   ├── EmotionDisplay.css
│   └── StatusIndicator.css
├── App.js                     # Main application
├── App.css                    # Main styles
└── index.js                   # React entry point
```

## 🔧 Configuration

### Frame Rate

Edit `WebcamCapture.jsx`:

```javascript
const CAPTURE_FPS = 8; // Adjust FPS (5-10 recommended)
```

### WebSocket URL

Edit `.env`:

```env
# Development
REACT_APP_WS_URL=ws://localhost:8000/ws

# Production with HTTPS
REACT_APP_WS_URL=wss://your-domain.com/ws
```

## 📱 Browser Compatibility

- **Chrome**: ✅ Full support
- **Firefox**: ✅ Full support
- **Safari**: ✅ Full support (iOS 11+)
- **Edge**: ✅ Full support

**Note**: Webcam access requires **HTTPS** in production (except localhost).

## 🎨 Customization

### Emotions and Colors

Edit `EmotionDisplay.jsx`:

```javascript
const EMOTION_EMOJIS = {
  'Happy': '😊',
  // Add or modify emotions
};

const EMOTION_COLORS = {
  'Happy': '#4CAF50',
  // Customize colors
};
```

### Styling

- **Main styles**: `App.css`
- **Component styles**: `styles/*.css`
- **Theme colors**: CSS variables in `App.css`

## 🧪 Testing

### Test Webcam Access

1. Open browser console (F12)
2. Check for webcam permissions
3. Look for "Webcam started successfully" message

### Test WebSocket Connection

1. Ensure backend is running on port 8000
2. Check connection status indicator (green = connected)
3. Monitor browser console for connection messages

## 🐛 Troubleshooting

### Webcam Not Working

**Problem**: "Permission denied" or "No camera found"

**Solutions**:
- Grant camera permissions in browser
- Check if camera is in use by another app
- Try different browser
- Ensure HTTPS in production

### WebSocket Connection Failed

**Problem**: "Disconnected" status

**Solutions**:
- Verify backend is running (`http://localhost:8000/health`)
- Check WebSocket URL in `.env`
- Check browser console for errors
- Verify CORS settings in backend

### Slow Performance

**Solutions**:
- Reduce CAPTURE_FPS in `WebcamCapture.jsx`
- Check network latency
- Verify backend CPU usage
- Close other browser tabs

## 📊 Performance

- **Frame Capture**: ~125ms interval (8 FPS)
- **Frame Size**: ~20-50KB per frame (JPEG compressed)
- **Network**: ~160-400KB/s bandwidth usage
- **UI Render**: 60 FPS animations

## 🔒 Security & Privacy

- **No Storage**: Frames are not stored anywhere
- **Client-side Only**: All frame capture happens in browser
- **Secure Connection**: Use WSS (WebSocket Secure) in production
- **Permissions**: Camera access requires explicit user permission

## 📝 Available Scripts

### `npm start`
Runs app in development mode at `http://localhost:3000`

### `npm run build`
Builds app for production in `build/` folder

### `npm test`
Launches test runner

### `npm run eject`
Ejects from Create React App (⚠️ irreversible)

## 🌐 Deployment

### Deploy to Vercel/Netlify

1. Build the app:
   ```bash
   npm run build
   ```

2. Deploy `build/` directory

3. Set environment variable:
   ```
   REACT_APP_WS_URL=wss://your-backend.com/ws
   ```

### Deploy with Docker

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm install -g serve
CMD ["serve", "-s", "build", "-l", "3000"]
```

## 📄 License

MIT License
