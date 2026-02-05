"""
WebSocket handler for real-time emotion detection.
Handles frame reception, processing, and result transmission.
"""
import cv2
import numpy as np
import base64
import json
import asyncio
from fastapi import WebSocket, WebSocketDisconnect
from typing import Dict, Optional
import logging
import time

from app.face_detection import face_detector
from app.preprocessing import preprocessor
from app.model import predictor
from app.config import settings

logger = logging.getLogger(__name__)


class WebSocketManager:
    """
    Manages WebSocket connections and handles real-time emotion detection.
    """
    
    def __init__(self):
        """Initialize WebSocket manager."""
        self.active_connections: list[WebSocket] = []
        self.processing_stats = {
            "total_frames": 0,
            "successful_predictions": 0,
            "failed_predictions": 0,
            "no_face_detected": 0,
            "avg_processing_time": 0.0
        }
    
    async def connect(self, websocket: WebSocket):
        """Accept and register a new WebSocket connection."""
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"New WebSocket connection. Total connections: {len(self.active_connections)}")
        
        # Send welcome message with model info
        await self.send_model_info(websocket)
    
    def disconnect(self, websocket: WebSocket):
        """Remove a WebSocket connection."""
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        logger.info(f"WebSocket disconnected. Total connections: {len(self.active_connections)}")
    
    async def send_model_info(self, websocket: WebSocket):
        """Send model information to client."""
        try:
            model_info = predictor.get_model_info()
            await websocket.send_json({
                "type": "model_info",
                "data": model_info
            })
        except Exception as e:
            logger.error(f"Error sending model info: {e}")
    
    async def send_message(self, websocket: WebSocket, message: Dict):
        """Send a JSON message to client."""
        try:
            await websocket.send_json(message)
        except Exception as e:
            logger.error(f"Error sending message: {e}")
    
    async def handle_frame(self, websocket: WebSocket, frame_data: str) -> None:
        """
        Process a single frame from the client.
        
        Args:
            websocket: WebSocket connection
            frame_data: Base64-encoded image frame
        """
        start_time = time.time()
        self.processing_stats["total_frames"] += 1
        
        try:
            # Decode base64 image
            image = self._decode_base64_image(frame_data)
            
            if image is None:
                await self.send_error(websocket, "Failed to decode image")
                self.processing_stats["failed_predictions"] += 1
                return
            
            # Detect face
            face_image = face_detector.detect_and_extract_largest_face(image, padding=0.2)
            
            if face_image is None:
                await self.send_message(websocket, {
                    "type": "no_face",
                    "message": "No face detected in frame"
                })
                self.processing_stats["no_face_detected"] += 1
                return
            
            # Preprocess face
            preprocessed_face = preprocessor.preprocess(face_image)
            
            if preprocessed_face is None:
                await self.send_error(websocket, "Failed to preprocess face")
                self.processing_stats["failed_predictions"] += 1
                return
            
            # Predict emotion
            prediction = predictor.predict(preprocessed_face)
            
            # Calculate processing time
            processing_time = time.time() - start_time
            
            # Update stats
            self.processing_stats["successful_predictions"] += 1
            self._update_avg_processing_time(processing_time)
            
            # Send result to client
            await self.send_message(websocket, {
                "type": "prediction",
                "data": {
                    "emotion": prediction["emotion"],
                    "confidence": prediction["confidence"],
                    "probabilities": prediction["probabilities"],
                    "processing_time": round(processing_time, 3)
                }
            })
            
        except Exception as e:
            logger.error(f"Error handling frame: {e}")
            await self.send_error(websocket, f"Processing error: {str(e)}")
            self.processing_stats["failed_predictions"] += 1
    
    def _decode_base64_image(self, base64_string: str) -> Optional[np.ndarray]:
        """
        Decode base64 string to OpenCV image.
        
        Args:
            base64_string: Base64-encoded image string
        
        Returns:
            OpenCV image (numpy array) or None if decoding fails
        """
        try:
            # Remove data URL prefix if present
            if ',' in base64_string:
                base64_string = base64_string.split(',')[1]
            
            # Decode base64 to bytes
            image_bytes = base64.b64decode(base64_string)
            
            # Convert bytes to numpy array
            nparr = np.frombuffer(image_bytes, np.uint8)
            
            # Decode image
            image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            return image
            
        except Exception as e:
            logger.error(f"Error decoding base64 image: {e}")
            return None
    
    async def send_error(self, websocket: WebSocket, error_message: str):
        """Send error message to client."""
        await self.send_message(websocket, {
            "type": "error",
            "message": error_message
        })
    
    def _update_avg_processing_time(self, new_time: float):
        """Update average processing time with exponential moving average."""
        alpha = 0.1  # Smoothing factor
        current_avg = self.processing_stats["avg_processing_time"]
        self.processing_stats["avg_processing_time"] = (
            alpha * new_time + (1 - alpha) * current_avg
        )
    
    def get_stats(self) -> Dict:
        """Get processing statistics."""
        return {
            **self.processing_stats,
            "active_connections": len(self.active_connections)
        }
    
    async def broadcast_stats(self):
        """Broadcast statistics to all connected clients."""
        stats = self.get_stats()
        for connection in self.active_connections:
            try:
                await self.send_message(connection, {
                    "type": "stats",
                    "data": stats
                })
            except:
                pass


# Global WebSocket manager instance
ws_manager = WebSocketManager()


async def handle_websocket_connection(websocket: WebSocket):
    """
    Main WebSocket connection handler.
    
    Args:
        websocket: WebSocket connection
    """
    await ws_manager.connect(websocket)
    
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            
            # Parse message
            try:
                message = json.loads(data)
                message_type = message.get("type")
                
                if message_type == "frame":
                    # Handle frame for emotion detection
                    frame_data = message.get("data")
                    if frame_data:
                        await ws_manager.handle_frame(websocket, frame_data)
                
                elif message_type == "ping":
                    # Respond to ping with pong
                    await ws_manager.send_message(websocket, {
                        "type": "pong",
                        "timestamp": time.time()
                    })
                
                elif message_type == "get_stats":
                    # Send statistics
                    stats = ws_manager.get_stats()
                    await ws_manager.send_message(websocket, {
                        "type": "stats",
                        "data": stats
                    })
                
                else:
                    logger.warning(f"Unknown message type: {message_type}")
            
            except json.JSONDecodeError:
                logger.error("Invalid JSON received")
                await ws_manager.send_error(websocket, "Invalid JSON format")
    
    except WebSocketDisconnect:
        logger.info("WebSocket disconnected normally")
        ws_manager.disconnect(websocket)
    
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        ws_manager.disconnect(websocket)
