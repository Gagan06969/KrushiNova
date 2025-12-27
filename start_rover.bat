@echo off
echo ==========================================
echo    KRUSHINOVA ROVER LAUNCH SYSTEM
echo ==========================================

echo 1. Starting Backend (Brain)...
start "Krushinova Brain (Backend)" cmd /k "cd backend && py -3.11 app.py"

echo 2. Starting Frontend (Interface)...
start "Krushinova UI (Frontend)" cmd /k "cd frontend && npm run dev"

echo 3. Waiting for servers to warm up...
timeout /t 5 >nul

echo 4. Opening Control Panel...
start http://localhost:5173

echo ==========================================
echo    SYSTEMS ACTIVE
echo    Don't close the black scheduling windows!
echo ==========================================
pause
