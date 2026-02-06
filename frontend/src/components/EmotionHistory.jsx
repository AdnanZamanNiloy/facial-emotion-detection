/**
 * EmotionHistory Component
 * Displays real-time emotion tracking history with interactive graph
 */
import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, Trash2 } from 'lucide-react';
import '../styles/EmotionHistory.css';

const EMOTION_COLORS = {
  'Happy': '#4CAF50',
  'Sad': '#2196F3',
  'Angry': '#F44336',
  'Surprise': '#FF9800',
  'Fear': '#9C27B0',
  'Disgust': '#795548',
  'Neutral': '#607D8B'
};

const MAX_HISTORY = 30; // Keep last 30 data points

const EmotionHistory = ({ currentEmotion, confidence, probabilities }) => {
  const [history, setHistory] = useState([]);
  const [selectedEmotion, setSelectedEmotion] = useState('all');
  const canvasRef = useRef(null);

  // Add new emotion data to history
  useEffect(() => {
    if (currentEmotion && confidence && probabilities) {
      const timestamp = Date.now();
      const newEntry = {
        timestamp,
        emotion: currentEmotion,
        confidence,
        probabilities: { ...probabilities },
        time: new Date().toLocaleTimeString()
      };

      setHistory(prev => {
        const updated = [...prev, newEntry];
        // Keep only last MAX_HISTORY entries
        return updated.slice(-MAX_HISTORY);
      });
    }
  }, [currentEmotion, confidence, probabilities]);

  // Draw emotion history graph
  useEffect(() => {
    if (!canvasRef.current || history.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const y = (height / 10) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    if (history.length < 2) return;

    // Draw emotion lines
    const emotions = Object.keys(EMOTION_COLORS);
    const dataPoints = history.length;
    const xStep = width / (dataPoints - 1);

    emotions.forEach(emotion => {
      if (selectedEmotion !== 'all' && selectedEmotion !== emotion) return;

      ctx.strokeStyle = EMOTION_COLORS[emotion];
      ctx.lineWidth = selectedEmotion === emotion ? 3 : 2;
      ctx.globalAlpha = selectedEmotion === 'all' ? 0.7 : 1;
      ctx.beginPath();

      history.forEach((entry, index) => {
        const x = index * xStep;
        const probability = entry.probabilities[emotion] || 0;
        const y = height - (probability * height);

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();

      // Draw dots at data points
      if (selectedEmotion === emotion || selectedEmotion === 'all') {
        history.forEach((entry, index) => {
          const x = index * xStep;
          const probability = entry.probabilities[emotion] || 0;
          const y = height - (probability * height);

          ctx.fillStyle = EMOTION_COLORS[emotion];
          ctx.globalAlpha = 1;
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fill();
        });
      }
    });

    ctx.globalAlpha = 1;
  }, [history, selectedEmotion]);

  // Calculate statistics
  const stats = React.useMemo(() => {
    if (history.length === 0) return null;

    const emotionCounts = {};
    const emotionTotalConfidence = {};
    
    history.forEach(entry => {
      emotionCounts[entry.emotion] = (emotionCounts[entry.emotion] || 0) + 1;
      emotionTotalConfidence[entry.emotion] = 
        (emotionTotalConfidence[entry.emotion] || 0) + entry.confidence;
    });

    const dominant = Object.entries(emotionCounts)
      .sort(([, a], [, b]) => b - a)[0];

    return {
      totalSamples: history.length,
      dominantEmotion: dominant ? dominant[0] : 'None',
      dominantCount: dominant ? dominant[1] : 0,
      averageConfidence: history.reduce((sum, e) => sum + e.confidence, 0) / history.length
    };
  }, [history]);

  const clearHistory = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setHistory([]);
  };

  return (
    <div className="emotion-history">
      <div className="history-header">
        <h3>
          <TrendingUp size={20} />
          Emotion Timeline
        </h3>
        <button 
          type="button" 
          className="btn-clear" 
          onClick={clearHistory}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Trash2 size={16} />
          Clear History
        </button>
      </div>

      {/* Graph */}
      <div className="graph-container">
        <canvas
          ref={canvasRef}
          width={800}
          height={200}
          className="emotion-graph"
        />
        {history.length === 0 && (
          <div className="graph-placeholder">
            <p>Start detection to see emotion timeline</p>
          </div>
        )}
      </div>

      {/* Emotion Filter */}
      <div className="emotion-filter">
        <button
          className={`filter-btn ${selectedEmotion === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedEmotion('all')}
        >
          All
        </button>
        {Object.keys(EMOTION_COLORS).map(emotion => (
          <button
            key={emotion}
            className={`filter-btn ${selectedEmotion === emotion ? 'active' : ''}`}
            style={{
              borderColor: EMOTION_COLORS[emotion],
              color: selectedEmotion === emotion ? EMOTION_COLORS[emotion] : 'inherit'
            }}
            onClick={() => setSelectedEmotion(emotion)}
          >
            {emotion}
          </button>
        ))}
      </div>

      {/* Statistics */}
      {stats && (
        <div className="history-stats">
          <div className="stat-item">
            <span className="stat-label">Samples</span>
            <span className="stat-value">{stats.totalSamples}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Dominant</span>
            <span className="stat-value" style={{ color: EMOTION_COLORS[stats.dominantEmotion] }}>
              {stats.dominantEmotion} ({stats.dominantCount})
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Avg Confidence</span>
            <span className="stat-value">{(stats.averageConfidence * 100).toFixed(1)}%</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmotionHistory;
