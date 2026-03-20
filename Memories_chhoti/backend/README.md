# Chatbot Backend Server 🤖

This is a simple Python backend server that provides **real AI-powered conversations** using Google's Gemini LLM.

## Why Backend Server?

- ✅ **Real AI Conversations** - Natural, flowing chat using LLM
- ✅ **No CORS Issues** - Runs locally, avoids browser security blocks
- ✅ **Conversation Memory** - Remembers context across messages
- ✅ **100% Free** - Uses Google Gemini's free tier

## How to Start the Server

### Option 1: Easy Way (Windows)
1. Double-click `start_server.bat`
2. Wait for it to install dependencies and start
3. Keep the terminal window open

### Option 2: Manual Way
```bash
# Install dependencies (only needed once)
pip install -r requirements.txt

# Start the server
python chatbot_server.py
```

## How to Use

1. **Start the server** using either method above
2. **Open `index.html`** in your browser
3. **Go to "Chat with Bhaiya" tab**
4. **Start chatting!**

The chatbot will automatically use the backend server for real AI responses.

## What If Server Isn't Running?

No problem! The chatbot will automatically fall back to **pattern matching mode** (offline mode). It will still work, just with pre-programmed responses instead of AI.

## Server Status

Once running, you can check:
- **Health Check**: http://localhost:5000/health
- **Server Console**: Shows all incoming requests

## Stopping the Server

Press `Ctrl + C` in the terminal window where the server is running.

## Troubleshooting

**Problem**: `pip` command not found
- **Solution**: Install Python from python.org and make sure to check "Add Python to PATH"

**Problem**: Port 5000 already in use
- **Solution**: Change port in `chatbot_server.py` (line at bottom: `port=5000`) and in `chatbot.js` (line: `BACKEND_URL`)

**Problem**: Cannot install dependencies
- **Solution**: Try `pip install --user -r requirements.txt`

**Problem**: Chatbot still uses pattern matching
- **Solution**: Make sure server is running and console shows no errors. Check browser console (F12) for error messages.

## Technical Details

- **Framework**: Flask (Python web server)
- **LLM**: Google Gemini Pro (free API)
- **Port**: localhost:5000
- **Language**: Python 3.7+
