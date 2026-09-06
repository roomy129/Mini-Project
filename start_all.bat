@echo off
echo ===================================================================
echo Starting Smart Faculty Location & Availability Tracking System
echo ===================================================================

echo [1/2] Starting Flask Backend Server (Port 5000)...
start "Smart Faculty Backend" cmd /c "cd /d %~dp0backend && python database.py && python app.py"

timeout /t 2 >nul

echo [2/2] Starting React Frontend Server (Port 5173)...
start "Smart Faculty Frontend" cmd /c "cd /d %~dp0frontend && npm run dev"

timeout /t 3 >nul

echo Opening application in your browser...
start http://localhost:5173

echo.
echo ===================================================================
echo Applications launched!
echo Frontend: http://localhost:5173
echo Backend API: http://localhost:5000/api/health
echo ===================================================================
pause
