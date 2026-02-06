/**
 * StatusIndicator Component
 * Shows connection status and notifications
 */
import React from 'react';
import { Wifi, WifiOff, AlertTriangle, Info } from 'lucide-react';
import '../styles/StatusIndicator.css';

const StatusIndicator = ({ isConnected, error, message }) => {
  return (
    <div className="status-indicator-container">
      {/* Connection Status */}
      <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
        <span className="status-dot">
          {isConnected ? <Wifi size={16} /> : <WifiOff size={16} />}
        </span>
        <span className="status-text">
          {isConnected ? 'Connected to Server' : 'Disconnected'}
        </span>
      </div>

      {/* Error Message */}
      {error && (
        <div className="status-message error">
          <span className="message-icon"><AlertTriangle size={18} /></span>
          <span className="message-text">{error}</span>
        </div>
      )}

      {/* Info Message */}
      {message && !error && (
        <div className="status-message info">
          <span className="message-icon"><Info size={18} /></span>
          <span className="message-text">{message}</span>
        </div>
      )}
    </div>
  );
};

export default StatusIndicator;
