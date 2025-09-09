@echo off
echo Starting Algolearn Integrated Development Environment...
echo.

echo Starting AlgolearnWeb Server on port 5000...
cd "src\components\AlgolearnWeb"
start "AlgolearnWeb Server" cmd /k "npm run dev"

echo.
echo Starting Main Project on port 8080...
cd "..\..\.."
start "Main Project" cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo Main Project: http://localhost:8080
echo AlgolearnWeb Server: http://localhost:5000
echo.
echo Press any key to exit this launcher...
pause > nul 