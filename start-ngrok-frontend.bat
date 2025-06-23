@echo off
echo 正在啟動 ngrok 前端隧道...
echo 請確保您的前端開發服務器正在運行在端口 5173

REM 使用完整路徑啟動 ngrok
"C:\Users\user\Downloads\ngrok-v3-stable-windows-amd64\ngrok.exe" http 5173

pause 