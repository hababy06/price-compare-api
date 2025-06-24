@echo off
REM 設定 Google OAuth2 環境變數，請將 xxx/yyy 換成你的密鑰
set SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GOOGLE_CLIENT_ID=***REMOVED***
set SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GOOGLE_CLIENT_SECRET=***REMOVED***

REM 啟動 Spring Boot 專案（可依需求選擇一種）
REM 如果用 Maven
mvn spring-boot:run
REM 如果用 jar
REM java -jar target/你的專案檔案.jar 