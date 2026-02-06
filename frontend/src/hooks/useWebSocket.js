/**
 * Custom React hook for WebSocket connection
 * Handles connection, reconnection, and message handling
 */
import { useState, useEffect, useCallback, useRef } from 'react';

const WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:8000/ws';
const RECONNECT_DELAY = 3000; // 3 seconds
const MAX_RECONNECT_ATTEMPTS = 5;

export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [connectionError, setConnectionError] = useState(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const shouldReconnectRef = useRef(true);

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      const ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        setIsConnected(true);
        setConnectionError(null);
        setReconnectAttempts(0);
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          setLastMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionError('WebSocket connection error');
      };

      ws.onclose = () => {
        setIsConnected(false);
        wsRef.current = null;

        // Attempt to reconnect
        if (shouldReconnectRef.current && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          reconnectTimeoutRef.current = setTimeout(() => {
            setReconnectAttempts(prev => prev + 1);
            connect();
          }, RECONNECT_DELAY);
        } else if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
          setConnectionError('Max reconnection attempts reached. Please refresh the page.');
        }
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('Error creating WebSocket:', error);
      setConnectionError('Failed to create WebSocket connection');
    }
  }, [reconnectAttempts]);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    shouldReconnectRef.current = false;
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  // Send message through WebSocket
  const sendMessage = useCallback((message) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(JSON.stringify(message));
        return true;
      } catch (error) {
        console.error('Error sending message:', error);
        return false;
      }
    } else {
      console.warn('WebSocket is not connected');
      return false;
    }
  }, []);

  // Send frame for emotion detection
  const sendFrame = useCallback((base64Image) => {
    return sendMessage({
      type: 'frame',
      data: base64Image
    });
  }, [sendMessage]);

  // Auto-connect on mount
  useEffect(() => {
    shouldReconnectRef.current = true;
    connect();

    return () => {
      shouldReconnectRef.current = false;
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    lastMessage,
    connectionError,
    sendFrame,
    sendMessage,
    reconnect: connect,
    disconnect
  };
};
