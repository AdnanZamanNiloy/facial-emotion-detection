/**
 * WebcamCapture Component
 * Handles webcam access and frame capture
 */
import React, { useRef, useEffect, useState } from 'react';
import '../styles/WebcamCapture.css';

const CAPTURE_FPS = 8; // Frames per second to send to backend
const CAPTURE_INTERVAL = 1000 / CAPTURE_FPS; // milliseconds

const WebcamCapture = ({ onFrame, isActive, onError }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const captureIntervalRef = useRef(null);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Start webcam
  const startWebcam = async () => {
    try {
      console.log('Requesting webcam access...');
      
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
        console.log('Webcam started successfully');
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
    console.log('Webcam stopped');
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

    console.log(`Starting frame capture at ${CAPTURE_FPS} FPS`);
    
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
      console.log('Frame capture stopped');
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

  // Cleanup on unmount
  useEffect(() => {
    startWebcam();

    return () => {
      stopCapture();
      stopWebcam();
    };
  }, []);

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
            <div className="spinner"></div>
            <p>Initializing camera...</p>
          </div>
        )}
        {errorMessage && (
          <div className="webcam-error">
            <p>⚠️ {errorMessage}</p>
            <button onClick={startWebcam} className="retry-button">
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
