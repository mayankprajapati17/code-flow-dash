@echo off
echo Starting Both Servers...
echo.
echo Starting API Server on port 3001...
start "API Server" cmd /k "npm run dev:server"
echo.
echo Waiting 3 seconds for API server to start...
timeout /t 3 /nobreak > nul
echo.
echo Starting Vite Dev Server on port 8080...
start "Vite Dev Server" cmd /k "npm run dev"
echo.
echo Both servers are now running:
echo - Frontend: http://localhost:8080
echo - API: http://localhost:3001
echo - API calls from frontend will be proxied automatically
echo.
pause
