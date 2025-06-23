@echo off
echo 正在啟動 ngrok...
echo 請確保您的 Spring Boot 應用程序正在運行在端口 8080

REM 啟動 ngrok 並暴露後端 API
ngrok http 8080

pause 