# Model Training Guide

This guide explains how to train your own emotion detection model for this system.

## 📊 Dataset

### Recommended Datasets

1. **FER2013** (Most Popular)
   - 35,887 grayscale images (48x48 pixels)
   - 7 emotions: Angry, Disgust, Fear, Happy, Sad, Surprise, Neutral
   - Available on [Kaggle](https://www.kaggle.com/datasets/msambare/fer2013)

2. **CK+ (Extended Cohn-Kanade)**
   - Higher quality, smaller dataset
   - Good for fine-tuning

3. **AffectNet**
   - Large-scale dataset
   - More diverse

### Download FER2013

```bash
# Option 1: Kaggle CLI
pip install kaggle
kaggle datasets download -d msambare/fer2013

# Option 2: Manual download from Kaggle website
```

---

## 🏗️ Model Architecture

This system uses the `EmotionCNN` architecture defined in `backend/app/model.py`.

### Architecture Overview

```
Input: 48x48 grayscale image
    ↓
Conv Block 1: Conv(64) → BatchNorm → Conv(64) → Pool → Dropout
    ↓
Conv Block 2: Conv(128) → BatchNorm → Conv(128) → Pool → Dropout
    ↓
Conv Block 3: Conv(256) → BatchNorm → Conv(256) → Pool → Dropout
    ↓
Conv Block 4: Conv(512) → Pool → Dropout
    ↓
Flatten → FC(512) → Dropout → FC(256) → Dropout → FC(7)
    ↓
Output: 7 emotion classes
```

### Key Features

- **4 Convolutional Blocks**: Progressive feature extraction
- **Batch Normalization**: Faster training, better generalization
- **Dropout**: Prevents overfitting
- **ReLU Activation**: Non-linearity
- **MaxPooling**: Spatial downsampling

---

## 🎓 Training on Kaggle (Recommended)

### Step 1: Create Training Notebook

Create a new Kaggle notebook and add the FER2013 dataset.

### Step 2: Training Code

```python
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
import numpy as np
import pandas as pd
from PIL import Image
import io

# Enable GPU
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f'Using device: {device}')

# Copy EmotionCNN class from backend/app/model.py
class EmotionCNN(nn.Module):
    # ... (paste full class from model.py)
    pass

# Custom Dataset
class FERDataset(Dataset):
    def __init__(self, csv_file, transform=None):
        self.data = pd.read_csv(csv_file)
        self.transform = transform
    
    def __len__(self):
        return len(self.data)
    
    def __getitem__(self, idx):
        # Get pixels and emotion
        pixels = self.data.iloc[idx]['pixels']
        emotion = self.data.iloc[idx]['emotion']
        
        # Convert pixels string to image
        pixels = np.array([int(p) for p in pixels.split()])
        image = pixels.reshape(48, 48).astype(np.float32) / 255.0
        
        # Add channel dimension
        image = torch.from_numpy(image).unsqueeze(0)
        
        return image, emotion

# Load datasets
train_dataset = FERDataset('/kaggle/input/fer2013/fer2013/train.csv')
test_dataset = FERDataset('/kaggle/input/fer2013/fer2013/test.csv')

train_loader = DataLoader(train_dataset, batch_size=64, shuffle=True, num_workers=2)
test_loader = DataLoader(test_dataset, batch_size=64, shuffle=False, num_workers=2)

# Initialize model
model = EmotionCNN(num_classes=7, input_channels=1).to(device)

# Loss and optimizer
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)
scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, 'min', patience=3)

# Training loop
num_epochs = 50
best_accuracy = 0.0

for epoch in range(num_epochs):
    # Training phase
    model.train()
    train_loss = 0.0
    train_correct = 0
    train_total = 0
    
    for images, labels in train_loader:
        images, labels = images.to(device), labels.to(device)
        
        # Forward pass
        outputs = model(images)
        loss = criterion(outputs, labels)
        
        # Backward pass
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        
        # Statistics
        train_loss += loss.item()
        _, predicted = torch.max(outputs.data, 1)
        train_total += labels.size(0)
        train_correct += (predicted == labels).sum().item()
    
    # Validation phase
    model.eval()
    test_loss = 0.0
    test_correct = 0
    test_total = 0
    
    with torch.no_grad():
        for images, labels in test_loader:
            images, labels = images.to(device), labels.to(device)
            outputs = model(images)
            loss = criterion(outputs, labels)
            
            test_loss += loss.item()
            _, predicted = torch.max(outputs.data, 1)
            test_total += labels.size(0)
            test_correct += (predicted == labels).sum().item()
    
    # Calculate metrics
    train_accuracy = 100 * train_correct / train_total
    test_accuracy = 100 * test_correct / test_total
    
    print(f'Epoch [{epoch+1}/{num_epochs}]')
    print(f'  Train Loss: {train_loss/len(train_loader):.4f}, Acc: {train_accuracy:.2f}%')
    print(f'  Test Loss: {test_loss/len(test_loader):.4f}, Acc: {test_accuracy:.2f}%')
    
    # Learning rate scheduling
    scheduler.step(test_loss)
    
    # Save best model
    if test_accuracy > best_accuracy:
        best_accuracy = test_accuracy
        torch.save({
            'epoch': epoch,
            'model_state_dict': model.state_dict(),
            'optimizer_state_dict': optimizer.state_dict(),
            'test_accuracy': test_accuracy,
            'num_classes': 7,
            'input_channels': 1
        }, 'emotion_model_best.pth')
        print(f'  ✓ Saved best model (Accuracy: {test_accuracy:.2f}%)')

print(f'\nTraining complete! Best accuracy: {best_accuracy:.2f}%')

# Save final model
torch.save(model.state_dict(), 'emotion_model_final.pth')
```

### Step 3: Download Trained Model

After training:
1. Download `emotion_model_best.pth` from Kaggle
2. Place in `backend/models/emotion_model.pth`

---

## 🎯 Training Tips

### Hyperparameters

```python
# Good starting points
BATCH_SIZE = 64
LEARNING_RATE = 0.001  # Use Adam optimizer
NUM_EPOCHS = 50-100
WEIGHT_DECAY = 1e-4  # L2 regularization
```

### Data Augmentation

```python
import torchvision.transforms as transforms

transform = transforms.Compose([
    transforms.RandomHorizontalFlip(p=0.5),
    transforms.RandomRotation(10),
    transforms.RandomAffine(degrees=0, translate=(0.1, 0.1)),
    transforms.ToTensor(),
])
```

### Learning Rate Scheduling

```python
# Option 1: ReduceLROnPlateau
scheduler = optim.lr_scheduler.ReduceLROnPlateau(
    optimizer, 
    mode='min', 
    patience=3, 
    factor=0.5
)

# Option 2: StepLR
scheduler = optim.lr_scheduler.StepLR(
    optimizer, 
    step_size=15, 
    gamma=0.1
)
```

### Early Stopping

```python
patience = 10
best_loss = float('inf')
counter = 0

for epoch in range(num_epochs):
    # ... training code ...
    
    if val_loss < best_loss:
        best_loss = val_loss
        counter = 0
        # Save model
    else:
        counter += 1
        if counter >= patience:
            print("Early stopping triggered")
            break
```

---

## 📈 Expected Performance

### FER2013 Benchmarks

- **Baseline** (Random): ~14% accuracy
- **Simple CNN**: ~50-60% accuracy
- **This Architecture**: ~65-70% accuracy
- **State-of-the-art**: ~75-80% accuracy

### Training Time (Kaggle GPU)

- **Per Epoch**: ~2-3 minutes
- **50 Epochs**: ~2 hours
- **100 Epochs**: ~4 hours

---

## 🔧 Advanced Techniques

### 1. Transfer Learning

```python
# Use pretrained ResNet as backbone
import torchvision.models as models

resnet = models.resnet18(pretrained=True)
# Freeze early layers
for param in resnet.parameters():
    param.requires_grad = False

# Modify final layer
resnet.fc = nn.Linear(resnet.fc.in_features, 7)
```

### 2. Class Balancing

FER2013 is imbalanced. Use weighted loss:

```python
# Calculate class weights
class_counts = [4953, 547, 5121, 8989, 6077, 4002, 6198]  # FER2013
weights = 1.0 / torch.tensor(class_counts, dtype=torch.float)
weights = weights / weights.sum() * len(class_counts)

criterion = nn.CrossEntropyLoss(weight=weights.to(device))
```

### 3. Ensemble Methods

Train multiple models and average predictions:

```python
models = [model1, model2, model3]
predictions = []

for model in models:
    model.eval()
    with torch.no_grad():
        pred = model(image)
        predictions.append(pred)

# Average predictions
final_pred = torch.mean(torch.stack(predictions), dim=0)
```

---

## ✅ Model Validation

### Test Your Model Locally

```python
# Load model
from app.model import EmotionCNN, predictor

# Test prediction
import cv2
import numpy as np

# Load test image
image = cv2.imread('test_face.jpg', cv2.IMREAD_GRAYSCALE)
image = cv2.resize(image, (48, 48))
image = image.astype(np.float32) / 255.0

# Predict
result = predictor.predict(image)
print(f"Emotion: {result['emotion']}")
print(f"Confidence: {result['confidence']:.2f}")
```

### Confusion Matrix

```python
from sklearn.metrics import confusion_matrix, classification_report
import seaborn as sns
import matplotlib.pyplot as plt

# Get predictions
all_preds = []
all_labels = []

model.eval()
with torch.no_grad():
    for images, labels in test_loader:
        outputs = model(images.to(device))
        _, preds = torch.max(outputs, 1)
        all_preds.extend(preds.cpu().numpy())
        all_labels.extend(labels.numpy())

# Plot confusion matrix
cm = confusion_matrix(all_labels, all_preds)
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
plt.title('Confusion Matrix')
plt.ylabel('True Label')
plt.xlabel('Predicted Label')
plt.show()

# Classification report
emotions = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']
print(classification_report(all_labels, all_preds, target_names=emotions))
```

---

## 🚀 Deployment

### Save Model Properly

```python
# Save with metadata
checkpoint = {
    'model_state_dict': model.state_dict(),
    'num_classes': 7,
    'input_channels': 1,
    'input_size': (48, 48),
    'test_accuracy': test_accuracy,
    'emotion_labels': ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral'],
    'training_date': '2026-02-05',
    'notes': 'Trained on FER2013 for 50 epochs'
}

torch.save(checkpoint, 'emotion_model.pth')
```

### Optimize for Inference

```python
# Convert to TorchScript for faster inference
model.eval()
example_input = torch.randn(1, 1, 48, 48)
traced_model = torch.jit.trace(model, example_input)
traced_model.save('emotion_model_traced.pt')
```

---

## 📚 Resources

### Papers
- [FER2013 Paper](https://arxiv.org/abs/1307.0414)
- [Emotion Recognition Survey](https://arxiv.org/abs/1905.05078)

### Tutorials
- [PyTorch Image Classification Tutorial](https://pytorch.org/tutorials/beginner/blitz/cifar10_tutorial.html)
- [Kaggle FER2013 Notebooks](https://www.kaggle.com/datasets/msambare/fer2013/code)

### Pretrained Models
- [FER+ Model Zoo](https://github.com/microsoft/FERPlus)

---

## 🎯 Quick Checklist

- [ ] Download FER2013 dataset
- [ ] Set up Kaggle notebook with GPU
- [ ] Copy EmotionCNN architecture
- [ ] Implement training loop
- [ ] Add data augmentation
- [ ] Train for 50+ epochs
- [ ] Validate on test set
- [ ] Save best model checkpoint
- [ ] Download trained model
- [ ] Place in backend/models/
- [ ] Test with real webcam

---

Happy training! 🎓
