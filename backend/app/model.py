"""
Deep Learning model definition and loading for emotion detection.
This module defines the CNN architecture and handles model inference.
"""
import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np
from pathlib import Path
from typing import Tuple, Dict
import logging

from app.config import settings, MODEL_DIR

logger = logging.getLogger(__name__)


class EmotionCNN(nn.Module):
    """
    Convolutional Neural Network for Emotion Recognition.
    Architecture: 4 Conv blocks + 2 FC layers
    Input: Grayscale images (1, 48, 48) or RGB (3, 48, 48)
    Output: 7 emotion classes
    """
    
    def __init__(self, num_classes: int = 7, input_channels: int = 1):
        super(EmotionCNN, self).__init__()
        
        # Convolutional Block 1
        self.conv1 = nn.Conv2d(input_channels, 64, kernel_size=3, padding=1)
        self.bn1 = nn.BatchNorm2d(64)
        self.conv2 = nn.Conv2d(64, 64, kernel_size=3, padding=1)
        self.bn2 = nn.BatchNorm2d(64)
        self.pool1 = nn.MaxPool2d(kernel_size=2, stride=2)
        self.dropout1 = nn.Dropout(0.25)
        
        # Convolutional Block 2
        self.conv3 = nn.Conv2d(64, 128, kernel_size=3, padding=1)
        self.bn3 = nn.BatchNorm2d(128)
        self.conv4 = nn.Conv2d(128, 128, kernel_size=3, padding=1)
        self.bn4 = nn.BatchNorm2d(128)
        self.pool2 = nn.MaxPool2d(kernel_size=2, stride=2)
        self.dropout2 = nn.Dropout(0.25)
        
        # Convolutional Block 3
        self.conv5 = nn.Conv2d(128, 256, kernel_size=3, padding=1)
        self.bn5 = nn.BatchNorm2d(256)
        self.conv6 = nn.Conv2d(256, 256, kernel_size=3, padding=1)
        self.bn6 = nn.BatchNorm2d(256)
        self.pool3 = nn.MaxPool2d(kernel_size=2, stride=2)
        self.dropout3 = nn.Dropout(0.25)
        
        # Convolutional Block 4
        self.conv7 = nn.Conv2d(256, 512, kernel_size=3, padding=1)
        self.bn7 = nn.BatchNorm2d(512)
        self.pool4 = nn.MaxPool2d(kernel_size=2, stride=2)
        self.dropout4 = nn.Dropout(0.25)
        
        # Fully Connected Layers
        # After 4 pooling layers: 48x48 -> 24x24 -> 12x12 -> 6x6 -> 3x3
        self.fc1 = nn.Linear(512 * 3 * 3, 512)
        self.bn_fc1 = nn.BatchNorm1d(512)
        self.dropout5 = nn.Dropout(0.5)
        
        self.fc2 = nn.Linear(512, 256)
        self.bn_fc2 = nn.BatchNorm1d(256)
        self.dropout6 = nn.Dropout(0.5)
        
        self.fc3 = nn.Linear(256, num_classes)
    
    def forward(self, x):
        # Block 1
        x = F.relu(self.bn1(self.conv1(x)))
        x = F.relu(self.bn2(self.conv2(x)))
        x = self.pool1(x)
        x = self.dropout1(x)
        
        # Block 2
        x = F.relu(self.bn3(self.conv3(x)))
        x = F.relu(self.bn4(self.conv4(x)))
        x = self.pool2(x)
        x = self.dropout2(x)
        
        # Block 3
        x = F.relu(self.bn5(self.conv5(x)))
        x = F.relu(self.bn6(self.conv6(x)))
        x = self.pool3(x)
        x = self.dropout3(x)
        
        # Block 4
        x = F.relu(self.bn7(self.conv7(x)))
        x = self.pool4(x)
        x = self.dropout4(x)
        
        # Flatten
        x = x.view(x.size(0), -1)
        
        # FC Layers
        x = F.relu(self.bn_fc1(self.fc1(x)))
        x = self.dropout5(x)
        
        x = F.relu(self.bn_fc2(self.fc2(x)))
        x = self.dropout6(x)
        
        x = self.fc3(x)
        
        return x


