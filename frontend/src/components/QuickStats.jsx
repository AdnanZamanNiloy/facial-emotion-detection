/**
 * QuickStats Component
 * Compact statistics overlay
 */
import React, { useState, useEffect } from 'react';
import { Timer, Target, Repeat, TrendingUp } from 'lucide-react';
import '../styles/QuickStats.css';

const QuickStats = ({ currentEmotion, confidence }) => {
  const [sessionStats, setSessionStats] = useState({
    startTime: Date.now(),
    detections: 0,
    emotionChanges: 0,
    peakConfidence: 0,
    avgConfidence: 0
  });
  const [lastEmotion, setLastEmotion] = useState(null);

  useEffect(() => {
    if (currentEmotion && confidence) {
      setSessionStats(prev => {
        const newDetections = prev.detections + 1;
        const emotionChanged = lastEmotion && lastEmotion !== currentEmotion;
        const newChanges = emotionChanged ? prev.emotionChanges + 1 : prev.emotionChanges;
        const newPeak = Math.max(prev.peakConfidence, confidence);
        const newAvg = ((prev.avgConfidence * prev.detections) + confidence) / newDetections;

        return {
          ...prev,
          detections: newDetections,
          emotionChanges: newChanges,
          peakConfidence: newPeak,
          avgConfidence: newAvg
        };
      });

      if (lastEmotion !== currentEmotion) {
        setLastEmotion(currentEmotion);
      }
    }
  }, [currentEmotion, confidence, lastEmotion]);

  const getSessionDuration = () => {
    const duration = Math.floor((Date.now() - sessionStats.startTime) / 1000);
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="quick-stats">
      <div className="quick-stat">
        <span className="stat-icon">
          <Timer size={20} />
        </span>
        <span className="stat-text">{getSessionDuration()}</span>
      </div>
      <div className="quick-stat">
        <span className="stat-icon">
          <Target size={20} />
        </span>
        <span className="stat-text">{sessionStats.detections}</span>
      </div>
      <div className="quick-stat">
        <span className="stat-icon">
          <Repeat size={20} />
        </span>
        <span className="stat-text">{sessionStats.emotionChanges}</span>
      </div>
      <div className="quick-stat">
        <span className="stat-icon">
          <TrendingUp size={20} />
        </span>
        <span className="stat-text">{(sessionStats.avgConfidence * 100).toFixed(0)}%</span>
      </div>
    </div>
  );
};

export default QuickStats;
