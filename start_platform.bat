@echo off
echo ==========================================
echo Starting Evangelista Intelligence Platform
echo ==========================================

:: Start Backend
:: ponytail: aligned backend port to 8000 to match default frontend config
echo Launching Backend (Port 8000)...
start "EIP-Backend" cmd /k "cd Backend && .\.venv_win\Scripts\python.exe -m uvicorn src.api.server:app --port 8000 --reload"

:: Wait for backend to initialize
timeout /t 5 /nobreak > nul

:: Start Frontend
echo Launching Frontend (Port 5174)...
start "EIP-Frontend" cmd /k "cd Frontend && node "node_modules\vite\bin\vite.js" --port 5174"

echo.
echo ==========================================
echo Platfom Startup Initiated
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:5174
echo ==========================================
pause
