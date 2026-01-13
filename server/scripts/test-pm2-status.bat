# Windows batch file to test the PM2 status endpoint
# Usage: Double-click or run in terminal to see the raw response
curl -i http://localhost:8000/api/pm2/status
pause
