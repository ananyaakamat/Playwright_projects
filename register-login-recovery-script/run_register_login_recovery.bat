@echo off
echo Running Register-Login-Recovery Script
echo =====================================
cd /d "d:\Anant\Playwright_projects\register-login-recovery-script"
echo Installing dependencies from parent directory...
cd ..
npm install
npx playwright install chromium
cd register-login-recovery-script
echo Running Register-Login-Recovery script...
node Register_login_Recovery.js
echo.
echo Script execution completed!
pause
