/**
 * EmotionDisplay Component
 * Displays detected emotion and confidence scores
 */
import React from 'react';
import '../styles/EmotionDisplay.css';

// Emoji mapping for emotions
const EMOTION_EMOJIS = {
  'Happy': '😊',
  'Sad': '😢',
  'Angry': '😠',
  'Surprise': '😲',
  'Fear': '😨',
  'Disgust': '🤢',
  'Neutral': '😐'
};

// Color mapping for emotions
const EMOTION_COLORS = {
  'Happy': '#4CAF50',
  'Sad': '#2196F3',
  'Angry': '#F44336',
  'Surprise': '#FF9800',
  'Fear': '#9C27B0',
  'Disgust': '#795548',
  'Neutral': '#607D8B'
};

const EmotionDisplay = ({ emotion, confidence, probabilities, processingTime }) => {
  
  // Sort probabilities by value (descending)
  const sortedEmotions = probabilities
    ? Object.entries(probabilities)
        .sort(([, a], [, b]) => b - a)
    : [];

  return (
    <div className="emotion-display">
      {emotion ? (
        <>
          {/* Main Emotion */}
          <div className="emotion-main" style={{ borderColor: EMOTION_COLORS[emotion] }}>
            <div className="emotion-emoji" style={{ color: EMOTION_COLORS[emotion] }}>
              {EMOTION_EMOJIS[emotion]}
            </div>
            <div className="emotion-label" style={{ color: EMOTION_COLORS[emotion] }}>
              {emotion}
            </div>
            <div className="emotion-confidence">
              {(confidence * 100).toFixed(1)}% confident
            </div>
          </div>

          {/* All Probabilities */}
          {probabilities && (
            <div className="emotion-probabilities">
              <h3>All Emotions</h3>
              <div className="probability-bars">
                {sortedEmotions.map(([emotionName, prob]) => (
                  <div key={emotionName} className="probability-item">
                    <div className="probability-header">
                      <span className="probability-emoji">{EMOTION_EMOJIS[emotionName]}</span>
                      <span className="probability-name">{emotionName}</span>
                      <span className="probability-value">{(prob * 100).toFixed(1)}%</span>
                    </div>
                    <div className="probability-bar-bg">
                      <div
                        className="probability-bar-fill"
                        style={{
                          width: `${prob * 100}%`,
                          backgroundColor: EMOTION_COLORS[emotionName]
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Processing Time */}
          {processingTime !== undefined && (
            <div className="processing-time">
              Processing: {(processingTime * 1000).toFixed(0)}ms
            </div>
          )}
        </>
      ) : (
        <div className="emotion-waiting">
          <div className="waiting-icon">👤</div>
          <p>Waiting for detection...</p>
          <p className="waiting-hint">Make sure your face is visible</p>
        </div>
      )}
    </div>
  );
};

export default EmotionDisplay;
