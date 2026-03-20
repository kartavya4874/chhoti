@echo off
echo ================================================
echo Installing Python dependencies...
echo ================================================
pip install -r requirements.txt

echo.
echo ================================================
echo Starting Chatbot Backend Server...
echo ================================================
python chatbot_server.py

pause