class EmotionPredictor:
    """
    Handles model loading and emotion prediction.
    Singleton pattern for efficient model reuse.
    """
    
    _instance = None
    _model = None
    _device = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(EmotionPredictor, cls).__new__(cls)
        return cls._instance
    
    def __init__(self):
        """Initialize the predictor and load the model."""
        if self._model is None:
            self._load_model()
    
    def _load_model(self):
        """Load the pretrained model from disk."""
        try:
            # Determine device (CPU only for this project)
            self._device = torch.device("cpu")
            logger.info(f"Using device: {self._device}")
            
            # Initialize model architecture
            input_channels = 1 if settings.MODEL_GRAYSCALE else 3
            num_classes = len(settings.EMOTION_LABELS)
            
            self._model = EmotionCNN(
                num_classes=num_classes,
                input_channels=input_channels
            )
            
            # Load pretrained weights
            model_path = MODEL_DIR / settings.MODEL_PATH.split('/')[-1]
            
            if model_path.exists():
                logger.info(f"Loading model from: {model_path}")
                checkpoint = torch.load(model_path, map_location=self._device)
                
                # Handle different checkpoint formats
                if isinstance(checkpoint, dict):
                    if 'model_state_dict' in checkpoint:
                        self._model.load_state_dict(checkpoint['model_state_dict'])
                    elif 'state_dict' in checkpoint:
                        self._model.load_state_dict(checkpoint['state_dict'])
                    else:
                        self._model.load_state_dict(checkpoint)
                else:
                    self._model.load_state_dict(checkpoint)
                
                logger.info("Model loaded successfully!")
            else:
                logger.warning(
                    f"Model file not found at {model_path}. "
                    "Using randomly initialized weights. "
                    "Please place your pretrained model in the models/ directory."
                )
            
            # Set model to evaluation mode
            self._model.to(self._device)
            self._model.eval()
            
            logger.info(f"Model initialized with {input_channels} input channels")
            logger.info(f"Model output classes: {num_classes}")
            
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            raise
    
    def predict(self, face_image: np.ndarray) -> Dict[str, any]:
        """
        Predict emotion from a face image.
        
        Args:
            face_image: Preprocessed face image as numpy array
                       Shape: (H, W) for grayscale or (H, W, 3) for RGB
        
        Returns:
            Dictionary containing:
                - emotion: Predicted emotion label
                - confidence: Confidence score (0-1)
                - probabilities: Dictionary of all class probabilities
        """
        try:
            # Convert numpy array to torch tensor
            if settings.MODEL_GRAYSCALE:
                # Ensure grayscale
                if len(face_image.shape) == 3:
                    face_image = face_image[:, :, 0]  # Take first channel
                # Add channel dimension: (H, W) -> (1, H, W)
                image_tensor = torch.from_numpy(face_image).unsqueeze(0).float()
            else:
                # RGB image: (H, W, 3) -> (3, H, W)
                image_tensor = torch.from_numpy(face_image).permute(2, 0, 1).float()
            
            # Add batch dimension: (C, H, W) -> (1, C, H, W)
            image_tensor = image_tensor.unsqueeze(0)
            
            # Move to device
            image_tensor = image_tensor.to(self._device)
            
            # Perform inference
            with torch.no_grad():
                outputs = self._model(image_tensor)
                probabilities = F.softmax(outputs, dim=1)
                confidence, predicted = torch.max(probabilities, 1)
            
            # Get predicted emotion
            emotion_idx = predicted.item()
            emotion_label = settings.EMOTION_LABELS[emotion_idx]
            confidence_score = confidence.item()
            
            # Get all probabilities
            all_probs = probabilities[0].cpu().numpy()
            prob_dict = {
                label: float(prob) 
                for label, prob in zip(settings.EMOTION_LABELS, all_probs)
            }
            
            return {
                "emotion": emotion_label,
                "confidence": float(confidence_score),
                "probabilities": prob_dict
            }
            
        except Exception as e:
            logger.error(f"Error during prediction: {e}")
            raise
    
    def get_model_info(self) -> Dict[str, any]:
        """Get information about the loaded model."""
        return {
            "device": str(self._device),
            "input_size": settings.MODEL_INPUT_SIZE,
            "grayscale": settings.MODEL_GRAYSCALE,
            "num_classes": len(settings.EMOTION_LABELS),
            "classes": settings.EMOTION_LABELS
        }


# Global predictor instance
predictor = EmotionPredictor()
