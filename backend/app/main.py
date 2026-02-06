"""
Main FastAPI application for Emotion Detection system.
Provides REST API endpoints and WebSocket connections.
"""
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
import sys
from contextlib import asynccontextmanager

from app.config import settings
from app.websocket import handle_websocket_connection, ws_manager
from app.model import predictor

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('emotion_detection.log')
    ]
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for startup and shutdown events.
    Loads ML model at startup for efficiency.
    """
    # Startup
    logger.info("=" * 50)
    logger.info(f"Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    logger.info("=" * 50)
    
    # Initialize model (already done via singleton, but log info)
    model_info = predictor.get_model_info()
    logger.info(f"Model loaded: {model_info}")
    
    logger.info(f"Server configured for {settings.HOST}:{settings.PORT}")
    logger.info("Application startup complete")
    
    yield
    
    # Shutdown
    logger.info("Shutting down application...")
    logger.info("Cleanup complete")


# Initialize FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Real-time emotion detection API with WebSocket support",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================================
# REST API Endpoints
# ============================================================================

@app.get("/")
async def root():
    """Root endpoint - API information."""
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running",
        "description": "Real-time emotion detection system",
        "endpoints": {
            "websocket": "/ws",
            "health": "/health",
            "stats": "/stats",
            "model_info": "/model-info"
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    try:
        # Check if model is loaded
        model_info = predictor.get_model_info()
        
        return {
            "status": "healthy",
            "model_loaded": True,
            "model_device": model_info["device"],
            "active_connections": len(ws_manager.active_connections)
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return JSONResponse(
            status_code=503,
            content={
                "status": "unhealthy",
                "error": str(e)
            }
        )


@app.get("/model-info")
async def get_model_info():
    """Get information about the loaded emotion detection model."""
    try:
        model_info = predictor.get_model_info()
        return {
            "status": "success",
            "data": model_info
        }
    except Exception as e:
        logger.error(f"Error getting model info: {e}")
        return JSONResponse(
            status_code=500,
            content={
                "status": "error",
                "message": str(e)
            }
        )


@app.get("/stats")
async def get_statistics():
    """Get processing statistics."""
    try:
        stats = ws_manager.get_stats()
        return {
            "status": "success",
            "data": stats
        }
    except Exception as e:
        logger.error(f"Error getting stats: {e}")
        return JSONResponse(
            status_code=500,
            content={
                "status": "error",
                "message": str(e)
            }
        )


@app.get("/emotions")
async def get_emotion_labels():
    """Get list of supported emotion labels."""
    return {
        "status": "success",
        "data": {
            "emotions": settings.EMOTION_LABELS,
            "count": len(settings.EMOTION_LABELS)
        }
    }


# ============================================================================
# WebSocket Endpoint
# ============================================================================

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for real-time emotion detection.
    
    Client should send JSON messages:
    {
        "type": "frame",
        "data": "<base64-encoded-image>"
    }
    
    Server responds with:
    {
        "type": "prediction",
        "data": {
            "emotion": "Happy",
            "confidence": 0.95,
            "probabilities": {...},
            "processing_time": 0.123
        }
    }
    """
    await handle_websocket_connection(websocket)


# ============================================================================
# Error Handlers
# ============================================================================

@app.exception_handler(404)
async def not_found_handler(request, exc):
    """Handle 404 errors."""
    return JSONResponse(
        status_code=404,
        content={
            "status": "error",
            "message": "Endpoint not found",
            "path": str(request.url)
        }
    )


@app.exception_handler(500)
async def internal_error_handler(request, exc):
    """Handle 500 errors."""
    logger.error(f"Internal server error: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "status": "error",
            "message": "Internal server error occurred"
        }
    )


# ============================================================================
# Main Entry Point
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    
    logger.info(f"Starting server on {settings.HOST}:{settings.PORT}")
    
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info"
    )
