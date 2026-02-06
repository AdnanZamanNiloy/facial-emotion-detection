# Deployment Guide

This guide explains how to deploy and connect your Emotion Detection application on Render (backend) and Vercel (frontend).

## Current Deployment URLs

- **Backend (Render)**: https://facialemotiondetection.onrender.com
- **Frontend (Vercel)**: https://facial-emotion-detection-beta.vercel.app/

## Configuration Complete ✓

The following configuration files have been created/updated to connect your deployments:

### Backend Configuration
- **File**: `backend/.env`
- **CORS Settings**: Now includes your Vercel frontend URL
- **Allowed Origins**: 
  - http://localhost:3000 (development)
  - https://facial-emotion-detection-beta.vercel.app (production)

### Frontend Configuration
- **Development**: `frontend/.env` - Points to localhost
- **Production**: `frontend/.env.production` - Points to your Render backend
- **WebSocket URL**: wss://facialemotiondetection.onrender.com/ws

## Next Steps

### 1. Redeploy Backend on Render

1. Push your changes to your Git repository:
   ```bash
   git add backend/.env
   git commit -m "Update CORS settings for Vercel frontend"
   git push
   ```

2. In Render Dashboard:
   - Go to your backend service
   - Navigate to **Environment** tab
   - Add/update the environment variable:
     - **Key**: `ALLOWED_ORIGINS`
     - **Value**: `["http://localhost:3000","http://127.0.0.1:3000","https://facial-emotion-detection-beta.vercel.app"]`
   - Click **Save Changes**
   - Render will automatically redeploy

### 2. Redeploy Frontend on Vercel

1. Push your changes to your Git repository:
   ```bash
   git add frontend/.env.production
   git commit -m "Configure production WebSocket URL for Render backend"
   git push
   ```

2. In Vercel Dashboard:
   - Go to your project
   - Navigate to **Settings** → **Environment Variables**
   - Add the environment variable:
     - **Key**: `REACT_APP_WS_URL`
     - **Value**: `wss://facialemotiondetection.onrender.com/ws`
     - **Environment**: Select **Production**
   - Click **Save**
   - Go to **Deployments** tab
   - Click **Redeploy** on the latest deployment

**OR** simply push to Git and Vercel will auto-deploy.

### 3. Testing the Connection

After both deployments are complete:

1. Open your frontend: https://facial-emotion-detection-beta.vercel.app/
2. Allow camera permissions when prompted
3. Check the connection status indicator
4. Verify that emotion detection is working in real-time

### 4. Verifying Backend Health

Check if your backend is running properly:
- Health check: https://facialemotiondetection.onrender.com/health
- API info: https://facialemotiondetection.onrender.com/

## Troubleshooting

### Frontend Can't Connect to Backend

**Symptoms**: WebSocket connection fails, "disconnected" status

**Solutions**:
1. Verify the backend is awake (Render free tier services sleep after inactivity)
2. Check browser console for CORS errors
3. Ensure you're using `wss://` (not `ws://`) for the production WebSocket URL
4. Verify the environment variable in Vercel is set correctly

### CORS Errors

**Symptoms**: "Access-Control-Allow-Origin" errors in browser console

**Solutions**:
1. Verify the ALLOWED_ORIGINS environment variable in Render includes your Vercel URL
2. Make sure there are no trailing slashes or typos in URLs
3. Redeploy the backend after updating environment variables

### Backend Not Responding

**Symptoms**: 502/503 errors, timeouts

**Solutions**:
1. Check Render logs for errors
2. Verify the model file (emotion_model.pth) is included in your deployment
3. Ensure all requirements are installed (check requirements.txt)
4. Check if you need to upgrade your Render plan for better performance

### WebSocket Connection Drops

**Symptoms**: Connection works initially but disconnects frequently

**Solutions**:
1. This is normal for Render free tier during cold starts
2. Consider upgrading to a paid Render plan for persistent connections
3. The frontend will automatically attempt to reconnect

## Environment Variables Reference

### Backend (Render)
```
ALLOWED_ORIGINS=["http://localhost:3000","http://127.0.0.1:3000","https://facial-emotion-detection-beta.vercel.app"]
DEBUG=False
HOST=0.0.0.0
PORT=8000
```

### Frontend (Vercel)
```
REACT_APP_WS_URL=wss://facialemotiondetection.onrender.com/ws
```

## Important Notes

- **Render Free Tier**: Services sleep after 15 minutes of inactivity. First request may take 30-60 seconds to wake up.
- **WebSocket Protocol**: Always use `wss://` (secure) with HTTPS deployments, not `ws://`
- **CORS**: Both the exact URL (with/without trailing slash) and the origin must match
- **Git Deployment**: Both Render and Vercel can auto-deploy from Git commits

## Support

If you encounter issues:
1. Check Render logs: Dashboard → Your Service → Logs
2. Check Vercel logs: Dashboard → Your Project → Deployments → View Function Logs
3. Check browser console (F12) for frontend errors
4. Verify all environment variables are set correctly
