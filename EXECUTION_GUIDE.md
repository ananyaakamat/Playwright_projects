# How to Run the Temp Email Script

## Method 1: Command Prompt (Recommended)

1. Open Command Prompt as Administrator
2. Navigate to the project directory:
   ```
   cd "d:\Anant\Playwright_projects"
   ```
3. Run the batch file:
   ```
   run_temp_email.bat
   ```

## Method 2: PowerShell with Bypass

1. Open PowerShell as Administrator
2. Run the script with execution policy bypass:
   ```
   powershell -ExecutionPolicy Bypass -File "d:\Anant\Playwright_projects\run_temp_email.ps1"
   ```

## Method 3: Manual Steps

1. Open Command Prompt or PowerShell as Administrator
2. Navigate to the project directory:
   ```
   cd "d:\Anant\Playwright_projects"
   ```
3. Install packages:
   ```
   npm install
   ```
4. Install Playwright browsers:
   ```
   npx playwright install chromium
   ```
5. Run the script:
   ```
   node temp_email.js
   ```

## Method 4: Fix PowerShell Execution Policy (One-time setup)

1. Open PowerShell as Administrator
2. Set execution policy:
   ```
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
3. After this, you can run npm and npx commands normally

## Expected Output

- The script will open temp-mail.org in Chrome
- It will click the delete button to generate a new email
- The new email address will be saved to `temp_email.txt`
- The browser will close automatically when done

## Troubleshooting

- Make sure Node.js is installed
- Run commands as Administrator
- Check that Chrome is installed on your system
- If the script fails, check the error screenshots generated
