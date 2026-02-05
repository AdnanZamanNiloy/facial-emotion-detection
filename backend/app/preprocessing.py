"""
Image preprocessing for emotion detection model.
Handles resizing, normalization, and format conversion.
"""
import cv2
import numpy as np
from typing import Optional
import logging

from app.config import settings

logger = logging.getLogger(__name__)


class ImagePreprocessor:
    """
    Handles preprocessing of face images for the emotion detection model.
    """
    
    def __init__(self):
        """Initialize preprocessor with model requirements."""
        self.target_size = settings.MODEL_INPUT_SIZE
        self.grayscale = settings.MODEL_GRAYSCALE
    
    def preprocess(self, face_image: np.ndarray) -> Optional[np.ndarray]:
        """
        Preprocess face image for model input.
        
        Steps:
        1. Convert to grayscale (if required)
        2. Resize to model input size
        3. Normalize pixel values to [0, 1]
        
        Args:
            face_image: Face image as numpy array
        
        Returns:
            Preprocessed image ready for model input or None if preprocessing fails
        """
        try:
            if face_image is None or face_image.size == 0:
                logger.warning("Empty face image provided")
                return None
            
            # Convert to grayscale if required
            if self.grayscale:
                if len(face_image.shape) == 3:
                    face_gray = cv2.cvtColor(face_image, cv2.COLOR_BGR2GRAY)
                else:
                    face_gray = face_image
            else:
                # Ensure RGB format
                if len(face_image.shape) == 2:
                    # Convert grayscale to RGB
                    face_gray = cv2.cvtColor(face_image, cv2.COLOR_GRAY2RGB)
                elif face_image.shape[2] == 4:
                    # Convert RGBA to RGB
                    face_gray = cv2.cvtColor(face_image, cv2.COLOR_BGRA2RGB)
                else:
                    # Keep as is (assume RGB or BGR)
                    face_gray = face_image
            
            # Resize to model input size
            face_resized = cv2.resize(
                face_gray, 
                self.target_size,
                interpolation=cv2.INTER_AREA
            )
            
            # Normalize pixel values to [0, 1]
            face_normalized = face_resized.astype(np.float32) / 255.0
            
            return face_normalized
            
        except Exception as e:
            logger.error(f"Error preprocessing image: {e}")
            return None
    
    def preprocess_with_histogram_equalization(
        self, 
        face_image: np.ndarray
    ) -> Optional[np.ndarray]:
        """
        Preprocess with histogram equalization for better contrast.
        Useful for images with poor lighting conditions.
        
        Args:
            face_image: Face image as numpy array
        
        Returns:
            Preprocessed image or None if preprocessing fails
        """
        try:
            if face_image is None or face_image.size == 0:
                return None
            
            # Convert to grayscale if needed
            if len(face_image.shape) == 3:
                face_gray = cv2.cvtColor(face_image, cv2.COLOR_BGR2GRAY)
            else:
                face_gray = face_image
            
            # Apply histogram equalization
            face_equalized = cv2.equalizeHist(face_gray)
            
            # Resize to model input size
            face_resized = cv2.resize(
                face_equalized,
                self.target_size,
                interpolation=cv2.INTER_AREA
            )
            
            # Normalize pixel values
            face_normalized = face_resized.astype(np.float32) / 255.0
            
            return face_normalized
            
        except Exception as e:
            logger.error(f"Error preprocessing with histogram equalization: {e}")
            return None
    
    def batch_preprocess(
        self, 
        face_images: list
    ) -> list:
        """
        Preprocess multiple face images.
        
        Args:
            face_images: List of face images
        
        Returns:
            List of preprocessed images (None for failed preprocessing)
        """
        return [self.preprocess(face) for face in face_images]
    
    def validate_input(self, image: np.ndarray) -> bool:
        """
        Validate if image is suitable for preprocessing.
        
        Args:
            image: Input image
        
        Returns:
            True if valid, False otherwise
        """
        if image is None:
            return False
        
        if not isinstance(image, np.ndarray):
            return False
        
        if image.size == 0:
            return False
        
        # Check if image has minimum size
        min_size = 20  # Minimum 20x20 pixels
        if image.shape[0] < min_size or image.shape[1] < min_size:
            logger.warning(f"Image too small: {image.shape}")
            return False
        
        return True


# Global preprocessor instance
preprocessor = ImagePreprocessor()
