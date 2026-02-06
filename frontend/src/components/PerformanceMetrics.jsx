/**
 * PerformanceMetrics Component
 * Display FPS, latency, and other performance metrics
 */
import React, { useState, useEffect, useRef } from 'react';
import { Zap, Clock, Activity } from 'lucide-react';
import '../styles/PerformanceMetrics.css';

const PerformanceMetrics = ({ processingTime, isActive }) => {
  const [fps, setFps] = useState(0);
  const [avgLatency, setAvgLatency] = useState(0);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(Date.now());
  const latencyHistory = useRef([]);

  // Calculate FPS
  useEffect(() => {
    if (!isActive) {
      setFps(0);
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = (now - lastTimeRef.current) / 1000;
      const currentFps = frameCountRef.current / elapsed;
      
      setFps(Math.round(currentFps));
      
      frameCountRef.current = 0;
      lastTimeRef.current = now;
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  // Track frame processing
  useEffect(() => {
    if (isActive) {
      frameCountRef.current++;
    }
  }, [processingTime, isActive]);

  // Calculate average latency
  useEffect(() => {
    if (processingTime !== null && processingTime !== undefined) {
      latencyHistory.current.push(processingTime);
      if (latencyHistory.current.length > 30) {
        latencyHistory.current.shift();
      }
      
      const avg = latencyHistory.current.reduce((a, b) => a + b, 0) / latencyHistory.current.length;
      setAvgLatency(avg);
    }
  }, [processingTime]);

  const getPerformanceColor = (fps) => {
    if (fps >= 25) return '#10b981'; // Green
    if (fps >= 15) return '#f59e0b'; // Orange
    return '#ef4444'; // Red
  };

  const getLatencyColor = (latency) => {
    if (latency < 0.1) return '#10b981'; // < 100ms
    if (latency < 0.2) return '#f59e0b'; // < 200ms
    return '#ef4444'; // > 200ms
  };

  return (
    <div className="performance-metrics">
      <div className="metric-item">
        <span className="metric-icon">
          <Zap size={20} />
        </span>
        <div className="metric-content">
          <span className="metric-label">FPS</span>
          <span 
            className="metric-value"
            style={{ color: getPerformanceColor(fps) }}
          >
            {fps}
          </span>
        </div>
      </div>

      <div className="metric-item">
        <span className="metric-icon">
          <Clock size={20} />
        </span>
        <div className="metric-content">
          <span className="metric-label">Latency</span>
          <span 
            className="metric-value"
            style={{ color: getLatencyColor(avgLatency) }}
          >
            {(avgLatency * 1000).toFixed(0)}ms
          </span>
        </div>
      </div>

      <div className="metric-item">
        <span className="metric-icon">
          <Activity size={20} />
        </span>
        <div className="metric-content">
          <span className="metric-label">Status</span>
          <span 
            className="metric-value"
            style={{ color: isActive ? '#10b981' : '#64748b' }}
          >
            {isActive ? 'Active' : 'Idle'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;
