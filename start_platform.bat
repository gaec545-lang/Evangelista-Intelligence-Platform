@echo off
echo ==========================================
echo Starting Evangelista Intelligence Platform
echo ==========================================

:: Start Backend
echo Launching Backend (Port 8001)...
start "EIP-Backend" cmd /k "cd evangelista-rag && .\.venv_win\Scripts\python.exe -m uvicorn src.api.server:app --port 8001 --reload"

:: Wait for backend to initialize
timeout /t 5 /nobreak > nul

:: Start Frontend
echo Launching Frontend (Port 5174)...
start "EIP-Frontend" cmd /k "cd evangelista-dashboard && node "node_modules\vite\bin\vite.js" --port 5174"

echo.
echo ==========================================
echo Platfom Startup Initiated
echo Backend:  http://localhost:8001
echo Frontend: http://localhost:5174
echo ==========================================
pause
