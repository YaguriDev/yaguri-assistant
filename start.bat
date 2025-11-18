@echo off
cd /d %~dp0
echo [INFO] Make sure you have run "npm install" in this directory before first start.
echo [INFO] Starting Yaguri Assistant...
npx tsx index.ts
pause