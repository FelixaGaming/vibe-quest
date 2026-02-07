@echo off
echo.
echo 🌟 ==================================
echo    VIBE QUEST - Setup
echo 🌟 ==================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed!
    echo.
    echo 👉 Download it from: https://nodejs.org
    echo    Pick the LTS version
    echo.
    echo After installing, run this script again.
    pause
    exit /b 1
)

echo ✅ Node.js found
echo.
echo 📦 Installing packages...
call npm install

if %errorlevel% neq 0 (
    echo.
    echo ❌ Install failed. Try deleting node_modules folder and running again.
    pause
    exit /b 1
)

echo.
echo ✅ All packages installed!
echo.
echo 🚀 Starting Vibe Quest...
echo    Open your browser to: http://localhost:3000
echo.
call npm run dev
pause
