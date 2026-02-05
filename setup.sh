#!/bin/bash

# Emotion Detection - Quick Setup Script
# This script automates the setup process for the Emotion Detection system

set -e  # Exit on error

echo "🎭 Emotion Detection - Automated Setup"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Python is installed
echo "📋 Checking prerequisites..."
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 is not installed. Please install Python 3.8+ first.${NC}"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 16+ first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Python $(python3 --version) found${NC}"
echo -e "${GREEN}✓ Node.js $(node --version) found${NC}"
echo ""

# Backend Setup
echo "🔧 Setting up backend..."
cd backend

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing Python dependencies (this may take a few minutes)..."
pip install --upgrade pip > /dev/null 2>&1
pip install -r requirements.txt

# Create dummy model if no model exists
if [ ! -f "models/emotion_model.pth" ]; then
    echo "Creating dummy model for testing..."
    python create_dummy_model.py
    echo -e "${YELLOW}⚠️  Using dummy model with random weights.${NC}"
    echo -e "${YELLOW}   For real predictions, replace with trained model.${NC}"
fi

echo -e "${GREEN}✓ Backend setup complete${NC}"
echo ""

# Frontend Setup
echo "🎨 Setting up frontend..."
cd ../frontend

# Install dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing Node.js dependencies (this may take a few minutes)..."
    npm install
fi

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating environment configuration..."
    cp .env.example .env
fi

echo -e "${GREEN}✓ Frontend setup complete${NC}"
echo ""

# Summary
echo "======================================"
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo "======================================"
echo ""
echo "To start the application:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend"
echo "  source venv/bin/activate  # On Linux/Mac"
echo "  python -m app.main"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd frontend"
echo "  npm start"
echo ""
echo "Then open: http://localhost:3000"
echo ""
echo -e "${YELLOW}Note: The dummy model won't give accurate predictions.${NC}"
echo -e "${YELLOW}      Replace backend/models/emotion_model.pth with a trained model.${NC}"
echo ""
