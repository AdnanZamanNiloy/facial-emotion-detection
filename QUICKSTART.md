# Quick Start Guide - 5 Minutes ⚡

Get your emotion detection system running in 5 minutes!

## 🎯 Before You Start

Make sure you have:
- ✅ Python 3.8 or higher
- ✅ Node.js 16 or higher  
- ✅ A webcam (built-in or USB)
- ✅ Internet connection (for installing dependencies)

**Check Installation:**
```bash
python3 --version    # Should show 3.8+
node --version       # Should show 16+
```

---

## 🚀 Step-by-Step Setup

### Step 1: Open Terminal

- **Windows**: Press `Win + R`, type `cmd`, press Enter
- **Mac**: Press `Cmd + Space`, type "Terminal", press Enter  
- **Linux**: Press `Ctrl + Alt + T`

### Step 2: Navigate to Project

```bash
cd "Desktop/Emotion Detection"
```

### Step 3: Setup Backend (2 minutes)

```bash
# Go to backend folder
cd backend

# Create Python environment
python3 -m venv venv

# Activate it
# On Mac/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install requirements (this takes ~1-2 minutes)
pip install -r requirements.txt

# Create test model
python create_dummy_model.py
```

You should see: ✓ Dummy model saved

### Step 4: Start Backend Server

```bash
# Start the server
python -m app.main
```

You should see:
```
INFO: Application startup complete
INFO: Uvicorn running on http://0.0.0.0:8000
```

**✅ Keep this terminal open!**

### Step 5: Setup Frontend (2 minutes)

**Open a NEW terminal** (keep the first one running!)

```bash
# Go to project folder
cd "Desktop/Emotion Detection"

# Go to frontend folder  
cd frontend

# Install requirements (this takes ~1-2 minutes)
npm install

# Copy environment file
cp .env.example .env
```

### Step 6: Start Frontend

```bash
# Start the app
npm start
```

After a few seconds, your browser will open automatically to:
```
http://localhost:3000
```

---

## 🎉 You're Done!

Your emotion detection system is now running!

### What You Should See:

1. **Browser opens automatically**
2. **Camera permission popup** - Click "Allow"
3. **Your webcam feed appears**
4. **Green "Connected" status** at the top
5. **Emotion detection starts** automatically

---

## 🧪 Quick Test

1. **Smile** 😊 - Should detect "Happy"
2. **Make an angry face** 😠 - Should detect "Angry"
3. **Look surprised** 😲 - Should detect "Surprise"

⚠️ **Note**: The dummy model won't give accurate results. See below for training a real model.

---

## ❓ Something Not Working?

### Backend won't start

**Error: "Port 8000 already in use"**
```bash
# Kill the process
# Mac/Linux:
lsof -ti:8000 | xargs kill -9
# Windows:
netstat -ano | findstr :8000
# Then use Task Manager to kill the process
```

**Error: "No module named 'torch'"**
```bash
# Reinstall requirements
pip install -r requirements.txt
```

### Frontend won't start

**Error: "npm command not found"**
- Install Node.js from https://nodejs.org/

**Error: "Port 3000 already in use"**
```bash
# Use a different port
PORT=3001 npm start
```

### Camera not working

- **Click "Allow"** when browser asks for camera permission
- **Check settings**: Make sure camera isn't blocked in browser settings
- **Restart browser**: Close all browser windows and try again
- **Try different browser**: Chrome works best

### Can't connect to server

- **Check backend is running**: Look for "Uvicorn running" message
- **Check URL**: Should be `ws://localhost:8000/ws`
- **Restart both**: Close both terminals, start over from Step 3

---

## 🎓 Next Steps

### Get Accurate Predictions

The dummy model won't work well. To get real predictions:

1. **Read**: [MODEL_TRAINING.md](MODEL_TRAINING.md)
2. **Train model** on Kaggle (free GPU)
3. **Download** trained model
4. **Replace** `backend/models/emotion_model.pth`
5. **Restart** backend server

### Customize the App

- **Change colors**: Edit `frontend/src/App.css`
- **Adjust frame rate**: Edit `frontend/src/components/WebcamCapture.jsx`
- **Modify emotions**: Edit `backend/app/config.py`

### Deploy to Production

- **Read**: [SETUP.md](SETUP.md) - Deployment section
- **Get domain**: Use Vercel/Netlify for frontend
- **Get server**: Use DigitalOcean/AWS for backend
- **Enable HTTPS**: Required for webcam access

---

## 💡 Tips

- Use **good lighting** for best face detection
- Keep **face centered** in camera
- **Close other apps** using camera
- Backend uses **20-40% CPU** - normal
- Frontend sends **8 frames per second** - adjustable

---

## 📱 Access from Phone

1. **Find your computer's IP**:
   ```bash
   # Mac/Linux:
   ifconfig | grep "inet "
   # Windows:
   ipconfig
   ```

2. **Use IP address**:
   - Change frontend `.env`: `REACT_APP_WS_URL=ws://192.168.1.100:8000/ws`
   - Restart frontend
   - Open phone browser: `http://192.168.1.100:3000`

---

## 🆘 Still Need Help?

### Check These Files:

- 📖 **Full setup guide**: [SETUP.md](SETUP.md)
- 🏗️ **Project structure**: [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)
- 🎓 **Model training**: [MODEL_TRAINING.md](MODEL_TRAINING.md)
- 🔧 **Backend docs**: [backend/README.md](backend/README.md)
- 🎨 **Frontend docs**: [frontend/README.md](frontend/README.md)

### Check Logs:

**Backend logs**:
```bash
cat backend/emotion_detection.log
```

**Frontend logs**:
- Open browser
- Press F12
- Check Console tab

---

## ✅ Quick Checklist

Use this to verify everything is working:

- [ ] Python 3.8+ installed
- [ ] Node.js 16+ installed
- [ ] Backend virtual environment created
- [ ] Backend dependencies installed
- [ ] Model file exists (`backend/models/emotion_model.pth`)
- [ ] Backend running (check terminal for "Uvicorn running")
- [ ] Frontend dependencies installed
- [ ] Frontend `.env` file exists
- [ ] Frontend running (browser opens automatically)
- [ ] Camera permission granted
- [ ] Video feed visible
- [ ] "Connected" status shows green
- [ ] Emotion predictions appearing

---

**Time Estimate**: 5-10 minutes total ⏱️

**Difficulty**: Beginner-friendly 🌟

**Result**: Working emotion detection system! 🎉

---

Need help? Check the troubleshooting section above or read the full setup guide! 📚
