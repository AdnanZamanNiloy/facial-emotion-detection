"""
Script to create a dummy pretrained model for testing.
This creates an untrained model with random weights.

For production use, replace this with your actual trained model.
"""
import torch
import sys
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

from app.model import EmotionCNN
from app.config import settings, MODEL_DIR


def create_dummy_model():
    """Create and save a dummy model with random initialization."""
    
    print("Creating dummy emotion detection model...")
    print(f"Model directory: {MODEL_DIR}")
    
    # Create model
    input_channels = 1 if settings.MODEL_GRAYSCALE else 3
    num_classes = len(settings.EMOTION_LABELS)
    
    model = EmotionCNN(
        num_classes=num_classes,
        input_channels=input_channels
    )
    
    print(f"Model architecture:")
    print(f"  - Input channels: {input_channels}")
    print(f"  - Output classes: {num_classes}")
    print(f"  - Input size: {settings.MODEL_INPUT_SIZE}")
    
    # Save model
    model_path = MODEL_DIR / "emotion_model.pth"
    
    # Save with metadata
    checkpoint = {
        'model_state_dict': model.state_dict(),
        'num_classes': num_classes,
        'input_channels': input_channels,
        'input_size': settings.MODEL_INPUT_SIZE,
        'emotion_labels': settings.EMOTION_LABELS,
        'note': 'This is a dummy model with random weights. Replace with trained model.'
    }
    
    torch.save(checkpoint, model_path)
    
    print(f"\n✓ Dummy model saved to: {model_path}")
    print(f"✓ Model size: {model_path.stat().st_size / (1024*1024):.2f} MB")
    print("\n⚠️  WARNING: This model has random weights and won't produce meaningful predictions.")
    print("⚠️  For production use, train a model and replace this file.\n")
    
    return model_path


if __name__ == "__main__":
    create_dummy_model()
