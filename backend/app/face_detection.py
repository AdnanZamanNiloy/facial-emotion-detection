"""
Face detection using OpenCV Haar Cascade.
Extracts face regions from images for emotion recognition.
"""
import cv2
import numpy as np
from typing import List, Tuple, Optional
import logging

from app.config import settings

logger = logging.getLogger(__name__)


class FaceDetector:
    """
    Face detection using OpenCV Haar Cascade.
    Singleton pattern for efficient reuse.
    """
    
    _instance = None
    _detector = None
    _cascade = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(FaceDetector, cls).__new__(cls)
        return cls._instance
    
    def __init__(self):
        """Initialize OpenCV face detector."""
        if self._cascade is None:
            self._initialize_detector()
    
    def _initialize_detector(self):
        """Initialize the OpenCV Haar Cascade face detection."""
        try:
            # Load OpenCV's pre-trained Haar Cascade
            cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
            self._cascade = cv2.CascadeClassifier(cascade_path)
            
            if self._cascade.empty():
                raise Exception("Failed to load Haar Cascade model")
            
            logger.info("OpenCV Haar Cascade Face Detector initialized successfully")
            
        except Exception as e:
            logger.error(f"Error initializing face detector: {e}")
            raise
    
    def detect_faces(
        self, 
        image: np.ndarray
    ) -> List[Tuple[int, int, int, int]]:
        """
        Detect faces in an image using OpenCV Haar Cascade.
        
        Args:
            image: Input image as numpy array (BGR or RGB format)
        
        Returns:
            List of face bounding boxes as (x, y, width, height) tuples
        """
        try:
            # Convert to grayscale for Haar Cascade
            if len(image.shape) == 3:
                gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            else:
                gray = image
            
            # Detect faces
            faces = self._cascade.detectMultiScale(
                gray,
                scaleFactor=1.1,
                minNeighbors=5,
                minSize=(30, 30),
                flags=cv2.CASCADE_SCALE_IMAGE
            )
            
            # Convert from numpy array to list of tuples
            return [(int(x), int(y), int(w), int(h)) for x, y, w, h in faces]
            
        except Exception as e:
            logger.error(f"Error detecting faces: {e}")
            return []
    
    def extract_face(
        self, 
        image: np.ndarray, 
        bbox: Tuple[int, int, int, int],
        padding: float = 0.2
    ) -> Optional[np.ndarray]:
        """
        Extract and crop face region from image with padding.
        
        Args:
            image: Input image
            bbox: Bounding box as (x, y, width, height)
            padding: Padding ratio to add around face (default: 0.2 = 20%)
        
        Returns:
            Cropped face image or None if extraction fails
        """
        try:
            x, y, w, h = bbox
            height, width = image.shape[:2]
            
            # Calculate padding
            pad_w = int(w * padding)
            pad_h = int(h * padding)
            
            # Add padding to bounding box
            x1 = max(0, x - pad_w)
            y1 = max(0, y - pad_h)
            x2 = min(width, x + w + pad_w)
            y2 = min(height, y + h + pad_h)
            
            # Extract face region
            face = image[y1:y2, x1:x2]
            
            if face.size == 0:
                return None
            
            return face
            
        except Exception as e:
            logger.error(f"Error extracting face: {e}")
            return None
    
    def detect_and_extract_largest_face(
        self, 
        image: np.ndarray,
        padding: float = 0.2
    ) -> Optional[np.ndarray]:
        """
        Detect faces and extract the largest one.
        Useful for single-person scenarios.
        
        Args:
            image: Input image
            padding: Padding ratio around face
        
        Returns:
            Cropped face image or None if no face detected
        """
        faces = self.detect_faces(image)
        
        if not faces:
            return None
        
        # Find largest face (by area)
        largest_face = max(faces, key=lambda bbox: bbox[2] * bbox[3])
        
        # Extract face
        face_image = self.extract_face(image, largest_face, padding)
        
        return face_image
    
    def __del__(self):
        """Cleanup resources."""
        pass  # OpenCV cascade doesn't require explicit cleanup


# Global face detector instance
face_detector = FaceDetector()
