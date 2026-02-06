/**
 * WebcamCapture Component
 * Handles webcam access and frame capture
 */
import React, { useRef, useEffect, useState } from 'react';
import { AlertTriangle, RefreshCw, Loader } from 'lucide-react';
import '../styles/WebcamCapture.css';

const CAPTURE_FPS = 8; // Frames per second to send to backend
const CAPTURE_INTERVAL = 1000 / CAPTURE_FPS; // milliseconds

const WebcamCapture = ({ onFrame, isActive, onError, videoRef: externalVideoRef }) => {
  const internalVideoRef = useRef(null);
  const videoRef = externalVideoRef || internalVideoRef;
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const captureIntervalRef = useRef(null);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Start webcam
  const startWebcam = async () => {
    try {
      // Check for browser compatibility
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Your browser does not support webcam access. Please use a modern browser (Chrome, Firefox, Safari, Edge) over HTTPS.');
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsWebcamActive(true);
        setErrorMessage(null);
      }
    } catch (error) {
      console.error('Error accessing webcam:', error);
      let errorMsg = 'Failed to access webcam. ';
      
      if (error.name === 'NotAllowedError') {
        errorMsg += 'Permission denied. Please allow camera access.';
      } else if (error.name === 'NotFoundError') {
        errorMsg += 'No camera found on this device.';
      } else if (error.name === 'NotReadableError') {
        errorMsg += 'Camera is already in use by another application.';
      } else {
        errorMsg += error.message;
      }
      
      setErrorMessage(errorMsg);
      if (onError) onError(errorMsg);
    }
  };

  // Stop webcam
  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsWebcamActive(false);
  };

  // Capture frame from video and convert to base64
  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current || !isActive) {
      return null;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to base64 JPEG
    try {
      const base64Image = canvas.toDataURL('image/jpeg', 0.8);
      return base64Image;
    } catch (error) {
      console.error('Error capturing frame:', error);
      return null;
    }
  };

  // Start frame capture loop
  const startCapture = () => {
    if (captureIntervalRef.current) {
      return;
    }
    
    captureIntervalRef.current = setInterval(() => {
      const frame = captureFrame();
      if (frame && onFrame) {
        onFrame(frame);
      }
    }, CAPTURE_INTERVAL);
  };

  // Stop frame capture loop
  const stopCapture = () => {
    if (captureIntervalRef.current) {
      clearInterval(captureIntervalRef.current);
      captureIntervalRef.current = null;
    }
  };

  // Start/stop capture based on isActive prop
  useEffect(() => {
    if (isActive && isWebcamActive) {
      startCapture();
    } else {
      stopCapture();
    }

    return () => stopCapture();
  }, [isActive, isWebcamActive]);

  // Start/stop webcam based on isActive prop
  useEffect(() => {
    if (isActive) {
      startWebcam();
    } else {
      stopWebcam();
    }

    return () => {
      stopCapture();
      stopWebcam();
    };
  }, [isActive]);

  return (
    <div className="webcam-container">
      <div className="video-wrapper">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`webcam-video ${isWebcamActive ? 'active' : ''}`}
        />
        {!isWebcamActive && !errorMessage && (
          <div className="webcam-loading">
            <div className="spinner">
              <Loader size={48} className="spin-animation" />
            </div>
            <p>Initializing camera...</p>
          </div>
        )}
        {errorMessage && (
          <div className="webcam-error">
            <p>
              <AlertTriangle size={20} style={{ marginRight: '8px' }} />
              {errorMessage}
            </p>
            <button onClick={startWebcam} className="retry-button">
              <RefreshCw size={16} />
              Retry
            </button>
          </div>
        )}
      </div>
      
      {/* Hidden canvas for frame capture */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      {isWebcamActive && (
        <div className="webcam-indicator">
          <span className={`indicator-dot ${isActive ? 'active' : ''}`}></span>
          <span>{isActive ? 'Detecting...' : 'Paused'}</span>
        </div>
      )}
    </div>
  );
};

export default WebcamCapture;
