/**
 * AdvancedControls Component
 * Screenshot, recording, settings, and advanced features
 */
import React, { useState } from 'react';
import { Camera, Download, Settings, Trash2, FileJson } from 'lucide-react';
import '../styles/AdvancedControls.css';

const AdvancedControls = ({ 
  videoRef, 
  currentEmotion, 
  confidence,
  onSettingsChange,
  isDetecting 
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    fps: 8,
    confidenceThreshold: 0.5,
    showFPS: true,
    soundEnabled: false,
    autoCapture: false
  });
  const [screenshots, setScreenshots] = useState([]);

  // Capture screenshot
  const captureScreenshot = () => {
    if (!videoRef || !videoRef.current) {
      alert('Video not available');
      return;
    }

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    
    // Draw video frame
    ctx.drawImage(video, 0, 0);
    
    // Add emotion overlay
    if (currentEmotion) {
      ctx.font = 'bold 24px Inter';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(10, 10, 300, 60);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`Emotion: ${currentEmotion}`, 20, 40);
      ctx.fillText(`Confidence: ${(confidence * 100).toFixed(1)}%`, 20, 60);
    }
    
    const screenshot = {
      id: Date.now(),
      url: canvas.toDataURL('image/png'),
      emotion: currentEmotion,
      confidence: confidence,
      timestamp: new Date().toLocaleString()
    };
    
    setScreenshots(prev => [...prev, screenshot]);
  };

  // Download screenshot
  const downloadScreenshot = (screenshot) => {
    const link = document.createElement('a');
    link.href = screenshot.url;
    link.download = `emotion-${screenshot.emotion}-${screenshot.id}.png`;
    link.click();
  };

  // Delete screenshot
  const deleteScreenshot = (id) => {
    setScreenshots(prev => prev.filter(s => s.id !== id));
  };

  // Clear all screenshots
  const clearAllScreenshots = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (window.confirm('Delete all screenshots?')) {
      setScreenshots([]);
    }
  };

  // Export data as JSON
  const exportData = () => {
    const data = {
      exportDate: new Date().toISOString(),
      screenshots: screenshots.map(s => ({
        emotion: s.emotion,
        confidence: s.confidence,
        timestamp: s.timestamp
      })),
      settings
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `emotion-data-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Update settings
  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    if (onSettingsChange) {
      onSettingsChange(newSettings);
    }
  };

  return (
    <div className="advanced-controls">
      {/* Action Buttons */}
      <div className="control-actions">
        <button 
          className="btn-action btn-screenshot"
          onClick={captureScreenshot}
          disabled={!isDetecting}
          title="Capture Screenshot"
        >
          <Camera size={18} />
          <span>Screenshot</span>
        </button>
        
        <button 
          className="btn-action btn-export"
          onClick={exportData}
          title="Export Data"
        >
          <FileJson size={18} />
          <span>Export Data</span>
        </button>
        
        <button 
          className="btn-action btn-settings"
          onClick={() => setShowSettings(!showSettings)}
          title="Settings"
        >
          <Settings size={18} />
          <span>Settings</span>
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="settings-panel">
          <h4>
            <Settings size={20} />
            Detection Settings
          </h4>
          
          <div className="setting-item">
            <label>
              <span className="setting-label">Capture FPS</span>
              <input
                type="range"
                min="1"
                max="30"
                value={settings.fps}
                onChange={(e) => updateSetting('fps', parseInt(e.target.value))}
              />
              <span className="setting-value">{settings.fps} FPS</span>
            </label>
          </div>

          <div className="setting-item">
            <label>
              <span className="setting-label">Confidence Threshold</span>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.confidenceThreshold * 100}
                onChange={(e) => updateSetting('confidenceThreshold', e.target.value / 100)}
              />
              <span className="setting-value">{(settings.confidenceThreshold * 100).toFixed(0)}%</span>
            </label>
          </div>

          <div className="setting-item setting-toggle">
            <label>
              <span className="setting-label">Show FPS Counter</span>
              <input
                type="checkbox"
                checked={settings.showFPS}
                onChange={(e) => updateSetting('showFPS', e.target.checked)}
              />
              <span className="toggle-switch"></span>
            </label>
          </div>

          <div className="setting-item setting-toggle">
            <label>
              <span className="setting-label">Sound Alerts</span>
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => updateSetting('soundEnabled', e.target.checked)}
              />
              <span className="toggle-switch"></span>
            </label>
          </div>
        </div>
      )}

      {/* Screenshots Gallery */}
      {screenshots.length > 0 && (
        <div className="screenshots-section">
          <div className="screenshots-header">
            <h4>
              <Camera size={20} />
              Screenshots ({screenshots.length})
            </h4>
            <button 
              type="button" 
              className="btn-clear-all" 
              onClick={clearAllScreenshots}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <Trash2 size={16} />
              Clear All
            </button>
          </div>
          
          <div className="screenshots-grid">
            {screenshots.map(screenshot => (
              <div key={screenshot.id} className="screenshot-card">
                <img src={screenshot.url} alt={screenshot.emotion} />
                <div className="screenshot-info">
                  <div className="screenshot-emotion">{screenshot.emotion}</div>
                  <div className="screenshot-confidence">
                    {(screenshot.confidence * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="screenshot-actions">
                  <button 
                    className="btn-download"
                    onClick={() => downloadScreenshot(screenshot)}
                    title="Download"
                  >
                    <Download size={16} />
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => deleteScreenshot(screenshot.id)}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="screenshot-time">{screenshot.timestamp}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedControls;
