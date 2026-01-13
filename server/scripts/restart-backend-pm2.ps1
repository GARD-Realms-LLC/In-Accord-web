# PowerShell script to stop, clean, rebuild, and restart backend with PM2
# Usage: Run from the server directory

# Stop and delete the PM2 process
pm2 stop inaccord-backend
pm2 delete inaccord-backend

# Clean TypeScript build
if (Test-Path dist) { Remove-Item -Recurse -Force dist }

# Rebuild
npx tsc --build --force

# Start backend with PM2
pm2 start dist/index.js --name inaccord-backend

Write-Host "Backend stopped, cleaned, rebuilt, and restarted with PM2."
