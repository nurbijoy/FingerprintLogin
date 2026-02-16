@echo off
title SecuGen Fingerprint System
color 0A

echo.
echo ============================================================
echo    SecuGen Fingerprint Authentication System
echo ============================================================
echo.

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    color 0C
    echo [ERROR] Python not found!
    echo Please install Python 3.8+ from https://www.python.org/
    echo.
    pause
    exit /b 1
)

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    color 0C
    echo [ERROR] Node.js not found!
    echo Please install Node.js 16+ from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [OK] Python and Node.js detected
echo.

REM Check if backend venv exists, if not create it
if not exist "backend\venv" (
    echo [SETUP] First time setup detected...
    echo [SETUP] Creating Python virtual environment for backend...
    cd backend
    python -m venv venv
    call venv\Scripts\activate.bat
    echo [SETUP] Installing backend dependencies...
    pip install -r requirements.txt
    echo [SETUP] Running database migrations...
    python manage.py migrate
    cd ..
    echo [SETUP] Backend setup complete!
    echo.
)

REM Check if frontend node_modules exists
if not exist "frontend\node_modules" (
    echo [SETUP] Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
    echo [SETUP] Frontend setup complete!
    echo.
)

echo Starting services...
echo.

REM Start SecuGen Bridge Service
echo [1/3] Starting SecuGen Bridge Service (Port 8080)...
start "SecuGen Bridge - Port 8080" cmd /k "title SecuGen Bridge && cd /d %~dp0 && python secugen-bridge\secugen_bridge_native.py"
timeout /t 5 /nobreak >nul

REM Start Django Backend
echo [2/3] Starting Django Backend (Port 8000)...
start "Django Backend - Port 8000" cmd /k "title Django Backend && cd /d %~dp0backend && if exist venv\Scripts\activate.bat (venv\Scripts\activate.bat && python manage.py runserver) else (python manage.py runserver)"
timeout /t 5 /nobreak >nul

REM Start React Frontend
echo [3/3] Starting React Frontend (Port 3000)...
start "React Frontend - Port 3000" cmd /k "title React Frontend && cd /d %~dp0frontend && npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo ============================================================
echo    All Services Started Successfully!
echo ============================================================
echo.
echo  Services:
echo    [1] SecuGen Bridge .... http://localhost:8080
echo    [2] Django Backend .... http://localhost:8000
echo    [3] React Frontend .... http://localhost:3000
echo.
echo  Next Steps:
echo    1. Wait 10 seconds for all services to initialize
echo    2. Browser will open automatically
echo    3. Connect your SecuGen fingerprint scanner
echo    4. Start capturing fingerprints!
echo.
echo  To Stop:
echo    Close all command windows or press Ctrl+C in each
echo.
echo ============================================================
echo.

REM Wait a bit more for services to fully start
echo Waiting for services to initialize...
timeout /t 10 /nobreak >nul

REM Open browser
echo Opening application in browser...
start http://localhost:3000

echo.
echo Application is now running!
echo Keep this window and the service windows open.
echo.
pause
