/**
 * Main Application Component
 * Real-time Emotion Detection System
 */
import React, { useState, useEffect, useCallback } from 'react';
import WebcamCapture from './components/WebcamCapture';
import EmotionDisplay from './components/EmotionDisplay';
import StatusIndicator from './components/StatusIndicator';
import { useWebSocket } from './hooks/useWebSocket';
import './App.css';

function App() {
  const [isDetecting, setIsDetecting] = useState(true);
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [probabilities, setProbabilities] = useState(null);
  const [processingTime, setProcessingTime] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const [webcamError, setWebcamError] = useState(null);

  const { isConnected, lastMessage, connectionError, sendFrame } = useWebSocket();

  // Handle incoming WebSocket messages
  useEffect(() => {
    if (!lastMessage) return;

    const { type, data, message } = lastMessage;

    switch (type) {
      case 'prediction':
        // Update emotion display with prediction results
        setCurrentEmotion(data.emotion);
        setConfidence(data.confidence);
        setProbabilities(data.probabilities);
        setProcessingTime(data.processing_time);
        setStatusMessage(null);
        break;

      case 'no_face':
        // No face detected in frame
        setStatusMessage('No face detected. Please face the camera.');
        break;

      case 'error':
        // Server-side error
        console.error('Server error:', message);
        setStatusMessage(message);
        break;

      case 'model_info':
        // Model information received
        console.log('Model info:', data);
        break;

      default:
        break;
    }
  }, [lastMessage]);

  // Handle frame capture from webcam
  const handleFrame = useCallback((frameData) => {
    if (isConnected && isDetecting) {
      sendFrame(frameData);
    }
  }, [isConnected, isDetecting, sendFrame]);

  // Handle webcam errors
  const handleWebcamError = useCallback((error) => {
    setWebcamError(error);
  }, []);

  // Toggle detection on/off
  const toggleDetection = () => {
    setIsDetecting(prev => !prev);
    if (!isDetecting) {
      setStatusMessage(null);
    }
  };

  // Get display error message
  const displayError = connectionError || webcamError;

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <h1>🎭 Real-Time Emotion Detection</h1>
        <p className="app-subtitle">AI-Powered Facial Emotion Recognition</p>
      </header>

      {/* Status Bar */}
      <StatusIndicator
        isConnected={isConnected}
        error={displayError}
        message={statusMessage}
      />

      {/* Main Content */}
      <main className="app-main">
        {/* Left Panel - Webcam */}
        <div className="panel webcam-panel">
          <h2>📹 Camera Feed</h2>
          <WebcamCapture
            onFrame={handleFrame}
            isActive={isDetecting && isConnected}
            onError={handleWebcamError}
          />
          
          {/* Controls */}
          <div className="controls">
            <button
              className={`btn-control ${isDetecting ? 'btn-pause' : 'btn-start'}`}
              onClick={toggleDetection}
              disabled={!isConnected}
            >
              {isDetecting ? '⏸️ Pause Detection' : '▶️ Start Detection'}
            </button>
          </div>
        </div>

        {/* Right Panel - Emotion Display */}
        <div className="panel emotion-panel">
          <h2>😊 Detected Emotion</h2>
          <EmotionDisplay
            emotion={currentEmotion}
            confidence={confidence}
            probabilities={probabilities}
            processingTime={processingTime}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>
          🔒 Privacy-First: No images or video are stored. All processing happens in real-time.
        </p>
        <p className="footer-tech">
          Built with React • FastAPI • PyTorch • MediaPipe
        </p>
      </footer>
    </div>
  );
}

export default App;
