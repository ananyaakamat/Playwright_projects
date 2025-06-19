@echo off
cd /d "d:\Anant\Playwright_projects"
npm install
npx playwright install chromium
node temp_email.js
pause
