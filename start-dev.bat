@echo off
REM Quick Start Script for AI Palm Reader (Windows)
REM This opens the necessary terminals and starts the development servers

setlocal enabledelayedexpansion

echo.
echo ===================================================
echo   🔮 AI PALM READER - Development Quick Start
echo ===================================================
echo.

REM Check if python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python not found. Please install Python 3.10+
    pause
    exit /b 1
)

REM Check if node is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found. Please install Node.js 18+
    pause
    exit /b 1
)

echo ✅ Python and Node.js found
echo.
echo 📋 Setting up virtual environment...

REM Create backend venv if it doesn't exist
if not exist "backend\.venv\" (
    echo Creating backend virtual environment...
    cd backend
    python -m venv .venv
    cd ..
    echo ✅ Virtual environment created
) else (
    echo ✅ Virtual environment already exists
)

echo.
echo 📦 Installing dependencies...

REM Install backend dependencies silently
echo Installing backend dependencies (this may take a minute)...
cd backend
call .venv\Scripts\pip install -q -r requirements\dev.txt
if errorlevel 1 (
    echo ⚠️  Some dependencies may not have installed. Continuing anyway...
)
cd ..

REM Install frontend dependencies if needed
if not exist "frontend\node_modules\" (
    echo Installing frontend dependencies (this may take a minute)...
    cd frontend
    call npm install --silent
    cd ..
) else (
    echo ✅ Frontend dependencies already installed
)

echo.
echo ===================================================
echo   ✨ Setup Complete!
echo ===================================================
echo.
echo 🚀 Opening development servers...
echo.
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:8000
echo    Docs:     http://localhost:8000/docs
echo.
echo Press Enter to start servers (open two terminal windows)
pause

REM Open Backend terminal
start cmd /k "cd backend && .\.venv\Scripts\activate && echo. && echo 🔮 Backend starting... && echo. && uvicorn app.main:app --reload --port 8000"

REM Open Frontend terminal
start cmd /k "cd frontend && echo. && echo 🎨 Frontend starting... && echo. && npm run dev"

echo.
echo ✅ Servers started! Check the opened terminal windows.
echo.
pause
