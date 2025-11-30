@echo off
title PKM-Universe Website
echo ============================================
echo    PKM-Universe Website Server
echo ============================================
echo.

cd /d "%~dp0"

if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    echo.
)

echo Starting website server...
echo Open http://localhost:3000 in your browser
echo.
node server.js

pause
