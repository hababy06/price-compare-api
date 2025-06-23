@echo off
echo ========================================
echo 啟動前端開發服務器並暴露到 ngrok
echo ========================================

echo 1. 切換到前端目錄...
cd price-info-frontend

echo 2. 安裝依賴（如果需要）...
call npm install

echo 3. 啟動前端開發服務器...
start "Frontend Dev Server" cmd /k "npm run dev"

echo 4. 等待服務器啟動...
timeout /t 5 /nobreak > nul

echo 5. 啟動 ngrok 隧道...
echo 前端將在 https://xxx.ngrok-free.app 上可用
ngrok http 5173

pause 