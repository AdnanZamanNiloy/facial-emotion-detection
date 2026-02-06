/**
 * Main Application Component
 * Real-time Emotion Detection System with Advanced Features
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Smile, Video, Play, Pause, Lock, Sparkles } from 'lucide-react';
import WebcamCapture from './components/WebcamCapture';
import EmotionDisplay from './components/EmotionDisplay';
import StatusIndicator from './components/StatusIndicator';
import EmotionHistory from './components/EmotionHistory';
import AdvancedControls from './components/AdvancedControls';
import PerformanceMetrics from './components/PerformanceMetrics';
import QuickStats from './components/QuickStats';
import { useWebSocket } from './hooks/useWebSocket';
import './App.css';

function App() {
  const [isDetecting, setIsDetecting] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [probabilities, setProbabilities] = useState(null);
  const [processingTime, setProcessingTime] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const [webcamError, setWebcamError] = useState(null);
  const [settings, setSettings] = useState({
    fps: 8,
    confidenceThreshold: 0.5,
    showFPS: true,
    soundEnabled: false
  });
  
  const videoRef = useRef(null);

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

  // Handle settings change
  const handleSettingsChange = useCallback((newSettings) => {
    setSettings(newSettings);
  }, []);

  // Get display error message
  const displayError = connectionError || webcamError;

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="header-text">
            <h1>
              <Smile size={32} strokeWidth={2.5} />
              Real-Time Emotion Detection
            </h1>
            <p className="app-subtitle">AI-Powered Facial Emotion Recognition</p>
          </div>
          <QuickStats 
            currentEmotion={currentEmotion}
            confidence={confidence}
          />
        </div>
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
          <h2>
            <Video size={24} />
            Camera Feed
          </h2>
          <WebcamCapture
            onFrame={handleFrame}
            isActive={isDetecting && isConnected}
            onError={handleWebcamError}
            videoRef={videoRef}
          />
          
          {/* Performance Metrics */}
          {settings.showFPS && (
            <PerformanceMetrics 
              processingTime={processingTime}
              isActive={isDetecting && isConnected}
            />
          )}
          
          {/* Controls */}
          <div className="controls">
            <button
              className={`btn-control ${isDetecting ? 'btn-pause' : 'btn-start'}`}
              onClick={toggleDetection}
              disabled={!isConnected}
            >
              {isDetecting ? (
                <>
                  <Pause size={20} />
                  Pause Detection
                </>
              ) : (
                <>
                  <Play size={20} />
                  Start Detection
                </>
              )}
            </button>
          </div>
          
          {/* Advanced Controls */}
          <AdvancedControls
            videoRef={videoRef}
            currentEmotion={currentEmotion}
            confidence={confidence}
            onSettingsChange={handleSettingsChange}
            isDetecting={isDetecting && isConnected}
          />
        </div>

        {/* Right Panel - Emotion Display & History */}
        <div className="panel emotion-panel">
          <h2>
            <Smile size={24} />
            Detected Emotion
          </h2>
          <EmotionDisplay
            emotion={currentEmotion}
            confidence={confidence}
            probabilities={probabilities}
            processingTime={processingTime}
          />
          
          {/* Emotion History */}
          <EmotionHistory 
            currentEmotion={currentEmotion}
            confidence={confidence}
            probabilities={probabilities}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>
          <Lock size={16} />
          Privacy-First: No images or video are stored. All processing happens in real-time.
        </p>
        <p className="footer-tech">
          Built with React • FastAPI • PyTorch • OpenCV
        </p>
        <p className="footer-features">
          <Sparkles size={16} />
          Features: Real-time Detection • Emotion History • Performance Metrics • Screenshot Capture • Data Export • Advanced Settings
        </p>
      </footer>
    </div>
  );
}

export default App;
