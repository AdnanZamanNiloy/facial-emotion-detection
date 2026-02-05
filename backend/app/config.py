"""
Configuration settings for the Emotion Detection application.
"""
import os
from pathlib import Path
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application configuration settings."""
    
    # Application
    APP_NAME: str = "Emotion Detection API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # CORS
    ALLOWED_ORIGINS: list = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://localhost:3000",
    ]
    
    # Model
    MODEL_PATH: str = "models/emotion_model.pth"
    MODEL_INPUT_SIZE: tuple = (48, 48)  # Width, Height
    MODEL_GRAYSCALE: bool = True  # Set to False if model expects RGB
    
    # Emotion Classes
    EMOTION_LABELS: list = [
        "Angry",
        "Disgust", 
        "Fear",
        "Happy",
        "Sad",
        "Surprise",
        "Neutral"
    ]
    
    # Face Detection
    FACE_DETECTION_CONFIDENCE: float = 0.5
    
    # WebSocket
    WS_HEARTBEAT_INTERVAL: int = 30  # seconds
    MAX_FRAME_SIZE: int = 1024 * 1024  # 1MB
    
    # Processing
    FRAME_PROCESSING_TIMEOUT: float = 5.0  # seconds
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "models"
MODEL_DIR.mkdir(exist_ok=True)
