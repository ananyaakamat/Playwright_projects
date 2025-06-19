@echo off
cd /d "d:\Anant\Playwright_projects\temp-email-script"
echo Installing dependencies from parent directory...
cd ..
npm install
npx playwright install chromium
cd temp-email-script
echo Running temp email script...
node temp_email.js
pause
